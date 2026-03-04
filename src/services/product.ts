import { prisma } from "../lib/prisma";

interface Product {
  name: string;
  description?: string;
  price: number;
  userId: string;
}

export const productService = {
  async createProduct(data: Product) {
    try {
      return await prisma.$transaction(async (tx) => {
        const user = await tx.user.findFirst({
          where: { id: data.userId },
        });

        if (!user?.role || user.role !== "admin") {
          throw new Error("Unauthorized");
        }

        return await tx.product.create({ data });
      });
    } catch (error) {
      throw error;
    }
  },

  async deleteProduct(productId: string, userId: string) {
    try {
      return await prisma.$transaction(async (tx) => {
        const user = await tx.user.findFirst({
          where: { id: userId },
        });

        if (!user?.role || user.role !== "admin") {
          throw new Error("Unauthorized");
        }

        return await tx.product.delete({
          where: {
            id: productId,
          },
        });
      });
    } catch (error) {
      throw error;
    }
  },

  async updateProduct(
    productId: string,
    data: Partial<Product>,
    userId: string,
  ) {
    try {
      return await prisma.$transaction(async (tx) => {
        const user = await tx.user.findFirst({
          where: { id: userId },
        });

        if (!user?.role || user.role !== "admin") {
          throw new Error("Unauthorized");
        }

        return await tx.product.update({
          where: {
            id: productId,
          },
          data,
        });
      });
    } catch (error) {
      throw error;
    }
  },

  async getProducts() {
    try {
      return await prisma.product.findMany();
    } catch (error) {
      throw error;
    }
  },

  async getProductById(id: string) {
    try {
      return await prisma.product.findUnique({
        where: { id },
      });
    } catch (error) {
      throw error;
    }
  },
};
