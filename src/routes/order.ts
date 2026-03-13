import { FastifyInstance } from "fastify";
import { orderController } from "../controllers/order";
import z from "zod";

export const orderRoutes = async (fastify: FastifyInstance) => {
  fastify.get(
    "/orders",
    {
      preHandler: [fastify.authenticate],
      schema: {
        tags: ["Orders"],
        security: [{ bearerAuth: [] }],
        summary: "List user orders",
        description:
          "Returns all orders that belong to the authenticated user, including order items and payment information.",
        response: {
          200: z.array(
            z.object({
              id: z.string().uuid().describe("Order unique identifier"),
              userId: z.string().uuid().describe("User who created the order"),
              amount: z.number().describe("Total order amount"),
              expiresAt: z.string().describe("Expiration date for payment"),
              createdAt: z.string().describe("Order creation date"),

              orderItems: z.array(
                z.object({
                  id: z.string().uuid(),
                  productId: z.string().uuid(),
                  quantity: z.number(),
                  unitPrice: z.number(),
                  product: z.object({
                    name: z.string(),
                    description: z.string(),
                  }),
                }),
              ),

              payment: z.object({
                id: z.string().uuid(),
                amount: z.number(),
                status: z.string().describe("Payment status"),
              }),
            }),
          ),
          500: z.object({
            error: z.string(),
          }),
        },
      },
    },
    orderController.getOrdersByUserId,
  );

  fastify.post(
    "/orders",
    {
      preHandler: [fastify.authenticate],
      schema: {
        tags: ["Orders"],
        security: [{ bearerAuth: [] }],
        summary: "Create order",
        description:
          "Creates an order using the authenticated user's cart. All cart items become order items and a payment is generated.",
        response: {
          200: z.object({
            message: z.string().describe("Order creation result"),
          }),
          400: z.object({
            error: z.string().describe("Cart not found or empty"),
          }),
          500: z.object({
            error: z.string(),
          }),
        },
      },
    },
    orderController.createOrder,
  );

  fastify.put(
    "/orders/:orderId/confirm-payment",
    {
      preHandler: [fastify.authenticate],
      schema: {
        tags: ["Orders"],
        security: [{ bearerAuth: [] }],
        summary: "Confirm payment",
        description:
          "Confirms the payment of an order. This will update the payment status and process stock updates if needed.",
        params: z.object({
          orderId: z
            .string()
            .uuid()
            .describe("Unique identifier of the order to confirm payment"),
        }),
        response: {
          200: z.object({
            message: z.string().describe("Payment confirmation result"),
          }),
          404: z.object({
            error: z.string().describe("Order not found"),
          }),
          400: z.object({
            error: z.string().describe("Invalid payment state"),
          }),
          500: z.object({
            error: z.string(),
          }),
        },
      },
    },
    orderController.confirmPayment,
  );
};