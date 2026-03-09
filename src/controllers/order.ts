import { FastifyReply, FastifyRequest } from "fastify";
import { orderService } from "../services/order";
import { paymentService } from "../services/payment";

export const orderController = {
  async createOrder(req: FastifyRequest, reply: FastifyReply) {
    const { id: userId } = req.user;

    try {
      await orderService.createOrder(userId);

      return reply.status(200).send({ message: "Order created successfully" });
    } catch (error) {
      console.error(error);

      return reply.status(500).send({ error: "Failed to create order" });
    }
  },

  async getOrdersByUserId(req: FastifyRequest, reply: FastifyReply) {
    try {
      const { id: userId } = req.user;

      const orders = await orderService.getOrdersByUserId(userId);

      return reply.status(200).send(orders);
    } catch (error) {
      console.error(error);

      return reply.status(500).send({ error: "Failed to fetch orders" });
    }
  },

  async confirmPayment(
    req: FastifyRequest<{ Params: { orderId: string } }>,
    reply: FastifyReply,
  ) {
    const { id: userId } = req.user;
    const { orderId } = req.params;

    try {
      await paymentService.confirmPayment(orderId, userId);

      return reply
        .status(200)
        .send({ message: "Payment confirmed successfully" });
    } catch (error) {
      console.error(error);

      return reply.status(500).send({ error: "Failed to confirm payment" });
    }
  },
};
