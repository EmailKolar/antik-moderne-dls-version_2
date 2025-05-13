import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { createOrder as createOrderInService } from '../services/order.service';
import { publishEvent } from '../services/rabbitmq.service';
const prisma = new PrismaClient();


export const createOrder = async (req: Request, res: Response) => {
  const { userId, items } = req.body;

  const order = await createOrderInService(userId, items);

  await publishEvent('order.created', {
    orderId: order.id,
    userId: order.userId,
    totalAmount: order.totalAmount,
    items: order.items,
  });

  res.status(201).json(order);
};

export const getUserOrders = async (req: Request, res: Response) => {
  const { userId } = req.params;

  const orders = await prisma.order.findMany({
    where: { userId },
    include: { items: true },
  });

  res.json(orders);
};
