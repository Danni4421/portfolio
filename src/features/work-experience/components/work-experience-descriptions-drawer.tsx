// ponytail: separate work experience descriptions manager drawer component
import * as React from "react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Loader2, Trash2 } from "lucide-react";
import { Button } from "@/shared/ui/button";
import { FormTextField } from "@/shared/ui/form";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetFooter,
} from "@/shared/ui/sheet";
import { apiClient } from "@/shared/api/client";
import { Effect } from "effect";
import { useToast } from "@/shared/ui/toast";
import type { WorkExperience, WorkExperienceJobDesc } from "@/features/work-experience/types";

const descriptionSchema = z.object({
  description: z.string().min(1, "Job description is required"),
});

type DescriptionFormValues = z.infer<typeof descriptionSchema>;

interface WorkExperienceDescriptionsDrawerProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  experience: WorkExperience | null;
  setExperience: React.Dispatch<React.SetStateAction<WorkExperience | null>>;
  onSuccess: () => void;
}

export function WorkExperienceDescriptionsDrawer({
  open,
  onOpenChange,
  experience,
  setExperience,
  onSuccess,
}: WorkExperienceDescriptionsDrawerProps) {
  const { toast } = useToast();
  const [descLoading, setNewDescLoading] = useState(false);
  const form = useForm<DescriptionFormValues>({
    resolver: zodResolver(descriptionSchema),
    defaultValues: { description: "" },
  });

  if (!experience) return null;

  const handleAddDescBullet = form.handleSubmit((values) => {
    setNewDescLoading(true);
    Effect.runPromise(
      apiClient.post<{ success: boolean; data: WorkExperienceJobDesc }>("/api/v1/work-experience-job-descriptions", {
        work_experience_id: experience.id,
        description: values.description,
      })
    )
      .then((res) => {
        const updated = {
          ...experience,
          job_descriptions: [...(experience.job_descriptions || []), res.data],
        };
        setExperience(updated);
        form.reset({ description: "" });
        onSuccess();
        onOpenChange(false);
        toast({ title: "Success", description: "Job description added successfully", variant: "success" });
      })
      .catch((err) => {
        toast({ title: "Error", description: err.message || "Failed to add job description", variant: "destructive" });
      })
      .finally(() => {
        setNewDescLoading(false);
      });
  });

  const handleDeleteDescBullet = (descId: string) => {
    Effect.runPromise(apiClient.delete(`/api/v1/work-experience-job-descriptions/${descId}`, "?soft=false"))
      .then(() => {
        const updated = {
          ...experience,
          job_descriptions: (experience.job_descriptions || []).filter((j) => j.id !== descId),
        };
        setExperience(updated);
        onSuccess();
        toast({ title: "Deleted", description: "Job description deleted successfully", variant: "success" });
      })
      .catch((err) => {
        toast({ title: "Error", description: err.message || "Failed to delete job description", variant: "destructive" });
      });
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>Job Descriptions</SheetTitle>
          <p className="text-lg text-muted-foreground font-medium mt-0.5">
            {experience.title}
          </p>
        </SheetHeader>

        <form onSubmit={handleAddDescBullet} className="flex min-h-0 flex-1 flex-col">
          <div className="min-h-0 flex-1 space-y-4 overflow-y-auto px-6 py-6">
            <FormTextField
              name="description"
              label="Add Job Desc"
              placeholder="e.g. Led core product rebuild..."
              register={form.register}
              error={form.formState.errors.description}
              required
            />

            <div className="space-y-2 h-auto overflow-y-auto pr-1 mt-5">
              {experience.job_descriptions?.map((j) => (
                <div
                  key={j.id}
                  className="flex items-center justify-between gap-3 p-2.5 bg-muted/50 border border-border rounded-lg text-xs leading-normal"
                >
                  <span className="flex-1 text-foreground">{j.description}</span>
                  <button
                    type="button"
                    onClick={() => handleDeleteDescBullet(j.id)}
                    className="text-destructive hover:text-destructive p-1 cursor-pointer flex-shrink-0 self-start"
                  >
                    <Trash2 size={12} />
                  </button>
                </div>
              ))}
              {(!experience.job_descriptions || experience.job_descriptions.length === 0) && (
                <p className="text-xs text-muted-foreground italic mt-2 text-center">
                  No job descriptions added yet.
                </p>
              )}
            </div>
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
              disabled={descLoading}
            >
              {descLoading && <Loader2 size={12} className="animate-spin" />}
              Add Job Desc
            </Button>
          </SheetFooter>
        </form>
      </SheetContent>
    </Sheet>
  );
}
