// ponytail: separate project tech stacks manager dialog component
import { useState, useEffect } from "react";
import { Loader2, Trash2, Layers } from "lucide-react";
import { Button } from "@/shared/ui/button";
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
import type { Project } from "@/entities/project/model/types";

interface TechStack {
  id: string;
  name: string;
  image_logo: string;
  redirect_url: string;
}

interface ProjectTechStacksDrawerProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  project: Project | null;
  setProject: React.Dispatch<React.SetStateAction<Project | null>>;
  allStacks: TechStack[];
  onSuccess: () => void;
}

export function ProjectTechStacksDrawer({
  open,
  onOpenChange,
  project,
  setProject,
  allStacks,
  onSuccess,
}: ProjectTechStacksDrawerProps) {
  const { toast } = useToast();
  const [selectedStackId, setSelectedStackId] = useState("");
  const [stackLoading, setStackLoading] = useState(false);

  useEffect(() => {
    if (allStacks.length > 0 && !selectedStackId) {
      setSelectedStackId(allStacks[0].id);
    }
  }, [allStacks]);

  if (!project) return null;

  const handleLinkStack = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedStackId) return;

    if (project.tech_stacks?.some((s) => s.id === selectedStackId)) {
      toast({ title: "Link Error", description: "Tech stack already linked to this project", variant: "destructive" });
      return;
    }

    setStackLoading(true);
    Effect.runPromise(
      apiClient.post<unknown>("/api/v1/project-tech-stacks", {
        project_id: project.id,
        tech_stack_id: selectedStackId,
      })
    )
      .then(() => {
        const linked = allStacks.find((s) => s.id === selectedStackId);
        if (linked) {
          const updated = {
            ...project,
            tech_stacks: [...(project.tech_stacks || []), linked],
          };
          setProject(updated as any);
        }
        onSuccess();
        onOpenChange(false);
        toast({ title: "Success", description: "Tech stack linked successfully", variant: "success" });
      })
      .catch((err) => {
        toast({ title: "Link Failed", description: err.message || "Failed to link tech stack", variant: "destructive" });
      })
      .finally(() => {
        setStackLoading(false);
      });
  };

  const handleUnlinkStack = (stackId: string) => {
    Effect.runPromise(apiClient.get<{ success: boolean; data: Record<string, unknown>[] }>("/api/v1/project-tech-stacks"))
      .then((res) => {
        const join = res.data.find(
          (j) => j.project_id === project.id && j.tech_stack_id === stackId
        );
        if (!join) {
          throw new Error("Link record not found on Hono backend");
        }
        return Effect.runPromise(apiClient.delete(`/api/v1/project-tech-stacks/${join.id}`, "?soft=false"));
      })
      .then(() => {
        const updated = {
          ...project,
          tech_stacks: (project.tech_stacks || []).filter((s) => s.id !== stackId),
        };
        setProject(updated as any);
        onSuccess();
        toast({ title: "Deleted", description: "Tech stack unlinked successfully", variant: "success" });
      })
      .catch((err) => {
        toast({ title: "Unlink Failed", description: err.message || "Failed to unlink tech stack", variant: "destructive" });
      });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader className="border-b border-neutral-200 dark:border-neutral-800 pb-3">
          <DialogTitle className="font-sans text-lg font-bold text-neutral-955 dark:text-neutral-50 flex items-center gap-1.5">
            <Layers size={18} className="text-[#ec7211]" /> Project Tech Stacks
          </DialogTitle>
          <p className="text-xs text-[#ec7211] font-semibold mt-0.5">Project: {project.title}</p>
        </DialogHeader>

        <form onSubmit={handleLinkStack}>
          <div className="space-y-4 p-6">
            <div className="space-y-1.5">
              <Label className="text-neutral-700 font-semibold text-xs uppercase tracking-wider block">Link Tech Stack</Label>
              <select
                value={selectedStackId}
                onChange={(e) => setSelectedStackId(e.target.value)}
                className="bg-white border border-neutral-300 text-neutral-900 text-sm rounded-lg p-2 w-full focus:border-[#ec7211] focus:ring-1 focus:ring-[#ec7211] outline-none cursor-pointer h-9"
              >
                {allStacks.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.name}
                  </option>
                ))}
                {allStacks.length === 0 && <option value="">No tech stacks configured</option>}
              </select>
            </div>

            <div className="space-y-2">
              <Label className="text-neutral-700 font-semibold text-xs uppercase tracking-wider block">Linked Tech Stacks</Label>
              <div className="flex flex-wrap gap-2 max-h-[160px] overflow-y-auto pr-1">
                {project.tech_stacks?.map((stack) => (
                  <div key={stack.id} className="flex items-center gap-1.5 pl-2 pr-1.5 py-1 bg-white border border-neutral-200 rounded-full shadow-xs text-xs font-medium">
                    <img src={stack.image_logo} alt={stack.name} className="w-4.5 h-4.5 object-contain" />
                    <span className="text-neutral-800">{stack.name}</span>
                    <button
                      type="button"
                      onClick={() => handleUnlinkStack(stack.id)}
                      className="p-0.5 text-neutral-400 hover:text-red-655 hover:bg-neutral-50 rounded-full transition-all cursor-pointer"
                    >
                      <Trash2 size={11} />
                    </button>
                  </div>
                ))}
                {(!project.tech_stacks || project.tech_stacks.length === 0) && (
                  <p className="text-xs text-neutral-400 italic mt-2 text-center w-full">No tech stacks linked.</p>
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
              disabled={stackLoading}
            >
              {stackLoading && <Loader2 size={12} className="animate-spin" />}
              Link Stack
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
