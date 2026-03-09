import { prisma } from "../lib/prisma";
import { paymentService } from "./payment";

export const orderService = {
  async createOrder(userId: string) {
    return prisma.$transaction(async (tx) => {
      const cart = await tx.cart.findUnique({
        where: { userId },
        include: {
          cartItems: {
            select: {
              quantity: true,
              product: {
                select: {
                  id: true,
                  price: true,
                },
              },
            },
          },
        },
      });

      if (!cart) {
        throw new Error("Cart not found");
      }

      if (cart.cartItems.length === 0) {
        throw new Error("Cart is empty");
      }

      const amount = cart.cartItems.reduce(
        (acc, item) => acc + item.product.price * item.quantity,
        0,
      );

      const expiresAt = new Date(Date.now() + 5 * 60 * 1000);

      const order = await tx.order.create({
        data: {
          userId,
          amount,
          expiresAt,
          orderItems: {
            create: cart.cartItems.map((item) => ({
              productId: item.product.id,
              quantity: item.quantity,
              unitPrice: item.product.price,
            })),
          },
        },
      });

      await paymentService.createPayment(tx, order.id, amount);

      return order;
    });
  },

  async getOrdersByUserId(userId: string) {
    return prisma.order.findMany({
      where: { userId },
      include: {
        orderItems: {
          include: {
            product: {
              select: {
                name: true,
                description: true,
              },
            },
          },
        },
        payment: {
          select: {
            id: true,
            amount: true,
            status: true,
          },
        },
      },
    });
  },
};
