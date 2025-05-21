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

// Checkout a basket
router.post('/baskets/:basketId/checkout', BasketController.checkoutBasket);

// Add or get a basket for a user (idempotent)
router.post('/basket', BasketController.addOrGetUserBasket);

// Add an item to a user's basket (idempotent)
router.post('/basket/item', BasketController.addItemToUserBasket);

// Get a user's basket by userId
router.get('/basket', BasketController.getUserBasket);

// Clear a user's basket
router.delete('/basket', BasketController.clearUserBasket);

// remove an item from a user's basket
router.delete('/basket/item', BasketController.removeItemFromUserBasket);

export default router;