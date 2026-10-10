// ponytail: separate project external resources manager sheet component
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Loader2, Trash2, ExternalLink } from "lucide-react";
import { Button } from "@/shared/ui/button";
import { FormTextField, FormSelectField } from "@/shared/ui/form";
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
import type { Project, ProjectResource } from "@/entities/project/model/types";

const resourceSchema = z.object({
  title: z.string().min(1, "Link title is required"),
  type: z.string().min(1, "Link type is required"),
  url: z.string().min(1, "Resource URL is required"),
});

type ResourceFormValues = z.infer<typeof resourceSchema>;

const RESOURCE_TYPE_OPTIONS = [
  { value: "repository", label: "Repository" },
  { value: "documentation", label: "Docs" },
  { value: "demo", label: "Demo Web" },
  { value: "article", label: "Blog/Paper" },
  { value: "other", label: "Other Link" },
];

interface ProjectResourcesDrawerProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  project: Project | null;
  setProject: React.Dispatch<React.SetStateAction<Project | null>>;
  onSuccess: () => void;
}

export function ProjectResourcesDrawer({
  open,
  onOpenChange,
  project,
  setProject,
  onSuccess,
}: ProjectResourcesDrawerProps) {
  const { toast } = useToast();
  const [resourceLoading, setResourceLoading] = useState(false);
  const form = useForm<ResourceFormValues>({
    resolver: zodResolver(resourceSchema),
    defaultValues: { title: "", type: "repository", url: "" },
  });

  if (!project) return null;

  const handleAddResourceLink = form.handleSubmit((values) => {
    setResourceLoading(true);
    Effect.runPromise(
      apiClient.post<{ success: boolean; data: ProjectResource }>("/api/v1/project-resources", {
        project_id: project.id,
        resource_url: values.url,
        type: values.type,
        title: values.title,
      })
    )
      .then((res) => {
        setProject({
          ...project,
          resources: [...(project.resources || []), res.data],
        });
        form.reset({ title: "", type: "repository", url: "" });
        onSuccess();
        onOpenChange(false);
        toast({ title: "Success", description: "Resource link added successfully", variant: "success" });
      })
      .catch((err) => {
        toast({ title: "Error", description: err.message || "Failed to add resource link", variant: "destructive" });
      })
      .finally(() => {
        setResourceLoading(false);
      });
  });

  const handleDeleteResourceLink = (resId: string) => {
    Effect.runPromise(apiClient.delete(`/api/v1/project-resources/${resId}`, "?soft=false"))
      .then(() => {
        setProject({
          ...project,
          resources: (project.resources || []).filter((r) => r.id !== resId),
        });
        onSuccess();
        toast({ title: "Deleted", description: "Resource link deleted successfully", variant: "success" });
      })
      .catch((err) => {
        toast({ title: "Error", description: err.message || "Failed to delete resource link", variant: "destructive" });
      });
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>
            <ExternalLink size={18} className="text-foreground" /> Project Resources
          </SheetTitle>
          <p className="text-xs text-muted-foreground font-medium mt-0.5">Project: {project.title}</p>
        </SheetHeader>

        <form onSubmit={handleAddResourceLink} className="flex min-h-0 flex-1 flex-col">
          <div className="min-h-0 flex-1 space-y-4 overflow-y-auto px-6 py-6">
            <div className="grid grid-cols-2 gap-3">
              <FormTextField
                name="title"
                label="Link Title"
                placeholder="e.g. GitHub Repo"
                register={form.register}
                error={form.formState.errors.title}
                required
                className="space-y-1.5"
              />
              <FormSelectField
                name="type"
                label="Link Type"
                options={RESOURCE_TYPE_OPTIONS}
                register={form.register}
                error={form.formState.errors.type}
                required
                className="space-y-1.5"
              />
            </div>

            <FormTextField
              name="url"
              label="Resource URL"
              placeholder="https://github.com/..."
              register={form.register}
              error={form.formState.errors.url}
              required
              className="space-y-1.5"
            />

            <div className="space-y-2">
              <h4 className="text-xs font-bold text-foreground uppercase tracking-wider">
                Existing Resources
              </h4>
              <div className="space-y-2 max-h-[160px] overflow-y-auto pr-1">
                {project.resources?.map((r) => (
                  <div key={r.id} className="flex items-center justify-between gap-3 p-2.5 bg-muted/50 border border-border rounded-lg text-xs leading-normal">
                    <div className="flex-1 min-w-0">
                      <span className="font-semibold text-foreground block">{r.title}</span>
                      <span className="truncate text-muted-foreground font-mono text-[10px] block mt-0.5">{r.resource_url}</span>
                    </div>
                    <button type="button" onClick={() => handleDeleteResourceLink(r.id)} className="text-destructive hover:text-destructive p-1 cursor-pointer flex-shrink-0 self-start">
                      <Trash2 size={12} />
                    </button>
                  </div>
                ))}
                {(!project.resources || project.resources.length === 0) && (
                  <p className="text-xs text-muted-foreground italic mt-2 text-center">No resource links added yet.</p>
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
              disabled={resourceLoading}
            >
              {resourceLoading && <Loader2 size={12} className="animate-spin" />}
              Add Resource
            </Button>
          </SheetFooter>
        </form>
      </SheetContent>
    </Sheet>
  );
}
