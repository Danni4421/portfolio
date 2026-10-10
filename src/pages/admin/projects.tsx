// ponytail: projects crud page separated from unified dashboard layout
import { useState, useEffect } from "react";
import { Plus, Edit2, Trash2 } from "lucide-react";
import { Button } from "@/shared/ui/button";
import { Card } from "@/shared/ui/card";
import { Badge } from "@/shared/ui/badge";
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
import type { Project } from "@/entities/project/model/types";

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
    const hardDelete = window.confirm("Delete project permanently? Cancel for soft delete.")
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
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-1.5 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-lg font-semibold tracking-tight">Projects</h2>
          <p className="text-sm text-muted-foreground">Manage project records, case stories, tech stack join links, and demo assets</p>
        </div>
        <Button onClick={handleOpenCreate} className="gap-2 self-start">
          <Plus size={16} /> Add Project
        </Button>
      </div>

      <Card className="overflow-hidden py-0">
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
                    <Skeleton className="h-12 w-20" />
                  </TableCell>
                  <TableCell>
                    <Skeleton className="h-4 w-32" />
                  </TableCell>
                  <TableCell>
                    <Skeleton className="h-4 w-48" />
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-1">
                      <Skeleton className="h-4 w-10" />
                      <Skeleton className="h-4 w-10" />
                    </div>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Skeleton className="h-8 w-16" />
                      <Skeleton className="h-8 w-12" />
                    </div>
                  </TableCell>
                </TableRow>
              ))
            ) : projects.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="p-8 text-center text-muted-foreground">
                  No projects configured. Click 'Add Project' to get started.
                </TableCell>
              </TableRow>
            ) : (
              projects.map((proj, idx) => (
                <TableRow
                  key={proj.id}
                  className="animate-content-enter"
                  style={{ animationDelay: `${idx * 60}ms` }}
                >
                  <TableCell>
                    <div className="shine-enter w-20 h-12 rounded-md">
                      <img
                        src={proj.thumbnail_url}
                        alt={proj.title}
                        className="w-full h-full rounded-md object-cover border border-border bg-muted"
                      />
                    </div>
                  </TableCell>
                  <TableCell className="font-medium text-foreground">{proj.title}</TableCell>
                  <TableCell className="text-muted-foreground text-xs max-w-xs truncate">{proj.description}</TableCell>
                  <TableCell className="text-muted-foreground text-xs space-y-1">
                    <div className="flex flex-wrap gap-1">
                      <Badge
                        variant="secondary"
                        asChild
                        className="cursor-pointer"
                      >
                        <button onClick={() => handleOpenStories(proj)}>
                          {proj.stories?.length || 0} Stories
                        </button>
                      </Badge>
                      <Badge variant="secondary" asChild className="cursor-pointer">
                        <button onClick={() => handleOpenTechStacks(proj)}>
                          {proj.tech_stacks?.length || 0} Stacks
                        </button>
                      </Badge>
                      <Badge variant="secondary" asChild className="cursor-pointer">
                        <button onClick={() => handleOpenGallery(proj)}>
                          {proj.images?.length || 0} Gallery
                        </button>
                      </Badge>
                      <Badge variant="secondary" asChild className="cursor-pointer">
                        <button onClick={() => handleOpenResources(proj)}>
                          {proj.resources?.length || 0} Links
                        </button>
                      </Badge>
                    </div>
                  </TableCell>
                  <TableCell className="text-right whitespace-nowrap">
                    <div className="flex justify-end gap-1">
                      <Button
                        variant="default"
                        size="icon-sm"
                        onClick={() => handleOpenEdit(proj)}
                        aria-label="Edit project"
                      >
                        <Edit2 size={14} />
                      </Button>
                      <Button
                        variant="destructive"
                        size="icon-sm"
                        onClick={() => handleDelete(proj.id)}
                        aria-label="Delete project"
                      >
                        <Trash2 size={14} />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </Card>

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
