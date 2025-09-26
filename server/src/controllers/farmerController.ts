import { Request, Response } from 'express';
import { Farmer, CropScan, ChallengeCompletion } from '../models';
import { asyncHandler, AppError } from '../middleware/errorHandler';
import { leaderboardValidation } from '../utils/validation';
import { ApiResponse, ILeaderboardEntry } from '../types';

export const getDemoFarmer = asyncHandler(async (req: Request, res: Response<ApiResponse>) => {
  let farmer = await Farmer.findOne({ name: 'Demo Farmer' });

  if (!farmer) {
    // Create demo farmer if doesn't exist
    farmer = new Farmer({
      name: 'Demo Farmer',
      village: 'Green Valley',
      region: 'Maharashtra',
      xp: 150,
      ecoScore: 75,
      badges: ['eco-newcomer', 'first-scan'],
    });
    await farmer.save();
  }

  res.status(200).json({
    success: true,
    data: farmer,
  });
});

export const getFarmerById = asyncHandler(async (req: Request, res: Response<ApiResponse>) => {
  const { id } = req.params;

  const farmer = await Farmer.findById(id);

  if (!farmer) {
    throw new AppError('Farmer not found', 404);
  }

  res.status(200).json({
    success: true,
    data: farmer,
  });
});

export const getFarmerProgress = asyncHandler(async (req: Request, res: Response<ApiResponse>) => {
  const { id } = req.params;

  const farmer = await Farmer.findById(id);
  if (!farmer) {
    throw new AppError('Farmer not found', 404);
  }

  // Get recent crop scans
  const recentScans = await CropScan.find({ farmerId: id })
    .sort({ createdAt: -1 })
    .limit(10);

  // Get challenge completions
  const completions = await ChallengeCompletion.find({ farmerId: id })
    .populate('challengeId', 'title xpReward difficulty')
    .sort({ createdAt: -1 })
    .limit(10);

  // Calculate progress metrics
  const totalScans = await CropScan.countDocuments({ farmerId: id });
  const totalCompletions = await ChallengeCompletion.countDocuments({ farmerId: id });
  
  const avgEcoScore = recentScans.length > 0 
    ? recentScans.reduce((sum, scan) => sum + scan.ecoScore, 0) / recentScans.length
    : farmer.ecoScore;

  // Calculate level and progress to next level
  const currentLevel = Math.floor(farmer.xp / 100) + 1;
  const xpForNextLevel = currentLevel * 100;
  const progressToNextLevel = ((farmer.xp % 100) / 100) * 100;

  // Estimate water and soil health based on eco score and activities
  const waterUsageEfficiency = Math.min(100, farmer.ecoScore + (totalCompletions * 2));
  const soilHealthScore = Math.min(100, avgEcoScore + (farmer.badges.length * 5));

  res.status(200).json({
    success: true,
    data: {
      farmer,
      metrics: {
        currentLevel,
        xpForNextLevel,
        progressToNextLevel: Math.round(progressToNextLevel),
        totalScans,
        totalCompletions,
        avgEcoScore: Math.round(avgEcoScore),
        waterUsageEfficiency: Math.round(waterUsageEfficiency),
        soilHealthScore: Math.round(soilHealthScore),
      },
      recentActivity: {
        scans: recentScans,
        completions,
      },
      achievements: {
        badges: farmer.badges,
        badgeDescriptions: {
          'eco-newcomer': 'Welcome to sustainable farming!',
          'first-scan': 'Completed first crop analysis',
          'eco-warrior': 'Reached level 5 in sustainable practices',
          'sustainability-champion': 'Reached level 10 with excellent eco-score',
          'green-master': 'Achieved mastery in sustainable farming',
          'water-saver': 'Demonstrated excellent water conservation',
          'soil-protector': 'Maintained healthy soil practices',
        },
      },
    },
  });
});

export const getLeaderboard = asyncHandler(async (req: Request, res: Response<ApiResponse<ILeaderboardEntry[]>>) => {
  const { error, value } = leaderboardValidation.validate(req.query);
  if (error) {
    throw new AppError(error.details[0].message, 400);
  }

  const { limit, page, region, village } = value;
  const skip = (page - 1) * limit;

  // Build query
  const query: any = {};
  if (region) query.region = region;
  if (village) query.village = village;

  // Get farmers sorted by XP and eco score
  const farmers = await Farmer.find(query)
    .sort({ xp: -1, ecoScore: -1 })
    .limit(limit)
    .skip(skip);

  // Format leaderboard entries
  const leaderboardEntries: ILeaderboardEntry[] = farmers.map((farmer, index) => ({
    farmer,
    rank: skip + index + 1,
    xp: farmer.xp,
    ecoScore: farmer.ecoScore,
    badges: farmer.badges,
  }));

  const total = await Farmer.countDocuments(query);

  res.status(200).json({
    success: true,
    data: leaderboardEntries,
    message: `Top ${farmers.length} farmers`,
    // Add pagination info
    pagination: {
      page,
      limit,
      total,
      pages: Math.ceil(total / limit),
    } as any,
  });
});

export const getRegions = asyncHandler(async (req: Request, res: Response<ApiResponse>) => {
  const regions = await Farmer.distinct('region');
  
  res.status(200).json({
    success: true,
    data: regions,
  });
});

export const getVillagesByRegion = asyncHandler(async (req: Request, res: Response<ApiResponse>) => {
  const { region } = req.params;
  
  const villages = await Farmer.distinct('village', { region });
  
  res.status(200).json({
    success: true,
    data: villages,
  });
});

export const updateFarmer = asyncHandler(async (req: Request, res: Response<ApiResponse>) => {
  const { id } = req.params;
  const updates = req.body;

  // Remove sensitive fields that shouldn't be updated directly
  delete updates.xp;
  delete updates.ecoScore;
  delete updates.badges;

  const farmer = await Farmer.findByIdAndUpdate(
    id,
    updates,
    { new: true, runValidators: true }
  );

  if (!farmer) {
    throw new AppError('Farmer not found', 404);
  }

  res.status(200).json({
    success: true,
    data: farmer,
    message: 'Farmer updated successfully',
  });
});
