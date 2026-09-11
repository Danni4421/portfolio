// ponytail: projects crud page separated from unified dashboard layout
import { useState, useEffect } from "react";
import { Plus, Edit2, Trash2, PlusCircle } from "lucide-react";
import { Button } from "@/shared/ui/button";
import { apiClient } from "@/shared/api/client";
import { Effect } from "effect";
import { useToast } from "@/shared/ui/toast";
import { ProjectDrawer } from "@/features/project/components/project-drawer";
import { ProjectStoriesDrawer } from "@/features/project/components/project-stories-drawer";
import { ProjectTechStacksDrawer } from "@/features/project/components/project-tech-stacks-drawer";
import { ProjectGalleryDrawer } from "@/features/project/components/project-gallery-drawer";
import { ProjectResourcesDrawer } from "@/features/project/components/project-resources-drawer";

import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from "@/components/ui/table";
import { Skeleton } from "@/shared/ui/skeleton";

interface ApiResponse<T> {
  success: boolean;
  data: T;
}

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

export function AdminProjectsPage() {
  const { toast } = useToast();
  const [projects, setProjects] = useState<Project[]>([]);
  const [allStacks, setAllStacks] = useState<TechStack[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingProject, setEditingProject] = useState<Project | null>(null);
  const [formOpen, setFormOpen] = useState(false);

  const [storiesOpen, setStoriesOpen] = useState(false);
  const [techStacksOpen, setTechStacksOpen] = useState(false);
  const [galleryOpen, setGalleryOpen] = useState(false);
  const [resourcesOpen, setResourcesOpen] = useState(false);

  const fetchProjects = () => {
    setLoading(true);
    Effect.runPromise(apiClient.get<ApiResponse<Project[]>>("/api/v1/projects"))
      .then((res) => setProjects(res.data))
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  };

  const fetchTechStacks = () => {
    Effect.runPromise(apiClient.get<ApiResponse<TechStack[]>>("/api/v1/tech-stacks"))
      .then((res) => setAllStacks(res.data))
      .catch((err) => console.error(err));
  };

  useEffect(() => {
    fetchProjects();
    fetchTechStacks();
  }, []);

  const handleOpenCreate = () => {
    setEditingProject(null);
    setFormOpen(true);
  };

  const handleOpenEdit = (project: Project) => {
    setEditingProject(project);
    setFormOpen(true);
  };

  const handleOpenStories = (project: Project) => {
    setEditingProject(project);
    setStoriesOpen(true);
  };

  const handleOpenTechStacks = (project: Project) => {
    setEditingProject(project);
    setTechStacksOpen(true);
  };

  const handleOpenGallery = (project: Project) => {
    setEditingProject(project);
    setGalleryOpen(true);
  };

  const handleOpenResources = (project: Project) => {
    setEditingProject(project);
    setResourcesOpen(true);
  };

  const handleDelete = (id: string) => {
    const hardDelete = window.confirm("Delete project permanently? Cancel for soft delete.");
    Effect.runPromise(apiClient.delete(`/api/v1/projects/${id}`, `?soft=${!hardDelete}`))

      .then(() => {
        fetchProjects();
        toast({ title: "Deleted", description: "Project deleted successfully", variant: "success" });
      })
      .catch((err) => {
        toast({ title: "Deletion Failed", description: err.message || "Deletion failed", variant: "destructive" });
      });
  };




  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg tracking-[-0.64px] text-[#111111] font-medium">Projects</h2>
          <p className="text-gray-500 mt-1 text-sm">Manage project records, case stories, tech stack join links, and demo assets</p>
        </div>
        <Button
          onClick={handleOpenCreate}
          className="bg-[#ff5c06] hover:opacity-90 text-white font-semibold rounded-2xl shadow-[0_6px_10px_rgba(255,255,255,0.5)_inset,-10px_40px_41px_-4px_rgba(0,0,0,0.01)] cursor-pointer flex items-center gap-2 will-change-transform transition-opacity"
        >
          <Plus size={16} /> Add Project
        </Button>
      </div>

      <div className="w-full overflow-x-auto border border-gray-200 rounded-lg bg-white">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-32">Thumbnail</TableHead>
              <TableHead>Project Title</TableHead>
              <TableHead>Description</TableHead>
              <TableHead>Relations</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              Array.from({ length: 5 }).map((_, idx) => (
                <TableRow key={idx}>
                  <TableCell>
                    <Skeleton className="h-12 w-20 bg-gray-200" />
                  </TableCell>
                  <TableCell>
                    <Skeleton className="h-4 w-32 bg-gray-200" />
                  </TableCell>
                  <TableCell>
                    <Skeleton className="h-4 w-48 bg-gray-200" />
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-1">
                      <Skeleton className="h-4 w-10 bg-gray-200" />
                      <Skeleton className="h-4 w-10 bg-gray-200" />
                    </div>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Skeleton className="h-8 w-16 bg-gray-200" />
                      <Skeleton className="h-8 w-12 bg-gray-200" />
                    </div>
                  </TableCell>
                </TableRow>
              ))
            ) : projects.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="p-8 text-center text-gray-500 italic">
                  No projects configured. Click 'Add Project' to get started.
                </TableCell>
              </TableRow>
            ) : (
              projects.map((proj) => (
                <TableRow key={proj.id}>
                  <TableCell>
                    <img
                      src={proj.thumbnail_url}
                      alt={proj.title}
                      className="w-20 h-12 rounded-lg object-cover border border-gray-200 bg-gray-50"
                    />
                  </TableCell>
                  <TableCell className="font-semibold text-[#111111]">{proj.title}</TableCell>
                  <TableCell className="text-gray-600 text-xs max-w-xs truncate">{proj.description}</TableCell>
                  <TableCell className="text-gray-500 text-xs space-y-1">
                    <div className="flex flex-wrap gap-1">
                      <button
                        onClick={() => handleOpenStories(proj)}
                        className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-1.5 py-0.5 rounded border border-gray-200 font-medium text-[9px] uppercase tracking-wider cursor-pointer transition-all"
                      >
                        {proj.stories?.length || 0} Stories
                      </button>
                      <button
                        onClick={() => handleOpenTechStacks(proj)}
                        className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-1.5 py-0.5 rounded border border-gray-200 font-medium text-[9px] uppercase tracking-wider cursor-pointer transition-all"
                      >
                        {proj.tech_stacks?.length || 0} Stacks
                      </button>
                      <button
                        onClick={() => handleOpenGallery(proj)}
                        className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-1.5 py-0.5 rounded border border-gray-200 font-medium text-[9px] uppercase tracking-wider cursor-pointer transition-all"
                      >
                        {proj.images?.length || 0} Gallery
                      </button>
                      <button
                        onClick={() => handleOpenResources(proj)}
                        className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-1.5 py-0.5 rounded border border-gray-200 font-medium text-[9px] uppercase tracking-wider cursor-pointer transition-all"
                      >
                        {proj.resources?.length || 0} Links
                      </button>
                    </div>
                  </TableCell>
                  <TableCell className="text-right space-x-1 whitespace-nowrap">
                    <button
                      onClick={() => handleOpenEdit(proj)}
                      className="p-1.5 text-gray-500 hover:text-[#111111] hover:bg-gray-100 rounded cursor-pointer transition-all inline-flex items-center gap-1 text-xs font-semibold"
                    >
                      <Edit2 size={12} /> Edit
                    </button>
                    <button
                      onClick={() => handleDelete(proj.id)}
                      className="p-1.5 text-red-500 hover:text-red-600 hover:bg-red-50 rounded cursor-pointer transition-all inline-flex items-center gap-1 text-xs font-semibold"
                    >
                      <Trash2 size={12} /> Delete
                    </button>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      <ProjectDrawer
        open={formOpen}
        onOpenChange={setFormOpen}
        editingProject={editingProject}
        onSuccess={fetchProjects}
      />

      <ProjectStoriesDrawer
        open={storiesOpen}
        onOpenChange={setStoriesOpen}
        project={editingProject}
        setProject={setEditingProject}
        onSuccess={fetchProjects}
      />

      <ProjectTechStacksDrawer
        open={techStacksOpen}
        onOpenChange={setTechStacksOpen}
        project={editingProject}
        setProject={setEditingProject}
        allStacks={allStacks}
        onSuccess={fetchProjects}
      />

      <ProjectGalleryDrawer
        open={galleryOpen}
        onOpenChange={setGalleryOpen}
        project={editingProject}
        setProject={setEditingProject}
        onSuccess={fetchProjects}
      />

      <ProjectResourcesDrawer
        open={resourcesOpen}
        onOpenChange={setResourcesOpen}
        project={editingProject}
        setProject={setEditingProject}
        onSuccess={fetchProjects}
      />
    </div>
  );
}
