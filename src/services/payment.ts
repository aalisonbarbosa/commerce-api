import { Prisma } from "@prisma/client";
import { prisma } from "../lib/prisma";
import { productService } from "./product";

export const paymentService = {
  async createPayment(
    tx: Prisma.TransactionClient,
    orderId: string,
    amount: number,
  ) {
    return tx.payment.create({
      data: {
        orderId,
        amount,
      },
    });
  },

  async confirmPayment(orderId: string, userId: string) {
    return prisma.$transaction(async (tx) => {
      const payment = await tx.payment.findUnique({
        where: { orderId },
      });

      if (!payment) {
        throw new Error("Payment not found");
      }

      if (payment.status === "CONFIRMED") {
        throw new Error("Payment already confirmed");
      }

      await tx.payment.update({
        where: { id: payment.id },
        data: { status: "CONFIRMED" },
      });

      const cart = await tx.cart.findUnique({
        where: { userId },
        include: {
          cartItems: {
            include: {
              product: true,
            },
          },
        },
      });

      if (!cart) {
        throw new Error("Cart not found");
      }

      for (const item of cart.cartItems) {
        await productService.decrementStock(
          tx,
          item.product.id,
          item.quantity,
        );
      }

      await tx.cartItem.deleteMany({
        where: { cartId: cart.id },
      });

      return tx.order.update({
        where: { id: orderId },
        data: { status: "PAID" },
      });
    });
  },
};