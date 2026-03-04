import { FastifyInstance } from "fastify";
import { productController } from "../controllers/product";

export const productRoutes = async (fastify: FastifyInstance) => {
  fastify.get("/products", productController.getProducts);
  fastify.get("/products/:id", productController.getProductById);
  fastify.post(
    "/products",
    { preHandler: [fastify.authenticate] },
    productController.createProduct,
  );
  fastify.delete(
    "/products/:id",
    { preHandler: [fastify.authenticate] },
    productController.deleteProduct,
  );
  fastify.put(
    "/products/:id",
    { preHandler: [fastify.authenticate] },
    productController.updateProduct,
  );
};
