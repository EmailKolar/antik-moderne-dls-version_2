// backend/services/user-service/src/index.ts
import express from 'express';
import cors from 'cors';
import webhookRoutes from './routes/webhook.routes';
import RabbitMQClient from './config/rabbitmq';
import 'dotenv/config';  
import * as Sentry from '@sentry/node';  

Sentry.init({
  dsn: process.env.SENTRY_DSN,
  environment: process.env.NODE_ENV || 'development',
  tracesSampleRate: 1.0,
  sendDefaultPii: true,
  debug: true,
});

console.log('Starting user service...');

// Load environment variables
console.log('Environment variables loaded');

const app = express();

import client from 'prom-client';

// Prometheus metrics endpoint
client.collectDefaultMetrics();

app.get('/metrics', async (_req, res) => {
  res.set('Content-Type', client.register.contentType);
  res.end(await client.register.metrics());
});

// Middleware
app.use(cors());
app.use(express.json());

// Request logging middleware
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.url}`);
  next();
});

// Routes
app.use('/api/users', webhookRoutes);
console.log('Routes configured');

// Health check
app.get('/health', (req, res) => {
  console.log('Health check requested');
  res.json({ status: 'ok' });
});

// sentry test route
app.get('/debug-sentry', (_req, _res) => {
  throw new Error('My first Sentry error!');
});

Sentry.setupExpressErrorHandler(app);

async function startServer() {
  try {
    console.log('Initializing RabbitMQ...');
    // Initialize RabbitMQ
    await RabbitMQClient.getInstance().initialize();
    console.log('RabbitMQ initialized successfully');

    const port = process.env.PORT || 3001;
    app.listen(port, () => {
      console.log(`User service running on port ${port}`);
      console.log('Available endpoints:');
      console.log('  - POST /api/users/webhook');
      console.log('  - GET /health');
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    if (error instanceof Error) {
      console.error('Error details:', {
        message: error.message,
        stack: error.stack
      });
    }
    process.exit(1);
  }
}

startServer();