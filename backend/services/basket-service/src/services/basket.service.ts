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
  async addOrUpdateItem(basketId: string, productId: string, quantity: number, userId: string, idempotencyKey?: string) {
    console.log("Adding or updating item in basket:", {
      basketId, 
      productId,
      quantity,
      userId,
      idempotencyKey
    });
    if (idempotencyKey) {
      // Check if this idempotencyKey has already been used for this user and operation
      const existing = await prisma.idempotency.findUnique({
        where: { key: idempotencyKey },
      });
      if (existing) {
        // Return the previous response (already plain object)
        return existing.response;
      }
    }
    // Upsert the item
    const existingItem = await prisma.basketItem.findFirst({
      where: { basketId, productId },
    });
    let result;
    if (existingItem) {
      result = await prisma.basketItem.update({
        where: { id: existingItem.id },
        data: { quantity },
      });
    } else {
      result = await prisma.basketItem.create({
        data: { basketId, productId, quantity },
      });
    }
    console.log("Item added or updated:", result);
    // Always fetch the updated basket (with items)
    const updatedBasket = await prisma.basket.findUnique({
      where: { id: basketId },
      include: { items: true },
    });
    console.log("Updated basket:", updatedBasket);
    // Prepare a plain serializable response
    const response = {
      item: {
        id: result.id,
        basketId: result.basketId,
        productId: result.productId,
        quantity: result.quantity,
        createdAt: result.createdAt,
        updatedAt: result.updatedAt,
      },
      basket: updatedBasket,
    };
    // Store the idempotency key and response
    if (idempotencyKey) {
      await prisma.idempotency.create({
        data: {
          key: idempotencyKey,
          userId, // use the real userId here!
          operation: 'addOrUpdateItem',
          request: { basketId, productId, quantity },
          response,
        },
      });
    }
    console.log("Item added or updated in basket:", response);
    return response;
  }
}

export default new BasketService();