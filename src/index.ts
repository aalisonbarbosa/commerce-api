import Fastify from "fastify";
import { productRoutes } from "./routes/product";
import { authRoutes } from "./routes/auth";
import auth from "./plugins/auth";
import { cartRoutes } from "./routes/cart";
import { orderRoutes } from "./routes/order";
import { startJobs } from "./jobs/scheduler";
import fastifyCors from "@fastify/cors";
import {
  jsonSchemaTransform,
  serializerCompiler,
  validatorCompiler,
  ZodTypeProvider,
} from "fastify-type-provider-zod";
import fastifySwagger from "@fastify/swagger";
import fastifySwaggerUi from "@fastify/swagger-ui";

const fastify = Fastify().withTypeProvider<ZodTypeProvider>();

fastify.setValidatorCompiler(validatorCompiler);
fastify.setSerializerCompiler(serializerCompiler);

fastify.register(fastifyCors, { origin: "*" });

fastify.register(fastifySwagger, {
  openapi: {
    info: {
      title: "Commerce API",
      description: "API de e-commerce com autenticação de usuários, gerenciamento de produtos, carrinho de compras, criação de pedidos e confirmação de pagamento.",
      version: "1.0.0",
    },
    components: {
      securitySchemes: {
        bearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT",
        },
      },
    },
  },
  transform: jsonSchemaTransform,
});

fastify.register(fastifySwaggerUi, {
  routePrefix: "/docs",
});

fastify.register(auth);
fastify.register(authRoutes);
fastify.register(productRoutes);
fastify.register(cartRoutes);
fastify.register(orderRoutes);

startJobs();

fastify.listen({ port: 3333, host: "0.0.0.0" }).then(() => {
  console.log("Server is running on http://localhost:3333");
});
