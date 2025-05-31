import { Request, Response, NextFunction } from 'express';
import { logger } from '../utils/logger';

export interface ApiError extends Error {
  statusCode?: number;
  isOperational?: boolean;
}

export const errorHandler = (
  err: ApiError,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const correlationId = req.headers['x-correlation-id'] as string || 'unknown';
  
  // Log the error
  logger.error('Error occurred', {
    error: err.message,
    stack: err.stack,
    statusCode: err.statusCode,
    path: req.path,
    method: req.method,
    correlationId
  });
  
  // Default to 500 server error
  const statusCode = err.statusCode || 500;
  const message = err.message || 'Internal Server Error';
  
  // Send error response
  res.status(statusCode).json({
    error: {
      message,
      statusCode,
      correlationId,
      timestamp: new Date().toISOString()
    }
  });
};

// Create custom error classes
export class BadRequestError extends Error implements ApiError {
  statusCode = 400;
  isOperational = true;
  
  constructor(message: string) {
    super(message);
    this.name = 'BadRequestError';
  }
}

export class UnauthorizedError extends Error implements ApiError {
  statusCode = 401;
  isOperational = true;
  
  constructor(message: string = 'Unauthorized') {
    super(message);
    this.name = 'UnauthorizedError';
  }
}

export class ForbiddenError extends Error implements ApiError {
  statusCode = 403;
  isOperational = true;
  
  constructor(message: string = 'Forbidden') {
    super(message);
    this.name = 'ForbiddenError';
  }
}

export class NotFoundError extends Error implements ApiError {
  statusCode = 404;
  isOperational = true;
  
  constructor(message: string = 'Not Found') {
    super(message);
    this.name = 'NotFoundError';
  }
}

export class ConflictError extends Error implements ApiError {
  statusCode = 409;
  isOperational = true;
  
  constructor(message: string) {
    super(message);
    this.name = 'ConflictError';
  }
}

export class InternalServerError extends Error implements ApiError {
  statusCode = 500;
  isOperational = false;
  
  constructor(message: string = 'Internal Server Error') {
    super(message);
    this.name = 'InternalServerError';
  }
}