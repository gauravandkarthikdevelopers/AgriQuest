import rateLimit from 'express-rate-limit';

// General API rate limiter
export const generalLimiter = rateLimit({
  windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS || '900000'), // 15 minutes
  max: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS || '100'),
  message: {
    error: true,
    message: 'Too many requests from this IP, please try again later.',
  },
  standardHeaders: true,
  legacyHeaders: false,
});

// Stricter limiter for image uploads
export const uploadLimiter = rateLimit({
  windowMs: 5 * 60 * 1000, // 5 minutes
  max: 10, // 10 uploads per 5 minutes
  message: {
    error: true,
    message: 'Too many image uploads, please wait before uploading again.',
  },
  standardHeaders: true,
  legacyHeaders: false,
});

// Very strict limiter for AI analysis
export const aiAnalysisLimiter = rateLimit({
  windowMs: 10 * 60 * 1000, // 10 minutes
  max: 5, // 5 analyses per 10 minutes
  message: {
    error: true,
    message: 'AI analysis rate limit exceeded. Please wait before analyzing more images.',
  },
  standardHeaders: true,
  legacyHeaders: false,
});
