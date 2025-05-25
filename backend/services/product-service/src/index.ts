import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import productRoutes from './routes/product.routes';
import { prisma } from './config/database';
import { connectRabbitMQ } from './config/rabbitmq';
import RabbitMQService from './services/rabbitmq.service';
import { ClerkExpressRequireAuth, ClerkExpressWithAuth } from '@clerk/clerk-sdk-node';


dotenv.config();

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
