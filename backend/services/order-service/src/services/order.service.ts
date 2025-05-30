import { PrismaClient } from '@prisma/client';
import axios from 'axios';

export enum OrderStatus {
  PENDING = 'PENDING',
  COMPLETED = 'CONFIRMED',
  CANCELLED = 'CANCELLED',
}

const prisma = new PrismaClient();

export class OrderService {
  async createOrder(orderId: string, userId: string, items: any[]) {
    console.log('Creating order with items:', items);
    if (!items || items.length === 0) {
      throw new Error('Invalid items array. It must be a non-empty array.');
    }
    if (!userId) {
      throw new Error('User ID is required.');
    }

    // Fetch product details from product-service
    const itemsWithPrice = await Promise.all(
      items.map(async (item) => {
        const response = await axios.get(`http://product-service:3002/products/${item.productId}/price`);
        const product = response.data;

        if (!product) {
          throw new Error(`Product with ID ${item.productId} not found.`);
        }

        return {
          ...item,
          price: product.price,
        };
      })
    );
    items = itemsWithPrice;

    const totalAmount = items.reduce((sum: number, item: any) => {
      return sum + item.price * item.quantity;
    }, 0);

    const order = await prisma.order.create({
      data: {
        id: orderId,
        userId,
        totalAmount,
        status: OrderStatus.PENDING,
        items: {
          create: items.map((item) => ({
            productId: item.productId,
            quantity: item.quantity,
            price: item.price,
          })),
        },
      },
      include: { items: true },
    });

    return order;
  }

  async getOrdersByUserId(userId: string) {
    return prisma.order.findMany({
      where: { userId },
      include: { items: true },
    });
  }

  async updateOrderStatus(orderId: string, status: OrderStatus) {
    return prisma.order.update({
      where: { id: orderId },
      data: { status },
    });
  }
  async getOrderById(orderId: string) {
    return prisma.order.findUnique({
      where: { id: orderId },
      include: { items: true },
    });
  }
}