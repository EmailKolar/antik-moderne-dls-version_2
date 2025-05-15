import { PrismaClient } from '@prisma/client';

export enum OrderStatus {
  PENDING = 'PENDING',
  COMPLETED = 'CONFIRMED',
  CANCELLED = 'CANCELLED',
}

const prisma = new PrismaClient();

export const createOrder = async (userId: string, items: any[]) => {
    if (!Array.isArray(items) || items.length === 0) {
    throw new Error('Invalid items array. It must be a non-empty array.');
  }
  if (!userId) {
    throw new Error('User ID is required.');
  }
  const totalAmount = items.reduce((sum: number, item: any) => {
    return sum + item.price * item.quantity;
  }, 0);

  const order = await prisma.order.create({
    data: {
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
};

export const getOrdersByUserId = async (userId: string) => {
  return prisma.order.findMany({
    where: { userId },
    include: { items: true },
  });
};

export const updateOrderStatus = async (
  orderId: string,
  status: OrderStatus
) => {
  
  return prisma.order.update({
    where: { id: orderId },
    data: { status },
  });
};

