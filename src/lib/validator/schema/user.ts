import { z, ZodType } from "zod";

export default class UserValidator {
  static readonly REGISTER_SCHEMA: ZodType = z.object({
    userName: z
      .string()
      .min(3, {
        message: "Username must be at least 3 characters",
      })
      .max(100, {
        message: "Username must be at most 100 characters",
      }),
    firstName: z
      .string()
      .min(3, {
        message: "First name must be at least 3 characters",
      })
      .max(50, {
        message: "First name must be at most 50 characters",
      }),
    lastName: z
      .string()
      .min(3, {
        message: "Last name must be at least 3 characters",
      })
      .max(50, {
        message: "Last name must be at most 50 characters",
      }),
    email: z
      .string()
      .email({
        message: "Invalid email address",
      })
      .max(100, {
        message: "Email must be at most 100 characters",
      }),
    password: z
      .string()
      .min(8, {
        message: "Password must be at least 8 characters",
      })
      .max(100, {
        message: "Password must be at most 100 characters",
      }),
  });
}
