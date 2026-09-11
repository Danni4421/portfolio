import { useState, useEffect } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { apiClient } from "@/shared/api/client"
import { Effect } from "effect"

export const profileSchema = z.object({
  name: z.string().min(1, "Display Name is required"),
  bio: z.string().min(1, "Bio is required"),
  avatarUrl: z.string().nullable().optional(),
})

export type ProfileFormValues = z.infer<typeof profileSchema>

interface UserProfile {
  email: string;
  name: string;
  bio: string;
  avatar_url: string | null;
  role: string;
}

export function useProfileForm(profile: UserProfile | null, setProfile: (p: UserProfile) => void) {
  const [saving, setSaving] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [status, setStatus] = useState<{ type: "success" | "error"; msg: string } | null>(null)

  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      name: profile?.name || "",
      bio: profile?.bio || "",
      avatarUrl: profile?.avatar_url || "",
    },
  })

  // ponytail: sync form state with profile prop when loaded or updated
  useEffect(() => {
    if (profile) {
      form.reset({
        name: profile.name,
        bio: profile.bio,
        avatarUrl: profile.avatar_url || "",
      })
    }
  }, [profile, form])

  const handleAvatarUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setUploading(true)
    setStatus(null)

    Effect.runPromise(apiClient.uploadFile(file))
      .then((url) => {
        form.setValue("avatarUrl", url)
        setStatus({ type: "success", msg: "Avatar uploaded successfully" })
      })
      .catch((err) => {
        setStatus({ type: "error", msg: err.message || "Failed to upload avatar" })
      })
      .finally(() => {
        setUploading(false)
      })
  }

  const onSubmit = (data: ProfileFormValues) => {
    setSaving(true)
    setStatus(null)

    Effect.runPromise(
      apiClient.put<{ success: boolean; data: UserProfile }>("/api/v1/user/profile", {
        name: data.name,
        bio: data.bio,
        avatar_url: data.avatarUrl || null,
      })
    )
      .then((res) => {
        setProfile(res.data)
        setStatus({ type: "success", msg: "Profile updated successfully!" })
      })
      .catch((err) => {
        setStatus({ type: "error", msg: err.message || "Failed to update profile" })
      })
      .finally(() => {
        setSaving(false)
      })
  }

  return {
    form,
    saving,
    uploading,
    status,
    setStatus,
    handleAvatarUpload,
    onSubmit: form.handleSubmit(onSubmit),
  }
}
