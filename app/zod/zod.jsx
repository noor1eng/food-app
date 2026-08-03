import { z } from "zod";
export const SignUpSchema = z.object({
  name: z
    .string()
    .min(3, "name must be at least 3 characters")
    .max(20, "name must be less than 50 characters"),

  email: z.string().email("Please enter a valid email address"),

  password: z
    .string()
    .min(8, "Password must be at least 8 characters")
    .max(20, "Password is too long"),
});

export const LoginSchema = z.object({
  email: z.string().email("Please enter a valid email address"),

  password: z.string().min(8, "Password must be at least 8 characters"),
});
