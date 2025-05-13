import { getRabbitMQChannel } from '../config/rabbitmq';

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
}

export default new RabbitMQService();