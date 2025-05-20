import { prisma } from '../config/database';

export class ProductService {
  async getAllProducts() {
    return prisma.product.findMany();
  }

  async getProductById(productId: string) {
    const product = await prisma.product.findUnique({
      where: { id: productId },
    });

    if (!product) {
      throw new Error('Product not found');
    }

    return product;
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
  async getAllCategories() {
    console.log('Fetching all categories in service');
    const products = await this.getAllProducts();
    const categories = new Set(products.map((product) => product.category));
    return Array.from(categories);
  }
}