import { Prisma } from "@prisma/client";
import { prisma } from "../lib/prisma";

interface Product {
  name: string;
  description?: string | null;
  price: number;
  quantity: number;
  userId: string;
}

export const productService = {
  async createProduct(data: Product) {
    return prisma.$transaction(async (tx) => {
      const user = await tx.user.findFirst({
        where: { id: data.userId },
      });

      if (!user?.role || user.role !== "admin") {
        throw new Error("Unauthorized");
      }

      return tx.product.create({ data });
    });
  },

  async deleteProduct(productId: string, userId: string) {
    return prisma.$transaction(async (tx) => {
      const user = await tx.user.findFirst({
        where: { id: userId },
      });

      if (!user?.role || user.role !== "admin") {
        throw new Error("Unauthorized");
      }

      return tx.product.delete({
        where: {
          id: productId,
        },
      });
    });
  },

  async updateProduct(
    productId: string,
    data: Partial<Product>,
    userId: string,
  ) {
    return prisma.$transaction(async (tx) => {
      const user = await tx.user.findFirst({
        where: { id: userId },
      });

      if (!user?.role || user.role !== "admin") {
        throw new Error("Unauthorized");
      }

      return tx.product.update({
        where: {
          id: productId,
        },
        data,
      });
    });
  },

  async decrementStock(
    tx: Prisma.TransactionClient,
    productId: string,
    quantity: number,
  ) {
    return tx.product.update({
      where: {
        id: productId,
      },
      data: {
        quantity: {
          decrement: quantity,
        },
      },
    });
  },

  async getProducts() {
    return prisma.product.findMany();
  },

  async getProductById(id: string) {
    return prisma.product.findUnique({
      where: { id },
    });
  },
};
