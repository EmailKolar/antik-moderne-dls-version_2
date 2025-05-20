import { Request, Response } from 'express';
import BasketService from '../services/basket.service';

class BasketController {
  // Create a new basket
  async createBasket(req: Request, res: Response) {
    try {
      const { userId } = req.body;
      const basket = await BasketService.createBasket(userId);
      res.status(201).json(basket);
    } catch (error) {
      const err = error as Error; 
      res.status(500).json({ error: err.message });
    }
  }

  // Add an item to a basket
  async addItemToBasket(req: Request, res: Response) {
    try {
      const { basketId, productId, quantity } = req.body;
      const item = await BasketService.addItem(basketId, productId, quantity);
      res.status(201).json(item);
    } catch (error) {
      const err = error as Error; 
      res.status(500).json({ error: err.message });
    }
  }

  // Update the quantity of an item in a basket
  async updateItemQuantity(req: Request, res: Response) {
    try {
      const { basketId } = req.params;
      const { productId, quantity } = req.body;
      const updatedItem = await BasketService.updateItemQuantity(basketId, productId, quantity);
      res.status(200).json(updatedItem);
    } catch (error) {
      const err = error as Error; 
      res.status(500).json({ error: err.message });
    }
  }

  // Remove an item from a basket
  async removeItemFromBasket(req: Request, res: Response) {
    try {
      const { basketId, productId } = req.params;
      const deletedItem = await BasketService.removeItem(basketId, productId);
      res.status(200).json(deletedItem);
    } catch (error) {
      const err = error as Error; 
      res.status(500).json({ error: err.message });
    }
  }

  // Clear all items from a basket
  async clearBasket(req: Request, res: Response) {
    try {
      const { basketId } = req.params;
      const clearedItems = await BasketService.clearBasket(basketId);
      res.status(200).json(clearedItems);
    } catch (error) {
      const err = error as Error; 
      res.status(500).json({ error: err.message });
    }
  }

  // Get details 
  async getBasket(req: Request, res: Response) {
    try {
      const { basketId } = req.params;
      const basket = await BasketService.getBasket(basketId);
      if (!basket) {
        return res.status(404).json({ error: 'Basket not found' });
      }
      res.status(200).json(basket);
    } catch (error) {
      const err = error as Error; 
      res.status(500).json({ error: err.message });
    }
  }
  // Checkout a basket
  async checkoutBasket(req: Request, res: Response) {
    try {
      const { basketId } = req.params;
      const checkoutResult = await BasketService.checkoutBasket(basketId);
      res.status(200).json(checkoutResult);
    } catch (error) {
      const err = error as Error; 
      res.status(500).json({ error: err.message });
    }
  }

  // Add or get a basket for a user (idempotent)
  async addOrGetUserBasket(req: Request, res: Response) {
    try {
      const userId = typeof req.body.userId === 'string' ? req.body.userId : req.body.userId?.toString();
      if (!userId) return res.status(400).json({ error: 'userId is required' });
      let basket = await BasketService.findBasketByUserId(userId);
      if (!basket) {
        basket = await BasketService.createBasket(userId);
      }
      res.status(200).json(basket);
    } catch (error) {
      const err = error as Error;
      res.status(500).json({ error: err.message });
    }
  }

  // Add an item to a user's basket (idempotent)
  async addItemToUserBasket(req: Request, res: Response) {
    try {
      const userId = typeof req.body.userId === 'string' ? req.body.userId : req.body.userId?.toString();
      const productId = typeof req.body.productId === 'string' ? req.body.productId : req.body.productId?.toString();
      const quantity = Number(req.body.quantity);
      if (!userId || !productId || !quantity) return res.status(400).json({ error: 'userId, productId, and quantity are required' });
      let basket = await BasketService.findBasketByUserId(userId);
      if (!basket) {
        basket = await BasketService.createBasket(userId);
      }
      const item = await BasketService.addOrUpdateItem(basket.id, productId, quantity, req.headers["idempotency-key"] as string);
      res.status(201).json(item);
    } catch (error) {
      const err = error as Error;
      res.status(500).json({ error: err.message });
    }
  }

  // Get a user's basket by userId
  async getUserBasket(req: Request, res: Response) {
    try {
      const userId = typeof req.query.userId === 'string' ? req.query.userId : req.query.userId?.toString();
      if (!userId) return res.status(400).json({ error: 'userId is required' });
      const basket = await BasketService.findBasketByUserId(userId);
      if (!basket) return res.status(404).json({ error: 'Basket not found' });
      res.status(200).json(basket);
    } catch (error) {
      const err = error as Error;
      res.status(500).json({ error: err.message });
    }
  }

  // Clear a user's basket
  async clearUserBasket(req: Request, res: Response) {
    try {
      const userId = typeof req.body.userId === 'string' ? req.body.userId : req.body.userId?.toString();
      if (!userId) return res.status(400).json({ error: 'userId is required' });
      const basket = await BasketService.findBasketByUserId(userId);
      if (!basket) return res.status(404).json({ error: 'Basket not found' });
      await BasketService.clearBasket(basket.id);
      res.status(200).json({ message: 'Basket cleared' });
    } catch (error) {
      const err = error as Error;
      res.status(500).json({ error: err.message });
    }
  }
}

export default new BasketController();