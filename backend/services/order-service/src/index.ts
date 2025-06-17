import express from 'express';
import cors from 'cors';
import { PrismaClient } from '@prisma/client';
import orderRoutes from './routes/order.routes';
import RabbitMQService from './services/rabbitmq.service';
import 'dotenv/config';  
import * as Sentry from '@sentry/node';  

Sentry.init({
  dsn: process.env.SENTRY_DSN,
  environment: process.env.NODE_ENV || 'development',
  tracesSampleRate: 1.0,
  sendDefaultPii: true,
  debug: true,
});

const app = express();
const prisma = new PrismaClient();

app.use(cors());
app.use(express.json());
app.use('/orders', orderRoutes);

import client from 'prom-client';

// Prometheus metrics endpoint
client.collectDefaultMetrics();

app.get('/metrics', async (_req, res) => {
  res.set('Content-Type', client.register.contentType);
  res.end(await client.register.metrics());
});

// sentry test route
app.get('/debug-sentry', (_req, _res) => {
  throw new Error('My first Sentry error!');
});

Sentry.setupExpressErrorHandler(app);

const PORT = process.env.PORT || 3005;

const start = async () => {
  try {
    // Connect to RabbitMQ using the class-based service
    await RabbitMQService.connect();
    console.log('RabbitMQ connected successfully.');

    // Start consuming events
    await RabbitMQService.consumeEvents();
    console.log('RabbitMQ consumers started.');

    // Start the Express server
    app.listen(PORT, () => {
      console.log(`Order service running on port ${PORT}`);
    });
  } catch (error) {
    console.error('Failed to start the service:', error);
    process.exit(1); // Exit the process if initialization fails
  }
};

start();