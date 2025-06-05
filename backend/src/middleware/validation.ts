import { Request, Response, NextFunction } from 'express';
import { ZodSchema, ZodError } from 'zod';
import { ApiResponse } from '../types';
import logger from '../utils/logger';

export const validateBody = (schema: ZodSchema) => {
  return (req: Request, res: Response<ApiResponse<any>>, next: NextFunction) => {
    try {
      req.body = schema.parse(req.body);
      next();
    } catch (error) {
      if (error instanceof ZodError) {
        const errors = error.errors.map(err => ({
          field: err.path.join('.'),
          message: err.message
        }));
        
        logger.warn('Validation error:', { errors, body: req.body });
        
        res.status(400).json({
          success: false,
          error: 'Validation failed',
          message: errors.map(e => `${e.field}: ${e.message}`).join(', ')
        });
        return;
      }
      next(error);
    }
  };
};

export const validateParams = (schema: ZodSchema) => {
  return (req: Request, res: Response<ApiResponse<any>>, next: NextFunction) => {
    try {
      req.params = schema.parse(req.params);
      next();
    } catch (error) {
      if (error instanceof ZodError) {
        const errors = error.errors.map(err => ({
          field: err.path.join('.'),
          message: err.message
        }));
        
        logger.warn('Parameter validation error:', { errors, params: req.params });
        
        res.status(400).json({
          success: false,
          error: 'Invalid parameters',
          message: errors.map(e => `${e.field}: ${e.message}`).join(', ')
        });
        return;
      }
      next(error);
    }
  };
};

export const validateQuery = (schema: ZodSchema) => {
  return (req: Request, res: Response<ApiResponse<any>>, next: NextFunction) => {
    try {
      req.query = schema.parse(req.query);
      next();
    } catch (error) {
      if (error instanceof ZodError) {
        const errors = error.errors.map(err => ({
          field: err.path.join('.'),
          message: err.message
        }));
        
        logger.warn('Query validation error:', { errors, query: req.query });
        
        res.status(400).json({
          success: false,
          error: 'Invalid query parameters',
          message: errors.map(e => `${e.field}: ${e.message}`).join(', ')
        });
        return;
      }
      next(error);
    }
  };
};
