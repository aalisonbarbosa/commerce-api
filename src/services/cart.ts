import { Prisma } from "@prisma/client";
import { prisma } from "../lib/prisma";

export const cartService = {
  async getCartByUserId(userId: string) {
    return prisma.cart.findFirst({
      where: {
        userId,
      },
      include: {
        cartItems: true,
      },
    });
  },

  async createCart(tx: Prisma.TransactionClient, userId: string) {
    return tx.cart.create({
      data: {
        userId,
      },
    });
  },

  async addProductToCart(
    userId: string,
    productId: string,
    quantity: number = 1,
  ) {
    const cart = await prisma.cart.findUnique({
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
      return prisma.cartItem.update({
        where: {
          id: existingCartItem.id,
        },
        data: {
          quantity: { increment: quantity },
        },
      });
    }

    return prisma.cartItem.create({
      data: {
        cartId: cart.id,
        productId,
        quantity,
      },
    });
  },

  async deleteProductFromCart(cartItemId: string) {
    return prisma.cartItem.delete({
      where: {
        id: cartItemId,
      },
    });
  },

  async decrementProductQuantity(cartItemId: string) {
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
    }

    return prisma.cartItem.update({
      where: {
        id: cartItemId,
      },
      data: {
        quantity: { decrement: 1 },
      },
    });
  },
};
