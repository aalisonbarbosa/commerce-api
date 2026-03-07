import Fastify from "fastify";
import { productRoutes } from "./routes/product";
import { authRoutes } from "./routes/auth";
import auth from "./plugins/auth";
import { cartRoutes } from "./routes/cart";

const fastify = Fastify();

fastify.register(auth);
fastify.register(authRoutes);
fastify.register(productRoutes);
fastify.register(cartRoutes);

fastify.listen({ port: 3000, host: "0.0.0.0" }).then(() => {
  console.log("Server is running on http://localhost:3000");
});
