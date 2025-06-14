import rateLimit from 'express-rate-limit';
import { Request, Response } from 'express';

export const statsRateLimit = rateLimit({
  windowMs: 5 * 60 * 1000,
  max: 5,
  message: 'Too many requests, please try again later.',
  standardHeaders: true,
  legacyHeaders: false,
  keyGenerator: (req: Request) => req.user?.id || '',
  handler: (req: Request & { rateLimit?: { resetTime: number } }, res: Response) => {
    res.status(429).json({
      error: 'Rate limit exceeded',
      message: 'Too many requests for stats endpoint. Please try again later.',
      retryAfter: Math.round((req.rateLimit?.resetTime ?? 0) / 1000) || 60,
    });
  },
});

export const expensiveRateLimit = rateLimit({
  windowMs: 5 * 60 * 1000,
  max: 5,
  message: 'Too many requests, please try again later.',
  standardHeaders: true,
  legacyHeaders: false,
  keyGenerator: (req: Request) => req.user?.id || '',
  handler: (req: Request & { rateLimit?: { resetTime: number } }, res: Response) => {
    res.status(429).json({
      error: 'Rate limit exceeded',
      message: 'Too many requests for endpoint. Please try again later.',
      retryAfter: Math.round((req.rateLimit?.resetTime ?? 0) / 1000) || 60,
    });
  },
});

export const createUserRateLimit = () => {
  return rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 3,
    keyGenerator: (req: Request) => req.ip || '',
    message: 'Too many requests, please try again later.',
    standardHeaders: true,
    legacyHeaders: false,
    handler: (req: Request & { rateLimit?: { resetTime: number } }, res: Response) => {
      res.status(429).json({
        error: 'Rate limit exceeded',
        message: 'Too many requests for endpoint. Please try again later.',
        retryAfter: Math.round((req.rateLimit?.resetTime ?? 0) / 1000) || 60,
      });
    },
  });
};
