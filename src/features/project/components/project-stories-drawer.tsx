// ponytail: separate project case stories manager dialog component
import * as React from "react";
import { useState } from "react";
import { Loader2, Trash2, BookOpen } from "lucide-react";
import { Button } from "@/shared/ui/button";
import { Input } from "@/shared/ui/input";
import { Label } from "@/shared/ui/label";
import { Textarea } from "@/shared/ui/textarea";
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

interface ProjectStory {
  id: string;
  project_id: string;
  content: string;
  author: string[];
}

interface Project {
  id: string;
  title: string;
  stories: ProjectStory[];
}

interface ProjectStoriesDrawerProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  project: Project | null;
  setProject: React.Dispatch<React.SetStateAction<Project | null>>;
  onSuccess: () => void;
}

export function ProjectStoriesDrawer({
  open,
  onOpenChange,
  project,
  setProject,
  onSuccess,
}: ProjectStoriesDrawerProps) {
  const { toast } = useToast();
  const [storyContent, setStoryContent] = useState("");
  const [storyAuthors, setStoryAuthors] = useState("Aji");
  const [storyLoading, setStoryLoading] = useState(false);

  if (!project) return null;

  const handleAddStory = (e: React.FormEvent) => {
    e.preventDefault();
    if (!storyContent) return;

    setStoryLoading(true);
    const authors = storyAuthors.split(",").map((a) => a.trim()).filter((a) => a.length > 0);
    Effect.runPromise(
      apiClient.post<{ success: boolean; data: ProjectStory }>("/api/v1/project-stories", {
        project_id: project.id,
        content: storyContent,
        author: authors,
      })
    )
      .then((res) => {
        const updated = {
          ...project,
          stories: [...(project.stories || []), res.data],
        };
        setProject(updated as any);
        setStoryContent("");
        onSuccess();
        onOpenChange(false);
        toast({ title: "Success", description: "Story block added successfully", variant: "success" });
      })
      .catch((err) => {
        toast({ title: "Error", description: err.message || "Failed to add story block", variant: "destructive" });
      })
      .finally(() => {
        setStoryLoading(false);
      });
  };

  const handleDeleteStory = (storyId: string) => {
    Effect.runPromise(apiClient.delete(`/api/v1/project-stories/${storyId}`, "?soft=false"))
      .then(() => {
        const updated = {
          ...project,
          stories: (project.stories || []).filter((s) => s.id !== storyId),
        };
        setProject(updated as any);
        onSuccess();
        toast({ title: "Deleted", description: "Story block deleted successfully", variant: "success" });
      })
      .catch((err) => {
        toast({ title: "Error", description: err.message || "Failed to delete story block", variant: "destructive" });
      });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader className="border-b border-neutral-200 dark:border-neutral-800 pb-3">
          <DialogTitle className="font-sans text-lg font-bold text-neutral-955 dark:text-neutral-50 flex items-center gap-1.5">
            <BookOpen size={18} className="text-[#ec7211]" /> Project Stories
          </DialogTitle>
          <p className="text-xs text-[#ec7211] font-semibold mt-0.5">Project: {project.title}</p>
        </DialogHeader>

        <form onSubmit={handleAddStory}>
          <div className="space-y-4 p-6">
            <div className="space-y-1.5">
              <Label htmlFor="st-content" className="text-neutral-700 font-semibold text-xs uppercase tracking-wider">Story Paragraph Content</Label>
              <Textarea
                id="st-content"
                rows={3}
                placeholder="Story paragraph (supports markdown)..."
                value={storyContent}
                onChange={(e) => setStoryContent(e.target.value)}
                className="bg-white border-neutral-300 focus:border-[#ec7211] focus:ring-1 focus:ring-[#ec7211] text-neutral-900 rounded-lg text-sm w-full block"
                required
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="st-author" className="text-neutral-700 font-semibold text-xs uppercase tracking-wider">Authors (Comma-separated)</Label>
              <Input
                id="st-author"
                type="text"
                value={storyAuthors}
                onChange={(e) => setStoryAuthors(e.target.value)}
                className="bg-white border-neutral-300 focus:border-[#ec7211] text-neutral-900 rounded-lg text-sm w-full block h-9"
                required
              />
            </div>

            <div className="space-y-2">
              <Label className="text-neutral-700 font-semibold text-xs uppercase tracking-wider block">Existing Stories</Label>
              <div className="space-y-2 max-h-[180px] overflow-y-auto pr-1">
                {project.stories?.map((st) => (
                  <div key={st.id} className="flex items-start justify-between gap-3 p-2.5 bg-neutral-50 border border-neutral-200 rounded-lg text-xs leading-normal">
                    <div className="flex-1 min-w-0">
                      <p className="text-neutral-750 font-sans break-words">{st.content}</p>
                      <span className="text-[9px] text-neutral-400 font-mono block mt-1">By: {st.author.join(", ")}</span>
                    </div>
                    <button type="button" onClick={() => handleDeleteStory(st.id)} className="text-red-550 hover:text-red-655 p-1 cursor-pointer flex-shrink-0">
                      <Trash2 size={12} />
                    </button>
                  </div>
                ))}
                {(!project.stories || project.stories.length === 0) && (
                  <p className="text-xs text-neutral-400 italic mt-2 text-center">No case stories configured.</p>
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
              disabled={storyLoading}
            >
              {storyLoading && <Loader2 size={12} className="animate-spin" />}
              Add Story
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
