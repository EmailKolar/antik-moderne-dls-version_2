import prisma from '../config/database';
import RabbitMQService from './rabbitmq.service';

class BasketService {
  // Create a new basket
  async createBasket(userId: string) {
    const basket = await prisma.basket.create({
      data: { userId },
    });

    // Publish a message to RabbitMQ
    await RabbitMQService.publish('basket.created', { basket });

    return basket;
  }

  // Add an item to a basket
  async addItem(basketId: string, productId: string, quantity: number) {
    const item = await prisma.basketItem.create({
      data: { basketId, productId, quantity },
    });

    // Publish a message to RabbitMQ
    await RabbitMQService.publish('basket.itemAdded', { basketId, productId, quantity });

    return item;
  }

  // Update the quantity of an item in a basket
  async updateItemQuantity(basketId: string, productId: string, quantity: number) {
    const updatedItem = await prisma.basketItem.updateMany({
      where: { basketId, productId },
      data: { quantity },
    });

    // Publish a message to RabbitMQ
    await RabbitMQService.publish('basket.itemUpdated', { basketId, productId, quantity });

    return updatedItem;
  }

  // Remove an item from a basket
  async removeItem(basketId: string, productId: string) {
    const deletedItem = await prisma.basketItem.deleteMany({
      where: { basketId, productId },
    });

    // Publish a message to RabbitMQ
    await RabbitMQService.publish('basket.itemRemoved', { basketId, productId });

    return deletedItem;
  }

  // Clear all items from a basket
  async clearBasket(basketId: string) {
    const clearedItems = await prisma.basketItem.deleteMany({
      where: { basketId },
    });

    // Publish a message to RabbitMQ
    await RabbitMQService.publish('basket.cleared', { basketId });

    return clearedItems;
  }

  // Get details of a basket
  async getBasket(basketId: string) {
    return prisma.basket.findUnique({
      where: { id: basketId },
      include: { items: true },
    });
  }
}

export default new BasketService();