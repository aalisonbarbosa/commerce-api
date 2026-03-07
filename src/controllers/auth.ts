import { FastifyReply, FastifyRequest } from "fastify";
import z from "zod";
import bcrypt from "bcrypt";
import { userService } from "../services/user";

const registerSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters long"),
});

const loginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters long"),
});

export const authController = {
  async register(req: FastifyRequest, reply: FastifyReply) {
    const parseResult = registerSchema.safeParse(req.body);

    if (!parseResult.success) {
      return reply.status(400).send({
        error: "Validation failed",
      });
    }

    const { name, email, password } = parseResult.data;

    const hashPassword = await bcrypt.hash(password, 10);

    try {
      await userService.createUser(name, email, hashPassword);

      return reply.status(200).send({
        message: "User registered successfully",
      });
    } catch (error) {
      console.error(error);

      return reply.status(500).send({
        error: "Failed to create user",
      });
    }
  },

  async login(req: FastifyRequest, reply: FastifyReply) {
    const parseResult = loginSchema.safeParse(req.body);

    if (!parseResult.success) {
      return reply.status(400).send({
        error: "Validation failed",
      });
    }

    const { email, password } = parseResult.data;

    try {
      const user = await userService.getUserByEmail(email);

      if (!user) {
        return reply.status(401).send({
          error: "Invalid email or password",
        });
      }

      const isValidPassword = await bcrypt.compare(password, user.password);

      if (!isValidPassword) {
        return reply.status(401).send({ error: "Invalid email or password" });
      }

      const token = await reply.jwtSign(
        {
          id: user.id,
          email: user.email,
        },
        { expiresIn: "3d" },
      );

      reply.setCookie("token", token, {
        httpOnly: true,
        secure: false,
        sameSite: "lax",
        path: "/",
        maxAge: 60 * 60 * 24 * 3,
      });

      return reply.send({
        message: "Login successful",
      });
    } catch (error) {
      console.error(error);

      return reply.status(500).send({
        error: "Failed to login",
      });
    }
  },
};
