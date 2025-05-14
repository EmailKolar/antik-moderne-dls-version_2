import amqp from 'amqplib';
import dotenv from 'dotenv';
import prisma from '../config/database';
import { OrderStatus } from '@prisma/client';

dotenv.config();

let channel: amqp.Channel;

export const connectRabbitMQ = async () => {
  try {
    const connection = await amqp.connect(process.env.RABBITMQ_URL || 'amqp://localhost');
    channel = await connection.createChannel();
    console.log('Connected to RabbitMQ');
  } catch (err) {
    console.error('Failed to connect to RabbitMQ', err);
  }
 
};

export const publishEvent = async (queue: string, message: object) => {
  if (!channel) {
    console.error('RabbitMQ channel not initialized');
    return;
  }

  console.log('Publishing event to RabbitMQ:', queue, message);
  await channel.assertQueue(queue, { durable: true });
  channel.sendToQueue(queue, Buffer.from(JSON.stringify(message)));
  console.log(` Sent message to ${queue}:`, message);
};

// Consume events from RabbitMQ
export const consumeEvents = async () => {
  if (!channel) {
    console.error('RabbitMQ channel not initialized');
    return;
  }

  // Consume 'order.confirmed' events
  await channel.assertQueue('order.confirmed', { durable: false });
  channel.consume('order.confirmed', async (msg) => {
    if (msg) {
      const message = JSON.parse(msg.content.toString());
      console.log('Processing order.confirmed event:', message);

      const { orderId, items } = message;

      // Update the order status to 'confirmed' in the database
      await prisma.order.update({
        where: { id: orderId },
        data: { status: OrderStatus.CONFIRMED },
      });

      console.log(`Order ${orderId} has been confirmed.`);
      // Publish the event to the 'email.orderConfirmed' queue for the email-service
      await publishEvent('email.orderConfirmed', {
        orderId,
        items,
        status: OrderStatus.CONFIRMED,
      });
      channel.ack(msg);
    }
  });

  // Consume 'order.rejected' events
  await channel.assertQueue('order.rejected', { durable: false });
  channel.consume('order.rejected', async (msg) => {
    if (msg) {
      const message = JSON.parse(msg.content.toString());
      console.log('Processing order.rejected event:', message);

      const { orderId, reason } = message;

      // Update the order status to 'rejected' in the database
      await prisma.order.update({
        where: { id: orderId },
        data: { status: 'CANCELLED'},
      });

      console.log(`Order ${orderId} has been rejected. Reason: ${reason}`);
      channel.ack(msg);
    }
  });
};