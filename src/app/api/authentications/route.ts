import db from "@/lib/client";
import bcrypt from "bcrypt";
import { generateToken } from "@/lib/jwt";
import { users } from "@/lib/schema";
import AuthValidator from "@/lib/validator/schema/auth";
import { eq } from "drizzle-orm/expressions";

export async function POST(request: Request): Promise<Response> {
  try {
    const loginRequest = AuthValidator.LOGIN_SCHEMA.safeParse(
      await request.json()
    );

    console.error(loginRequest);

    if (!loginRequest.success) {
      return new Response(JSON.stringify(loginRequest.error), {
        status: 400,
        headers: {
          "Content-Type": "application/json",
        },
      });
    }

    const user = await db
      .select()
      .from(users)
      .where(eq(users.email, loginRequest.data.email))
      .execute();

    if (user.length === 0) throw new Error("User not found");

    const isPasswordMatch = await bcrypt.compare(
      loginRequest.data.password,
      user[0].password
    );

    if (!isPasswordMatch) throw new Error("Invalid password");

    // Generate JWT token
    const token = generateToken({ id: user[0].id }, "1d");

    return new Response(
      JSON.stringify({
        status: "success",
        data: {
          token,
        },
      }),
      {
        status: 200,
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
  } catch (error) {
    return new Response(
      JSON.stringify({
        status: "error",
        message:
          error instanceof Error ? error.message : "An unknown error occurred",
      }),
      {
        status: 400,
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
  }
}
