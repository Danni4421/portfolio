// ponytail: separate project tech stacks manager sheet component
import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Loader2, Trash2, Layers } from "lucide-react";
import { Button } from "@/shared/ui/button";
import { FormSelectField } from "@/shared/ui/form";
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
import type { Project } from "@/entities/project/model/types";

const linkStackSchema = z.object({
  stack_id: z.string().min(1, "Select a tech stack"),
});

type LinkStackFormValues = z.infer<typeof linkStackSchema>;

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
  const [stackLoading, setStackLoading] = useState(false);
  const form = useForm<LinkStackFormValues>({
    resolver: zodResolver(linkStackSchema),
    defaultValues: { stack_id: "" },
  });

  useEffect(() => {
    if (allStacks.length > 0 && !form.getValues("stack_id")) {
      form.setValue("stack_id", allStacks[0].id);
    }
  }, [allStacks, form]);

  if (!project) return null;

  const stackOptions =
    allStacks.length > 0
      ? allStacks.map((s) => ({ value: s.id, label: s.name }))
      : [{ value: "", label: "No tech stacks configured" }];

  const handleLinkStack = form.handleSubmit((values) => {
    const selectedStackId = values.stack_id;

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
  });

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
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>
            <Layers size={18} className="text-foreground" /> Project Tech Stacks
          </SheetTitle>
          <p className="text-xs text-muted-foreground font-medium mt-0.5">Project: {project.title}</p>
        </SheetHeader>

        <form onSubmit={handleLinkStack} className="flex min-h-0 flex-1 flex-col">
          <div className="min-h-0 flex-1 space-y-4 overflow-y-auto px-6 py-6">
            <FormSelectField
              name="stack_id"
              label="Link Tech Stack"
              options={stackOptions}
              register={form.register}
              error={form.formState.errors.stack_id}
              required
              className="space-y-1.5"
              selectClassName="h-9"
            />

            <div className="space-y-2">
              <h4 className="text-xs font-bold text-foreground uppercase tracking-wider">
                Linked Tech Stacks
              </h4>
              <div className="flex flex-wrap gap-2 max-h-[160px] overflow-y-auto pr-1">
                {project.tech_stacks?.map((stack) => (
                  <div key={stack.id} className="flex items-center gap-1.5 pl-2 pr-1.5 py-1 bg-white border border-border rounded-full shadow-xs text-xs font-medium">
                    <img src={stack.image_logo} alt={stack.name} className="w-4.5 h-4.5 object-contain" />
                    <span className="text-foreground">{stack.name}</span>
                    <button
                      type="button"
                      onClick={() => handleUnlinkStack(stack.id)}
                      className="p-0.5 text-muted-foreground hover:text-destructive hover:bg-muted/50 rounded-full transition-all cursor-pointer"
                    >
                      <Trash2 size={11} />
                    </button>
                  </div>
                ))}
                {(!project.tech_stacks || project.tech_stacks.length === 0) && (
                  <p className="text-xs text-muted-foreground italic mt-2 text-center w-full">No tech stacks linked.</p>
                )}
              </div>
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
              disabled={stackLoading}
            >
              {stackLoading && <Loader2 size={12} className="animate-spin" />}
              Link Stack
            </Button>
          </SheetFooter>
        </form>
      </SheetContent>
    </Sheet>
  );
}
