
import { Request, Response, NextFunction } from 'express';
import { logger } from '../utils/logger';

export const requestLogger = (req: Request, res: Response, next: NextFunction) => {
    logger.info(`Incoming Request: ${req.method} ${req.url}`, {
        body: req.body,
        query: req.query,
        ip: req.ip
    });

    // Hook into response finish to log status
    res.on('finish', () => {
        logger.info(`Response Sent: ${req.method} ${req.url}`, {
            status: res.statusCode
        });
    });

    next();
};
