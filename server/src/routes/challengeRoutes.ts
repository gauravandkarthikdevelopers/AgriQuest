import { Router } from 'express';
import {
  getChallenges,
  getChallengeById,
  completeChallenge,
  getFarmerCompletions,
  getCompletionById,
} from '../controllers/challengeController';
import { uploadSingle } from '../middleware/upload';
import { uploadLimiter } from '../middleware/rateLimiter';

const router = Router();

/**
 * @route GET /api/v1/challenges
 * @desc Get all challenges with pagination
 * @access Public (Demo)
 */
router.get('/', getChallenges);

/**
 * @route GET /api/v1/challenges/:id
 * @desc Get specific challenge
 * @access Public (Demo)
 */
router.get('/:id', getChallengeById);

/**
 * @route POST /api/v1/challenges/:id/complete
 * @desc Complete a challenge with optional image proof
 * @access Public (Demo)
 */
router.post('/:id/complete', uploadLimiter, uploadSingle, completeChallenge);

/**
 * @route GET /api/v1/challenges/farmer/:farmerId/completions
 * @desc Get farmer's challenge completions
 * @access Public (Demo)
 */
router.get('/farmer/:farmerId/completions', getFarmerCompletions);

/**
 * @route GET /api/v1/challenges/completions/:id
 * @desc Get specific challenge completion
 * @access Public (Demo)
 */
router.get('/completions/:id', getCompletionById);

export default router;
