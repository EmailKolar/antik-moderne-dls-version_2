import { Request, Response } from 'express';
import { ProductService } from '../services/product.service';
import { z } from 'zod';

const productSchema = z.object({
  name: z.string(),
  description: z.string(),
  price: z.number(),
  imageUrl: z.string().url(),
  category: z.string(),
  stock: z.number()
});

export class ProductController {
  private productService: ProductService;

  constructor() {
    this.productService = new ProductService();
  }

  async getAllProducts(_: Request, res: Response) {
    const products = await this.productService.getAllProducts();
    res.json(products);
  }
  async getProductById(req: Request, res: Response) {
    const { productId } = req.params;

    try {
      const product = await this.productService.getProductById(productId);
      res.json(product);
    } catch (e) {
      if (e instanceof Error) {
        res.status(404).json({ error: e.message });
      } else {
        res.status(500).json({ error: 'An unknown error occurred' });
      }
    }
  }
  async getProductsByCategory(req: Request, res: Response) {
    const { category } = req.params;
    try {
      const products = await this.productService.getAllProducts();
      const filteredProducts = products.filter((product) => product.category === category);
      res.json(filteredProducts);
    } catch (e) {
      if (e instanceof Error) {
        res.status(404).json({ error: e.message });
      } else {
        res.status(500).json({ error: 'An unknown error occurred' });
      }
    }
  }

  async createProduct(req: Request, res: Response) {
    try {
      const data = productSchema.parse(req.body);
      const product = await this.productService.createProduct(data);
      res.status(201).json(product);
    } catch (e) {
      if (e instanceof Error) {
        res.status(400).json({ error: e.message });
      } else {
        res.status(400).json({ error: 'An unknown error occurred' });
      }
    }
  }

  async getProductPrice(req: Request, res: Response) {
    const { productId } = req.params;

    try {
      const price = await this.productService.getProductPrice(productId);
      res.json({ price });
    } catch (e) {
      if (e instanceof Error) {
        res.status(404).json({ error: e.message });
      } else {
        res.status(500).json({ error: 'An unknown error occurred' });
      }
    }
  }
  async getAllCategories(_: Request, res: Response) {
    console.log('Fetching all categories in controller');
    try {
      const categories = await this.productService.getAllCategories();
      res.json(categories);
    } catch (e) {
      if (e instanceof Error) {
        console.error('Error fetching categories:', e);
        res.status(404).json({ error: e.message });
      } else {
        res.status(500).json({ error: 'An unknown error occurred' });
      }
    }
  }

  async editProduct(req: Request, res: Response) {
    console.log('Editing product in controller');
    const { productId } = req.params;
    try {
      const data = req.body;
      const updated = await this.productService.editProduct(productId, data);
      res.json(updated);
    } catch (e) {
      if (e instanceof Error) {
        res.status(400).json({ error: e.message });
      } else {
        res.status(400).json({ error: 'An unknown error occurred' });
      }
    }
  }

  async deleteProduct(req: Request, res: Response) {
    const { productId } = req.params;
    try {
      await this.productService.deleteProduct(productId);
      res.status(204).send();
    } catch (e) {
      if (e instanceof Error) {
        res.status(400).json({ error: e.message });
      } else {
        res.status(400).json({ error: 'An unknown error occurred' });
      }
    }
  }
}