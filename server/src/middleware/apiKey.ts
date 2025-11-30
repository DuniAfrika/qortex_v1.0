import { Request, Response, NextFunction } from 'express';
import { env } from '../config/env';

export const apiKeyAuth = (req: Request, res: Response, next: NextFunction) => {
  const apiKey = req.header('x-api-key');
  if (!apiKey || apiKey !== env.apiKeySecret) {
    return res.status(401).json({ message: 'Unauthorized' });
  }
  return next();
};
