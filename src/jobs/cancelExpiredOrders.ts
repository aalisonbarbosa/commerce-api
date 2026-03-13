import { prisma } from "../lib/prisma";

export async function cancelExpiredOrders() {
  const expiredOrders = await prisma.order.findMany({
    where: {
      status: "PENDING",
      expiresAt: {
        lt: new Date(),
      },
    },
    include: {
      payment: true,
    },
  });

  for (const order of expiredOrders) {
    await prisma.$transaction(async (tx) => {
      await tx.order.update({
        where: { id: order.id },
        data: { status: "CANCELLED" },
      });

      if (order.payment) {
        await tx.payment.update({
          where: { id: order.payment.id },
          data: { status: "FAILED" },
        });
      }
    });
  }
}
