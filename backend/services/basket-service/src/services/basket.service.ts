import prisma from '../config/database';
import RabbitMQService from './rabbitmq.service';
import { v4 as uuidv4 } from 'uuid';

class BasketService {
  // Create a new basket and include items (empty array)
  async createBasket(userId: string) {
    return prisma.basket.create({
      data: { userId },
      include: { items: true },
    });
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
  // Checkout a basket
  async checkoutBasket(basketId: string) {
    const basket = await prisma.basket.findUnique({
      where: { id: basketId },
      include: { items: true },
    });

    if (!basket) {
      throw new Error('Basket not found');
    }
    const orderId = uuidv4(); // Generate a unique order ID

    console.log('Basket checked out!:', basket);
    // Publish a message to RabbitMQ
    await RabbitMQService.publish('basket.checked_out',  {
      orderId,
      userId: basket.userId,
      items: basket.items,
    });

    return orderId;
  }


  // Find a basket by userId
  async findBasketByUserId(userId: string) {
    return prisma.basket.findFirst({
      where: { userId },
      include: { items: true },
    });
  }

  // Add or update an item in a basket (idempotent)
  async addOrUpdateItem(basketId: string, productId: string, quantity: number, idempotencyKey?: string) {
    // Optionally, you can store idempotencyKey in a table for true idempotency
    // For now, just upsert the item
    const existingItem = await prisma.basketItem.findFirst({
      where: { basketId, productId },
    });
    if (existingItem) {
      return prisma.basketItem.update({
        where: { id: existingItem.id },
        data: { quantity },
      });
    } else {
      return prisma.basketItem.create({
        data: { basketId, productId, quantity },
      });
    }
  }
}

export default new BasketService();