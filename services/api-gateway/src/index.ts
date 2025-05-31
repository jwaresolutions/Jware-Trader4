import express, { Request, Response, NextFunction } from 'express';
import helmet from 'helmet';
import cors from 'cors';
import { createProxyMiddleware } from 'http-proxy-middleware';
import rateLimit from 'express-rate-limit';
import { WebSocketServer } from 'ws';
import http from 'http';
import { v4 as uuidv4 } from 'uuid';
import { logger } from './utils/logger';
import { config } from './config';
import { authMiddleware } from './middleware/auth';
import { errorHandler } from './middleware/errorHandler';

// Create Express app
const app = express();
const server = http.createServer(app);

// Create WebSocket server
const wss = new WebSocketServer({ server });

// Middleware
app.use(helmet());
app.use(cors({
  origin: config.NODE_ENV === 'development' ? '*' : config.ALLOWED_ORIGINS,
  credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Request logging middleware
app.use((req: Request, res: Response, next: NextFunction) => {
  const correlationId = req.headers['x-correlation-id'] as string || uuidv4();
  req.headers['x-correlation-id'] = correlationId;
  
  const start = Date.now();
  
  res.on('finish', () => {
    const duration = Date.now() - start;
    logger.info('Request completed', {
      method: req.method,
      path: req.path,
      statusCode: res.statusCode,
      duration,
      correlationId
    });
  });
  
  logger.info('Request received', {
    method: req.method,
    path: req.path,
    correlationId
  });
  
  next();
});

// Rate limiting
const limiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 100, // limit each IP to 100 requests per windowMs
  message: 'Too many requests from this IP, please try again later.'
});

app.use('/api/', limiter);

// Health check endpoints
app.get('/health', (_req: Request, res: Response) => {
  res.json({
    status: 'healthy',
    service: 'api-gateway',
    version: '1.0.0',
    timestamp: new Date().toISOString()
  });
});

app.get('/health/detailed', async (_req: Request, res: Response) => {
  const healthStatus = {
    status: 'healthy',
    service: 'api-gateway',
    version: '1.0.0',
    checks: {
      tradingEngine: { status: 'unknown' },
      marketData: { status: 'unknown' }
    }
  };
  
  // Check Trading Engine
  try {
    const response = await fetch(`${config.TRADING_ENGINE_URL}/health`);
    if (response.ok) {
      healthStatus.checks.tradingEngine = { status: 'healthy' };
    } else {
      healthStatus.checks.tradingEngine = { status: 'unhealthy' };
      healthStatus.status = 'degraded';
    }
  } catch (error) {
    healthStatus.checks.tradingEngine = { status: 'unhealthy' };
    healthStatus.status = 'degraded';
  }
  
  // Check Market Data
  try {
    const response = await fetch(`${config.MARKET_DATA_URL}/health`);
    if (response.ok) {
      healthStatus.checks.marketData = { status: 'healthy' };
    } else {
      healthStatus.checks.marketData = { status: 'unhealthy' };
      healthStatus.status = 'degraded';
    }
  } catch (error) {
    healthStatus.checks.marketData = { status: 'unhealthy' };
    healthStatus.status = 'degraded';
  }
  
  res.json(healthStatus);
});

// Proxy configuration for services
const tradingEngineProxy = createProxyMiddleware({
  target: config.TRADING_ENGINE_URL,
  changeOrigin: true,
  onProxyReq: (proxyReq, req) => {
    // Forward correlation ID
    if (req.headers['x-correlation-id']) {
      proxyReq.setHeader('x-correlation-id', req.headers['x-correlation-id']);
    }
  },
  onError: (err, _req, res) => {
    logger.error('Trading Engine proxy error', { error: err.message });
    res.status(502).json({ error: 'Bad Gateway', message: 'Trading Engine unavailable' });
  }
});

const marketDataProxy = createProxyMiddleware({
  target: config.MARKET_DATA_URL,
  changeOrigin: true,
  onProxyReq: (proxyReq, req) => {
    // Forward correlation ID
    if (req.headers['x-correlation-id']) {
      proxyReq.setHeader('x-correlation-id', req.headers['x-correlation-id']);
    }
  },
  onError: (err, _req, res) => {
    logger.error('Market Data proxy error', { error: err.message });
    res.status(502).json({ error: 'Bad Gateway', message: 'Market Data unavailable' });
  }
});

// Route proxying
app.use('/api/v1/auth', tradingEngineProxy);
app.use('/api/v1/trading', authMiddleware, tradingEngineProxy);
app.use('/api/v1/accounts', authMiddleware, tradingEngineProxy);
app.use('/api/v1/market-data', marketDataProxy);

// WebSocket handling
wss.on('connection', (ws, _req) => {
  const clientId = uuidv4();
  logger.info('WebSocket connection established', { clientId });
  
  ws.on('message', (message) => {
    try {
      const data = JSON.parse(message.toString());
      logger.info('WebSocket message received', { clientId, data });
      
      // Echo for now - implement actual logic later
      ws.send(JSON.stringify({
        type: 'echo',
        data: data,
        timestamp: new Date().toISOString()
      }));
    } catch (error) {
      logger.error('WebSocket message error', { clientId, error });
      ws.send(JSON.stringify({
        type: 'error',
        message: 'Invalid message format'
      }));
    }
  });
  
  ws.on('close', () => {
    logger.info('WebSocket connection closed', { clientId });
  });
  
  ws.on('error', (error) => {
    logger.error('WebSocket error', { clientId, error });
  });
  
  // Send welcome message
  ws.send(JSON.stringify({
    type: 'welcome',
    clientId,
    timestamp: new Date().toISOString()
  }));
});

// 404 handler
app.use((req: Request, res: Response) => {
  res.status(404).json({
    error: 'Not Found',
    message: 'The requested resource was not found',
    path: req.path
  });
});

// Error handling middleware
app.use(errorHandler);

// Start server
const PORT = process.env.PORT || 3000;

server.listen(PORT, () => {
  logger.info(`API Gateway started on port ${PORT}`);
  logger.info(`Environment: ${config.NODE_ENV}`);
});

// Graceful shutdown
process.on('SIGTERM', () => {
  logger.info('SIGTERM received, shutting down gracefully');
  server.close(() => {
    logger.info('Server closed');
    process.exit(0);
  });
});

process.on('SIGINT', () => {
  logger.info('SIGINT received, shutting down gracefully');
  server.close(() => {
    logger.info('Server closed');
    process.exit(0);
  });
});

export { app, server };