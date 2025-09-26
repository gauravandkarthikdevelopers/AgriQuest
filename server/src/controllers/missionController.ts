import { Request, Response } from 'express';
import { Mission, Farmer } from '../models';
import { asyncHandler, AppError } from '../middleware/errorHandler';
import { missionCompletionValidation, paginationValidation } from '../utils/validation';
import { ApiResponse } from '../types';
import logger from '../utils/logger';

export const getMissions = asyncHandler(async (req: Request, res: Response<ApiResponse>) => {
  const { error, value } = paginationValidation.validate(req.query);
  if (error) {
    throw new AppError(error.details[0].message, 400);
  }

  const { page, limit, sort, order } = value;
  const skip = (page - 1) * limit;

  const sortField = sort || 'createdAt';
  const sortOrder = order === 'asc' ? 1 : -1;

  const missions = await Mission.find()
    .sort({ [sortField]: sortOrder })
    .limit(limit)
    .skip(skip);

  const total = await Mission.countDocuments();

  res.status(200).json({
    success: true,
    data: {
      missions,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    },
  });
});

export const getMissionById = asyncHandler(async (req: Request, res: Response<ApiResponse>) => {
  const { id } = req.params;

  const mission = await Mission.findById(id);

  if (!mission) {
    throw new AppError('Mission not found', 404);
  }

  res.status(200).json({
    success: true,
    data: mission,
  });
});

export const completeMission = asyncHandler(async (req: Request, res: Response<ApiResponse>) => {
  const { id: missionId } = req.params;

  const { error, value } = missionCompletionValidation.validate(req.body);
  if (error) {
    throw new AppError(error.details[0].message, 400);
  }

  const { farmerId, choices, totalScoreImpact } = value;

  // Check if mission exists
  const mission = await Mission.findById(missionId);
  if (!mission) {
    throw new AppError('Mission not found', 404);
  }

  // Check if farmer exists
  const farmer = await Farmer.findById(farmerId);
  if (!farmer) {
    throw new AppError('Farmer not found', 404);
  }

  // Validate choices against mission nodes
  if (choices.length !== mission.nodes.length) {
    throw new AppError('Invalid number of choices for this mission', 400);
  }

  // Validate each choice
  let calculatedScoreImpact = 0;
  for (let i = 0; i < choices.length; i++) {
    const choiceIndex = choices[i];
    const node = mission.nodes[i];
    
    if (choiceIndex < 0 || choiceIndex >= node.choices.length) {
      throw new AppError(`Invalid choice ${choiceIndex} for node ${i}`, 400);
    }
    
    calculatedScoreImpact += node.choices[choiceIndex].scoreImpact;
  }

  // Verify score impact matches
  if (Math.abs(calculatedScoreImpact - totalScoreImpact) > 0.1) {
    throw new AppError('Score impact calculation mismatch', 400);
  }

  // Update farmer's stats
  farmer.xp += mission.xpReward;
  
  // Update eco score based on mission choices
  const ecoScoreChange = Math.round(totalScoreImpact);
  farmer.ecoScore = Math.max(0, Math.min(100, farmer.ecoScore + ecoScoreChange));

  // Award badges for sustainable choices
  const sustainableBadges = [];
  if (totalScoreImpact >= 15) {
    if (!farmer.badges.includes('eco-champion')) {
      sustainableBadges.push('eco-champion');
      farmer.badges.push('eco-champion');
    }
  }

  if (totalScoreImpact >= 10) {
    if (!farmer.badges.includes('wise-farmer')) {
      sustainableBadges.push('wise-farmer');
      farmer.badges.push('wise-farmer');
    }
  }

  // Award water conservation badge for specific choices
  const waterConservationChoices = choices.some((choice, nodeIndex) => {
    const node = mission.nodes[nodeIndex];
    return node.choices[choice]?.desc?.toLowerCase().includes('water') ||
           node.choices[choice]?.desc?.toLowerCase().includes('drip');
  });

  if (waterConservationChoices && !farmer.badges.includes('water-saver')) {
    sustainableBadges.push('water-saver');
    farmer.badges.push('water-saver');
  }

  await farmer.save();

  // Determine mission outcome message
  let outcomeMessage = '';
  let outcomeType = 'neutral';

  if (totalScoreImpact >= 15) {
    outcomeMessage = 'Excellent choices! You demonstrated outstanding sustainable farming practices.';
    outcomeType = 'excellent';
  } else if (totalScoreImpact >= 8) {
    outcomeMessage = 'Good job! Your choices show strong environmental awareness.';
    outcomeType = 'good';
  } else if (totalScoreImpact >= 0) {
    outcomeMessage = 'Not bad, but there\'s room for improvement in sustainable practices.';
    outcomeType = 'okay';
  } else {
    outcomeMessage = 'Your choices could be more environmentally friendly. Consider sustainable alternatives.';
    outcomeType = 'poor';
  }

  logger.info(`Mission ${missionId} completed by farmer ${farmerId}, score impact: ${totalScoreImpact}, XP: ${mission.xpReward}`);

  res.status(200).json({
    success: true,
    data: {
      farmer: {
        xp: farmer.xp,
        ecoScore: farmer.ecoScore,
        badges: farmer.badges,
        level: Math.floor(farmer.xp / 100) + 1,
      },
      missionResult: {
        xpGained: mission.xpReward,
        ecoScoreChange,
        newBadges: sustainableBadges,
        outcomeMessage,
        outcomeType,
        totalScoreImpact,
        choicesSummary: choices.map((choice, nodeIndex) => ({
          nodeIndex,
          choiceIndex: choice,
          choiceText: mission.nodes[nodeIndex].choices[choice].text,
          scoreImpact: mission.nodes[nodeIndex].choices[choice].scoreImpact,
          description: mission.nodes[nodeIndex].choices[choice].desc,
        })),
      },
    },
    message: 'Mission completed successfully!',
  });
});

export const getMissionStats = asyncHandler(async (req: Request, res: Response<ApiResponse>) => {
  const totalMissions = await Mission.countDocuments();
  
  // Get average XP reward
  const missions = await Mission.find({}, 'xpReward');
  const avgXpReward = missions.length > 0 
    ? missions.reduce((sum, m) => sum + m.xpReward, 0) / missions.length
    : 0;

  // Get missions by difficulty (based on XP reward ranges)
  const easyMissions = await Mission.countDocuments({ xpReward: { $lte: 100 } });
  const mediumMissions = await Mission.countDocuments({ xpReward: { $gt: 100, $lte: 300 } });
  const hardMissions = await Mission.countDocuments({ xpReward: { $gt: 300 } });

  res.status(200).json({
    success: true,
    data: {
      totalMissions,
      avgXpReward: Math.round(avgXpReward),
      difficulty: {
        easy: easyMissions,
        medium: mediumMissions,
        hard: hardMissions,
      },
    },
  });
});
