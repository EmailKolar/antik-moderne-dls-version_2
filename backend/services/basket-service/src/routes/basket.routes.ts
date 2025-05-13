import { Router } from 'express';
import BasketController from '../controllers/basket.controller';

const router = Router();

router.post('/baskets', BasketController.createBasket);
router.post('/baskets/:basketId/items', BasketController.addItemToBasket);

// Other routes for fetching, updating, and deleting baskets/items...

export default router;