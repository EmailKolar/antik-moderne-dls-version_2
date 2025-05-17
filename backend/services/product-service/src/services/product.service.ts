import { prisma } from '../config/database';

export const getAllProducts = async () => {
  return prisma.product.findMany();
};

export const createProduct = async (data: any) => {
  return prisma.product.create({ data });
};

//get the price of a product
export const getProductPrice = async (productId: string) => {
  const product = await prisma.product.findUnique({
    where: { id: productId },
  });

  if (!product) {
    throw new Error('Product not found');
  }

  return product.price;
}