import { prisma } from "../lib/prisma";
import { cartService } from "./cart";

export const userService = {
  async createUser(name: string, email: string, password: string) {
    return prisma.$transaction(async (tx) => {
      const user = await tx.user.create({
        data: {
          name,
          email,
          password,
        },
      });

      await cartService.createCart(tx, user.id);

      return user;
    });
  },

  async getUserByEmail(email: string) {
    return prisma.user.findUnique({
      where: {
        email,
      },
    });
  },
};