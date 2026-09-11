// ponytail: separate achievement edit/create dialog component
import * as React from "react";
import { useState } from "react";
import { Loader2, Plus, Trash2 } from "lucide-react";
import { Button } from "@/shared/ui/button";
import { Input } from "@/shared/ui/input";
import { Label } from "@/shared/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/shared/ui/dialog";
import { apiClient } from "@/shared/api/client";
import { Effect } from "effect";
import { useToast } from "@/shared/ui/toast";
import { useAchievementForm } from "@/features/achievement/hooks/use-achievement-form";
import { FormTextField, FormTextAreaField } from "@/shared/ui/form";
import { FileUploader } from "@/shared/ui/file-uploader";

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

interface AchievementDrawerProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  editingAchievement: Achievement | null;
  setEditingAchievement: React.Dispatch<React.SetStateAction<Achievement | null>>;
  onSuccess: () => void;
}

export function AchievementDrawer({
  open,
  onOpenChange,
  editingAchievement,
  setEditingAchievement,
  onSuccess,
}: AchievementDrawerProps) {
  const { toast } = useToast();
  const [newResourceUrl, setNewResourceUrl] = useState("");
  const [resourceLoading, setResourceLoading] = useState(false);

  const { form, uploading, submitting, handleFileUpload, onSubmit } = useAchievementForm({
    editingAchievement,
    setFormOpen: onOpenChange,
    fetchAchievements: onSuccess,
  });

  const sourceLogoUrl = form.watch("sourceLogoUrl");

  const handleAddResource = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingAchievement || !newResourceUrl) return;

    setResourceLoading(true);
    Effect.runPromise(
      apiClient.post<{ success: boolean; data: AchievementResource }>("/api/v1/achievement-resources", {
        achievement_id: editingAchievement.id,
        resource_url: newResourceUrl,
      })
    )
      .then((res) => {
        const updated = {
          ...editingAchievement,
          resources: [...(editingAchievement.resources || []), res.data],
        };
        setEditingAchievement(updated);
        setNewResourceUrl("");
        onSuccess();
        toast({ title: "Success", description: "Resource link added successfully", variant: "success" });
      })
      .catch((err) => {
        toast({ title: "Error", description: err.message || "Failed to add resource link", variant: "destructive" });
      })
      .finally(() => {
        setResourceLoading(false);
      });
  };

  const handleDeleteResource = (resId: string) => {
    if (!editingAchievement) return;

    Effect.runPromise(apiClient.delete(`/api/v1/achievement-resources/${resId}`, "?soft=false"))
      .then(() => {
        const updated = {
          ...editingAchievement,
          resources: (editingAchievement.resources || []).filter((r) => r.id !== resId),
        };
        setEditingAchievement(updated);
        onSuccess();
        toast({ title: "Deleted", description: "Resource link deleted successfully", variant: "success" });
      })
      .catch((err) => {
        toast({ title: "Error", description: err.message || "Failed to delete resource", variant: "destructive" });
      });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader className="border-b border-neutral-200 dark:border-neutral-800 pb-3">
          <DialogTitle className="font-sans text-lg font-bold text-neutral-955 dark:text-neutral-50">
            {editingAchievement ? "Edit Achievement" : "Create Achievement"}
          </DialogTitle>
        </DialogHeader>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-6">
          <form id="achievement-form" onSubmit={onSubmit} className="space-y-4">
            <FormTextField
              name="title"
              label="Title"
              placeholder="AWS Solutions Architect"
              register={form.register}
              error={form.formState.errors.title}
              required
              className="space-y-1.5"
              inputClassName="bg-white border-neutral-300 focus:border-[#ec7211] focus:ring-1 focus:ring-[#ec7211] text-neutral-900 rounded-lg text-sm"
            />

            <FormTextAreaField
              name="description"
              label="Description"
              rows={3}
              placeholder="Credential details..."
              register={form.register}
              error={form.formState.errors.description}
              required
              className="space-y-1.5"
              inputClassName="bg-white border-neutral-300 focus:border-[#ec7211] focus:ring-1 focus:ring-[#ec7211] text-neutral-900 rounded-lg text-sm"
            />

            <FormTextField
              name="redirectUrl"
              label="Redirect URL"
              placeholder="verify.credentials.com"
              register={form.register}
              error={form.formState.errors.redirectUrl}
              required
              className="space-y-1.5"
              inputClassName="bg-white border-neutral-300 focus:border-[#ec7211] focus:ring-1 focus:ring-[#ec7211] text-neutral-900 rounded-lg text-sm"
            />

            <div className="space-y-1.5">
              <Label className="text-neutral-700 font-semibold text-xs uppercase tracking-wider">Source Logo</Label>
              <FileUploader
                onFileSelect={handleFileUpload}
                previewUrl={sourceLogoUrl}
                loading={uploading}
                onRemovePreview={() => form.setValue("sourceLogoUrl", "")}
                subLabel="PNG, JPG, or SVG (max. 5MB)"
              />
            </div>
          </form>

          <div className="border-l border-neutral-200 pl-6 space-y-4">
            <h4 className="font-sans text-xs font-bold text-neutral-700 uppercase tracking-wider">Verification Resources</h4>
            {editingAchievement ? (
              <>
                <form onSubmit={handleAddResource} className="flex gap-2">
                  <Input
                    type="text"
                    placeholder="Link/PDF URL"
                    value={newResourceUrl}
                    onChange={(e) => setNewResourceUrl(e.target.value)}
                    className="bg-white border-neutral-300 focus:border-[#ec7211] text-neutral-900 rounded-lg text-xs h-9 flex-1"
                    required
                  />
                  <button
                    type="submit"
                    className="p-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg cursor-pointer transition-all flex items-center justify-center"
                    disabled={resourceLoading}
                  >
                    {resourceLoading ? <Loader2 size={14} className="animate-spin" /> : <Plus size={14} />}
                  </button>
                </form>

                <div className="space-y-2 max-h-[220px] overflow-y-auto pr-1">
                  {editingAchievement.resources?.map((r) => (
                    <div key={r.id} className="flex items-center justify-between gap-3 p-2 bg-neutral-50 border border-neutral-200 rounded-lg text-xs">
                      <span className="truncate flex-1 text-neutral-700 font-mono">{r.resource_url}</span>
                      <button type="button" onClick={() => handleDeleteResource(r.id)} className="text-red-550 hover:text-red-655 p-1 cursor-pointer flex-shrink-0 self-start">
                        <Trash2 size={12} />
                      </button>
                    </div>
                  ))}
                  {(!editingAchievement.resources || editingAchievement.resources.length === 0) && (
                    <p className="text-xs text-neutral-400 italic mt-2">No verification links added yet.</p>
                  )}
                </div>
              </>
            ) : (
              <p className="text-xs text-neutral-400 italic">Submit new achievement details first to configure verification links.</p>
            )}
          </div>
        </div>
        <DialogFooter>
          <Button
            type="button"
            onClick={() => onOpenChange(false)}
            className="bg-neutral-100 hover:bg-neutral-200 text-neutral-700! font-semibold rounded-lg border border-neutral-300 cursor-pointer"
          >
            Cancel
          </Button>
          <Button
            type="submit"
            form="achievement-form"
            className="bg-[#ec7211] hover:bg-[#d65f0e] text-white font-bold rounded-lg cursor-pointer flex items-center gap-1.5"
            disabled={submitting || uploading}
          >
            {submitting && <Loader2 size={12} className="animate-spin" />}
            Submit
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
