import { useOutletContext } from "react-router-dom";
import { Upload, Loader2, CheckCircle } from "lucide-react";
import { Button } from "@/shared/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/shared/ui/card";
import { useProfileForm } from "@/features/profile/hooks/use-profile-form";
import { FormTextField, FormTextAreaField } from "@/shared/ui/form";

interface UserProfile {
  email: string;
  name: string;
  bio: string;
  avatar_url: string | null;
  role: string;
}

interface OutletContextType {
  profile: UserProfile | null;
  setProfile: (p: UserProfile) => void;
}

export function AdminProfilePage() {
  const { profile, setProfile } = useOutletContext<OutletContextType>();
  const { form, saving, uploading, status, handleAvatarUpload, onSubmit } =
    useProfileForm(profile, setProfile);

  const avatarUrl = form.watch("avatarUrl");

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h2 className="text-lg font-semibold tracking-tight">
          Admin Profile Settings
        </h2>
        <p className="text-sm text-muted-foreground">
          Manage public administrator identity details
        </p>
      </div>

      {status && (
        <div className="p-4 bg-emerald-500/10 border border-emerald-500/20 text-emerald-700 text-sm rounded-lg flex items-center gap-2 font-medium animate-in fade-in duration-200">
          <CheckCircle size={16} /> Profile settings updated successfully
        </div>
      )}

      <form onSubmit={onSubmit} className="max-w-2xl">
        <Card>
          <CardContent className="space-y-6">
            <div className="flex flex-col sm:flex-row items-center gap-6 pb-6 border-b border-border">
              <div className="relative w-24 h-24 rounded-lg border border-border overflow-hidden bg-muted flex items-center justify-center shrink-0">
                {avatarUrl ? (
                  <img
                    src={avatarUrl}
                    alt="Avatar"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <span className="text-2xl font-bold text-muted-foreground">
                    AJ
                  </span>
                )}
                {uploading && (
                  <div className="absolute inset-0 bg-background/60 rounded-lg flex items-center justify-center">
                    <Loader2 className="h-6 w-6 animate-spin text-foreground" />
                  </div>
                )}
              </div>
              <div className="flex flex-col gap-2 text-center sm:text-left">
                <span className="text-sm font-medium text-foreground">
                  Profile photo
                </span>
                <label className="inline-flex">
                  <Button
                    variant="outline"
                    size="sm"
                    asChild
                    className="cursor-pointer gap-2"
                  >
                    <Upload size={14} />
                    Choose File
                    <input
                      type="file"
                      onChange={handleAvatarUpload}
                      accept="image/*"
                      className="hidden"
                    />
                  </Button>
                </label>
              </div>
            </div>

            <div className="space-y-4">
              <FormTextField
                name="name"
                label="Display Name"
                register={form.register}
                error={form.formState.errors.name}
                required
                className="space-y-1.5"
              />

              <FormTextAreaField
                name="bio"
                label="Bio"
                rows={4}
                register={form.register}
                error={form.formState.errors.bio}
                required
                className="space-y-1.5"
              />
            </div>

            <Button
              type="submit"
              variant="default"
              className="gap-2"
              disabled={saving || uploading}
            >
              {saving && <Loader2 className="h-4 w-4 animate-spin" />}
              Save Changes
            </Button>
          </CardContent>
        </Card>
      </form>
    </div>
  );
}
