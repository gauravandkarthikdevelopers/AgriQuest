import { Router } from 'express';
import {
  healthCheck,
  readinessCheck,
  getSystemInfo,
} from '../controllers/healthController';

const router = Router();

/**
 * @route GET /api/v1/health
 * @desc Health check endpoint
 * @access Public
 */
router.get('/', healthCheck);

/**
 * @route GET /api/v1/health/ready
 * @desc Readiness check for container orchestration
 * @access Public
 */
router.get('/ready', readinessCheck);

/**
 * @route GET /api/v1/health/info
 * @desc System information
 * @access Public
 */
router.get('/info', getSystemInfo);

export default router;
