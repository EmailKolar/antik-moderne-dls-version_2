import amqp from 'amqplib';
import dotenv from 'dotenv';
import prisma from '../config/database';
import { OrderStatus } from '@prisma/client';
import { create } from 'domain';
import {createOrder} from './order.service';

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
  await channel.assertQueue('order.confirmed', { durable: true });
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
  await channel.assertQueue('order.rejected', { durable: true });
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

  // consume basket events
  await channel.assertQueue('basket.checked_out', { durable: true });
  channel.consume('basket.checked_out', async (msg) => {
    if (msg) {
      const basket = JSON.parse(msg.content.toString());

      console.log('Processing basket.checked_out event:', basket);
      console.log('Processing basket.checked_out event:!!!!!!!', basket.items);

      const order = await createOrder(basket.userId, basket.items);
      console.log(`Order created for basket ${basket.id}`);
      channel.ack(msg);

      // Publish the event to the 'order.created' queue for the order-service
      await publishEvent('order.created', {
        orderId: order.id,
        items: order.items,
        status: order.status,
      });
      console.log(`Order ${order.id} has been created.`);
  }
  });

};