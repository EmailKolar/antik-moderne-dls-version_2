import 'dotenv/config';


// --- SENTRY SETUP MUST COME FIRST ---
import * as Sentry from '@sentry/node';
Sentry.init({
  dsn: process.env.SENTRY_DSN,
  environment: process.env.NODE_ENV || 'development',
  tracesSampleRate: 1.0,
  sendDefaultPii: true,
  debug: true,
});
// -------------------------------------

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

// Add your routes here
app.use('/api', routes);

// Sentry test route
app.get("/debug-sentry", function mainHandler(req, res) {
  throw new Error("My first Sentry error!");
});

// Prometheus metrics endpoint
client.collectDefaultMetrics();
app.get('/metrics', async (_req, res) => {
  res.set('Content-Type', client.register.contentType);
  res.end(await client.register.metrics());
});

// --- Sentry Error Handler (must come after routes) ---
Sentry.setupExpressErrorHandler(app);

// -------------------------------------------------------

const startServer = async () => {
  try {
    const rabbitMQUrl = process.env.RABBITMQ_URL || 'amqp://localhost';
    await connectRabbitMQ(rabbitMQUrl);

    RabbitMQService.consume('basket.created', (message) => {
      console.log('Received basket.created event:', message);
    });

    RabbitMQService.consume('order.confirmed.basket', async (message) => {
      try {
        console.log('Received order.confirmed event for basket:', message);
        const userId = message.userId;
        if (!userId) {
          console.warn('order.confirmed event missing userId');
          return;
        }

        const basketService = require('./services/basket.service').default;
        const basket = await basketService.findBasketByUserId(userId);
        if (basket) {
          await basketService.clearBasket(basket.id);
          console.log(`Cleared basket for userId: ${userId}`);
        } else {
          console.log(`No basket found for userId: ${userId}`);
        }
      } catch (err) {
        console.error('Error handling order.confirmed event:', err);
      }
    });

    app.listen(PORT, () => {
      console.log(`Basket service is running on port ${PORT}`);
    });
  } catch (error) {
    console.error('Failed to start the server:', error);
  }
};

startServer();
