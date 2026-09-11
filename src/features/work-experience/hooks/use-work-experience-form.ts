import { useState, useEffect } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { apiClient } from "@/shared/api/client"
import { Effect } from "effect"
import type { WorkExperience } from "../types"
import { useToast } from "@/shared/ui/toast"

export const workExperienceSchema = z.object({
  title: z.string().min(1, "Job Role / Title is required"),
  description: z.string().min(1, "Summary Description is required"),
  companyUrl: z.any().refine((val) => val, "Company logo is required"),
  redirectUrl: z.string().optional().or(z.literal("")),
  startDate: z.string().min(1, "Start Date is required"),
  endDate: z.string().optional().or(z.literal("")),
})

export type WorkExperienceFormValues = z.infer<typeof workExperienceSchema>

interface ApiResponse<T> {
  success: boolean;
  data: T;
}

export function useWorkExperienceForm({
  editingExperience,
  setFormOpen,
  fetchExperiences,
}: {
  editingExperience: WorkExperience | null;
  setFormOpen: (open: boolean) => void;
  fetchExperiences: () => void;
}) {
  const { toast } = useToast()
  const [submitting, setSubmitting] = useState(false)

  const form = useForm<WorkExperienceFormValues>({
    resolver: zodResolver(workExperienceSchema),
    defaultValues: {
      title: "",
      description: "",
      companyUrl: "",
      redirectUrl: "",
      startDate: "",
      endDate: "",
    },
  })

  // ponytail: sync form state with editing status
  useEffect(() => {
    if (editingExperience) {
      form.reset({
        title: editingExperience.title,
        description: editingExperience.description,
        companyUrl: editingExperience.company_url,
        redirectUrl: editingExperience.redirect_url || "",
        startDate: editingExperience.start_date ? editingExperience.start_date.split("T")[0] : "",
        endDate: editingExperience.end_date ? editingExperience.end_date.split("T")[0] : "",
      })
    } else {
      form.reset({
        title: "",
        description: "",
        companyUrl: "",
        redirectUrl: "",
        startDate: "",
        endDate: "",
      })
    }
  }, [editingExperience, form])

  const handleFileUpload = (file: File) => {
    if (!file) return
    form.setValue("companyUrl", file, { shouldValidate: true })
  }

  const onSubmit = (data: WorkExperienceFormValues) => {
    setSubmitting(true)
    const formData = new FormData()
    formData.append("title", data.title)
    formData.append("description", data.description)
    if (data.redirectUrl) {
      formData.append("redirect_url", data.redirectUrl)
    }
    formData.append("start_date", data.startDate ? new Date(data.startDate).toISOString() : "")
    if (data.endDate) {
      formData.append("end_date", new Date(data.endDate).toISOString())
    }

    if (data.companyUrl instanceof File) {
      formData.append("company_url", data.companyUrl)
    } else if (typeof data.companyUrl === "string") {
      formData.append("company_url", data.companyUrl)
    }

    const task = editingExperience
      ? apiClient.put<ApiResponse<WorkExperience>>(`/api/v1/work-experiences/${editingExperience.id}`, formData)
      : apiClient.post<ApiResponse<WorkExperience>>("/api/v1/work-experiences", formData)

    Effect.runPromise(task)
      .then(() => {
        setFormOpen(false)
        fetchExperiences()
        toast({
          title: "Success",
          description: editingExperience ? "Work experience updated successfully" : "Work experience created successfully",
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
    submitting,
    handleFileUpload,
    onSubmit: form.handleSubmit(onSubmit),
  }
}
