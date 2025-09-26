import { Router } from 'express';
import {
  getMissions,
  getMissionById,
  completeMission,
  getMissionStats,
} from '../controllers/missionController';

const router = Router();

/**
 * @route GET /api/v1/missions
 * @desc Get all missions with pagination
 * @access Public (Demo)
 */
router.get('/', getMissions);

/**
 * @route GET /api/v1/missions/stats
 * @desc Get mission statistics
 * @access Public (Demo)
 */
router.get('/stats', getMissionStats);

/**
 * @route GET /api/v1/missions/:id
 * @desc Get specific mission
 * @access Public (Demo)
 */
router.get('/:id', getMissionById);

/**
 * @route POST /api/v1/missions/:id/complete
 * @desc Complete a mission with choices
 * @access Public (Demo)
 */
router.post('/:id/complete', completeMission);

export default router;
