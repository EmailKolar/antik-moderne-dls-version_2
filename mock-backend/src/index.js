import express from 'express';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';
import prisma from "./prisma.ts"; 

const app = express();
const PORT = process.env.PORT || 3002;

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use(cors());
app.use(express.json());
app.use('/media', express.static(path.join(__dirname, '../media')));
const BASE_URL = process.env.BASE_URL || "http://localhost:3002";

// --- Product Endpoints (DB-backed) ---
app.get('/products', async (req, res) => {
  const products = await prisma.product.findMany({ where: { deleted: false } });
  res.json(products.map(p => ({ ...p, imageUrl: p.imageUrl?.startsWith('http') ? p.imageUrl : `${BASE_URL}${p.imageUrl}` })));
});

app.get('/products/:id', async (req, res) => {
  const product = await prisma.product.findUnique({ where: { id: req.params.id } });
  if (!product || product.deleted) return res.status(404).json({ error: 'Product not found' });
  res.json({ ...product, imageUrl: product.imageUrl?.startsWith('http') ? product.imageUrl : `${BASE_URL}${product.imageUrl}` });
});

app.get('/products/categories', async (req, res) => {
  const categories = await prisma.product.findMany({ where: { deleted: false }, select: { category: true } });
  res.json(Array.from(new Set(categories.map(c => c.category))));
});

app.get('/products/category/:category', async (req, res) => {
  const filtered = await prisma.product.findMany({ where: { category: req.params.category, deleted: false } });
  res.json(filtered.map(p => ({ ...p, imageUrl: p.imageUrl?.startsWith('http') ? p.imageUrl : `${BASE_URL}${p.imageUrl}` })));
});

app.get('/products/:id/price', async (req, res) => {
  const product = await prisma.product.findUnique({ where: { id: req.params.id } });
  if (!product || product.deleted) return res.status(404).json({ error: 'Product not found' });
  res.json({ price: product.price });
});

// --- Basket Endpoints (DB-backed) ---
app.post('/basket', async (req, res) => {
  const { userId } = req.body;
  if (!userId) return res.status(400).json({ error: 'userId is required' });
  let basket = await prisma.basket.findFirst({ where: { userId }, include: { items: true } });
  if (!basket) basket = await prisma.basket.create({ data: { userId }, include: { items: true } });
  res.json(basket);
});

app.post('/basket/item', async (req, res) => {
  const { userId, productId, quantity } = req.body;
  if (!userId || !productId || !quantity) return res.status(400).json({ error: 'userId, productId, and quantity are required' });
  let basket = await prisma.basket.findFirst({ where: { userId } });
  if (!basket) basket = await prisma.basket.create({ data: { userId } });
  const existing = await prisma.basketItem.findFirst({ where: { basketId: basket.id, productId } });
  if (existing) {
    await prisma.basketItem.update({ where: { id: existing.id }, data: { quantity } });
  } else {
    await prisma.basketItem.create({ data: { basketId: basket.id, productId, quantity } });
  }
  const updated = await prisma.basket.findUnique({ where: { id: basket.id }, include: { items: true } });
  res.json(updated);
});

app.get('/basket', async (req, res) => {
  const userId = req.query.userId;
  if (!userId) return res.status(400).json({ error: 'userId is required' });
  const basket = await prisma.basket.findFirst({ where: { userId: String(userId) }, include: { items: true } });
  res.json(basket || { userId, items: [] });
});

app.delete('/basket', async (req, res) => {
  const { userId } = req.body;
  if (!userId) return res.status(400).json({ error: 'userId is required' });
  const basket = await prisma.basket.findFirst({ where: { userId } });
  if (basket) await prisma.basketItem.deleteMany({ where: { basketId: basket.id } });
  res.json({ message: 'Basket cleared' });
});

app.delete('/basket/item', async (req, res) => {
  const { userId, productId } = req.body;
  if (!userId || !productId) return res.status(400).json({ error: 'userId and productId are required' });
  const basket = await prisma.basket.findFirst({ where: { userId } });
  if (basket) await prisma.basketItem.deleteMany({ where: { basketId: basket.id, productId } });
  res.json({ message: 'Item removed' });
});

app.listen(PORT, () => {
  console.log(`Mock backend running on port ${PORT}`);
});