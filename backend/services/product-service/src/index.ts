import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import productRoutes from './routes/product.routes';
import { connectRabbitMQ } from './config/rabbitmq';
import { prisma } from './config/database';

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

app.use('/products', productRoutes);

const PORT = process.env.PORT || 4002;

app.listen(PORT, async () => {
  await prisma.$connect();
  await connectRabbitMQ();
  console.log(`Product service running on port ${PORT}`);
});
