import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import { PrismaClient } from '@prisma/client';
import orderRoutes from './routes/order.routes';
import RabbitMQService from './services/rabbitmq.service';

dotenv.config();
const app = express();
const prisma = new PrismaClient();

app.use(cors());
app.use(express.json());
app.use('/orders', orderRoutes);

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