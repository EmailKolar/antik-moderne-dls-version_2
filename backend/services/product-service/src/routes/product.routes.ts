import express from 'express';
import { ProductController } from '../controllers/product.controller';

const router = express.Router();
const productController = new ProductController();

router.get('/', productController.getAllProducts.bind(productController));
router.get('/categories', productController.getAllCategories.bind(productController)); // <-- move this up!
router.get('/category/:category', productController.getProductsByCategory.bind(productController));
router.post('/', productController.createProduct.bind(productController));
router.get('/:productId/price', productController.getProductPrice.bind(productController));
router.get('/:productId', productController.getProductById.bind(productController)); // <-- keep this last

export default router;