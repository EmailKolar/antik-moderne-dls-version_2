import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("Seeding product data...");

  // Optional: delete existing products
  await prisma.product.deleteMany();

  await prisma.product.createMany({
    data: [
      {
        id: "prod-1",
        name: "Vintage Travel Poster",
        description: "A beautiful vintage-style travel poster.",
        price: 29.99,
        stock: 10,
        imageUrl:"",
        category: "Art",
      },
      {
        id: "prod-2",
        name: "Abstract Art Poster",
        description: "Colorful abstract artwork for your home.",
        price: 24.99,
        stock: 5,
        imageUrl:"",
        category: "Art",
      },
      {
        id: "prod-3",
        name: "Retro Movie Poster",
        description: "Classic retro movie poster for collectors.",
        price: 19.99,
        stock: 8,
        imageUrl:"",
        category: "Art",
      },
    ],
  });

  console.log("Seeding complete.");
}

main()
  .catch((e) => {
    console.error(" Seeding failed:", e);
    
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

export { main as seed };
