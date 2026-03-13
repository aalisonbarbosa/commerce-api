import { FastifyInstance } from "fastify";
import { authController } from "../controllers/auth";
import z from "zod";

export const authRoutes = async (fastify: FastifyInstance) => {
  fastify.post(
    "/register",
    {
      schema: {
        tags: ["Auth"],
        summary: "Register user",
        description: "Creates a new user account.",
        body: z.object({
          name: z.string().min(1).describe("User name"),
          email: z.string().email().describe("User email"),
          password: z
            .string()
            .min(6)
            .describe("User password (minimum 6 characters)"),
        }),
        response: {
          200: z.object({
            message: z.string().describe("Registration result"),
          }),
          400: z.object({
            error: z.string().describe("Validation error"),
          }),
          500: z.object({
            error: z.string(),
          }),
        },
      },
    },
    authController.register,
  );

  fastify.post(
    "/login",
    {
      schema: {
        tags: ["Auth"],
        summary: "User login",
        description:
          "Authenticates the user and returns a JWT token stored in cookies.",
        body: z.object({
          email: z.string().email().describe("User email"),
          password: z.string().min(6).describe("User password"),
        }),
        response: {
          200: z.object({
            message: z.string().describe("Login result"),
          }),
          401: z.object({
            error: z.string().describe("Invalid credentials"),
          }),
          400: z.object({
            error: z.string().describe("Validation error"),
          }),
          500: z.object({
            error: z.string(),
          }),
        },
      },
    },
    authController.login,
  );
};
