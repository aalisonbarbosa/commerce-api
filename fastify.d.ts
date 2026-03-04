import "fastify";

declare module "fastify" {
  interface FastifyInstance {
    authenticate: any;
  }
}

import "@fastify/jwt";

declare module "@fastify/jwt" {
  interface FastifyJWT {
    payload: {
      id: string;
      email: string;
    };
    user: {
      id: string;
      email: string;
    };
  }
}