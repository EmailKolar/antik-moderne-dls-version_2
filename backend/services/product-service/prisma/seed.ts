import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("Seeding product data...");

  await prisma.product.deleteMany();

  await prisma.product.createMany({
    data: [
      {
        id: "prod-1",
        name: "Cirkel Kaffe Poster",
        description: "Classic Cirkel Kaffe advertising poster.",
        price: 49.99,
        stock: 10,
        imageUrl: "http://localhost:9000/products/Cirkel_Kaffe.JPG",
        category: "Museum",
      },
      {
        id: "prod-2",
        name: "Danske Luftfartselskab Poster",
        description: "Vintage Danish airline travel poster.",
        price: 59.99,
        stock: 8,
        imageUrl: "http://localhost:9000/products/Danske_Luftfartselskab.JPG",
        category: "Museum",
      },
      {
        id: "prod-3",
        name: "Davre Gryn Poster",
        description: "Charming breakfast oats advertisement.",
        price: 44.99,
        stock: 12,
        imageUrl: "http://localhost:9000/products/Davre-Gryn.JPG",
        category: "Museum",
      },
      {
        id: "prod-4",
        name: "Fact Arte Fact SMK Poster",
        description: "Artistic SMK museum exhibition poster.",
        price: 64.99,
        stock: 9,
        imageUrl: "http://localhost:9000/products/Fact_Arte_Fact_SMK.JPG",
        category: "Museum",
      },
      {
        id: "prod-5",
        name: "Louisiana Museum Poster",
        description: "Modern art from Louisiana Museum.",
        price: 69.99,
        stock: 7,
        imageUrl: "http://localhost:9000/products/Louisiana_01.JPG",
        category: "Museum",
      },
      {
        id: "prod-6",
        name: "Mickey Mouse Poster",
        description: "Classic Mickey Mouse Disney poster.",
        price: 54.99,
        stock: 6,
        imageUrl: "http://localhost:9000/products/Mickey_Mouse.JPG",
        category: "Movie",
      },
      {
        id: "prod-7",
        name: "Permind & Rosengreen Horse Poster",
        description: "Horse-themed poster by Permind & Rosengreen.",
        price: 48.99,
        stock: 11,
        imageUrl: "http://localhost:9000/products/Permind&Rosengreen_Hest.JPG",
        category: "Museum",
      },
      {
        id: "prod-8",
        name: "Robin Hood Poster",
        description: "Retro-style Robin Hood movie poster.",
        price: 52.99,
        stock: 10,
        imageUrl: "http://localhost:9000/products/Robin_Hood.JPG",
        category: "Movie",
      },
      {
        id: "prod-9",
        name: "Sommertiden Teater Poster",
        description: "Theater poster for Sommertiden play.",
        price: 46.99,
        stock: 8,
        imageUrl: "http://localhost:9000/products/Sommertiden_teater.JPG",
        category: "Theater",
      },
      {
        id: "prod-10",
        name: "Tivoli 1942 Poster",
        description: "Vintage Tivoli Gardens entertainment poster.",
        price: 55.99,
        stock: 6,
        imageUrl: "http://localhost:9000/products/Tivoli_1942.JPG",
        category: "Museum",
      },
      {
        id: "prod-11",
        name: "Tobak Poster",
        description: "Stylized vintage tobacco advertisement.",
        price: 42.99,
        stock: 10,
        imageUrl: "http://localhost:9000/products/Tobak.JPG",
        category: "Museum",
      },
      {
        id: "prod-12",
        name: "Tornerose Poster",
        description: "Sleeping Beauty fairytale-themed poster.",
        price: 58.99,
        stock: 9,
        imageUrl: "http://localhost:9000/products/Tornerose.JPG",
        category: "Theater",
      },
      {
        id: "prod-13",
        name: "Wiig Hansen SMK Poster",
        description: "Poster by Wiig Hansen for SMK exhibition.",
        price: 63.99,
        stock: 5,
        imageUrl: "http://localhost:9000/products/Wiig_Hansen_SMK.JPG",
        category: "Museum",
      },
      {
        id: "prod-14",
        name: "Zoo Okse Poster",
        description: "Illustrated ox from a Zoo-themed poster.",
        price: 45.99,
        stock: 12,
        imageUrl: "http://localhost:9000/products/Zoo_okse.JPG",
        category: "Museum",
      },
    ],
  });

  console.log("Seeding complete.");
}

main()
  .catch((e) => {
    console.error("Seeding failed:", e);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

export { main as seed };
