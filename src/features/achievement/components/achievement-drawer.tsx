import { Loader2 } from "lucide-react";
import { Button } from "@/shared/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetFooter,
} from "@/shared/ui/sheet";
import { useAchievementForm } from "@/features/achievement/hooks/use-achievement-form";
import { FormField, FormTextField, FormTextAreaField } from "@/shared/ui/form";
import { FileUploader } from "@/shared/ui/file-uploader";
import type { Achievement } from "@/entities/achievement/model/types";

interface AchievementDrawerProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  editingAchievement: Achievement | null;
  onSuccess: () => void;
}

export function AchievementDrawer({
  open,
  onOpenChange,
  editingAchievement,
  onSuccess,
}: AchievementDrawerProps) {
  const { form, uploading, submitting, handleFileUpload, onSubmit } = useAchievementForm({
    editingAchievement,
    setFormOpen: onOpenChange,
    fetchAchievements: onSuccess,
  });

  const sourceLogoUrl = form.watch("sourceLogoUrl");

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="sm:max-w-2xl">
        <SheetHeader>
          <SheetTitle>
            {editingAchievement ? "Edit Achievement" : "Create Achievement"}
          </SheetTitle>
        </SheetHeader>

        <div className="min-h-0 flex-1 overflow-y-auto px-6 py-6">
          <form id="achievement-form" onSubmit={onSubmit} className="space-y-4">
            <FormTextField
              name="title"
              label="Title"
              placeholder="AWS Solutions Architect"
              register={form.register}
              error={form.formState.errors.title}
              required
              className="space-y-1.5"
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
            />

            <FormTextField
              name="redirectUrl"
              label="Redirect URL"
              placeholder="verify.credentials.com"
              register={form.register}
              error={form.formState.errors.redirectUrl}
              required
              className="space-y-1.5"
            />

            <FormField label="Source Logo" htmlFor="sourceLogoUrl" className="space-y-1.5">
              <FileUploader
                onFileSelect={handleFileUpload}
                previewUrl={sourceLogoUrl}
                loading={uploading}
                onRemovePreview={() => form.setValue("sourceLogoUrl", "")}
                subLabel="PNG, JPG, or SVG (max. 5MB)"
              />
            </FormField>
          </form>
        </div>
        <SheetFooter className="flex flex-col!">
          <Button
            type="button"
            variant="outline"
            onClick={() => onOpenChange(false)}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            form="achievement-form"
            className="gap-1.5"
            disabled={submitting || uploading}
          >
            {submitting && <Loader2 size={12} className="animate-spin" />}
            Submit
          </Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}
