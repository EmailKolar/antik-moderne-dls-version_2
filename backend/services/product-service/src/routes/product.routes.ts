import express from 'express';
import { getAllProducts, createProduct } from '../controllers/product.controller';

const router = express.Router();

router.get('/', getAllProducts);
router.post('/', createProduct); // Add auth middleware for admin if needed

export default router;