// backend/services/user-service/src/index.ts
import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import webhookRoutes from './routes/webhook.routes';
import RabbitMQClient from './config/rabbitmq';

console.log('Starting user service...');

// Load environment variables
dotenv.config();
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