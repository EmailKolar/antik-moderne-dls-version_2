import { prisma } from '../config/database';

export class ProductService {
  async getAllProducts() {
    return prisma.product.findMany();
  }

  async createProduct(data: any) {
    return prisma.product.create({ data });
  }

  async getProductPrice(productId: string) {
    const product = await prisma.product.findUnique({
      where: { id: productId },
    });

    if (!product) {
      throw new Error('Product not found');
    }

    return product.price;
  }
}