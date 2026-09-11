// ponytail: separate work experience edit/create dialog component
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
import type { WorkExperience } from "@/features/work-experience/types";
import { useWorkExperienceForm } from "@/features/work-experience/hooks/use-work-experience-form";
import { FormTextField, FormTextAreaField } from "@/shared/ui/form";
import { FileUploader } from "@/shared/ui/file-uploader";

interface WorkExperienceDrawerProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  editingExperience: WorkExperience | null;
  onSuccess: () => void;
}

export function WorkExperienceDrawer({
  open,
  onOpenChange,
  editingExperience,
  onSuccess,
}: WorkExperienceDrawerProps) {
  const { form, submitting, handleFileUpload, onSubmit } = useWorkExperienceForm({
    editingExperience,
    setFormOpen: onOpenChange,
    fetchExperiences: onSuccess,
  });

  const companyUrl = form.watch("companyUrl");
  const previewUrl = companyUrl instanceof File ? URL.createObjectURL(companyUrl) : (companyUrl || null);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md w-[calc(100%-2rem)] max-h-[90vh] overflow-y-auto p-4 sm:p-6 rounded-2xl">
        <DialogHeader className="border-b border-neutral-200 dark:border-neutral-800 pb-3">
          <DialogTitle className="font-sans text-lg font-bold text-neutral-955 dark:text-neutral-50">
            {editingExperience ? "Edit Work Experience" : "Add Work Experience"}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={onSubmit}>
          <div className="space-y-4 py-4 sm:p-6">
            <FormTextField
              name="title"
              label="Job Role / Title"
              placeholder="e.g. Senior Software Engineer"
              register={form.register}
              error={form.formState.errors.title}
              required
              className="space-y-1.5"
              inputClassName="bg-white border-neutral-300 focus:border-[#ec7211] focus:ring-1 focus:ring-[#ec7211] text-neutral-900 rounded-lg text-sm"
            />

            <FormTextAreaField
              name="description"
              label="Job Summary"
              rows={3}
              placeholder="e.g. Led development of central design system..."
              register={form.register}
              error={form.formState.errors.description}
              required
              className="space-y-1.5"
              inputClassName="bg-white border-neutral-300 focus:border-[#ec7211] focus:ring-1 focus:ring-[#ec7211] text-neutral-900 rounded-lg text-sm"
            />

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <FormTextField
                name="startDate"
                label="Start Date"
                type="date"
                register={form.register}
                error={form.formState.errors.startDate}
                required
                className="space-y-1.5"
                inputClassName="bg-white border-neutral-300 focus:border-[#ec7211] focus:ring-1 focus:ring-[#ec7211] text-neutral-900 rounded-lg text-sm w-full block"
              />

              <FormTextField
                name="endDate"
                label="End Date"
                type="date"
                register={form.register}
                error={form.formState.errors.endDate}
                className="space-y-1.5"
                inputClassName="bg-white border-neutral-300 focus:border-[#ec7211] focus:ring-1 focus:ring-[#ec7211] text-neutral-900 rounded-lg text-sm w-full block"
              />
            </div>

            <div className="space-y-1.5">
              <Label className="text-neutral-700 font-semibold text-xs uppercase tracking-wider">Company Logo / URL</Label>
              <FileUploader
                onFileSelect={handleFileUpload}
                previewUrl={previewUrl}
                loading={submitting}
                onRemovePreview={() => form.setValue("companyUrl", "")}
                subLabel="PNG, JPG, or SVG (max. 5MB)"
              />
            </div>
          </div>

          <DialogFooter className="flex-row justify-end gap-2 pt-2">
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

