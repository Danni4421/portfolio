import { useState, useEffect } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { apiClient } from "@/shared/api/client"
import { Effect } from "effect"
import { useToast } from "@/shared/ui/toast"

export const projectSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().min(1, "Description is required"),
  thumbnail: z.any().refine((val) => {
    return typeof val === "string" ? val.length > 0 : val instanceof File;
  }, "Please upload a thumbnail image"),
})

export type ProjectFormValues = z.infer<typeof projectSchema>

interface TechStack {
  id: string;
  name: string;
  image_logo: string;
  redirect_url: string;
}

interface ProjectStory {
  id: string;
  project_id: string;
  content: string;
  author: string[];
}

interface ProjectImage {
  id: string;
  project_id: string;
  image_url: string;
}

interface ProjectResource {
  id: string;
  project_id: string;
  resource_url: string;
  type: string;
  title: string;
}

interface Project {
  id: string;
  title: string;
  description: string;
  thumbnail_url: string;
  stories: ProjectStory[];
  tech_stacks: TechStack[];
  images: ProjectImage[];
  resources: ProjectResource[];
}

interface ApiResponse<T> {
  success: boolean;
  data: T;
}

export function useProjectForm({
  editingProject,
  setFormOpen,
  fetchProjects,
}: {
  editingProject: Project | null;
  setFormOpen: (open: boolean) => void;
  fetchProjects: () => void;
}) {
  const { toast } = useToast()
  const [submitting, setSubmitting] = useState(false)
  const [previewUrl, setPreviewUrl] = useState("")

  const form = useForm<ProjectFormValues>({
    resolver: zodResolver(projectSchema),
    defaultValues: {
      title: "",
      description: "",
      thumbnail: "",
    },
  })

  // ponytail: sync form state with editing status and clean preview url
  useEffect(() => {
    if (editingProject) {
      form.reset({
        title: editingProject.title,
        description: editingProject.description,
        thumbnail: editingProject.thumbnail_url,
      })
      setPreviewUrl("")
    } else {
      form.reset({
        title: "",
        description: "",
        thumbnail: "",
      })
      setPreviewUrl("")
    }
  }, [editingProject, form])

  const handleFileUpload = (file: File) => {
    if (!file) return

    form.setValue("thumbnail", file, { shouldValidate: true })
    setPreviewUrl(URL.createObjectURL(file))
  }

  const onSubmit = (data: ProjectFormValues) => {
    setSubmitting(true)
    const formData = new FormData()
    formData.append("title", data.title)
    formData.append("description", data.description)

    if (data.thumbnail instanceof File) {
      formData.append("thumbnail_url", data.thumbnail)
    } else if (typeof data.thumbnail === "string") {
      formData.append("thumbnail_url", data.thumbnail)
    }

    const task = editingProject
      ? apiClient.put<ApiResponse<Project>>(`/api/v1/projects/${editingProject.id}`, formData)
      : apiClient.post<ApiResponse<Project>>("/api/v1/projects", formData)

    Effect.runPromise(task)
      .then(() => {
        setFormOpen(false)
        fetchProjects()
        toast({
          title: "Success",
          description: editingProject ? "Project updated successfully" : "Project created successfully",
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
    previewUrl,
    handleFileUpload,
    onSubmit: form.handleSubmit(onSubmit),
  }
}
