import { Router } from 'express';
import {
  analyzeCrop,
  getCropScans,
  getCropScanById,
  deleteCropScan,
} from '../controllers/cropScanController';
import { uploadSingle } from '../middleware/upload';
import { aiAnalysisLimiter, uploadLimiter } from '../middleware/rateLimiter';

const router = Router();

/**
 * @route POST /api/v1/crop-scan
 * @desc Analyze crop image with AI
 * @access Public (Demo)
 */
router.post('/', uploadLimiter, aiAnalysisLimiter, uploadSingle, analyzeCrop);

/**
 * @route GET /api/v1/crop-scan
 * @desc Get crop scans with pagination
 * @access Public (Demo)
 */
router.get('/', getCropScans);

/**
 * @route GET /api/v1/crop-scan/:id
 * @desc Get specific crop scan
 * @access Public (Demo)
 */
router.get('/:id', getCropScanById);

/**
 * @route DELETE /api/v1/crop-scan/:id
 * @desc Delete crop scan and associated files
 * @access Public (Demo)
 */
router.delete('/:id', deleteCropScan);

export default router;
