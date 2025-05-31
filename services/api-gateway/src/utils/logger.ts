import winston from 'winston';
import { config } from '../config';

const logFormat = winston.format.combine(
  winston.format.timestamp(),
  winston.format.errors({ stack: true }),
  winston.format.json()
);

export const logger = winston.createLogger({
  level: config.LOG_LEVEL,
  format: logFormat,
  defaultMeta: { service: 'api-gateway' },
  transports: [
    new winston.transports.Console({
      format: config.NODE_ENV === 'development' 
        ? winston.format.combine(
            winston.format.colorize(),
            winston.format.simple()
          )
        : logFormat
    })
  ]
});

// Create a stream object with a 'write' function for Morgan
export const loggerStream = {
  write: (message: string) => {
    logger.info(message.trim());
  }
};