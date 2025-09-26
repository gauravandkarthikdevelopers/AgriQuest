import { Router } from 'express';
import cropScanRoutes from './cropScanRoutes';
import challengeRoutes from './challengeRoutes';
import farmerRoutes from './farmerRoutes';
import missionRoutes from './missionRoutes';
import healthRoutes from './healthRoutes';

const router = Router();

// API Routes
router.use('/crop-scan', cropScanRoutes);
router.use('/challenges', challengeRoutes);
router.use('/farmers', farmerRoutes);
router.use('/missions', missionRoutes);
router.use('/health', healthRoutes);

// API Info endpoint
router.get('/', (req, res) => {
  res.json({
    success: true,
    message: 'AgriQuest API v1.0.0',
    endpoints: {
      health: '/api/v1/health',
      farmers: '/api/v1/farmers',
      challenges: '/api/v1/challenges',
      missions: '/api/v1/missions',
      cropScan: '/api/v1/crop-scan',
    },
    documentation: 'https://github.com/agriquest/api-docs',
    timestamp: new Date().toISOString(),
  });
});

export default router;
