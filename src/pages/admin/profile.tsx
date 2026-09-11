import { useOutletContext } from "react-router-dom";
import {
  Upload,
  Loader2,
  CheckCircle
} from "lucide-react";
import { Button } from "@/shared/ui/button";
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
  const { form, saving, uploading, status, handleAvatarUpload, onSubmit } = useProfileForm(profile, setProfile);

  const avatarUrl = form.watch("avatarUrl");

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg tracking-[-0.64px] text-[#111111] font-medium">Admin Profile Settings</h2>
        <p className="text-gray-500 text-sm mt-1">Manage public administrator identity details</p>
      </div>

      {status && (
        <div className="p-4 bg-green-50 border border-green-200 text-green-700 text-sm rounded-lg flex items-center gap-2 font-medium animate-in fade-in duration-200">
          <CheckCircle size={16} /> Profile settings updated successfully
        </div>
      )}

      <form onSubmit={onSubmit} className="max-w-2xl bg-white border border-gray-200 rounded-lg p-6 space-y-6">
        <div className="flex flex-col sm:flex-row items-center gap-6 pb-6 border-b border-gray-200">
          <div className="relative w-24 h-24 rounded-lg border border-gray-200 overflow-hidden bg-gray-50 flex items-center justify-center">
            {avatarUrl ? (
              <img src={avatarUrl} alt="Avatar" className="w-full h-full object-cover" />
            ) : (
              <span className="text-2xl font-bold text-gray-400">AJ</span>
            )}
            {uploading && (
              <div className="absolute inset-0 bg-white/60 rounded-lg flex items-center justify-center">
                <Loader2 className="h-6 w-6 animate-spin text-[#ff5c06]" />
              </div>
            )}
          </div>
          <div className="flex flex-col gap-2 text-center sm:text-left">
            <span className="text-sm font-semibold text-[#111111]">Administrator Avatar</span>
            <label className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 text-xs font-bold rounded-lg border border-gray-300 cursor-pointer flex items-center gap-2 transition-all">
              <Upload size={14} />
              CHOOSE FILE
              <input type="file" onChange={handleAvatarUpload} accept="image/*" className="hidden" />
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
            inputClassName="bg-white border-gray-300 focus:border-[#ff5c06] focus:ring-1 focus:ring-[#ff5c06] text-[#111111] rounded-lg text-sm h-10"
          />

          <FormTextAreaField
            name="bio"
            label="Bio"
            rows={4}
            register={form.register}
            error={form.formState.errors.bio}
            required
            className="space-y-1.5"
            inputClassName="bg-white border-gray-300 focus:border-[#ff5c06] focus:ring-1 focus:ring-[#ff5c06] text-[#111111] rounded-lg text-sm leading-relaxed"
          />
        </div>

        <Button
          type="submit"
          variant="default"
          className="bg-[#ff5c06] hover:opacity-90 text-white font-semibold rounded-2xl shadow-[0_6px_10px_rgba(255,255,255,0.5)_inset,-10px_40px_41px_-4px_rgba(0,0,0,0.01)] w-full sm:w-auto px-8 cursor-pointer flex items-center gap-2 will-change-transform transition-opacity"
          disabled={saving || uploading}
        >
          {saving && <Loader2 className="h-4 w-4 animate-spin" />}
          Save Changes
        </Button>
      </form>
    </div>
  );
}

