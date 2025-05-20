import express from 'express';
import { connectRabbitMQ } from './config/rabbitmq';
import routes from './routes/basket.routes';
import RabbitMQService from './services/rabbitmq.service';
import client from 'prom-client';
import cors from 'cors';

const app = express();
const PORT = process.env.PORT || 3003;

app.use(cors());
app.use(express.json());
app.use('/api', routes);

// Prometheus metrics endpoint
client.collectDefaultMetrics();

app.get('/metrics', async (_req, res) => {
  res.set('Content-Type', client.register.contentType);
  res.end(await client.register.metrics());
});

const startServer = async () => {
  try {
    // Connect to RabbitMQ
    const rabbitMQUrl = process.env.RABBITMQ_URL || 'amqp://localhost';
    await connectRabbitMQ(rabbitMQUrl);

    RabbitMQService.consume('basket.created', (message) => {
      console.log('Received basket.created event:', message);
    });

    // Start the server
    app.listen(PORT, () => {
      console.log(`Basket service is running on port ${PORT}`);
    });
  } catch (error) {
    console.error('Failed to start the server:', error);
  }
};

startServer();