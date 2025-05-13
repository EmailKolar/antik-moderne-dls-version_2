import prisma from '../config/database';
import RabbitMQService from './rabbitmq.service';

class BasketService {
  async createBasket(userId: string) {
  const basket = await prisma.basket.create({
    data: { userId },
  });

  // Publish a message to RabbitMQ
  await RabbitMQService.publish('basket.created', { basket });

  return basket;
}

  async addItem(basketId: string, productId: string, quantity: number) {
    return prisma.basketItem.create({
      data: { basketId, productId, quantity },
    });
  }

  
}

export default new BasketService();