import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { Effect } from "effect"

export const contactSchema = z.object({
  email: z.string().min(1, "Email Address is required").email("Invalid email address"),
  message: z.string().min(1, "Message is required"),
})

export type ContactFormValues = z.infer<typeof contactSchema>

export function useContactForm() {
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState("")

  const form = useForm<ContactFormValues>({
    resolver: zodResolver(contactSchema),
    defaultValues: {
      email: "",
      message: "",
    },
  })

  const onSubmit = (data: ContactFormValues) => {
    setLoading(true)
    setError("")
    setSuccess(false)

    // ponytail: use effect to perform API fetch in a clear side-effect context
    const program = Effect.gen(function* () {
      yield* Effect.tryPromise({
        try: async () => {
          const response = await fetch("https://formspree.io/f/mnngywja", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(data),
          })

          if (!response.ok) throw new Error("Failed to send message")
          return response
        },
        catch: (err) => new Error(err instanceof Error ? err.message : "Something went wrong")
      })
    }).pipe(
      Effect.match({
        onFailure: (err) => {
          setError(err.message)
          setTimeout(() => setError(""), 5000)
          setLoading(false)
        },
        onSuccess: () => {
          setSuccess(true)
          form.reset({ email: "", message: "" })
          setTimeout(() => setSuccess(false), 5000)
          setLoading(false)
        }
      })
    )

    Effect.runPromise(program)
  }

  return {
    form,
    loading,
    success,
    error,
    onSubmit: form.handleSubmit(onSubmit),
  }
}
