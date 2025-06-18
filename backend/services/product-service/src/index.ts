import express from 'express';
import cors from 'cors';
import productRoutes from './routes/product.routes';
import { prisma } from './config/database';
import { connectRabbitMQ } from './config/rabbitmq';
import RabbitMQService from './services/rabbitmq.service';
import { ClerkExpressRequireAuth, ClerkExpressWithAuth } from '@clerk/clerk-sdk-node';
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
const PORT = process.env.PORT || 3002;

app.use(cors());
app.use(express.json());

// Clerk middleware should be AFTER CORS and json, but BEFORE routes
app.use(ClerkExpressWithAuth());

// Health and metrics endpoints should NOT require Clerk
app.get('/', (_req, res) => res.send('Product Service Running'));


import client from 'prom-client';

// Prometheus metrics endpoint
client.collectDefaultMetrics();

app.get('/metrics', async (_req, res) => {
  res.set('Content-Type', client.register.contentType);
  res.end(await client.register.metrics());
});

// Product routes (protected by Clerk for req.auth, but GETs are public)
app.use('/products', productRoutes);

// sentry test route
app.get('/debug-sentry', (_req, _res) => {
  throw new Error('My first Sentry error!');
});

Sentry.setupExpressErrorHandler(app);

const start = async () => {
  try {
    await prisma.$connect();
    const rabbitMQUrl = process.env.RABBITMQ_URL || 'amqp://localhost';
    
    await connectRabbitMQ(rabbitMQUrl);
    console.log('Connected to RabbitMQ');
    await RabbitMQService.startOrderListener();

    app.listen(PORT, () => {
      console.log(`Product service running on http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error('Failed to start product service:', error);
    process.exit(1);
  }
};

start();
