// backend/services/user-service/src/config/rabbitmq.ts
import amqp from 'amqplib/callback_api';

class RabbitMQClient {
  private static instance: RabbitMQClient;
  private connection: any;
  private channel: any;

  private constructor() {}

  static getInstance(): RabbitMQClient {
    if (!RabbitMQClient.instance) {
      RabbitMQClient.instance = new RabbitMQClient();
    }
    return RabbitMQClient.instance;
  }

  initialize(): Promise<void> {
    return new Promise((resolve, reject) => {
      amqp.connect(process.env.RABBITMQ_URL || 'amqp://guest:guest@localhost:5672', (err, connection) => {
        if (err) {
          console.error('RabbitMQ connection error:', err);
          reject(err);
          return;
        }
        
        this.connection = connection;
        connection.createChannel((err, channel) => {
          if (err) {
            console.error('RabbitMQ channel error:', err);
            reject(err);
            return;
          }
          
          this.channel = channel;
          channel.assertExchange('user-events', 'topic', { durable: true }, (err) => {
            if (err) {
              reject(err);
              return;
            }
            console.log('Connected to RabbitMQ');
            resolve();
          });
        });
      });
    });
  }

  getChannel() {
    if (!this.channel) {
      throw new Error('RabbitMQ channel not initialized');
    }
    return this.channel;
  }
}

export default RabbitMQClient;