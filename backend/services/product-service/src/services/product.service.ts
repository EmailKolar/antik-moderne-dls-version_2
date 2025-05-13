import { prisma } from '../config/database';

export const getAllProducts = async () => {
  return prisma.product.findMany();
};

export const createProduct = async (data: any) => {
  return prisma.product.create({ data });
};