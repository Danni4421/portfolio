// ponytail: separate project edit/create dialog component
import * as React from "react";
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
import { useProjectForm } from "@/features/project/hooks/use-project-form";
import { FormTextField, FormTextAreaField } from "@/shared/ui/form";
import { FileUploader } from "@/shared/ui/file-uploader";

interface Project {
  id: string;
  title: string;
  description: string;
  thumbnail_url: string;
}

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
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader className="border-b border-neutral-200 dark:border-neutral-800 pb-3">
          <DialogTitle className="font-sans text-lg font-bold text-neutral-955 dark:text-neutral-50">
            {editingProject ? "Edit Project" : "Create Project"}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={onSubmit}>
          <div className="space-y-4 p-6">
            <FormTextField
              name="title"
              label="Title"
              placeholder="e.g. Portfolio Website"
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
              placeholder="e.g. Premium web engineering..."
              register={form.register}
              error={form.formState.errors.description}
              required
              className="space-y-1.5"
              inputClassName="bg-white border-neutral-300 focus:border-[#ec7211] focus:ring-1 focus:ring-[#ec7211] text-neutral-900 rounded-lg text-sm"
            />

            <div className="space-y-1.5">
              <Label className="text-neutral-700 font-semibold text-xs uppercase tracking-wider">Thumbnail Image</Label>
              <FileUploader
                onFileSelect={handleFileUpload}
                previewUrl={previewUrl || (typeof thumbnail === "string" ? thumbnail : null)}
                loading={submitting}
                onRemovePreview={() => form.setValue("thumbnail", null)}
                subLabel="PNG, JPG, or SVG (max. 5MB)"
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
              disabled={submitting}
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
