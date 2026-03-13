import { productController } from "../controllers/product";
import z from "zod";
import { FastifyTypedInstance } from "../types/fastify";

export const productRoutes = async (fastify: FastifyTypedInstance) => {
  fastify.get(
    "/products",
    {
      schema: {
        tags: ["Products"],
        summary: "List products",
        description: "Returns a list of all products available in the system.",
        response: {
          200: z.array(
            z.object({
              id: z.string().uuid().describe("Product unique identifier"),
              name: z.string().describe("Product name"),
              description: z.string().describe("Product description"),
              price: z.number().describe("Product price"),
              quantity: z.number().describe("Available stock quantity"),
              userId: z
                .string()
                .uuid()
                .describe("User who created the product"),
            }),
          ),
          500: z.object({
            error: z.string(),
          }),
        },
      },
    },
    productController.getProducts,
  );

  fastify.get(
    "/products/:id",
    {
      schema: {
        tags: ["Products"],
        summary: "Get product by ID",
        description: "Returns the details of a specific product by its ID.",
        params: z.object({
          id: z.string().uuid().describe("Unique identifier of the product"),
        }),
        response: {
          200: z.object({
            id: z.string().uuid(),
            name: z.string(),
            description: z.string(),
            price: z.number(),
            quantity: z.number(),
            userId: z.string().uuid(),
          }),
          404: z.object({
            message: z.string().describe("Product not found"),
          }),
          500: z.object({
            error: z.string(),
          }),
        },
      },
    },
    productController.getProductById,
  );

  fastify.post(
    "/products",
    {
      preHandler: [fastify.authenticate],
      schema: {
        tags: ["Products"],
        security: [{ bearerAuth: [] }],
        summary: "Create product",
        description:
          "Creates a new product. Only authenticated admin users are allowed to perform this action.",
        body: z.object({
          name: z.string().min(1).describe("Product name"),
          description: z.string().describe("Product description"),
          price: z
            .number()
            .positive()
            .describe("Product price (must be positive)"),
          quantity: z.number().min(1).describe("Initial stock quantity"),
        }),
        response: {
          201: z.object({
            message: z.string().describe("Product creation result"),
          }),
          400: z.object({
            error: z.string().describe("Validation error"),
          }),
          401: z.object({
            error: z.string().describe("Unauthorized"),
          }),
          500: z.object({
            error: z.string(),
          }),
        },
      },
    },
    productController.createProduct,
  );

  fastify.delete(
    "/products/:id",
    {
      preHandler: [fastify.authenticate],
      schema: {
        tags: ["Products"],
        security: [{ bearerAuth: [] }],
        summary: "Delete product",
        description:
          "Deletes a product by its ID. Only admin users can delete products.",
        params: z.object({
          id: z.string().uuid().describe("Product unique identifier"),
        }),
        response: {
          200: z.object({
            message: z.string().describe("Product deleted successfully"),
          }),
          404: z.object({
            error: z.string().describe("Product not found"),
          }),
          401: z.object({
            error: z.string().describe("Unauthorized"),
          }),
          500: z.object({
            error: z.string(),
          }),
        },
      },
    },
    productController.deleteProduct,
  );

  fastify.put(
    "/products/:id",
    {
      preHandler: [fastify.authenticate],
      schema: {
        tags: ["Products"],
        security: [{ bearerAuth: [] }],
        summary: "Update product",
        description:
          "Updates the information of an existing product. Only admin users are allowed to perform this action.",
        params: z.object({
          id: z.string().uuid().describe("Product unique identifier"),
        }),
        body: z.object({
          name: z.string().min(1).optional().describe("Product name"),
          description: z.string().optional().describe("Product description"),
          price: z.number().positive().optional().describe("Product price"),
        }),
        response: {
          200: z.object({
            message: z.string().describe("Product updated successfully"),
          }),
          400: z.object({
            error: z.string().describe("Validation error"),
          }),
          404: z.object({
            error: z.string().describe("Product not found"),
          }),
          401: z.object({
            error: z.string().describe("Unauthorized"),
          }),
          500: z.object({
            error: z.string(),
          }),
        },
      },
    },
    productController.updateProduct,
  );
};
