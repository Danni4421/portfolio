// ponytail: separate tech stack edit/create sheet component

import { Loader2 } from "lucide-react";
import { Button } from "@/shared/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetFooter,
} from "@/shared/ui/sheet";
import { useTechStackForm } from "@/features/tech-stack/hooks/use-tech-stack-form";
import { FormField, FormTextField } from "@/shared/ui/form";
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
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>
            {editingStack ? "Edit Tech Stack" : "Create Tech Stack"}
          </SheetTitle>
        </SheetHeader>

        <form onSubmit={onSubmit} className="flex min-h-0 flex-1 flex-col">
          <div className="min-h-0 flex-1 space-y-4 overflow-y-auto px-6 py-6">
            <FormTextField
              name="name"
              label="Stack Name"
              placeholder="e.g. React"
              register={form.register}
              error={form.formState.errors.name}
              required
              className="space-y-1.5"
            />

            <FormTextField
              name="redirectUrl"
              label="Redirect URL"
              placeholder="e.g. react.dev"
              register={form.register}
              error={form.formState.errors.redirectUrl}
              required
              className="space-y-1.5"
            />

            <FormTextField
              name="imageLogo"
              label="Logo Image URL"
              placeholder="e.g. /api/v1/storage/raw/uuid or https://example.com/logo.svg"
              register={form.register}
              error={form.formState.errors.imageLogo}
              required
              className="space-y-1.5"
            />
            <FormField label="OR UPLOAD FILE" htmlFor="imageLogo" className="mt-2">
              <FileUploader
                onFileSelect={handleFileUpload}
                previewUrl={imageLogo}
                loading={uploading}
                onRemovePreview={() => form.setValue("imageLogo", "")}
                subLabel="Upload logo to auto-populate URL (PNG, JPG, SVG)"
              />
            </FormField>
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
              className="gap-1.5"
              disabled={submitting || uploading}
            >
              {submitting && <Loader2 size={12} className="animate-spin" />}
              Submit
            </Button>
          </SheetFooter>
        </form>
      </SheetContent>
    </Sheet>
  );
}
