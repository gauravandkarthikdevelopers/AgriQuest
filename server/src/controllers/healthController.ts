import { Request, Response } from 'express';
import mongoose from 'mongoose';
import { GeminiService } from '../services/gemini';
import { asyncHandler } from '../middleware/errorHandler';
import { ApiResponse } from '../types';

const geminiService = new GeminiService();

export const healthCheck = asyncHandler(async (req: Request, res: Response<ApiResponse>) => {
  const health = {
    status: 'OK',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    environment: process.env.NODE_ENV || 'development',
    version: process.env.npm_package_version || '1.0.0',
    services: {
      database: 'unknown',
      geminiAPI: 'unknown',
    },
    memory: {
      used: Math.round((process.memoryUsage().heapUsed / 1024 / 1024) * 100) / 100,
      total: Math.round((process.memoryUsage().heapTotal / 1024 / 1024) * 100) / 100,
    },
  };

  // Check database connection
  try {
    if (mongoose.connection.readyState === 1) {
      health.services.database = 'connected';
    } else {
      health.services.database = 'disconnected';
    }
  } catch (error) {
    health.services.database = 'error';
  }

  // Check Gemini API
  try {
    if (geminiService.isAvailable()) {
      const isWorking = await geminiService.testConnection();
      health.services.geminiAPI = isWorking ? 'available' : 'error';
    } else {
      health.services.geminiAPI = 'not_configured';
    }
  } catch (error) {
    health.services.geminiAPI = 'error';
  }

  // Determine overall status
  const hasErrors = Object.values(health.services).some(status => 
    status === 'error' || status === 'disconnected'
  );

  if (hasErrors) {
    health.status = 'DEGRADED';
  }

  const statusCode = hasErrors ? 503 : 200;

  res.status(statusCode).json({
    success: !hasErrors,
    data: health,
    message: hasErrors ? 'Some services are experiencing issues' : 'All systems operational',
  });
});

export const readinessCheck = asyncHandler(async (req: Request, res: Response<ApiResponse>) => {
  const checks = {
    database: false,
    geminiAPI: false,
    environment: false,
  };

  // Check database
  checks.database = mongoose.connection.readyState === 1;

  // Check environment variables
  checks.environment = !!(
    process.env.MONGO_URI &&
    process.env.PORT
  );

  // Check Gemini API (optional for readiness)
  checks.geminiAPI = geminiService.isAvailable() || true; // Don't fail if not configured

  const isReady = Object.values(checks).every(check => check === true);

  res.status(isReady ? 200 : 503).json({
    success: isReady,
    data: {
      ready: isReady,
      checks,
    },
    message: isReady ? 'Service is ready' : 'Service is not ready',
  });
});

export const getSystemInfo = asyncHandler(async (req: Request, res: Response<ApiResponse>) => {
  const info = {
    node: {
      version: process.version,
      platform: process.platform,
      arch: process.arch,
    },
    app: {
      name: 'AgriQuest API',
      version: process.env.npm_package_version || '1.0.0',
      environment: process.env.NODE_ENV || 'development',
    },
    database: {
      status: mongoose.connection.readyState === 1 ? 'connected' : 'disconnected',
      host: process.env.MONGO_URI?.split('@')[1]?.split('/')[0] || 'unknown',
    },
    ai: {
      geminiConfigured: !!process.env.GEMINI_API_KEY,
      geminiAvailable: geminiService.isAvailable(),
    },
    features: {
      cropAnalysis: true,
      challenges: true,
      missions: true,
      leaderboard: true,
      imageUpload: true,
    },
  };

  res.status(200).json({
    success: true,
    data: info,
  });
});
