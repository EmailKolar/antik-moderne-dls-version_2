import { Router } from 'express';
import { createOrder, getUserOrders } from '../controllers/order.controller';

const router = Router();

router.post('/', createOrder);
router.get('/:userId', getUserOrders);

export default router;