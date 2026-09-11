// ponytail: separate project relations dialog component
import * as React from "react";
import { useState } from "react";
import { Loader2, Plus, Trash2, BookOpen, Layers, Globe, PlusCircle, Trash, ExternalLink } from "lucide-react";
import { Button } from "@/shared/ui/button";
import { Input } from "@/shared/ui/input";
import { Label } from "@/shared/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/shared/ui/dialog";
import { apiClient } from "@/shared/api/client";
import { Effect } from "effect";
import { useToast } from "@/shared/ui/toast";
import { FileUploader } from "@/shared/ui/file-uploader";

interface TechStack {
  id: string;
  name: string;
  image_logo: string;
  redirect_url: string;
}

interface ProjectStory {
  id: string;
  project_id: string;
  content: string;
  author: string[];
}

interface ProjectImage {
  id: string;
  project_id: string;
  image_url: string;
}

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
  description: string;
  thumbnail_url: string;
  stories: ProjectStory[];
  tech_stacks: TechStack[];
  images: ProjectImage[];
  resources: ProjectResource[];
}

interface ProjectRelationsDrawerProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  project: Project | null;
  setProject: React.Dispatch<React.SetStateAction<Project | null>>;
  allStacks: TechStack[];
  onRefresh: () => void;
}

export function ProjectRelationsDrawer({
  open,
  onOpenChange,
  project,
  setProject,
  allStacks,
  onRefresh,
}: ProjectRelationsDrawerProps) {
  const { toast } = useToast();

  // Story states
  const [storyContent, setStoryContent] = useState("");
  const [storyAuthors, setStoryAuthors] = useState("Aji");
  const [storyLoading, setStoryLoading] = useState(false);

  // Tech stack states
  const [selectedStackId, setSelectedStackId] = useState("");
  const [stackLoading, setStackLoading] = useState(false);

  // Gallery states
  const [galleryUploading, setGalleryUploading] = useState(false);

  // External resource states
  const [resourceLinkUrl, setResourceLinkUrl] = useState("");
  const [resourceTitle, setResourceTitle] = useState("");
  const [resourceType, setResourceType] = useState("repository");
  const [resourceLoading, setResourceLoading] = useState(false);

  // Sync selected stack index
  React.useEffect(() => {
    if (allStacks.length > 0 && !selectedStackId) {
      setSelectedStackId(allStacks[0].id);
    }
  }, [allStacks]);

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
        setProject(updated);
        setStoryContent("");
        onRefresh();
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
        setProject(updated);
        onRefresh();
        toast({ title: "Deleted", description: "Story block deleted successfully", variant: "success" });
      })
      .catch((err) => {
        toast({ title: "Error", description: err.message || "Failed to delete story block", variant: "destructive" });
      });
  };

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
          setProject(updated);
        }
        onRefresh();
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
        setProject(updated);
        onRefresh();
        toast({ title: "Deleted", description: "Tech stack unlinked successfully", variant: "success" });
      })
      .catch((err) => {
        toast({ title: "Unlink Failed", description: err.message || "Failed to unlink tech stack", variant: "destructive" });
      });
  };

  const handleAddProjectImage = (file: File) => {
    setGalleryUploading(true);
    Effect.runPromise(apiClient.uploadFile(file))
      .then((url) => {
        return Effect.runPromise(
          apiClient.post<{ success: boolean; data: ProjectImage }>("/api/v1/project-images", {
            project_id: project.id,
            image_url: url,
          })
        );
      })
      .then((res) => {
        const updated = {
          ...project,
          images: [...(project.images || []), res.data],
        };
        setProject(updated);
        onRefresh();
        toast({ title: "Success", description: "Gallery image uploaded successfully", variant: "success" });
      })
      .catch((err) => {
        toast({ title: "Upload Failed", description: err.message || "Failed to upload gallery image", variant: "destructive" });
      })
      .finally(() => {
        setGalleryUploading(false);
      });
  };

  const handleDeleteProjectImage = (imgId: string) => {
    Effect.runPromise(apiClient.delete(`/api/v1/project-images/${imgId}`, "?soft=false"))
      .then(() => {
        const updated = {
          ...project,
          images: (project.images || []).filter((i) => i.id !== imgId),
        };
        setProject(updated);
        onRefresh();
        toast({ title: "Deleted", description: "Gallery image deleted successfully", variant: "success" });
      })
      .catch((err) => {
        toast({ title: "Error", description: err.message || "Failed to delete gallery image", variant: "destructive" });
      });
  };

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
        setProject(updated);
        setResourceLinkUrl("");
        setResourceTitle("");
        setResourceType("repository");
        onRefresh();
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
        setProject(updated);
        onRefresh();
        toast({ title: "Deleted", description: "Resource link deleted successfully", variant: "success" });
      })
      .catch((err) => {
        toast({ title: "Error", description: err.message || "Failed to delete resource link", variant: "destructive" });
      });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader className="border-b border-neutral-200 dark:border-neutral-800 pb-3">
          <DialogTitle className="font-sans text-lg font-bold text-neutral-955 dark:text-neutral-50">
            Manage Project Relations
          </DialogTitle>
          <p className="text-xs text-[#ec7211] font-semibold mt-0.5">Project: {project.title}</p>
        </DialogHeader>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 p-6">
          {/* Left Column: Stories & Tech Stacks */}
          <div className="space-y-6">
            {/* Story Blocks Section */}
            <div className="space-y-4 border-b border-neutral-200 pb-6">
              <h4 className="font-sans text-xs font-bold text-neutral-700 uppercase tracking-wider flex items-center gap-1.5">
                <BookOpen size={14} /> Project Case Stories
              </h4>
              <form onSubmit={handleAddStory} className="flex flex-col gap-2 p-3 border border-neutral-200 rounded-xl bg-neutral-50/50">
                <div className="flex gap-2">
                  <Input
                    type="text"
                    placeholder="Block Content (Markdown supported)..."
                    value={storyContent}
                    onChange={(e) => setStoryContent(e.target.value)}
                    className="bg-white border-neutral-300 focus:border-[#ec7211] text-xs h-9 flex-1"
                    required
                  />
                  <button
                    type="submit"
                    className="p-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg cursor-pointer transition-all flex items-center justify-center h-9"
                    disabled={storyLoading}
                  >
                    {storyLoading ? <Loader2 size={14} className="animate-spin" /> : <Plus size={14} />}
                  </button>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-[9px] text-neutral-400 font-bold uppercase">Authors:</span>
                  <Input
                    type="text"
                    placeholder="Comma-separated authors"
                    value={storyAuthors}
                    onChange={(e) => setStoryAuthors(e.target.value)}
                    className="bg-white border-neutral-200 text-[10px] px-2 py-0.5 h-6 w-44 rounded-md"
                  />
                </div>
              </form>

              <div className="space-y-2 max-h-[160px] overflow-y-auto pr-1">
                {project.stories?.map((st) => (
                  <div key={st.id} className="flex items-start justify-between gap-3 p-2.5 bg-neutral-50 border border-neutral-200 rounded-lg text-xs leading-normal">
                    <div className="flex-1 min-w-0">
                      <p className="text-neutral-750 font-sans break-words">{st.content}</p>
                      <span className="text-[9px] text-neutral-400 font-mono block mt-1">By: {st.author.join(", ")}</span>
                    </div>
                    <button onClick={() => handleDeleteStory(st.id)} className="text-red-550 hover:text-red-655 p-1 cursor-pointer flex-shrink-0">
                      <Trash size={12} />
                    </button>
                  </div>
                ))}
                {(!project.stories || project.stories.length === 0) && (
                  <p className="text-xs text-neutral-500 italic">No case stories configured.</p>
                )}
              </div>
            </div>

            {/* Tech Stacks Section */}
            <div className="space-y-4">
              <h4 className="font-sans text-xs font-bold text-neutral-700 uppercase tracking-wider flex items-center gap-1.5">
                <Layers size={14} /> Linked Tech Stacks
              </h4>
              <form onSubmit={handleLinkStack} className="flex gap-2 p-3 border border-neutral-200 rounded-xl bg-neutral-50/50">
                <select
                  value={selectedStackId}
                  onChange={(e) => setSelectedStackId(e.target.value)}
                  className="bg-white border border-neutral-300 text-neutral-900 text-xs rounded-lg p-2 flex-1 focus:border-[#ec7211] focus:ring-1 focus:ring-[#ec7211] outline-none"
                >
                  {allStacks.map((s) => (
                    <option key={s.id} value={s.id}>
                      {s.name}
                    </option>
                  ))}
                  {allStacks.length === 0 && <option value="">No tech stacks configured</option>}
                </select>
                <button
                  type="submit"
                  className="px-3 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold rounded-lg cursor-pointer transition-all flex items-center justify-center gap-1"
                  disabled={stackLoading}
                >
                  {stackLoading ? <Loader2 size={12} className="animate-spin" /> : <PlusCircle size={12} />} Link
                </button>
              </form>

              <div className="flex flex-wrap gap-2 max-h-[140px] overflow-y-auto pr-1">
                {project.tech_stacks?.map((stack) => (
                  <div key={stack.id} className="flex items-center gap-1.5 pl-2 pr-1.5 py-1 bg-white border border-neutral-200 rounded-full shadow-xs text-xs font-medium">
                    <img src={stack.image_logo} alt={stack.name} className="w-4.5 h-4.5 object-contain" />
                    <span className="text-neutral-800">{stack.name}</span>
                    <button
                      onClick={() => handleUnlinkStack(stack.id)}
                      className="p-0.5 text-neutral-400 hover:text-red-655 hover:bg-neutral-50 rounded-full transition-all cursor-pointer"
                    >
                      <Trash2 size={11} />
                    </button>
                  </div>
                ))}
                {(!project.tech_stacks || project.tech_stacks.length === 0) && (
                  <p className="text-xs text-neutral-500 italic">No tech stacks linked.</p>
                )}
              </div>
            </div>
          </div>

          {/* Right Column: Gallery & External Resources */}
          <div className="space-y-6">
            {/* Gallery Images Section */}
            <div className="space-y-4 border-b border-neutral-200 pb-6">
              <h4 className="font-sans text-xs font-bold text-neutral-700 uppercase tracking-wider flex items-center gap-1.5">
                <Globe size={14} /> Project Gallery Images
              </h4>
              <FileUploader
                onFileSelect={handleAddProjectImage}
                loading={galleryUploading}
                subLabel="Drag & drop or click to add gallery images (PNG, JPG, SVG)"
              />

              <div className="grid grid-cols-4 gap-3 max-h-[140px] overflow-y-auto pr-1">
                {project.images?.map((img) => (
                  <div key={img.id} className="relative group rounded-lg overflow-hidden border border-neutral-200 h-14 bg-white flex items-center justify-center">
                    <img src={img.image_url} alt="Gallery" className="w-full h-full object-cover" />
                    <button
                      onClick={() => handleDeleteProjectImage(img.id)}
                      className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-all flex items-center justify-center text-white cursor-pointer"
                    >
                      <Trash size={14} />
                    </button>
                  </div>
                ))}
                {(!project.images || project.images.length === 0) && (
                  <p className="col-span-4 text-xs text-neutral-500 italic">No gallery images uploaded.</p>
                )}
              </div>
            </div>

            {/* External Resources Section */}
            <div className="space-y-4">
              <h4 className="font-sans text-xs font-bold text-neutral-700 uppercase tracking-wider flex items-center gap-1.5">
                <ExternalLink size={14} /> External Resources & Links
              </h4>
              <form onSubmit={handleAddResourceLink} className="flex flex-col gap-2 p-3 border border-neutral-200 rounded-xl bg-neutral-50/50">
                <div className="flex gap-2">
                  <Input
                    type="text"
                    placeholder="Link Title (e.g. GitHub Repo)"
                    value={resourceTitle}
                    onChange={(e) => setResourceTitle(e.target.value)}
                    className="bg-white border-neutral-300 focus:border-[#ec7211] text-xs h-9 flex-1"
                    required
                  />
                  <select
                    value={resourceType}
                    onChange={(e) => setResourceType(e.target.value)}
                    className="bg-white border border-neutral-300 text-neutral-900 text-xs rounded-lg p-2 focus:border-[#ec7211] outline-none"
                  >
                    <option value="repository">GitHub Repo</option>
                    <option value="documentation">Docs</option>
                    <option value="demo">Demo Web</option>
                    <option value="article">Blog/Paper</option>
                    <option value="other">Other Link</option>
                  </select>
                </div>
                <div className="flex gap-2">
                  <Input
                    type="text"
                    placeholder="https://github.com/..."
                    value={resourceLinkUrl}
                    onChange={(e) => setResourceLinkUrl(e.target.value)}
                    className="bg-white border-neutral-300 focus:border-[#ec7211] text-xs h-9 flex-1"
                    required
                  />
                  <button
                    type="submit"
                    className="px-3 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg cursor-pointer transition-all flex items-center justify-center h-9"
                    disabled={resourceLoading}
                  >
                    {resourceLoading ? <Loader2 size={12} className="animate-spin" /> : <Plus size={12} />} Add
                  </button>
                </div>
              </form>

              <div className="space-y-2 max-h-[160px] overflow-y-auto pr-1">
                {project.resources?.map((r) => (
                  <div key={r.id} className="flex items-center justify-between gap-3 p-2 bg-neutral-50 border border-neutral-200 rounded-lg text-xs">
                    <div className="flex-1 min-w-0 flex items-center gap-2">
                      <span className="px-1.5 py-0.5 bg-neutral-200 text-neutral-600 rounded font-semibold text-[8px] uppercase tracking-wider">{r.type}</span>
                      <span className="truncate text-neutral-800 font-semibold">{r.title}</span>
                      <span className="truncate text-neutral-400 text-[10px] font-mono">{r.resource_url}</span>
                    </div>
                    <button onClick={() => handleDeleteResourceLink(r.id)} className="text-red-550 hover:text-red-655 p-1 cursor-pointer flex-shrink-0">
                      <Trash size={12} />
                    </button>
                  </div>
                ))}
                {(!project.resources || project.resources.length === 0) && (
                  <p className="text-xs text-neutral-500 italic">No external resource links configured.</p>
                )}
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
