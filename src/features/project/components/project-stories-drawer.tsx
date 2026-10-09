// ponytail: separate project case stories manager dialog component
import { useRef, useState } from "react";
import { Loader2, Pencil, Trash2, BookOpen, X } from "lucide-react";
import Markdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { Button } from "@/shared/ui/button";
import { Input } from "@/shared/ui/input";
import { Label } from "@/shared/ui/label";
import { MarkdownEditor } from "@/shared/ui/markdown-editor";
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
import type { Project, ProjectStory } from "@/entities/project/model/types";

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
  const [editingStory, setEditingStory] = useState<ProjectStory | null>(null);
  const formRef = useRef<HTMLFormElement>(null);

  if (!project) return null;

  const parseAuthors = () =>
    storyAuthors
      .split(",")
      .map((a) => a.trim())
      .filter((a) => a.length > 0);

  const resetForm = () => {
    setEditingStory(null);
    setStoryContent("");
    setStoryAuthors("Aji");
  };

  const handleEditStory = (story: ProjectStory) => {
    setEditingStory(story);
    setStoryContent(story.content);
    setStoryAuthors(story.author?.length > 0 ? story.author.join(", ") : "Aji");
    requestAnimationFrame(() =>
      formRef.current?.scrollIntoView({ behavior: "smooth", block: "start" })
    );
  };

  const handleSubmitStory = (e: React.FormEvent) => {
    e.preventDefault();
    if (!storyContent.trim()) return;

    setStoryLoading(true);
    const payload = {
      project_id: project.id,
      content: storyContent,
      author: parseAuthors(),
    };

    const request = editingStory
      ? apiClient.put<{ success: boolean; data: ProjectStory }>(
          `/api/v1/project-stories/${editingStory.id}`,
          payload
        )
      : apiClient.post<{ success: boolean; data: ProjectStory }>(
          "/api/v1/project-stories",
          payload
        );

    Effect.runPromise(request)
      .then((res) => {
        const updatedProject = editingStory
          ? {
              ...project,
              stories: (project.stories || []).map((s) =>
                s.id === res.data.id ? res.data : s
              ),
            }
          : { ...project, stories: [...(project.stories || []), res.data] };
        setProject(updatedProject as Project);
        toast({
          title: "Success",
          description: editingStory
            ? "Story updated successfully"
            : "Story block added successfully",
          variant: "success",
        });
        resetForm();
        onSuccess();
      })
      .catch((err) => {
        toast({
          title: "Error",
          description:
            err.message ||
            (editingStory ? "Failed to update story" : "Failed to add story block"),
          variant: "destructive",
        });
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
        setProject(updated as Project);
        if (editingStory?.id === storyId) resetForm();
        onSuccess();
        toast({ title: "Deleted", description: "Story block deleted successfully", variant: "success" });
      })
      .catch((err) => {
        toast({ title: "Error", description: err.message || "Failed to delete story block", variant: "destructive" });
      });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader className="border-b border-neutral-200 pb-3">
          <DialogTitle className="font-sans text-lg font-bold text-neutral-955 flex items-center gap-1.5">
            <BookOpen size={18} className="text-[#ec7211]" /> Project Stories
          </DialogTitle>
          <p className="text-xs text-[#ec7211] font-semibold mt-0.5">Project: {project.title}</p>
        </DialogHeader>

        <form ref={formRef} onSubmit={handleSubmitStory}>
          <div className="space-y-4 p-6">
            {editingStory && (
              <div className="flex items-center justify-between gap-3 rounded-lg border border-[#ec7211]/30 bg-[#ec7211]/5 px-3 py-2">
                <span className="text-xs font-semibold text-[#ec7211]">
                  Editing a story — changes update the existing block
                </span>
                <button
                  type="button"
                  onClick={resetForm}
                  className="flex items-center gap-1 text-xs font-medium text-neutral-500 underline underline-offset-2 hover:text-neutral-800 cursor-pointer"
                >
                  <X size={12} /> Cancel edit
                </button>
              </div>
            )}

            <div className="space-y-1.5">
              <Label htmlFor="st-content" className="text-neutral-700 font-semibold text-xs uppercase tracking-wider">
                Story Content (Markdown)
              </Label>
              <MarkdownEditor
                id="st-content"
                value={storyContent}
                onChange={setStoryContent}
                placeholder="Write your story… headings, quotes, images, code — the preview updates as you type."
                minHeight={280}
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
              <div className="space-y-2 max-h-[220px] overflow-y-auto pr-1">
                {project.stories?.map((st, index) => (
                  <div
                    key={st.id}
                    className={
                      "flex items-start justify-between gap-3 p-2.5 bg-neutral-50 border rounded-lg text-xs leading-normal " +
                      (editingStory?.id === st.id
                        ? "border-[#ec7211] ring-1 ring-[#ec7211]/30"
                        : "border-neutral-200")
                    }
                  >
                    <div className="flex-1 min-w-0">
                      <div className="prose prose-sm prose-neutral max-w-none max-h-16 overflow-hidden pointer-events-none [&>*:first-child]:mt-0 [&>*:last-child]:mb-0">
                        <Markdown remarkPlugins={[remarkGfm]}>{st.content}</Markdown>
                      </div>
                      <span className="text-[9px] text-neutral-400 font-mono block mt-1">
                        #{index + 1} · By: {st.author?.join(", ") || "—"}
                      </span>
                    </div>
                    <div className="flex items-center gap-1 flex-shrink-0">
                      <button
                        type="button"
                        title="Edit story"
                        onClick={() => handleEditStory(st)}
                        className="text-neutral-400 hover:text-[#ec7211] p-1 cursor-pointer"
                      >
                        <Pencil size={12} />
                      </button>
                      <button
                        type="button"
                        title="Delete story"
                        onClick={() => handleDeleteStory(st.id)}
                        className="text-red-550 hover:text-red-655 p-1 cursor-pointer"
                      >
                        <Trash2 size={12} />
                      </button>
                    </div>
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
              onClick={() => (editingStory ? resetForm() : onOpenChange(false))}
              className="bg-neutral-100 hover:bg-neutral-200 text-neutral-700! font-semibold rounded-lg border border-neutral-300 cursor-pointer"
            >
              {editingStory ? "Cancel edit" : "Cancel"}
            </Button>
            <Button
              type="submit"
              className="bg-[#ec7211] hover:bg-[#d65f0e] text-white font-bold rounded-lg cursor-pointer flex items-center gap-1.5"
              disabled={storyLoading}
            >
              {storyLoading && <Loader2 size={12} className="animate-spin" />}
              {editingStory ? "Update Story" : "Add Story"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
