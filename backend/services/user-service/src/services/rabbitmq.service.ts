import amqp, { Message } from 'amqplib/callback_api';

export class RabbitMQService {
  private connection: any = null;
  private channel: any = null;
  private readonly url: string = process.env.RABBITMQ_URL || 'amqp://guest:guest@localhost:5672';

  connect(): Promise<void> {
    return new Promise((resolve, reject) => {
      amqp.connect(this.url, (error, connection) => {
        if (error) {
          console.error('Failed to connect to RabbitMQ:', error);
          reject(error);
          return;
        }

        this.connection = connection;
        connection.createChannel((error, channel) => {
          if (error) {
            console.error('Failed to create channel:', error);
            reject(error);
            return;
          }

          this.channel = channel;
          console.log('Connected to RabbitMQ');
          resolve();
        });
      });
    });
  }

  async publish(queue: string, message: any): Promise<boolean> {
    return new Promise((resolve, reject) => {
      if (!this.channel) {
        reject(new Error('Channel not initialized. Call connect() first.'));
        return;
      }

      this.channel.assertQueue(queue, { durable: true }, (error: Error | null) => {
        if (error) {
          reject(error);
          return;
        }

        const messageBuffer = Buffer.from(JSON.stringify(message));
        const success = this.channel.sendToQueue(queue, messageBuffer);
        resolve(success);
      });
    });
  }

  async consume(queue: string, callback: (message: any) => void): Promise<void> {
    return new Promise((resolve, reject) => {
      if (!this.channel) {
        reject(new Error('Channel not initialized. Call connect() first.'));
        return;
      }

      this.channel.assertQueue(queue, { durable: true }, (error: Error | null) => {
        if (error) {
          reject(error);
          return;
        }

        this.channel.consume(queue, (msg: Message | null) => {
          if (msg) {
            const content = JSON.parse(msg.content.toString());
            callback(content);
            this.channel.ack(msg);
          }
        }, { noAck: false }, (error: Error | null) => {
          if (error) {
            reject(error);
            return;
          }
          resolve();
        });
      });
    });
  }

  async close(): Promise<void> {
    return new Promise((resolve) => {
      if (this.channel) {
        this.channel.close();
      }
      if (this.connection) {
        this.connection.close();
      }
      resolve();
    });
  }
} 