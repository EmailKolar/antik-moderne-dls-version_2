import { Router } from 'express';
import BasketController from '../controllers/basket.controller';

const router = Router();

// Create a new basket
router.post('/baskets', BasketController.createBasket);

// Add an item to a basket
router.post('/baskets/:basketId/items', BasketController.addItemToBasket);

// Update the quantity of an item in a basket
router.put('/baskets/:basketId/items/:productId', BasketController.updateItemQuantity);

// Remove an item from a basket
router.delete('/baskets/:basketId/items/:productId', BasketController.removeItemFromBasket);

// Clear all items from a basket
router.delete('/baskets/:basketId/items', BasketController.clearBasket);

// Get details of a basket
router.get('/baskets/:basketId', BasketController.getBasket);

export default router;