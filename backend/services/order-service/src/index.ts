import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import { PrismaClient } from '@prisma/client';
import orderRoutes from './routes/order.routes';
import { connectRabbitMQ } from './services/rabbitmq.service';

dotenv.config();
const app = express();
const prisma = new PrismaClient();

app.use(cors());
app.use(express.json());
app.use('/orders', orderRoutes);

const PORT = process.env.PORT || 3005;
app.listen(PORT, () => {
  console.log(`Order service running on port ${PORT}`);
});
connectRabbitMQ();