import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import productRoutes from './routes/product.routes';
import { connectRabbitMQ } from './services/rabbitmq.service';
import { prisma } from './config/database';
import { orderListener } from "./events/order.listener";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

app.use('/products', productRoutes);
app.get('/', (req, res) => res.send('Product Service Running '));

const PORT = process.env.PORT || 3002;

async function start() {
  await prisma.$connect();
  await connectRabbitMQ();
  await orderListener();

  app.listen(PORT, () => {
    console.log(` Product service running on http://localhost:${PORT}`);
  });
}

start();
