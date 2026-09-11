// ponytail: separate work experience descriptions manager dialog component
import * as React from "react";
import { useState } from "react";
import { Loader2, Trash2, BookOpen } from "lucide-react";
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
import type { WorkExperience, WorkExperienceJobDesc } from "@/features/work-experience/types";

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
  const [newDescBullet, setNewDescBullet] = useState("");
  const [descLoading, setNewDescLoading] = useState(false);

  if (!experience) return null;

  const handleAddDescBullet = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newDescBullet) return;

    setNewDescLoading(true);
    Effect.runPromise(
      apiClient.post<{ success: boolean; data: WorkExperienceJobDesc }>("/api/v1/work-experience-job-descriptions", {
        work_experience_id: experience.id,
        description: newDescBullet,
      })
    )
      .then((res) => {
        const updated = {
          ...experience,
          job_descriptions: [...(experience.job_descriptions || []), res.data],
        };
        setExperience(updated);
        setNewDescBullet("");
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
  };

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
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader className="border-b border-neutral-200 dark:border-neutral-800 pb-3">
          <DialogTitle className="font-sans text-lg font-bold text-neutral-955 dark:text-neutral-50 flex items-center gap-1.5">
            <BookOpen size={18} className="text-[#ec7211]" /> Job Descriptions
          </DialogTitle>
          <p className="text-xs text-[#ec7211] font-semibold mt-0.5">Role: {experience.title}</p>
        </DialogHeader>

        <form onSubmit={handleAddDescBullet}>
          <div className="space-y-4 p-6">
            <div className="space-y-2">
              <Label className="text-neutral-700 font-semibold text-xs uppercase tracking-wider block">Add Job Desc</Label>
              <Input
                type="text"
                placeholder="e.g. Led core product rebuild..."
                value={newDescBullet}
                onChange={(e) => setNewDescBullet(e.target.value)}
                className="bg-white border-neutral-300 focus:border-[#ec7211] text-neutral-900 rounded-lg text-sm w-full block h-9"
                required
              />
            </div>

            <div className="space-y-2">
              <Label className="text-neutral-700 font-semibold text-xs uppercase tracking-wider block">Existing Job Descs</Label>
              <div className="space-y-2 max-h-[220px] overflow-y-auto pr-1">
                {experience.job_descriptions?.map((j) => (
                  <div key={j.id} className="flex items-start justify-between gap-3 p-2.5 bg-neutral-50 border border-neutral-200 rounded-lg text-xs leading-normal">
                    <span className="flex-1 text-neutral-750 font-sans">{j.description}</span>
                    <button type="button" onClick={() => handleDeleteDescBullet(j.id)} className="text-red-550 hover:text-red-655 p-1 cursor-pointer flex-shrink-0">
                      <Trash2 size={12} />
                    </button>
                  </div>
                ))}
                {(!experience.job_descriptions || experience.job_descriptions.length === 0) && (
                  <p className="text-xs text-neutral-400 italic mt-2 text-center font-sans">No job descriptions added yet.</p>
                )}
              </div>
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
              disabled={descLoading}
            >
              {descLoading && <Loader2 size={12} className="animate-spin" />}
              Add Job Desc
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
