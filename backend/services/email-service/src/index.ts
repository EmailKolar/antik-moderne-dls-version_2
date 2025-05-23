import express from 'express';
import { connectRabbitMQ } from './config/rabbitmq';
import RabbitMQService from './services/rabbitmq.service';
import EmailService from './services/email.service';
import routes from './routes/email.routes';



const app = express();
const PORT = process.env.PORT || 3004;

app.use(express.json());
app.use('/api', routes);

import client from 'prom-client';

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

    // Consume the 'user.signedUp' event
    RabbitMQService.consume('user.signedUp', async (message) => {
      console.log('Processing user.signedUp event:', message);
      const { to, subject, body } = message;

      // Send a welcome email
      await EmailService.sendEmail(to, subject, body, 'SIGN_UP');
    });

    // Consume the 'checkout.completed' event
    RabbitMQService.consume('checkout.completed', async (message) => {
      console.log('Processing checkout.completed event:', message);
      const { to, subject, body } = message;

      // Send a checkout confirmation email
      await EmailService.sendEmail(to, subject, body, 'CHECKOUT');
    });

    // Start the server
    app.listen(PORT, () => {
      console.log(`Email service is running on port ${PORT}`);
    });
  } catch (error) {
    console.error('Failed to start the server:', error);
  }

  RabbitMQService.startConsumers();
};

startServer();
