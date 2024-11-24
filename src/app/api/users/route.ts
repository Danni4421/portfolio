import db from "@/lib/client";
import bcrypt from "bcrypt";
import { users } from "@/lib/schema";
import UserValidator from "@/lib/validator/schema/user";
import { eq } from "drizzle-orm/expressions";

export async function POST(request: Request): Promise<Response> {
  try {
    const registerRequest = UserValidator.REGISTER_SCHEMA.safeParse(
      await request.json()
    );

    if (!registerRequest.success) {
      return new Response(
        JSON.stringify({ message: registerRequest.error.errors }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    const isEmailExists = await db
      .select()
      .from(users)
      .where(eq(users.email, registerRequest.data.email))
      .limit(1)
      .execute();

    if (isEmailExists.length > 0) {
      throw new Error("Gagal menambahkan user baru, Email sudah digunakan");
    }

    const hashedPw = await bcrypt.hash(registerRequest.data.password, 10);

    const user = await db
      .insert(users)
      .values({
        ...registerRequest.data,
        password: hashedPw,
      })
      .execute();

    if (!user) {
      throw new Error("Failed to register a new user");
    }

    return new Response(
      JSON.stringify({
        status: "success",
        message: "Successfully register new User",
      }),
      {
        status: 201,
        headers: { "Content-Type": "application/json" },
      }
    );
  } catch (error) {
    if (error instanceof Error) {
      return new Response(
        JSON.stringify({
          status: "fail",
          message: error.message,
        }),
        { status: 500, headers: { "Content-Type": "application/json" } }
      );
    } else {
      return new Response(
        JSON.stringify({
          status: "error",
          message: "An unknown error occured",
        }),
        { status: 500, headers: { "Content-Type": "application/json" } }
      );
    }
  }
}
