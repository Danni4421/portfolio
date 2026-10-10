// ponytail: separate project gallery manager sheet component
import { useState } from "react";
import { Loader2, Trash2, Image as ImageIcon } from "lucide-react";
import { Button } from "@/shared/ui/button";
import { FormField } from "@/shared/ui/form";
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
import { FileUploader } from "@/shared/ui/file-uploader";
import type { Project } from "@/entities/project/model/types";

interface ProjectImage {
  id: string;
  project_id: string;
  image_url: string;
}

interface ProjectGalleryDrawerProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  project: Project | null;
  setProject: React.Dispatch<React.SetStateAction<Project | null>>;
  onSuccess: () => void;
}

export function ProjectGalleryDrawer({
  open,
  onOpenChange,
  project,
  setProject,
  onSuccess,
}: ProjectGalleryDrawerProps) {
  const { toast } = useToast();
  const [galleryUploading, setGalleryUploading] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  if (!project) return null;

  const handleAddProjectImage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedFile) return;

    setGalleryUploading(true);
    Effect.runPromise(apiClient.uploadFile(selectedFile))
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
        setProject(updated as any);
        setSelectedFile(null);
        onSuccess();
        onOpenChange(false);
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
        setProject(updated as any);
        onSuccess();
        toast({ title: "Deleted", description: "Gallery image deleted successfully", variant: "success" });
      })
      .catch((err) => {
        toast({ title: "Error", description: err.message || "Failed to delete gallery image", variant: "destructive" });
      });
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>
            <ImageIcon size={18} className="text-foreground" /> Project Gallery
          </SheetTitle>
          <p className="text-xs text-muted-foreground font-medium mt-0.5">Project: {project.title}</p>
        </SheetHeader>

        <form onSubmit={handleAddProjectImage} className="flex min-h-0 flex-1 flex-col">
          <div className="min-h-0 flex-1 space-y-4 overflow-y-auto px-6 py-6">
            <FormField label="Add Gallery Image" htmlFor="gallery-image">
              <FileUploader
                onFileSelect={(file) => setSelectedFile(file)}
                loading={galleryUploading}
                previewUrl={selectedFile ? URL.createObjectURL(selectedFile) : null}
                onRemovePreview={() => setSelectedFile(null)}
                subLabel="Drag & drop or click to add gallery images (PNG, JPG, SVG)"
              />
            </FormField>

            <div className="space-y-2">
              <h4 className="text-xs font-bold text-foreground uppercase tracking-wider">
                Existing Images
              </h4>
              <div className="grid grid-cols-4 gap-3 max-h-[140px] overflow-y-auto pr-1">
                {project.images?.map((img) => (
                  <div key={img.id} className="relative group rounded-lg overflow-hidden border border-border h-14 bg-white flex items-center justify-center">
                    <img src={img.image_url} alt="Gallery" className="w-full h-full object-cover" />
                    <button
                      type="button"
                      onClick={() => handleDeleteProjectImage(img.id)}
                      className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-all flex items-center justify-center text-white cursor-pointer"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                ))}
                {(!project.images || project.images.length === 0) && (
                  <p className="col-span-4 text-xs text-muted-foreground italic text-center py-2">No gallery images uploaded.</p>
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
              disabled={galleryUploading || !selectedFile}
            >
              {galleryUploading && <Loader2 size={12} className="animate-spin" />}
              Upload Image
            </Button>
          </SheetFooter>
        </form>
      </SheetContent>
    </Sheet>
  );
}
