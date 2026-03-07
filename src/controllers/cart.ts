import fastify, { FastifyReply, FastifyRequest } from "fastify";
import z from "zod";
import { cartService } from "../services/cart";
import fastifyJwt from "@fastify/jwt";

const addProductToCartSchema = z.object({
  productId: z.string().min(1, "Product ID is required"),
});

export const cartController = {
  async getCartByUserId(req: FastifyRequest, reply: FastifyReply) {
    const { id: userId } = req.user;

    try {
      const cart = await cartService.getCartByUserId(userId);

      if (!cart) {
        return reply.status(404).send({ error: "Cart not found" });
      }

      return reply.status(200).send(cart);
    } catch (error) {
      console.error(error);

      return reply.status(500).send({ error: "Failed to retrieve cart" });
    }
  },

  async addProductToCart(req: FastifyRequest, reply: FastifyReply) {
    const parseResult = addProductToCartSchema.safeParse(req.body);

    if (!parseResult.success) {
      return reply.status(400).send({ error: "Validation failed" });
    }

    const { productId } = parseResult.data;
    const { id: userId } = req.user;

    try {
      await cartService.addProductToCart(userId, productId);

      return reply
        .status(200)
        .send({ message: "Product added to cart successfully" });
    } catch (error) {
      console.error(error);

      return reply.status(500).send({ error: "Failed to add product to cart" });
    }
  },

  async deleteProductFromCart(
    req: FastifyRequest<{ Params: { id: string } }>,
    reply: FastifyReply,
  ) {
    const { id: cartItemId } = req.params;

    try {
      await cartService.deleteProductFromCart(cartItemId);

      return reply
        .status(200)
        .send({ message: "Product deleted from cart successfully" });
    } catch (error) {
      console.error(error);

      return reply
        .status(500)
        .send({ error: "Failed to delete product from cart" });
    }
  },

  async decrementProductQuantity(
    req: FastifyRequest<{ Params: { id: string } }>,
    reply: FastifyReply,
  ) {
    const { id: cartItemId } = req.params;

    try {
      await cartService.decrementProductQuantity(cartItemId);

      return reply
        .status(200)
        .send({ message: "Product quantity decremented successfully" });
    } catch (error) {
      console.error(error);

      return reply
        .status(500)
        .send({ error: "Failed to decrement product quantity" });
    }
  },
};
