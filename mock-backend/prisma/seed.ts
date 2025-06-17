import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding mock-backend data...');

  // Clear existing data
  await prisma.basketItem.deleteMany();
  await prisma.basket.deleteMany();
  await prisma.product.deleteMany();
  await prisma.user.deleteMany();

  // Seed users
  await prisma.user.createMany({
    data: [
      { id: 'user-1', email: 'alice@example.com', name: 'Alice' },
      { id: 'user-2', email: 'bob@example.com', name: 'Bob' },
    ],
  });

  // Seed products
  await prisma.product.createMany({
    data: [
      { id: 'prod-1', name: 'Cirkel Kaffe Poster', price: 49.99, stock: 10, imageUrl: '/media/Cirkel_Kaffe.JPG', deleted: false, category: 'Art' },
      { id: 'prod-2', name: 'Mickey Mouse Poster', price: 54.99, stock: 6, imageUrl: '/media/Mickey_Mouse.JPG', deleted: false, category: 'Movie' },
      { id: 'prod-3', name: 'Permild & Rosengreen Horse Poster', price: 48.99, stock: 11, imageUrl: '/media/Permild&Rosengreen_Hest.JPG', deleted: false, category: 'Movie' },
      { id: 'prod-4', name: 'Robin Hood Poster', price: 52.99, stock: 10, imageUrl: '/media/Robin_Hood.JPG', deleted: false, category: 'Movie' },
    ],
  });

  // Seed baskets and items
  await prisma.basket.create({
    data: {
      id: 'basket-1',
      userId: 'user-1',
      items: {
        create: [
          { productId: 'prod-1', quantity: 2 },
          { productId: 'prod-2', quantity: 1 },
        ],
      },
    },
  });

  await prisma.basket.create({
    data: {
      id: 'basket-2',
      userId: 'user-2',
      items: {
        create: [
          { productId: 'prod-3', quantity: 1 },
        ],
      },
    },
  });

  console.log('Mock-backend seeding complete.');
}

main()
  .catch((e) => {
    console.error('Seeding failed:', e);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
