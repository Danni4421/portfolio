import { useState, useEffect } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { apiClient } from "@/shared/api/client"
import { Effect } from "effect"
import { useToast } from "@/shared/ui/toast"

export const articleSchema = z.object({
  title: z.string().min(1, "Title is required"),
  content: z.string().min(1, "Content is required"),
  authorInput: z.string().min(1, "Authors list is required"),
  thumbnailUrl: z.string().min(1, "Thumbnail is required"),
})

export type ArticleFormValues = z.infer<typeof articleSchema>

interface Article {
  id: string;
  title: string;
  content: string;
  thumbnail_url: string;
  author: string[];
}

interface ApiResponse<T> {
  success: boolean;
  data: T;
}

export function useArticleForm({
  editingArticle,
  setFormOpen,
  fetchArticles,
}: {
  editingArticle: Article | null;
  setFormOpen: (open: boolean) => void;
  fetchArticles: () => void;
}) {
  const { toast } = useToast()
  const [uploading, setUploading] = useState(false)
  const [submitting, setSubmitting] = useState(false)

  const form = useForm<ArticleFormValues>({
    resolver: zodResolver(articleSchema),
    defaultValues: {
      title: "",
      content: "",
      authorInput: "Aji",
      thumbnailUrl: "",
    },
  })

  // ponytail: sync form state with editing status
  useEffect(() => {
    if (editingArticle) {
      form.reset({
        title: editingArticle.title,
        content: editingArticle.content,
        authorInput: editingArticle.author.join(", "),
        thumbnailUrl: editingArticle.thumbnail_url,
      })
    } else {
      form.reset({
        title: "",
        content: "",
        authorInput: "Aji",
        thumbnailUrl: "",
      })
    }
  }, [editingArticle, form])

  const handleFileUpload = (file: File) => {
    if (!file) return

    setUploading(true)
    Effect.runPromise(apiClient.uploadFile(file))
      .then((url) => {
        form.setValue("thumbnailUrl", url, { shouldValidate: true })
        toast({ title: "Success", description: "Thumbnail uploaded successfully", variant: "success" })
      })
      .catch((err) => {
        toast({ title: "Upload Failed", description: err.message || "Failed to upload thumbnail", variant: "destructive" })
      })
      .finally(() => {
        setUploading(false)
      })
  }

  const onSubmit = (data: ArticleFormValues) => {
    setSubmitting(true)
    const authors = data.authorInput
      .split(",")
      .map((a) => a.trim())
      .filter((a) => a.length > 0)

    const payload = {
      title: data.title,
      content: data.content,
      thumbnail_url: data.thumbnailUrl,
      author: authors,
    }

    const task = editingArticle
      ? apiClient.put<ApiResponse<Article>>(`/api/v1/articles/${editingArticle.id}`, payload)
      : apiClient.post<ApiResponse<Article>>("/api/v1/articles", payload)

    Effect.runPromise(task)
      .then(() => {
        setFormOpen(false)
        fetchArticles()
        toast({
          title: "Success",
          description: editingArticle ? "Article updated successfully" : "Article created successfully",
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
