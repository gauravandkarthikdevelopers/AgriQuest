import { GoogleGenerativeAI } from '@google/generative-ai';
import fs from 'fs/promises';
import { ICropAnalysisResult } from '../types';
import { ImageProcessor } from '../utils/imageProcessing';
import logger from '../utils/logger';

export class GeminiService {
  private genAI: GoogleGenerativeAI | null = null;
  private model: any = null;

  constructor() {
    const apiKey = process.env.GEMINI_API_KEY;
    if (apiKey) {
      this.genAI = new GoogleGenerativeAI(apiKey);
      this.model = this.genAI.getGenerativeModel({ model: 'gemini-pro-vision' });
    }
  }

  async analyzeCropImage(imagePath: string): Promise<ICropAnalysisResult> {
    // Try Gemini API first
    if (this.model) {
      try {
        const result = await this.analyzeWithGemini(imagePath);
        if (result) {
          return result;
        }
      } catch (error) {
        logger.error('Gemini API analysis failed:', error);
      }
    }

    // Fallback to heuristic analysis
    logger.info('Using fallback image analysis');
    return await ImageProcessor.analyzeImageFallback(imagePath);
  }

  private async analyzeWithGemini(imagePath: string): Promise<ICropAnalysisResult | null> {
    try {
      const imageBuffer = await fs.readFile(imagePath);
      const base64Image = imageBuffer.toString('base64');

      const prompt = `
        Analyze this crop/plant image for sustainable farming assessment. Please provide:
        
        1. An eco-friendliness score (0-100) where:
           - 90-100: Excellent sustainable practices
           - 70-89: Good with minor improvements needed
           - 50-69: Moderate, needs attention
           - 30-49: Poor, significant issues
           - 0-29: Very poor, major intervention needed
        
        2. Identify any issues from this list:
           - pest-infestation
           - fungal-disease
           - bacterial-disease
           - nitrogen-deficiency
           - phosphorus-deficiency
           - potassium-deficiency
           - water-stress
           - over-fertilization
           - soil-degradation
           - chemical-burn
           - nutrient-lockout
           - ph-imbalance
        
        3. Provide sustainable recommendations focusing on:
           - Organic solutions
           - Water conservation
           - Soil health improvement
           - Natural pest management
           - Eco-friendly fertilization
        
        Format your response as JSON:
        {
          "ecoScore": number,
          "issues": ["issue1", "issue2"],
          "recommendations": ["rec1", "rec2"],
          "confidence": number (0-1),
          "analysis": "detailed explanation"
        }
      `;

      const result = await this.model.generateContent([
        prompt,
        {
          inlineData: {
            data: base64Image,
            mimeType: 'image/jpeg',
          },
        },
      ]);

      const response = await result.response;
      const text = response.text();

      // Try to parse JSON response
      const jsonMatch = text.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        const analysis = JSON.parse(jsonMatch[0]);
        
        return {
          ecoScore: Math.max(0, Math.min(100, analysis.ecoScore || 50)),
          issues: Array.isArray(analysis.issues) ? analysis.issues : [],
          recommendations: Array.isArray(analysis.recommendations) ? analysis.recommendations : [],
          confidence: Math.max(0, Math.min(1, analysis.confidence || 0.8)),
          source: 'gemini',
          rawAnalysis: {
            fullResponse: text,
            parsedAnalysis: analysis,
          },
        };
      }

      // If JSON parsing fails, extract information manually
      return this.parseGeminiTextResponse(text);
    } catch (error) {
      logger.error('Gemini analysis error:', error);
      return null;
    }
  }

  private parseGeminiTextResponse(text: string): ICropAnalysisResult {
    // Extract eco score
    const scoreMatch = text.match(/(?:eco[- ]?score|score)[:\s]*(\d+)/i);
    const ecoScore = scoreMatch ? parseInt(scoreMatch[1]) : 60;

    // Extract issues
    const issues: string[] = [];
    const issuePatterns = [
      'pest', 'fungal', 'bacterial', 'nitrogen', 'phosphorus', 'potassium',
      'water', 'fertiliz', 'soil', 'chemical', 'nutrient', 'ph'
    ];

    issuePatterns.forEach(pattern => {
      if (text.toLowerCase().includes(pattern)) {
        if (pattern === 'pest') issues.push('pest-infestation');
        else if (pattern === 'fungal') issues.push('fungal-disease');
        else if (pattern === 'nitrogen') issues.push('nitrogen-deficiency');
        else if (pattern === 'water') issues.push('water-stress');
      }
    });

    // Extract recommendations
    const recommendations: string[] = [];
    if (text.toLowerCase().includes('compost')) {
      recommendations.push('Apply organic compost to improve soil health');
    }
    if (text.toLowerCase().includes('water') || text.toLowerCase().includes('irrigat')) {
      recommendations.push('Implement drip irrigation for water conservation');
    }
    if (text.toLowerCase().includes('organic')) {
      recommendations.push('Use organic fertilizers and pest control methods');
    }

    // Default recommendations if none found
    if (recommendations.length === 0) {
      recommendations.push('Monitor crop health regularly');
      recommendations.push('Consider soil testing for nutrient analysis');
    }

    return {
      ecoScore: Math.max(0, Math.min(100, ecoScore)),
      issues,
      recommendations,
      confidence: 0.7,
      source: 'gemini',
      rawAnalysis: {
        fullResponse: text,
      },
    };
  }

  isAvailable(): boolean {
    return this.model !== null;
  }

  async testConnection(): Promise<boolean> {
    if (!this.model) return false;

    try {
      const result = await this.model.generateContent('Test connection');
      const response = await result.response;
      return !!response.text();
    } catch (error) {
      logger.error('Gemini connection test failed:', error);
      return false;
    }
  }
}
