import { Request, Response } from 'express';
import * as productService from '../services/product.service';
import { z } from 'zod';

const productSchema = z.object({
  name: z.string(),
  description: z.string(),
  price: z.number(),
  imageUrl: z.string().url(),
  category: z.string(),
  stock: z.number()
});

export const getAllProducts = async (_: Request, res: Response) => {
  const products = await productService.getAllProducts();
  res.json(products);
};

export const createProduct = async (req: Request, res: Response) => {
  try {
    const data = productSchema.parse(req.body);
    const product = await productService.createProduct(data);
    res.status(201).json(product);
  } catch (e) {
    if (e instanceof Error) {
      res.status(400).json({ error: e.message });
    } else {
      res.status(400).json({ error: 'An unknown error occurred' });
    }
  }
};