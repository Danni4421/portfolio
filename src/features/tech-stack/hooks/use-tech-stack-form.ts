import { useState, useEffect } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { apiClient } from "@/shared/api/client"
import { Effect } from "effect"
import { useToast } from "@/shared/ui/toast"

export const techStackSchema = z.object({
  name: z.string().min(1, "Stack name is required"),
  redirectUrl: z.string().min(1, "Redirect URL is required").url("Must be a valid URL"),
  imageLogo: z.string().min(1, "Logo image URL is required"),
})

export type TechStackFormValues = z.infer<typeof techStackSchema>

interface TechStack {
  id: string;
  name: string;
  image_logo: string;
  redirect_url: string;
  sort_order?: number;
}

interface ApiResponse<T> {
  success: boolean;
  data: T;
}

export function useTechStackForm({
  editingStack,
  setFormOpen,
  fetchStacks,
  stacksCount,
}: {
  editingStack: TechStack | null;
  setFormOpen: (open: boolean) => void;
  fetchStacks: () => void;
  stacksCount: number;
}) {
  const { toast } = useToast()
  const [uploading, setUploading] = useState(false)
  const [submitting, setSubmitting] = useState(false)

  const form = useForm<TechStackFormValues>({
    resolver: zodResolver(techStackSchema),
    defaultValues: {
      name: "",
      redirectUrl: "",
      imageLogo: "",
    },
  })

  // ponytail: sync form state with editing status
  useEffect(() => {
    if (editingStack) {
      form.reset({
        name: editingStack.name,
        redirectUrl: editingStack.redirect_url,
        imageLogo: editingStack.image_logo,
      })
    } else {
      form.reset({
        name: "",
        redirectUrl: "",
        imageLogo: "",
      })
    }
  }, [editingStack, form])

  const handleFileUpload = (file: File) => {
    if (!file) return

    setUploading(true)
    Effect.runPromise(apiClient.uploadFile(file))
      .then((url) => {
        form.setValue("imageLogo", url, { shouldValidate: true })
        toast({ title: "Success", description: "Logo uploaded successfully", variant: "success" })
      })
      .catch((err) => {
        toast({ title: "Upload Failed", description: err.message || "Failed to upload image", variant: "destructive" })
      })
      .finally(() => {
        setUploading(false)
      })
  }

  const onSubmit = (data: TechStackFormValues) => {
    setSubmitting(true)
    const payload = {
      name: data.name,
      image_logo: data.imageLogo,
      redirect_url: data.redirectUrl,
      sort_order: editingStack && editingStack.sort_order !== undefined ? editingStack.sort_order : stacksCount,
    }

    const task = editingStack
      ? apiClient.put<ApiResponse<TechStack>>(`/api/v1/tech-stacks/${editingStack.id}`, payload)
      : apiClient.post<ApiResponse<TechStack>>("/api/v1/tech-stacks", payload)

    Effect.runPromise(task)
      .then(() => {
        setFormOpen(false)
        fetchStacks()
        toast({
          title: "Success",
          description: editingStack ? "Tech stack updated successfully" : "Tech stack created successfully",
          variant: "success",
        })
      })
      .catch((err) => {
        toast({ title: "Submission Failed", description: err.message || "Submission failed", variant: "destructive" })
      })
      .finally(() => {
        setSubmitting(false)
      })
  }

  return {
    form,
    uploading,
    submitting,
    handleFileUpload,
    onSubmit: form.handleSubmit(onSubmit),
  }
}
