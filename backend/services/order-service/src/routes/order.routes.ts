import { Router } from 'express';
import { OrderController } from '../controllers/order.controller';

const router = Router();
const orderController = new OrderController();

router.post('/', orderController.createOrder.bind(orderController));
router.get('/:userId', orderController.getUserOrders.bind(orderController));
router.get('/:userId/:orderId', orderController.getOrderById.bind(orderController));



export default router;