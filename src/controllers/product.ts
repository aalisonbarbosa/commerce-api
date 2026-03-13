import { FastifyReply, FastifyRequest } from "fastify";
import z from "zod";
import { productService } from "../services/product";

const createProductSchema = z.object({
  name: z.string().min(1, "Name is required"),
  description: z.string(),
  price: z.number().positive("Price must be a positive number"),
  quantity: z.number().min(1, { message: "Quantity must be at least 1" }),
});

const updateProductSchema = z.object({
  name: z.string().min(1, "Name is required").optional(),
  description: z.string().optional(),
  price: z.number().positive("Price must be a positive number").optional(),
  quantity: z.number().positive("Quantity must be at least 1").optional(),
});

export const productController = {
  async createProduct(req: FastifyRequest, reply: FastifyReply) {
    const parseResult = createProductSchema.safeParse(req.body);

    if (!parseResult.success) {
      return reply.status(400).send({ error: "Validation failed" });
    }

    const { name, description, price, quantity } = parseResult.data;
    const { id: userId } = req.user;

    try {
      await productService.createProduct({
        name,
        description,
        price,
        quantity,
        userId,
      });

      return reply
        .status(201)
        .send({ message: "Product created successfully" });
    } catch (error) {
      console.error(error);

      return reply.status(500).send({ error: "Failed to create product" });
    }
  },

  async deleteProduct(
    req: FastifyRequest<{ Params: { id: string } }>,
    reply: FastifyReply,
  ) {
    const { id: productId } = req.params;
    const { id: userId } = req.user;

    try {
      await productService.deleteProduct(productId, userId);

      reply.status(200).send({ message: "Product deleted successfully" });
    } catch (error) {
      console.error(error);

      return reply.status(500).send({ error: "Failed to delete product" });
    }
  },

  async updateProduct(
    req: FastifyRequest<{ Params: { id: string } }>,
    reply: FastifyReply,
  ) {
    const { id: productId } = req.params;

    const parseResult = updateProductSchema.safeParse(req.body);

    if (!parseResult.success) {
      return reply.status(400).send({ error: "Validation failed" });
    }

    const { id: userId } = req.user;

    const { name, description, price, quantity } = parseResult.data;

    try {
      await productService.updateProduct(
        productId,
        { name, description, price, quantity },
        userId,
      );

      return reply
        .status(200)
        .send({ message: "Product updated successfully" });
    } catch (error) {
      console.error(error);

      return reply.status(500).send({ error: "Failed to update product" });
    }
  },

  async getProducts(req: FastifyRequest, reply: FastifyReply) {
    try {
      const products = await productService.getProducts();

      return reply.status(200).send(products);
    } catch (error) {
      console.error(error);

      return reply.status(500).send({ error: "Failed to fetch products" });
    }
  },

  async getProductById(
    req: FastifyRequest<{ Params: { id: string } }>,
    reply: FastifyReply,
  ) {
    const { id } = req.params;

    try {
      const product = await productService.getProductById(id);

      if (!product) {
        return reply.status(404).send({ error: "Product not found" });
      }

      return reply.status(200).send(product);
    } catch (error) {
      console.error(error);

      return reply.status(500).send({ error: "Failed to fetch product" });
    }
  },
};
