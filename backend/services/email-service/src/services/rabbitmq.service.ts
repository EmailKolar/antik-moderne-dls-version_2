import { getRabbitMQChannel } from '../config/rabbitmq';
import EmailService from './email.service';

class RabbitMQService {
  async publish(queue: string, message: any) {
    const channel = getRabbitMQChannel();
    await channel.assertQueue(queue, { durable: true });
    channel.sendToQueue(queue, Buffer.from(JSON.stringify(message)));
    console.log(`Message published to queue "${queue}":`, message);
  }

  async consume(queue: string, onMessage: (msg: any) => void) {
    const channel = getRabbitMQChannel();
    await channel.assertQueue(queue, { durable: true });
    channel.consume(queue, (msg) => {
      if (msg) {
        const content = JSON.parse(msg.content.toString());
        console.log(`Message received from queue "${queue}":`, content);
        onMessage(content);
        channel.ack(msg);
      }
    });
  }

  async startConsumers() {
    // Example: Consume 'email.orderConfirmed'
    await this.consume('email.orderConfirmed', async (message) => {
      console.log('Processing email.orderConfirmed event:', message);

      // Call your email-sending logic here
      const { orderId, items } = message;
      await EmailService.sendEmail(
        'user@example.com', // Replace with the user's email
        `Order Confirmation - ${orderId}`,
        `Your order has been confirmed. Items: ${JSON.stringify(items)}`,
        'ORDER_CONFIRMED'
      );
    });
  }
}

export default new RabbitMQService();