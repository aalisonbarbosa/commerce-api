import { Prisma } from "@prisma/client";
import { prisma } from "../lib/prisma";

export const cartService = {
  async getCartByUserId(userId: string) {
    try {
      return await prisma.cart.findFirst({
        where: {
          userId,
        },
        include: {
          cartItems: true,
        },
      });
    } catch (error) {
      throw error;
    }
  },

  async createCart(tx: Prisma.TransactionClient, userId: string) {
    try {
      return await tx.cart.create({
        data: {
          userId,
        },
      });
    } catch (error) {
      throw error;
    }
  },

  async addProductToCart(
    userId: string,
    productId: string,
    quantity: number = 1,
  ) {
    try {
      const cart = await prisma.cart.findFirst({
        where: {
          userId,
        },
      });

      if (!cart) {
        throw new Error("Cart not found for user");
      }

      const existingCartItem = await prisma.cartItem.findFirst({
        where: {
          cartId: cart.id,
          productId,
        },
      });

      if (existingCartItem) {
        return await prisma.cartItem.update({
          where: {
            id: existingCartItem.id,
          },
          data: {
            quantity: { increment: quantity },
          },
        });
      }

      return await prisma.cartItem.create({
        data: {
          cartId: cart.id,
          productId,
          quantity,
        },
      });
    } catch (error) {
      throw error;
    }
  },

  async deleteProductFromCart(cartItemId: string) {
    try {
      return await prisma.cartItem.delete({
        where: {
          id: cartItemId,
        },
      });
    } catch (error) {
      throw error;
    }
  },

  async decrementProductQuantity(cartItemId: string) {
    try {
      const cartItem = await prisma.cartItem.findUnique({
        where: {
          id: cartItemId,
        },
      });

      if (!cartItem) {
        throw new Error("Cart item not found");
      }

      if (cartItem.quantity === 1) {
        throw new Error("Quantity cannot be less than 1");
      } else {
        return await prisma.cartItem.update({
          where: {
            id: cartItemId,
          },
          data: {
            quantity: { decrement: 1 },
          },
        });
      }
    } catch (error) {
      throw error;
    }
  },
};
