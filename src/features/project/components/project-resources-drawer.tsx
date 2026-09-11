// ponytail: separate project external resources manager dialog component
import * as React from "react";
import { useState } from "react";
import { Loader2, Trash2, ExternalLink } from "lucide-react";
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

interface ProjectResource {
  id: string;
  project_id: string;
  resource_url: string;
  type: string;
  title: string;
}

interface Project {
  id: string;
  title: string;
  resources: ProjectResource[];
}

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
  const [resourceLinkUrl, setResourceLinkUrl] = useState("");
  const [resourceTitle, setResourceTitle] = useState("");
  const [resourceType, setResourceType] = useState("repository");
  const [resourceLoading, setResourceLoading] = useState(false);

  if (!project) return null;

  const handleAddResourceLink = (e: React.FormEvent) => {
    e.preventDefault();
    if (!resourceLinkUrl || !resourceTitle || !resourceType) return;

    setResourceLoading(true);
    Effect.runPromise(
      apiClient.post<{ success: boolean; data: ProjectResource }>("/api/v1/project-resources", {
        project_id: project.id,
        resource_url: resourceLinkUrl,
        type: resourceType,
        title: resourceTitle,
      })
    )
      .then((res) => {
        const updated = {
          ...project,
          resources: [...(project.resources || []), res.data],
        };
        setProject(updated as any);
        setResourceLinkUrl("");
        setResourceTitle("");
        setResourceType("repository");
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
  };

  const handleDeleteResourceLink = (resId: string) => {
    Effect.runPromise(apiClient.delete(`/api/v1/project-resources/${resId}`, "?soft=false"))
      .then(() => {
        const updated = {
          ...project,
          resources: (project.resources || []).filter((r) => r.id !== resId),
        };
        setProject(updated as any);
        onSuccess();
        toast({ title: "Deleted", description: "Resource link deleted successfully", variant: "success" });
      })
      .catch((err) => {
        toast({ title: "Error", description: err.message || "Failed to delete resource link", variant: "destructive" });
      });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader className="border-b border-neutral-200 dark:border-neutral-800 pb-3">
          <DialogTitle className="font-sans text-lg font-bold text-neutral-955 dark:text-neutral-50 flex items-center gap-1.5">
            <ExternalLink size={18} className="text-[#ec7211]" /> Project Resources
          </DialogTitle>
          <p className="text-xs text-[#ec7211] font-semibold mt-0.5">Project: {project.title}</p>
        </DialogHeader>

        <form onSubmit={handleAddResourceLink}>
          <div className="space-y-4 p-6">
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label htmlFor="res-title" className="text-neutral-700 font-semibold text-xs uppercase tracking-wider">Link Title</Label>
                <Input
                  id="res-title"
                  type="text"
                  placeholder="e.g. GitHub Repo"
                  value={resourceTitle}
                  onChange={(e) => setResourceTitle(e.target.value)}
                  className="bg-white border border-neutral-300 text-neutral-900 text-sm rounded-lg p-2 w-full focus:outline-none focus:border-[#ec7211] h-9"
                  required
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="res-type" className="text-neutral-700 font-semibold text-xs uppercase tracking-wider">Link Type</Label>
                <select
                  id="res-type"
                  value={resourceType}
                  onChange={(e) => setResourceType(e.target.value)}
                  className="bg-white border border-neutral-300 text-neutral-900 text-sm rounded-lg p-2 w-full focus:outline-none focus:border-[#ec7211] h-9 cursor-pointer"
                  required
                >
                  <option value="repository">Repository</option>
                  <option value="documentation">Docs</option>
                  <option value="demo">Demo Web</option>
                  <option value="article">Blog/Paper</option>
                  <option value="other">Other Link</option>
                </select>
              </div>
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="res-url" className="text-neutral-700 font-semibold text-xs uppercase tracking-wider">Resource URL</Label>
              <Input
                id="res-url"
                type="text"
                placeholder="https://github.com/..."
                value={resourceLinkUrl}
                onChange={(e) => setResourceLinkUrl(e.target.value)}
                className="bg-white border border-neutral-300 text-neutral-900 text-sm rounded-lg p-2 w-full focus:outline-none focus:border-[#ec7211] h-9"
                required
              />
            </div>

            <div className="space-y-2">
              <Label className="text-neutral-700 font-semibold text-xs uppercase tracking-wider block">Existing Resources</Label>
              <div className="space-y-2 max-h-[160px] overflow-y-auto pr-1">
                {project.resources?.map((r) => (
                  <div key={r.id} className="flex items-center justify-between gap-3 p-2.5 bg-neutral-50 border border-neutral-200 rounded-lg text-xs leading-normal">
                    <div className="flex-1 min-w-0">
                      <span className="font-semibold text-neutral-850 block">{r.title}</span>
                      <span className="truncate text-neutral-400 font-mono text-[10px] block mt-0.5">{r.resource_url}</span>
                    </div>
                    <button type="button" onClick={() => handleDeleteResourceLink(r.id)} className="text-red-550 hover:text-red-655 p-1 cursor-pointer flex-shrink-0 self-start">
                      <Trash2 size={12} />
                    </button>
                  </div>
                ))}
                {(!project.resources || project.resources.length === 0) && (
                  <p className="text-xs text-neutral-400 italic mt-2 text-center">No resource links added yet.</p>
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
              disabled={resourceLoading}
            >
              {resourceLoading && <Loader2 size={12} className="animate-spin" />}
              Add Resource
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
