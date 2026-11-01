// ponytail: work experience image fan manager drawer
import * as React from "react";
import { useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { Image as ImageIcon, Loader2, Trash2 } from "lucide-react";
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
import type { WorkExperience, WorkExperienceImage } from "../types";

interface WorkExperienceImagesDrawerProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  experience: WorkExperience | null;
  setExperience: React.Dispatch<React.SetStateAction<WorkExperience | null>>;
  onSuccess: () => void;
}

export function WorkExperienceImagesDrawer({
  open,
  onOpenChange,
  experience,
  setExperience,
  onSuccess,
}: WorkExperienceImagesDrawerProps) {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [uploading, setUploading] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploadKey, setUploadKey] = useState(0);

  if (!experience) return null;

  const refresh = () => {
    onSuccess();
    queryClient.invalidateQueries({ queryKey: ["workExperiences"] });
  };

  const handleAddImage = (event: React.FormEvent) => {
    event.preventDefault();
    if (!selectedFile) return;

    setUploading(true);
    Effect.runPromise(apiClient.uploadFile(selectedFile))
      .then((url) =>
        Effect.runPromise(
          apiClient.post<{ success: boolean; data: WorkExperienceImage }>(
            "/api/v1/work-experience-images",
            {
              work_experience_id: experience.id,
              image_url: url,
            },
          ),
        ),
      )
      .then((res) => {
        setExperience({
          ...experience,
          images: [...(experience.images || []), res.data],
        });
        setSelectedFile(null);
        setUploadKey((key) => key + 1);
        refresh();
        toast({
          title: "Success",
          description: "Experience image uploaded successfully",
          variant: "success",
        });
      })
      .catch((err) => {
        toast({
          title: "Upload Failed",
          description: err.message || "Failed to upload experience image",
          variant: "destructive",
        });
      })
      .finally(() => {
        setUploading(false);
      });
  };

  const handleDeleteImage = (imageId: string) => {
    Effect.runPromise(
      apiClient.delete(
        `/api/v1/work-experience-images/${imageId}`,
        "?soft=false",
      ),
    )
      .then(() => {
        setExperience({
          ...experience,
          images: (experience.images || []).filter(
            (image) => image.id !== imageId,
          ),
        });
        refresh();
        toast({
          title: "Deleted",
          description: "Experience image deleted successfully",
          variant: "success",
        });
      })
      .catch((err) => {
        toast({
          title: "Error",
          description: err.message || "Failed to delete experience image",
          variant: "destructive",
        });
      });
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>
            <ImageIcon size={18} className="text-foreground" /> Experience Images
          </SheetTitle>
          <p className="mt-0.5 text-xs font-medium text-muted-foreground">
            {experience.title}
          </p>
        </SheetHeader>

        <form onSubmit={handleAddImage} className="flex min-h-0 flex-1 flex-col">
          <div className="min-h-0 flex-1 space-y-4 overflow-y-auto px-6 py-6">
            <FormField label="Add Image" htmlFor="experience-image">
              <FileUploader
                key={uploadKey}
                onFileSelect={(file) => setSelectedFile(file)}
                loading={uploading}
                previewUrl={
                  selectedFile ? URL.createObjectURL(selectedFile) : null
                }
                onRemovePreview={() => setSelectedFile(null)}
                subLabel="Drag & drop or click to add experience images (PNG, JPG, SVG)"
              />
            </FormField>

            <div className="space-y-2">
              <h4 className="text-xs font-bold uppercase tracking-wider text-foreground">
                Existing Images
              </h4>
              <div className="grid max-h-[180px] grid-cols-4 gap-3 overflow-y-auto pr-1">
                {experience.images?.map((image) => (
                  <div
                    key={image.id}
                    className="group relative flex h-14 items-center justify-center overflow-hidden rounded-lg border border-border bg-white"
                  >
                    <img
                      src={image.image_url}
                      alt="Experience"
                      className="h-full w-full object-cover"
                    />
                    <button
                      type="button"
                      onClick={() => handleDeleteImage(image.id)}
                      className="absolute inset-0 flex cursor-pointer items-center justify-center bg-black/60 text-white opacity-0 transition-all group-hover:opacity-100"
                      aria-label="Delete experience image"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                ))}
                {(!experience.images || experience.images.length === 0) && (
                  <p className="col-span-4 py-2 text-center text-xs italic text-muted-foreground">
                    No images uploaded.
                  </p>
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
              Close
            </Button>
            <Button
              type="submit"
              className="gap-1.5"
              disabled={uploading || !selectedFile}
            >
              {uploading && <Loader2 size={12} className="animate-spin" />}
              Upload Image
            </Button>
          </SheetFooter>
        </form>
      </SheetContent>
    </Sheet>
  );
}
