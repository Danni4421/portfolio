import { Loader2 } from "lucide-react";
import { Button } from "@/shared/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetFooter,
} from "@/shared/ui/sheet";
import { useProjectForm } from "@/features/project/hooks/use-project-form";
import { FormField, FormTextField, FormTextAreaField } from "@/shared/ui/form";
import { FileUploader } from "@/shared/ui/file-uploader";
import type { Project } from "@/entities/project/model/types";

interface ProjectDrawerProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  editingProject: Project | null;
  onSuccess: () => void;
}

export function ProjectDrawer({
  open,
  onOpenChange,
  editingProject,
  onSuccess,
}: ProjectDrawerProps) {
  const { form, submitting, previewUrl, handleFileUpload, onSubmit } = useProjectForm({
    editingProject,
    setFormOpen: onOpenChange,
    fetchProjects: onSuccess,
  });

  const thumbnail = form.watch("thumbnail");

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>
            {editingProject ? "Edit Project" : "Create Project"}
          </SheetTitle>
        </SheetHeader>

        <form onSubmit={onSubmit} className="flex min-h-0 flex-1 flex-col">
          <div className="min-h-0 flex-1 space-y-4 overflow-y-auto px-6 py-6">
            <FormTextField
              name="title"
              label="Title"
              placeholder="e.g. Portfolio Website"
              register={form.register}
              error={form.formState.errors.title}
              required
              className="space-y-1.5"
            />

            <FormTextAreaField
              name="description"
              label="Description"
              rows={3}
              placeholder="e.g. Premium web engineering..."
              register={form.register}
              error={form.formState.errors.description}
              required
              className="space-y-1.5"
            />

            <FormField label="Thumbnail Image" htmlFor="thumbnail" className="space-y-1.5">
              <FileUploader
                onFileSelect={handleFileUpload}
                previewUrl={previewUrl || (typeof thumbnail === "string" ? thumbnail : null)}
                loading={submitting}
                onRemovePreview={() => form.setValue("thumbnail", null)}
                subLabel="PNG, JPG, or SVG (max. 5MB)"
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
              disabled={submitting}
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
