import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

export const config = {
  // Environment
  NODE_ENV: process.env.NODE_ENV || 'development',
  PORT: parseInt(process.env.PORT || '3000', 10),
  
  // Service URLs
  TRADING_ENGINE_URL: process.env.TRADING_ENGINE_URL || 'http://trading-engine:8000',
  MARKET_DATA_URL: process.env.MARKET_DATA_URL || 'http://market-data:8001',
  
  // Security
  JWT_SECRET: process.env.JWT_SECRET || 'your-secret-key',
  API_GATEWAY_SECRET: process.env.API_GATEWAY_SECRET || 'gateway-secret',
  
  // Redis
  REDIS_HOST: process.env.REDIS_HOST || 'redis',
  REDIS_PORT: parseInt(process.env.REDIS_PORT || '6379', 10),
  REDIS_PASSWORD: process.env.REDIS_PASSWORD || '',
  
  // CORS
  ALLOWED_ORIGINS: process.env.ALLOWED_ORIGINS?.split(',') || ['http://localhost:3001'],
  
  // Rate limiting
  RATE_LIMIT_WINDOW_MS: parseInt(process.env.RATE_LIMIT_WINDOW_MS || '60000', 10),
  RATE_LIMIT_MAX_REQUESTS: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS || '100', 10),
  
  // Logging
  LOG_LEVEL: process.env.LOG_LEVEL || 'info',
};

// Validate required configuration
const requiredEnvVars = ['JWT_SECRET', 'REDIS_PASSWORD'];
for (const envVar of requiredEnvVars) {
  if (!process.env[envVar]) {
    console.error(`Missing required environment variable: ${envVar}`);
    process.exit(1);
  }
}