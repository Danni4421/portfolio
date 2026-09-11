import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { useNavigate } from "react-router-dom"
import { apiClient } from "@/shared/api/client"
import { Effect } from "effect"

export const authSchema = z.object({
  email: z.string().min(1, "Email is required").email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  name: z.string().optional(),
  bio: z.string().optional(),
})

export type AuthFormValues = z.infer<typeof authSchema>

export function useAuthForm() {
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const form = useForm<AuthFormValues>({
    resolver: zodResolver(authSchema),
    defaultValues: {
      email: "",
      password: "",
      name: "",
      bio: "",
    },
  })

  const onSubmit = (isRegister: boolean) => (data: AuthFormValues) => {
    if (isRegister && !data.name) {
      form.setError("name", { type: "custom", message: "Full Name is required" })
      return
    }

    setLoading(true)
    setError(null)

    const task = isRegister
      ? apiClient.post<{
          success: boolean;
          token?: string;
          refresh_token?: string;
          data?: { token?: string; refresh_token?: string };
        }>("/api/v1/auth/register", {
          email: data.email,
          password: data.password,
          name: data.name,
          bio: data.bio,
        })
      : apiClient.post<{
          success: boolean;
          token?: string;
          refresh_token?: string;
          data?: { token?: string; refresh_token?: string };
        }>("/api/v1/auth/login", {
          email: data.email,
          password: data.password,
        });

    Effect.runPromise(task)
      .then((res) => {
        const token = res.token || res.data?.token;
        const refreshToken = res.refresh_token || res.data?.refresh_token;
        if (token) {
          apiClient.setToken(token);
          if (refreshToken) {
            apiClient.setRefreshToken(refreshToken);
          }
          navigate("/admin/dashboard");
        } else {
          setError("No token received from server");
        }
      })
      .catch((err) => {
        setError(err.message || "Authentication failed");
      })
      .finally(() => {
        setLoading(false);
      });
  }

  return {
    form,
    loading,
    error,
    setError,
    onSubmit: (isRegister: boolean) => form.handleSubmit(onSubmit(isRegister)),
  }
}
