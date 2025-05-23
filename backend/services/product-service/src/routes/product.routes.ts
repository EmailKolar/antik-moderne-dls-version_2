import express from 'express';
import { ProductController } from '../controllers/product.controller';
import { requireAuth } from '@clerk/clerk-sdk-node';
import { Request, Response, NextFunction } from 'express';

const router = express.Router();
const productController = new ProductController();

// Admin check middleware
function isAdmin(req: Request, res: Response, next: NextFunction) {
  // Clerk attaches auth info to req.auth
  const user = (req as any).auth?.sessionClaims;
  if (user?.publicMetadata?.role === 'admin') {
    return next();
  }
  return res.status(403).json({ error: 'Admin access required' });
}

router.get('/', productController.getAllProducts.bind(productController));
router.get('/categories', productController.getAllCategories.bind(productController)); // <-- move this up!
router.get('/category/:category', productController.getProductsByCategory.bind(productController));
router.post('/', requireAuth as any, isAdmin, productController.createProduct.bind(productController));
router.put('/:productId', requireAuth as any, isAdmin, productController.editProduct.bind(productController));
router.delete('/:productId', requireAuth as any, isAdmin, productController.deleteProduct.bind(productController));
router.get('/:productId/price', productController.getProductPrice.bind(productController));
router.get('/:productId', productController.getProductById.bind(productController)); // <-- keep this last

export default router;