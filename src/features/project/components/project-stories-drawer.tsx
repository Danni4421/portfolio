// ponytail: separate project case stories manager sheet component
import { useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Loader2, Pencil, Trash2, X } from "lucide-react";
import Markdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { Button } from "@/shared/ui/button";
import { FormTextField } from "@/shared/ui/form";
import { MarkdownEditor } from "@/shared/ui/markdown-editor";
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
import type { Project, ProjectStory } from "@/entities/project/model/types";

const storySchema = z.object({
  authors: z.string().min(1, "Authors are required"),
});

type StoryFormValues = z.infer<typeof storySchema>;

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
  const [storyLoading, setStoryLoading] = useState(false);
  const [editingStory, setEditingStory] = useState<ProjectStory | null>(null);
  const formRef = useRef<HTMLFormElement>(null);
  const form = useForm<StoryFormValues>({
    resolver: zodResolver(storySchema),
    defaultValues: { authors: "Aji" },
  });

  if (!project) return null;

  const parseAuthors = (authors: string) =>
    authors
      .split(",")
      .map((a) => a.trim())
      .filter((a) => a.length > 0);

  const resetForm = () => {
    setEditingStory(null);
    setStoryContent("");
    form.reset({ authors: "Aji" });
  };

  const handleEditStory = (story: ProjectStory) => {
    setEditingStory(story);
    setStoryContent(story.content);
    form.setValue(
      "authors",
      story.author?.length > 0 ? story.author.join(", ") : "Aji",
    );
    requestAnimationFrame(() =>
      formRef.current?.scrollIntoView({ behavior: "smooth", block: "start" }),
    );
  };

  const handleSubmitStory = form.handleSubmit((values) => {
    if (!storyContent.trim()) return;

    setStoryLoading(true);
    const payload = {
      project_id: project.id,
      content: storyContent,
      author: parseAuthors(values.authors),
    };

    const request = editingStory
      ? apiClient.put<{ success: boolean; data: ProjectStory }>(
          `/api/v1/project-stories/${editingStory.id}`,
          payload,
        )
      : apiClient.post<{ success: boolean; data: ProjectStory }>(
          "/api/v1/project-stories",
          payload,
        );

    Effect.runPromise(request)
      .then((res) => {
        const updatedProject = editingStory
          ? {
              ...project,
              stories: (project.stories || []).map((s) =>
                s.id === res.data.id ? res.data : s,
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
            (editingStory
              ? "Failed to update story"
              : "Failed to add story block"),
          variant: "destructive",
        });
      })
      .finally(() => {
        setStoryLoading(false);
      });
  });

  const handleDeleteStory = (storyId: string) => {
    Effect.runPromise(
      apiClient.delete(`/api/v1/project-stories/${storyId}`, "?soft=false"),
    )
      .then(() => {
        const updated = {
          ...project,
          stories: (project.stories || []).filter((s) => s.id !== storyId),
        };
        setProject(updated as Project);
        if (editingStory?.id === storyId) resetForm();
        onSuccess();
        toast({
          title: "Deleted",
          description: "Story block deleted successfully",
          variant: "success",
        });
      })
      .catch((err) => {
        toast({
          title: "Error",
          description: err.message || "Failed to delete story block",
          variant: "destructive",
        });
      });
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="sm:max-w-4xl">
        <SheetHeader>
          <SheetTitle>Project Stories</SheetTitle>
          <p className="text-sm text-muted-foreground font-medium mt-0.5">
            {project.title}
          </p>
        </SheetHeader>

        <form
          ref={formRef}
          onSubmit={handleSubmitStory}
          className="flex min-h-0 flex-1 flex-col"
        >
          <div className="min-h-0 flex-1 space-y-4 overflow-y-auto px-6 py-6">
            {editingStory && (
              <div className="flex items-center justify-between gap-3 rounded-lg border border-ring/30 bg-accent px-3 py-2">
                <span className="text-xs font-semibold text-muted-foreground">
                  Editing a story — changes update the existing block
                </span>
                <button
                  type="button"
                  onClick={resetForm}
                  className="flex items-center gap-1 text-xs font-medium text-muted-foreground underline underline-offset-2 hover:text-foreground cursor-pointer"
                >
                  <X size={12} /> Cancel edit
                </button>
              </div>
            )}

            <MarkdownEditor
              id="st-content"
              value={storyContent}
              onChange={setStoryContent}
              placeholder="Write your story… headings, quotes, images, code — the preview updates as you type."
              minHeight={280}
            />

            <FormTextField
              name="authors"
              label="Authors (Comma-separated)"
              register={form.register}
              error={form.formState.errors.authors}
              required
              className="space-y-1.5"
            />

            <div className="space-y-2">
              <h4 className="text-xs font-bold text-foreground uppercase tracking-wider">
                Existing Stories
              </h4>
              <div className="space-y-2 max-h-[220px] overflow-y-auto pr-1">
                {project.stories?.map((st, index) => (
                  <div
                    key={st.id}
                    className={
                      "flex items-start justify-between gap-3 p-2.5 bg-muted/50 border rounded-lg text-xs leading-normal " +
                      (editingStory?.id === st.id
                        ? "border-ring ring-1 ring-ring/30"
                        : "border-border")
                    }
                  >
                    <div className="flex-1 min-w-0">
                      <div className="prose prose-sm prose-neutral max-w-none max-h-16 overflow-hidden pointer-events-none [&>*:first-child]:mt-0 [&>*:last-child]:mb-0">
                        <Markdown remarkPlugins={[remarkGfm]}>
                          {st.content}
                        </Markdown>
                      </div>
                      <span className="text-[9px] text-muted-foreground font-mono block mt-1">
                        #{index + 1} · By: {st.author?.join(", ") || "—"}
                      </span>
                    </div>
                    <div className="flex items-center gap-1 flex-shrink-0">
                      <button
                        type="button"
                        title="Edit story"
                        onClick={() => handleEditStory(st)}
                        className="text-muted-foreground hover:text-foreground p-1 cursor-pointer"
                      >
                        <Pencil size={12} />
                      </button>
                      <button
                        type="button"
                        title="Delete story"
                        onClick={() => handleDeleteStory(st.id)}
                        className="text-destructive hover:text-destructive p-1 cursor-pointer"
                      >
                        <Trash2 size={12} />
                      </button>
                    </div>
                  </div>
                ))}
                {(!project.stories || project.stories.length === 0) && (
                  <p className="text-xs text-muted-foreground italic mt-2 text-center">
                    No case stories configured.
                  </p>
                )}
              </div>
            </div>
          </div>

          <SheetFooter className="flex flex-col!">
            <Button
              type="button"
              variant="outline"
              onClick={() => (editingStory ? resetForm() : onOpenChange(false))}
            >
              {editingStory ? "Cancel edit" : "Cancel"}
            </Button>
            <Button type="submit" className="gap-1.5" disabled={storyLoading}>
              {storyLoading && <Loader2 size={12} className="animate-spin" />}
              {editingStory ? "Update Story" : "Add Story"}
            </Button>
          </SheetFooter>
        </form>
      </SheetContent>
    </Sheet>
  );
}
