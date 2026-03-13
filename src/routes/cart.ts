import { FastifyInstance } from "fastify";
import { cartController } from "../controllers/cart";
import z from "zod";

export const cartRoutes = async (fastify: FastifyInstance) => {
  fastify.get(
    "/cart",
    {
      preHandler: [fastify.authenticate],
      schema: {
        tags: ["Cart"],
        security: [{ bearerAuth: [] }],
        summary: "Get user cart",
        description:
          "Returns the cart of the authenticated user, including all products currently added.",
        response: {
          200: z.object({
            id: z.string().uuid().describe("Cart unique identifier"),
            userId: z.string().uuid().describe("Owner of the cart"),
            cartItems: z.array(
              z.object({
                id: z.string().uuid(),
                productId: z.string().uuid(),
                quantity: z
                  .number()
                  .describe("Quantity of the product in cart"),
                product: z.object({
                  name: z.string(),
                  description: z.string(),
                  price: z.number(),
                }),
              }),
            ),
          }),
          404: z.object({
            error: z.string().describe("Cart not found"),
          }),
          500: z.object({
            error: z.string(),
          }),
        },
      },
    },
    cartController.getCartByUserId,
  );

  fastify.post(
    "/cart",
    {
      preHandler: [fastify.authenticate],
      schema: {
        tags: ["Cart"],
        security: [{ bearerAuth: [] }],
        summary: "Add product to cart",
        description:
          "Adds a product to the authenticated user's cart. If the product already exists in the cart, its quantity will be incremented.",
        body: z.object({
          productId: z
            .string()
            .uuid()
            .describe("Unique identifier of the product to add to the cart"),
        }),
        response: {
          200: z.object({
            message: z.string().describe("Product successfully added to cart"),
          }),
          400: z.object({
            error: z.string().describe("Validation error"),
          }),
          404: z.object({
            error: z.string().describe("Product not found"),
          }),
          500: z.object({
            error: z.string(),
          }),
        },
      },
    },
    cartController.addProductToCart,
  );

  fastify.delete(
    "/cart/:id",
    {
      preHandler: [fastify.authenticate],
      schema: {
        tags: ["Cart"],
        security: [{ bearerAuth: [] }],
        summary: "Remove product from cart",
        description:
          "Removes a product from the user's cart using the cart item identifier.",
        params: z.object({
          id: z.string().uuid().describe("Cart item identifier to be removed"),
        }),
        response: {
          200: z.object({
            message: z
              .string()
              .describe("Product removed from cart successfully"),
          }),
          404: z.object({
            error: z.string().describe("Cart item not found"),
          }),
          500: z.object({
            error: z.string(),
          }),
        },
      },
    },
    cartController.deleteProductFromCart,
  );

  fastify.put(
    "/cart/decrement/:id",
    {
      preHandler: [fastify.authenticate],
      schema: {
        tags: ["Cart"],
        security: [{ bearerAuth: [] }],
        summary: "Decrement product quantity",
        description:
          "Decreases the quantity of a product in the cart. If the quantity reaches zero, the item may be removed from the cart.",
        params: z.object({
          id: z
            .string()
            .uuid()
            .describe(
              "Cart item identifier whose quantity will be decremented",
            ),
        }),
        response: {
          200: z.object({
            message: z
              .string()
              .describe("Product quantity decremented successfully"),
          }),
          404: z.object({
            error: z.string().describe("Cart item not found"),
          }),
          500: z.object({
            error: z.string(),
          }),
        },
      },
    },
    cartController.decrementProductQuantity,
  );
};
