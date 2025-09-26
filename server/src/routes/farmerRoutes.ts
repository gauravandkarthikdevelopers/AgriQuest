import { Router } from 'express';
import {
  getDemoFarmer,
  getFarmerById,
  getFarmerProgress,
  getLeaderboard,
  getRegions,
  getVillagesByRegion,
  updateFarmer,
} from '../controllers/farmerController';

const router = Router();

/**
 * @route GET /api/v1/farmers/demo
 * @desc Get or create demo farmer
 * @access Public (Demo)
 */
router.get('/demo', getDemoFarmer);

/**
 * @route GET /api/v1/farmers/leaderboard
 * @desc Get farmers leaderboard
 * @access Public (Demo)
 */
router.get('/leaderboard', getLeaderboard);

/**
 * @route GET /api/v1/farmers/regions
 * @desc Get all regions
 * @access Public (Demo)
 */
router.get('/regions', getRegions);

/**
 * @route GET /api/v1/farmers/regions/:region/villages
 * @desc Get villages by region
 * @access Public (Demo)
 */
router.get('/regions/:region/villages', getVillagesByRegion);

/**
 * @route GET /api/v1/farmers/:id
 * @desc Get specific farmer
 * @access Public (Demo)
 */
router.get('/:id', getFarmerById);

/**
 * @route GET /api/v1/farmers/:id/progress
 * @desc Get farmer's progress and statistics
 * @access Public (Demo)
 */
router.get('/:id/progress', getFarmerProgress);

/**
 * @route PUT /api/v1/farmers/:id
 * @desc Update farmer profile
 * @access Public (Demo)
 */
router.put('/:id', updateFarmer);

export default router;
