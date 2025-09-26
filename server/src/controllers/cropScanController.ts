import { Request, Response } from 'express';
import { CropScan, Farmer } from '../models';
import { GeminiService } from '../services/gemini';
import { ImageProcessor } from '../utils/imageProcessing';
import { uploadPaths } from '../middleware/upload';
import { asyncHandler, AppError } from '../middleware/errorHandler';
import { cropScanValidation } from '../utils/validation';
import { ApiResponse, ICropAnalysisResult } from '../types';
import logger from '../utils/logger';
import path from 'path';

const geminiService = new GeminiService();

export const analyzeCrop = asyncHandler(async (req: Request, res: Response<ApiResponse<ICropAnalysisResult>>) => {
  if (!req.file) {
    throw new AppError('No image file provided', 400);
  }

  const { error, value } = cropScanValidation.validate(req.body);
  if (error) {
    throw new AppError(error.details[0].message, 400);
  }

  const { farmerId } = value;
  const tempImagePath = req.file.path;

  try {
    // Process the image (resize, optimize)
    const processedImagePath = await ImageProcessor.processImage(
      tempImagePath,
      uploadPaths.processed
    );

    // Create thumbnail
    const thumbnailPath = await ImageProcessor.createThumbnail(
      processedImagePath,
      uploadPaths.thumbnails
    );

    // Analyze the image with Gemini or fallback
    const analysisResult = await geminiService.analyzeCropImage(processedImagePath);

    // Save the scan result to database
    if (farmerId) {
      const farmer = await Farmer.findById(farmerId);
      if (!farmer) {
        throw new AppError('Farmer not found', 404);
      }

      const cropScan = new CropScan({
        farmerId,
        imageUrl: processedImagePath,
        ecoScore: analysisResult.ecoScore,
        issues: analysisResult.issues,
        recommendations: analysisResult.recommendations,
        rawAnalysis: analysisResult.rawAnalysis,
        confidence: analysisResult.confidence,
        source: analysisResult.source,
      });

      await cropScan.save();

      // Update farmer's eco score (weighted average)
      const recentScans = await CropScan.find({ farmerId })
        .sort({ createdAt: -1 })
        .limit(5);

      const avgEcoScore = recentScans.reduce((sum, scan) => sum + scan.ecoScore, 0) / recentScans.length;
      farmer.ecoScore = Math.round(avgEcoScore);
      await farmer.save();

      logger.info(`Crop scan completed for farmer ${farmerId}, eco score: ${analysisResult.ecoScore}`);
    }

    // Clean up temp file
    await ImageProcessor.deleteFile(tempImagePath);

    res.status(200).json({
      success: true,
      data: {
        ...analysisResult,
        imageUrl: processedImagePath,
        thumbnailUrl: thumbnailPath,
      },
      message: 'Crop analysis completed successfully',
    });
  } catch (error) {
    // Clean up files on error
    await ImageProcessor.deleteFile(tempImagePath);
    throw error;
  }
});

export const getCropScans = asyncHandler(async (req: Request, res: Response<ApiResponse>) => {
  const { farmerId, limit = 20, page = 1 } = req.query;

  const query = farmerId ? { farmerId } : {};
  const skip = (Number(page) - 1) * Number(limit);

  const scans = await CropScan.find(query)
    .populate('farmerId', 'name village region')
    .sort({ createdAt: -1 })
    .limit(Number(limit))
    .skip(skip);

  const total = await CropScan.countDocuments(query);

  res.status(200).json({
    success: true,
    data: {
      scans,
      pagination: {
        page: Number(page),
        limit: Number(limit),
        total,
        pages: Math.ceil(total / Number(limit)),
      },
    },
  });
});

export const getCropScanById = asyncHandler(async (req: Request, res: Response<ApiResponse>) => {
  const { id } = req.params;

  const scan = await CropScan.findById(id).populate('farmerId', 'name village region');

  if (!scan) {
    throw new AppError('Crop scan not found', 404);
  }

  res.status(200).json({
    success: true,
    data: scan,
  });
});

export const deleteCropScan = asyncHandler(async (req: Request, res: Response<ApiResponse>) => {
  const { id } = req.params;

  const scan = await CropScan.findById(id);
  if (!scan) {
    throw new AppError('Crop scan not found', 404);
  }

  // Delete associated files
  if (scan.imageUrl) {
    await ImageProcessor.deleteFile(scan.imageUrl);
    
    // Delete thumbnail if exists
    const thumbnailPath = scan.imageUrl.replace('/processed/', '/thumbnails/').replace(/\.[^/.]+$/, '_thumb.jpg');
    await ImageProcessor.deleteFile(thumbnailPath);
  }

  await CropScan.findByIdAndDelete(id);

  res.status(200).json({
    success: true,
    message: 'Crop scan deleted successfully',
  });
});
