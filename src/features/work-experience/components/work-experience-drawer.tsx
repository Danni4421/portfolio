// ponytail: separate work experience edit/create sheet component
import { Loader2 } from "lucide-react";
import { Button } from "@/shared/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetFooter,
} from "@/shared/ui/sheet";
import type { WorkExperience } from "@/features/work-experience/types";
import { useWorkExperienceForm } from "@/features/work-experience/hooks/use-work-experience-form";
import { FormField, FormTextField, FormTextAreaField } from "@/shared/ui/form";
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
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>
            {editingExperience ? "Edit Work Experience" : "Add Work Experience"}
          </SheetTitle>
        </SheetHeader>

        <form onSubmit={onSubmit} className="flex min-h-0 flex-1 flex-col">
          <div className="min-h-0 flex-1 space-y-4 overflow-y-auto px-6 py-6">
            <FormTextField
              name="title"
              label="Job Role / Title"
              placeholder="e.g. Senior Software Engineer"
              register={form.register}
              error={form.formState.errors.title}
              required
              className="space-y-1.5"
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
              />

              <FormTextField
                name="endDate"
                label="End Date"
                type="date"
                register={form.register}
                error={form.formState.errors.endDate}
                className="space-y-1.5"
              />
            </div>

            <FormField label="Company Logo / URL" htmlFor="companyUrl" className="space-y-1.5">
              <FileUploader
                onFileSelect={handleFileUpload}
                previewUrl={previewUrl}
                loading={submitting}
                onRemovePreview={() => form.setValue("companyUrl", "")}
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
