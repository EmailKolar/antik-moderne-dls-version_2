import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import productRoutes from './routes/product.routes';
import { prisma } from './config/database';
import { connectRabbitMQ } from './config/rabbitmq';
import RabbitMQService from './services/rabbitmq.service';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3002;

app.use(cors());
app.use(express.json());
app.use('/products', productRoutes);
app.get('/', (_req, res) => res.send('Product Service Running'));

const start = async () => {
  try {
    await prisma.$connect();
    const rabbitMQUrl = process.env.RABBITMQ_URL || 'amqp://localhost';
    await connectRabbitMQ(rabbitMQUrl);
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