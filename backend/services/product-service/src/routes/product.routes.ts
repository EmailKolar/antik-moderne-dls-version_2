import express from 'express';
import { ProductController } from '../controllers/product.controller';

const router = express.Router();
const productController = new ProductController();

router.get('/', productController.getAllProducts.bind(productController));
router.post('/', productController.createProduct.bind(productController));
router.get('/:productId/price', productController.getProductPrice.bind(productController));

export default router;