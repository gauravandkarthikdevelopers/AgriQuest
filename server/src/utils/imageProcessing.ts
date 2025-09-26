import sharp from 'sharp';
import path from 'path';
import fs from 'fs/promises';
import { ICropAnalysisResult } from '../types';

export class ImageProcessor {
  static async processImage(inputPath: string, outputDir: string): Promise<string> {
    const filename = `processed_${Date.now()}_${Math.random().toString(36).substring(7)}.jpg`;
    const outputPath = path.join(outputDir, filename);

    await sharp(inputPath)
      .resize(800, 600, { 
        fit: 'inside',
        withoutEnlargement: true 
      })
      .jpeg({ 
        quality: 85,
        progressive: true 
      })
      .toFile(outputPath);

    return outputPath;
  }

  static async createThumbnail(inputPath: string, outputDir: string): Promise<string> {
    const filename = `thumb_${Date.now()}_${Math.random().toString(36).substring(7)}.jpg`;
    const outputPath = path.join(outputDir, filename);

    await sharp(inputPath)
      .resize(200, 150, { 
        fit: 'cover' 
      })
      .jpeg({ 
        quality: 70 
      })
      .toFile(outputPath);

    return outputPath;
  }

  static async analyzeImageFallback(imagePath: string): Promise<ICropAnalysisResult> {
    try {
      const image = sharp(imagePath);
      const { data, info } = await image
        .raw()
        .ensureAlpha()
        .toBuffer({ resolveWithObject: true });

      const pixels = new Uint8Array(data);
      const totalPixels = info.width * info.height;
      
      let greenPixels = 0;
      let yellowPixels = 0;
      let brownPixels = 0;
      let totalBrightness = 0;

      // Analyze pixel colors
      for (let i = 0; i < pixels.length; i += 4) {
        const r = pixels[i];
        const g = pixels[i + 1];
        const b = pixels[i + 2];
        
        totalBrightness += (r + g + b) / 3;

        // Detect green (healthy vegetation)
        if (g > r && g > b && g > 80) {
          greenPixels++;
        }
        // Detect yellow (potential nitrogen deficiency or disease)
        else if (r > 150 && g > 150 && b < 100) {
          yellowPixels++;
        }
        // Detect brown (dead/dying vegetation)
        else if (r > 100 && g > 60 && b < 80 && r > g && r > b) {
          brownPixels++;
        }
      }

      const greenRatio = greenPixels / totalPixels;
      const yellowRatio = yellowPixels / totalPixels;
      const brownRatio = brownPixels / totalPixels;
      const avgBrightness = totalBrightness / totalPixels;

      // Calculate eco score based on ratios
      let ecoScore = 50; // Base score
      ecoScore += Math.min(greenRatio * 100, 40); // Green is good
      ecoScore -= yellowRatio * 60; // Yellow indicates problems
      ecoScore -= brownRatio * 80; // Brown is bad
      ecoScore = Math.max(0, Math.min(100, ecoScore));

      // Determine issues
      const issues: string[] = [];
      const recommendations: string[] = [];

      if (yellowRatio > 0.15) {
        issues.push('nitrogen-deficiency');
        recommendations.push('Apply organic compost to improve nitrogen levels');
      }

      if (brownRatio > 0.2) {
        issues.push('plant-stress');
        recommendations.push('Check soil moisture and drainage');
      }

      if (greenRatio < 0.3) {
        issues.push('low-vegetation-health');
        recommendations.push('Consider crop rotation and soil testing');
      }

      if (avgBrightness < 80) {
        issues.push('poor-lighting-conditions');
        recommendations.push('Take photos in better lighting for accurate analysis');
      }

      // Add general recommendations
      if (ecoScore < 70) {
        recommendations.push('Switch to drip irrigation to conserve water');
        recommendations.push('Use organic fertilizers instead of chemical ones');
      }

      return {
        ecoScore: Math.round(ecoScore),
        issues,
        recommendations,
        confidence: 0.6,
        source: 'fallback',
        rawAnalysis: {
          greenRatio,
          yellowRatio,
          brownRatio,
          avgBrightness,
          totalPixels,
        },
      };
    } catch (error) {
      console.error('Fallback image analysis error:', error);
      return {
        ecoScore: 50,
        issues: ['analysis-error'],
        recommendations: ['Please try uploading a clearer image'],
        confidence: 0.1,
        source: 'fallback',
      };
    }
  }

  static async deleteFile(filePath: string): Promise<void> {
    try {
      await fs.unlink(filePath);
    } catch (error) {
      console.error('Error deleting file:', error);
    }
  }
}
