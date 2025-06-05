import { Request, Response, NextFunction } from 'express';
import { ApiResponse } from '../types';
import logger from '../utils/logger';

export const errorHandler = (
  error: Error,
  req: Request,
  res: Response<ApiResponse<any>>,
  next: NextFunction
) => {
  logger.error('Unhandled error:', {
    error: error.message,
    stack: error.stack,
    url: req.url,
    method: req.method,
    body: req.body,
    params: req.params,
    query: req.query
  });

  // Default error response
  let statusCode = 500;
  let message = 'Internal server error';

  // Handle specific error types
  if (error.message.includes('Failed to retrieve')) {
    statusCode = 500;
    message = 'Database error occurred';
  } else if (error.message.includes('not found') || error.message.includes('Task not found')) {
    statusCode = 404;
    message = 'Resource not found';
  } else if (error.message.includes('Validation')) {
    statusCode = 400;
    message = error.message;
  }

  res.status(statusCode).json({
    success: false,
    error: message,
    ...(process.env.NODE_ENV === 'development' && { stack: error.stack })
  });
};

export const notFoundHandler = (req: Request, res: Response<ApiResponse<any>>) => {
  logger.warn(`Route not found: ${req.method} ${req.url}`);
  
  res.status(404).json({
    success: false,
    error: 'Route not found',
    message: `Cannot ${req.method} ${req.url}`
  });
};
