import { FastifyInstance } from "fastify";
import { orderController } from "../controllers/order";

export const orderRoutes = async (fastify: FastifyInstance) => {
  fastify.get(
    "/orders",
    { preHandler: [fastify.authenticate] },
    orderController.getOrdersByUserId,
  );
  fastify.post(
    "/orders",
    { preHandler: [fastify.authenticate] },
    orderController.createOrder,
  );
  fastify.put(
    "/orders/:orderId/confirm-payment",
    { preHandler: [fastify.authenticate] },
    orderController.confirmPayment,
  );
};
