import { prisma } from '../config/database';

export class ProductService {
  async getAllProducts() {
    // Only return products that are not deleted
    return prisma.product.findMany({ where: { deleted: false } });
  }

  async getProductById(productId: string) {
    const product = await prisma.product.findFirst({
      where: { id: productId, deleted: false },
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
    const product = await prisma.product.findFirst({
      where: { id: productId, deleted: false },
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
  async editProduct(productId: string, data: any) {
    // Prevent editing deleted products
    const product = await prisma.product.findFirst({
      where: { id: productId, deleted: false },
    });
    if (!product) {
      throw new Error('Product not found or has been deleted');
    }
    return prisma.product.update({
      where: { id: productId },
      data,
    });
  }

  async deleteProduct(productId: string) {
    // Tombstone: set a deleted flag instead of actually deleting
    return prisma.product.update({
      where: { id: productId },
      data: { deleted: true },
    });
  }
}