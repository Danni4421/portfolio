import { useState, useEffect } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { apiClient } from "@/shared/api/client"
import { Effect } from "effect"
import { useToast } from "@/shared/ui/toast"

export const achievementSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().min(1, "Description is required"),
  sourceLogoUrl: z.string().min(1, "Issuer logo is required"),
  redirectUrl: z.string().min(1, "Redirect URL is required").url("Must be a valid URL"),
})

export type AchievementFormValues = z.infer<typeof achievementSchema>

interface AchievementResource {
  id: string;
  achievement_id: string;
  resource_url: string;
}

interface Achievement {
  id: string;
  title: string;
  description: string;
  source_logo_url: string;
  redirect_url: string;
  resources: AchievementResource[];
}

interface ApiResponse<T> {
  success: boolean;
  data: T;
}

export function useAchievementForm({
  editingAchievement,
  setFormOpen,
  fetchAchievements,
}: {
  editingAchievement: Achievement | null;
  setFormOpen: (open: boolean) => void;
  fetchAchievements: () => void;
}) {
  const { toast } = useToast()
  const [uploading, setUploading] = useState(false)
  const [submitting, setSubmitting] = useState(false)

  const form = useForm<AchievementFormValues>({
    resolver: zodResolver(achievementSchema),
    defaultValues: {
      title: "",
      description: "",
      sourceLogoUrl: "",
      redirectUrl: "",
    },
  })

  // ponytail: sync form state with editing status
  useEffect(() => {
    if (editingAchievement) {
      form.reset({
        title: editingAchievement.title,
        description: editingAchievement.description,
        sourceLogoUrl: editingAchievement.source_logo_url,
        redirectUrl: editingAchievement.redirect_url,
      })
    } else {
      form.reset({
        title: "",
        description: "",
        sourceLogoUrl: "",
        redirectUrl: "",
      })
    }
  }, [editingAchievement, form])

  const handleFileUpload = (file: File) => {
    if (!file) return

    setUploading(true)
    Effect.runPromise(apiClient.uploadFile(file))
      .then((url) => {
        form.setValue("sourceLogoUrl", url, { shouldValidate: true })
        toast({ title: "Success", description: "Logo uploaded successfully", variant: "success" })
      })
      .catch((err) => {
        toast({ title: "Upload Failed", description: err.message || "Failed to upload logo", variant: "destructive" })
      })
      .finally(() => {
        setUploading(false)
      })
  }

  const onSubmit = (data: AchievementFormValues) => {
    setSubmitting(true)
    const payload = {
      title: data.title,
      description: data.description,
      source_logo_url: data.sourceLogoUrl,
      redirect_url: data.redirectUrl,
    }

    const task = editingAchievement
      ? apiClient.put<ApiResponse<Achievement>>(`/api/v1/achievements/${editingAchievement.id}`, payload)
      : apiClient.post<ApiResponse<Achievement>>("/api/v1/achievements", payload)

    Effect.runPromise(task)
      .then(() => {
        setFormOpen(false)
        fetchAchievements()
        toast({
          title: "Success",
          description: editingAchievement ? "Achievement updated successfully" : "Achievement created successfully",
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
