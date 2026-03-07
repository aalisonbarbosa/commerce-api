import { prisma } from "../lib/prisma";
import { cartService } from "./cart";

export const userService = {
  async createUser(name: string, email: string, password: string) {
    try {
      return await prisma.$transaction(async (tx) => {
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
    } catch (error) {
      throw error;
    }
  },

  async getUserByEmail(email: string) {
    try {
      return await prisma.user.findUnique({
        where: {
          email,
        },
      });
    } catch (error) {
      throw error;
    }
  },
};
