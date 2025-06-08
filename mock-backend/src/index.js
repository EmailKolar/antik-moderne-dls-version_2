import express from 'express';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';

const app = express();
const PORT = process.env.PORT || 3002;

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use(cors());
app.use(express.json());
app.use('/media', express.static(path.join(__dirname, '../media')));
const BASE_URL = process.env.BASE_URL || "http://localhost:3002";
// Example static product data
const products = [
  {
    id: "prod-1",
    name: "Cirkel Kaffe Poster",
    imageUrl: `${BASE_URL}/media/Cirkel_Kaffe.JPG`,
    price: 199,
    category: "Art",
    description: "A beautiful vintage poster.",
    deleted: false
  },
  {
    id: "prod-2",
    name: "Robin Hood Movie Poster",
    imageUrl: `${BASE_URL}/media/Robin_Hood.JPG`,
    price: 149,
    category: "Movie",
    description: "A stylish modern print.",
    deleted: false
  },
  {
    id: "prod-3",
    name: "Horse",
    imageUrl: `${BASE_URL}/media/Permild&Rosengreen_Hest.JPG`,
    price: 149,
    category: "Movie",
    description: "A stylish modern print.",
    deleted: false
  },
  {
    id: "prod-4",
    name: "Mickey Mouse",
    imageUrl: `${BASE_URL}/media/Mickey_Mouse.JPG`,
    price: 149,
    category: "Movie",
    description: "A stylish modern print.",
    deleted: false
  }
];

// --- Simple basket logic (in-memory, per user) ---
const baskets = {};

// Endpoints
app.get('/products', (req, res) => {
  res.json(products.filter(p => !p.deleted));
});

app.get('/products/:id', (req, res) => {
  const product = products.find(p => p.id === req.params.id && !p.deleted);
  if (!product) return res.status(404).json({ error: 'Product not found' });
  res.json(product);
});

// Get all categories
app.get('/products/categories', (req, res) => {
  const categories = Array.from(new Set(products.map(p => p.category)));
  res.json(categories);
});

// Get products by category
app.get('/products/category/:category', (req, res) => {
  const filtered = products.filter(p => p.category === req.params.category && !p.deleted);
  res.json(filtered);
});

// Get product price
app.get('/products/:id/price', (req, res) => {
  const product = products.find(p => p.id === req.params.id && !p.deleted);
  if (!product) return res.status(404).json({ error: 'Product not found' });
  res.json({ price: product.price });
});

// Add or get a basket for a user (idempotent)
app.post('/basket', (req, res) => {
  const { userId } = req.body;
  if (!userId) return res.status(400).json({ error: 'userId is required' });
  if (!baskets[userId]) baskets[userId] = [];
  res.json({ userId, items: baskets[userId] });
});

// Add an item to a user's basket
app.post('/basket/item', (req, res) => {
  const { userId, productId, quantity } = req.body;
  if (!userId || !productId || !quantity) return res.status(400).json({ error: 'userId, productId, and quantity are required' });
  if (!baskets[userId]) baskets[userId] = [];
  // Upsert logic
  const idx = baskets[userId].findIndex(item => item.productId === productId);
  if (idx >= 0) {
    baskets[userId][idx].quantity = quantity;
  } else {
    baskets[userId].push({ productId, quantity, basketId: userId + '-basket' });
  }
  res.json({ basket: { userId, items: baskets[userId] } });
});

// Get a user's basket
app.get('/basket', (req, res) => {
  const userId = req.query.userId;
  if (!userId) return res.status(400).json({ error: 'userId is required' });
  res.json({ userId, items: baskets[userId] || [] });
});

// Clear a user's basket
app.delete('/basket', (req, res) => {
  const { userId } = req.body;
  if (!userId) return res.status(400).json({ error: 'userId is required' });
  baskets[userId] = [];
  res.json({ message: 'Basket cleared' });
});

// Remove an item from a user's basket
app.delete('/basket/item', (req, res) => {
  const { userId, productId } = req.body;
  if (!userId || !productId) return res.status(400).json({ error: 'userId and productId are required' });
  if (!baskets[userId]) return res.json({ message: 'Nothing to remove' });
  baskets[userId] = baskets[userId].filter(item => item.productId !== productId);
  res.json({ message: 'Item removed' });
});

app.listen(PORT, () => {
  console.log(`Mock backend running on port ${PORT}`);
});