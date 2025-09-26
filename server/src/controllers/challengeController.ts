import { Request, Response } from 'express';
import { Challenge, ChallengeCompletion, Farmer } from '../models';
import { ImageProcessor } from '../utils/imageProcessing';
import { uploadPaths } from '../middleware/upload';
import { asyncHandler, AppError } from '../middleware/errorHandler';
import { challengeCompletionValidation, paginationValidation } from '../utils/validation';
import { ApiResponse } from '../types';
import logger from '../utils/logger';

export const getChallenges = asyncHandler(async (req: Request, res: Response<ApiResponse>) => {
  const { error, value } = paginationValidation.validate(req.query);
  if (error) {
    throw new AppError(error.details[0].message, 400);
  }

  const { page, limit, sort, order } = value;
  const skip = (page - 1) * limit;

  const sortField = sort || 'createdAt';
  const sortOrder = order === 'asc' ? 1 : -1;

  const challenges = await Challenge.find()
    .sort({ [sortField]: sortOrder })
    .limit(limit)
    .skip(skip);

  const total = await Challenge.countDocuments();

  res.status(200).json({
    success: true,
    data: {
      challenges,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    },
  });
});

export const getChallengeById = asyncHandler(async (req: Request, res: Response<ApiResponse>) => {
  const { id } = req.params;

  const challenge = await Challenge.findById(id);

  if (!challenge) {
    throw new AppError('Challenge not found', 404);
  }

  res.status(200).json({
    success: true,
    data: challenge,
  });
});

export const completeChallenge = asyncHandler(async (req: Request, res: Response<ApiResponse>) => {
  const { id: challengeId } = req.params;

  const { error, value } = challengeCompletionValidation.validate(req.body);
  if (error) {
    throw new AppError(error.details[0].message, 400);
  }

  const { farmerId, notes } = value;

  // Check if challenge exists
  const challenge = await Challenge.findById(challengeId);
  if (!challenge) {
    throw new AppError('Challenge not found', 404);
  }

  // Check if farmer exists
  const farmer = await Farmer.findById(farmerId);
  if (!farmer) {
    throw new AppError('Farmer not found', 404);
  }

  // Check if already completed
  const existingCompletion = await ChallengeCompletion.findOne({
    challengeId,
    farmerId,
  });

  if (existingCompletion) {
    throw new AppError('Challenge already completed by this farmer', 400);
  }

  let imageUrl: string | undefined;
  let thumbnailUrl: string | undefined;

  // Process uploaded image if provided
  if (req.file) {
    try {
      const tempImagePath = req.file.path;
      
      // Process the image
      imageUrl = await ImageProcessor.processImage(
        tempImagePath,
        uploadPaths.processed
      );

      // Create thumbnail
      thumbnailUrl = await ImageProcessor.createThumbnail(
        imageUrl,
        uploadPaths.thumbnails
      );

      // Clean up temp file
      await ImageProcessor.deleteFile(tempImagePath);
    } catch (error) {
      logger.error('Image processing failed:', error);
      if (req.file) {
        await ImageProcessor.deleteFile(req.file.path);
      }
      throw new AppError('Image processing failed', 500);
    }
  }

  // Create challenge completion
  const completion = new ChallengeCompletion({
    challengeId,
    farmerId,
    imageUrl,
    notes,
    status: 'approved', // Auto-approve for demo
    xpAwarded: challenge.xpReward,
  });

  await completion.save();

  // Update farmer's XP and eco score
  farmer.xp += challenge.xpReward;
  
  // Increase eco score slightly for completing challenges
  farmer.ecoScore = Math.min(100, farmer.ecoScore + Math.floor(challenge.xpReward / 20));

  // Award badges based on XP milestones
  const currentLevel = Math.floor(farmer.xp / 100);
  const previousLevel = Math.floor((farmer.xp - challenge.xpReward) / 100);

  if (currentLevel > previousLevel) {
    const newBadges = [];
    
    if (currentLevel >= 5 && !farmer.badges.includes('eco-warrior')) {
      newBadges.push('eco-warrior');
    }
    if (currentLevel >= 10 && !farmer.badges.includes('sustainability-champion')) {
      newBadges.push('sustainability-champion');
    }
    if (currentLevel >= 20 && !farmer.badges.includes('green-master')) {
      newBadges.push('green-master');
    }

    farmer.badges = [...farmer.badges, ...newBadges];
  }

  await farmer.save();

  logger.info(`Challenge ${challengeId} completed by farmer ${farmerId}, XP awarded: ${challenge.xpReward}`);

  res.status(200).json({
    success: true,
    data: {
      completion,
      farmer: {
        xp: farmer.xp,
        ecoScore: farmer.ecoScore,
        badges: farmer.badges,
        level: Math.floor(farmer.xp / 100) + 1,
      },
      xpGained: challenge.xpReward,
      newBadges: farmer.badges.slice(-1), // Return latest badges
    },
    message: 'Challenge completed successfully!',
  });
});

export const getFarmerCompletions = asyncHandler(async (req: Request, res: Response<ApiResponse>) => {
  const { farmerId } = req.params;
  const { page = 1, limit = 20 } = req.query;

  const skip = (Number(page) - 1) * Number(limit);

  const completions = await ChallengeCompletion.find({ farmerId })
    .populate('challengeId', 'title description xpReward difficulty')
    .sort({ createdAt: -1 })
    .limit(Number(limit))
    .skip(skip);

  const total = await ChallengeCompletion.countDocuments({ farmerId });

  res.status(200).json({
    success: true,
    data: {
      completions,
      pagination: {
        page: Number(page),
        limit: Number(limit),
        total,
        pages: Math.ceil(total / Number(limit)),
      },
    },
  });
});

export const getCompletionById = asyncHandler(async (req: Request, res: Response<ApiResponse>) => {
  const { id } = req.params;

  const completion = await ChallengeCompletion.findById(id)
    .populate('challengeId', 'title description xpReward difficulty')
    .populate('farmerId', 'name village region');

  if (!completion) {
    throw new AppError('Challenge completion not found', 404);
  }

  res.status(200).json({
    success: true,
    data: completion,
  });
});
