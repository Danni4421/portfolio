import { z, ZodType } from "zod";

export default class AuthValidator {
  static readonly LOGIN_SCHEMA: ZodType = z.object({
    email: z
      .string()
      .email({
        message: "Invalid email address",
      })
      .max(100, {
        message: "Email must be less than 100 characters",
      }),
    password: z
      .string()
      .min(8, {
        message: "Password must be at least 8 characters",
      })
      .max(20, {
        message: "Password must be less than 20 characters",
      }),
  });
}
