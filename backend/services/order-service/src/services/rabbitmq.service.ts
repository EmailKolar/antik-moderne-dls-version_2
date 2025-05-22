import amqp from 'amqplib';
import dotenv from 'dotenv';
import prisma from '../config/database';
import { OrderStatus } from '@prisma/client';
import { OrderService } from './order.service';
import { notifyUser } from '../ws';

dotenv.config();

class RabbitMQService {
  private channel: amqp.Channel | null = null;
  private orderService: OrderService;

  constructor() {
    this.orderService = new OrderService();
  }

  async connect() {
    try {
      const connection = await amqp.connect(process.env.RABBITMQ_URL || 'amqp://localhost');
      this.channel = await connection.createChannel();
      console.log('Connected to RabbitMQ');
    } catch (err) {
      console.error('Failed to connect to RabbitMQ', err);
    }
  }

  async publishEvent(queue: string, message: object) {
    if (!this.channel) {
      console.error('RabbitMQ channel not initialized');
      return;
    }
    await this.channel.assertQueue(queue, { durable: true });
    this.channel.sendToQueue(queue, Buffer.from(JSON.stringify(message)));
    console.log(`Sent message to ${queue}:`, message);
  }

  async consumeEvents() {
    if (!this.channel) {
      console.error('RabbitMQ channel not initialized');
      return;
    }

    // Consume 'order.confirmed' events
    await this.channel.assertQueue('order.confirmed', { durable: true });
    this.channel.consume('order.confirmed', async (msg) => {
      if (msg) {
        const message = JSON.parse(msg.content.toString());
        console.log('Processing order.confirmed event:', message);

        const { orderId, items } = message;

        await prisma.order.update({
          where: { id: orderId },
          data: { status: OrderStatus.CONFIRMED },
        });

        // Notify the user about the order confirmation
        console.log('Notifying user about order confirmation:', message.userId);
        notifyUser(message.userId, {
          type: 'order-confirmed',
          orderId,
          items,
        });

        console.log(`Order ${orderId} has been confirmed.`);
        await this.publishEvent('email.orderConfirmed', {
          orderId,
          items,
          status: OrderStatus.CONFIRMED,
        });
        this.channel!.ack(msg);
      }
    });

    // Consume 'order.rejected' events
    await this.channel.assertQueue('order.rejected', { durable: true });
    this.channel.consume('order.rejected', async (msg) => {
      if (msg) {
        const message = JSON.parse(msg.content.toString());
        console.log('Processing order.rejected event:', message);

        const { orderId, reason } = message;

        await prisma.order.update({
          where: { id: orderId },
          data: { status: OrderStatus.CANCELLED },
        });
        notifyUser(message.userId, {
          type: 'order-rejected',
          orderId,
          reason,
        });

        console.log(`Order ${orderId} has been rejected. Reason: ${reason}`);
        this.channel!.ack(msg);
      }
    });


    // Consume 'basket.checked_out' events
    await this.channel.assertQueue('basket.checked_out', { durable: true });
    this.channel.consume('basket.checked_out', async (msg) => {
      if (msg) {
        const message = JSON.parse(msg.content.toString());
        const { orderId, userId, items } = message;

        

        // Use the class-based OrderService
        const order = await this.orderService.createOrder(orderId, userId, items);
        
        this.channel!.ack(msg);

        await this.publishEvent('order.created', {
          orderId: order.id,
          items: order.items,
          status: order.status,
          userId: order.userId,
        });
        console.log(`Order ${order.id} has been created.`);
      }
    });
  }
}

export default new RabbitMQService();