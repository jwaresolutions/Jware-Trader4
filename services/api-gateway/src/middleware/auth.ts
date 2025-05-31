import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { config } from '../config';
import { logger } from '../utils/logger';

interface AuthRequest extends Request {
  user?: any;
}

export const authMiddleware = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    // Get token from header
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({
        error: 'Unauthorized',
        message: 'No token provided'
      });
    }
    
    const token = authHeader.substring(7);
    
    try {
      // Verify token
      const decoded = jwt.verify(token, config.JWT_SECRET);
      req.user = decoded;
      
      // Forward the authorization header to backend services
      next();
    } catch (error) {
      logger.error('Token verification failed', { error });
      return res.status(401).json({
        error: 'Unauthorized',
        message: 'Invalid token'
      });
    }
  } catch (error) {
    logger.error('Auth middleware error', { error });
    return res.status(500).json({
      error: 'Internal Server Error',
      message: 'Authentication error'
    });
  }
};

// Optional auth middleware - doesn't fail if no token
export const optionalAuthMiddleware = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const authHeader = req.headers.authorization;
    
    if (authHeader && authHeader.startsWith('Bearer ')) {
      const token = authHeader.substring(7);
      
      try {
        const decoded = jwt.verify(token, config.JWT_SECRET);
        req.user = decoded;
      } catch (error) {
        // Token is invalid but we don't fail the request
        logger.debug('Invalid token in optional auth', { error });
      }
    }
    
    next();
  } catch (error) {
    logger.error('Optional auth middleware error', { error });
    next();
  }
};