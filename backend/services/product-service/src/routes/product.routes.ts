import express from 'express';
import { getAllProducts, createProduct, getProductPrice } from '../controllers/product.controller';


const router = express.Router();

router.get('/', getAllProducts);
router.post('/', createProduct); // Add auth middleware for admin if needed

//get the price of a product
router.get('/:productId/price', getProductPrice); // Add auth middleware for admin if needed
export default router;