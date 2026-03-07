import { FastifyInstance } from "fastify";
import { cartController } from "../controllers/cart";

export const cartRoutes = async (fastify: FastifyInstance) => {
  fastify.get(
    "/cart",
    { preHandler: [fastify.authenticate] },
    cartController.getCartByUserId,
  );
  fastify.post(
    "/cart",
    { preHandler: [fastify.authenticate] },
    cartController.addProductToCart,
  );
  fastify.delete(
    "/cart/:id",
    { preHandler: [fastify.authenticate] },
    cartController.deleteProductFromCart,
  );
  fastify.put(
    "/cart/decrement/:id",
    { preHandler: [fastify.authenticate] },
    cartController.decrementProductQuantity,
  );
};
