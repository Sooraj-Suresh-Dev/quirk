import { Request, Response, NextFunction } from 'express';
import { logRequest } from '../config/logger.js';

export function requestLogger(req: Request, res: Response, next: NextFunction) {
  const start = Date.now();

  res.on('finish', () => {
    const duration = Date.now() - start;
    logRequest(req.method, req.path, res.statusCode, duration);
  });

  next();
}
