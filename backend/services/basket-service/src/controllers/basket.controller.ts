import { Request, Response } from 'express';
import BasketService from '../services/basket.service';

class BasketController {
  async createBasket(req: Request, res: Response) {
    const { userId } = req.body;
    const basket = await BasketService.createBasket(userId);
    res.status(201).json(basket);
  }

  async addItemToBasket(req: Request, res: Response) {
    const { basketId, productId, quantity } = req.body;
    const item = await BasketService.addItem(basketId, productId, quantity);
    res.status(201).json(item);
  }

  // Other methods for fetching, updating, and deleting baskets/items...
}

export default new BasketController();