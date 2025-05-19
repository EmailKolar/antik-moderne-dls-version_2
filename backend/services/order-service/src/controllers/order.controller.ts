import { Request, Response } from 'express';
import { OrderService } from '../services/order.service';
import RabbitMQService from '../services/rabbitmq.service';

export class OrderController {
  private orderService: OrderService;

  constructor() {
    this.orderService = new OrderService();
  }

  async createOrder(req: Request, res: Response) {
    try {
      const { userId, items } = req.body;
      const order = await this.orderService.createOrder(userId, items);

      await RabbitMQService.publishEvent('order.created', {
        orderId: order.id,
        userId: order.userId,
        totalAmount: order.totalAmount,
        items: order.items,
      });

      res.status(201).json(order);
    } catch (error) {
      res.status(400).json({ error: (error as Error).message });
    }
  }

  async getUserOrders(req: Request, res: Response) {
    try {
      const { userId } = req.params;
      const orders = await this.orderService.getOrdersByUserId(userId);
      res.json(orders);
    } catch (error) {
      res.status(400).json({ error: (error as Error).message });
    }
  }
}