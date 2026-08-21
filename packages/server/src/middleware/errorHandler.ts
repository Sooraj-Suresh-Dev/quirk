import { Request, Response, NextFunction } from 'express';
import { ZodError } from 'zod';
import { logError, logWarn } from '../config/logger.js';

export function errorHandler(
  err: Error,
  req: Request,
  res: Response,
  _next: NextFunction
): void {
  if (err instanceof ZodError) {
    logWarn(`Validation error at ${req.method} ${req.path}`, { err });

    res.status(400).json({
      error: 'Validation error',
      details: err.errors.map((e) => ({
        path: e.path.join('.'),
        message: e.message,
      })),
    });
    return;
  }

  if (err.name === 'UnauthorizedError') {
    logWarn(`Unauthorized at ${req.method} ${req.path}`);

    res.status(401).json({ error: 'Unauthorized' });
    return;
  }

  logError(`Internal server error at ${req.method} ${req.path}`, { err });

  res.status(500).json({ error: 'Internal server error' });
}
