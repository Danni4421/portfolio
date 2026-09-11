// ponytail: separate tech stack edit/create dialog component

import { Loader2 } from "lucide-react";
import { Button } from "@/shared/ui/button";
import { Label } from "@/shared/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/shared/ui/dialog";
import { useTechStackForm } from "@/features/tech-stack/hooks/use-tech-stack-form";
import { FormTextField } from "@/shared/ui/form";
import { FileUploader } from "@/shared/ui/file-uploader";

interface TechStack {
  id: string;
  name: string;
  image_logo: string;
  redirect_url: string;
  sort_order?: number;
}

interface TechStackDrawerProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  editingStack: TechStack | null;
  stacksCount: number;
  onSuccess: () => void;
}

export function TechStackDrawer({
  open,
  onOpenChange,
  editingStack,
  stacksCount,
  onSuccess,
}: TechStackDrawerProps) {
  const { form, uploading, submitting, handleFileUpload, onSubmit } = useTechStackForm({
    editingStack,
    setFormOpen: onOpenChange,
    fetchStacks: onSuccess,
    stacksCount,
  });

  const imageLogo = form.watch("imageLogo");

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader className="border-b border-neutral-200 dark:border-neutral-800 pb-3">
          <DialogTitle className="font-sans text-lg font-bold text-neutral-950 dark:text-neutral-50">
            {editingStack ? "Edit Tech Stack" : "Create Tech Stack"}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={onSubmit}>
          <div className="space-y-4 p-6">
            <FormTextField
              name="name"
              label="Stack Name"
              placeholder="e.g. React"
              register={form.register}
              error={form.formState.errors.name}
              required
              className="space-y-1.5"
              inputClassName="bg-white border-neutral-300 focus:border-[#ec7211] focus:ring-1 focus:ring-[#ec7211] text-neutral-900 rounded-lg text-sm"
            />

            <FormTextField
              name="redirectUrl"
              label="Redirect URL"
              placeholder="e.g. react.dev"
              register={form.register}
              error={form.formState.errors.redirectUrl}
              required
              className="space-y-1.5"
              inputClassName="bg-white border-neutral-300 focus:border-[#ec7211] focus:ring-1 focus:ring-[#ec7211] text-neutral-900 rounded-lg text-sm"
            />

            <FormTextField
              name="imageLogo"
              label="Logo Image URL"
              placeholder="e.g. /api/v1/storage/raw/uuid or https://example.com/logo.svg"
              register={form.register}
              error={form.formState.errors.imageLogo}
              required
              className="space-y-1.5"
              inputClassName="bg-white border-neutral-300 focus:border-[#ec7211] focus:ring-1 focus:ring-[#ec7211] text-neutral-900 rounded-lg text-sm"
            />
            <div className="mt-2">
              <Label className="text-neutral-700 font-semibold text-xs uppercase tracking-wider mb-1.5 block">OR UPLOAD FILE</Label>
              <FileUploader
                onFileSelect={handleFileUpload}
                previewUrl={imageLogo}
                loading={uploading}
                onRemovePreview={() => form.setValue("imageLogo", "")}
                subLabel="Upload logo to auto-populate URL (PNG, JPG, SVG)"
              />
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
              className="bg-[#ec7211] hover:bg-[#d65f0e] text-white font-bold rounded-lg cursor-pointer flex items-center gap-1.5"
              disabled={submitting || uploading}
            >
              {submitting && <Loader2 size={12} className="animate-spin" />}
              Submit
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
