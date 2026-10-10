import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Loader2, Trash2 } from "lucide-react";
import { Button } from "@/shared/ui/button";
import { FormTextField } from "@/shared/ui/form";
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
import type { Achievement } from "@/entities/achievement/model/types";

const resourceSchema = z.object({
  resource_url: z.string().min(1, "Resource URL is required"),
});

type ResourceFormValues = z.infer<typeof resourceSchema>;

interface AchievementResource {
  id: string;
  achievement_id: string;
  resource_url: string;
}

interface AchievementResourcesDrawerProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  achievement: Achievement | null;
  setAchievement: React.Dispatch<React.SetStateAction<Achievement | null>>;
  onSuccess: () => void;
}

export function AchievementResourcesDrawer({
  open,
  onOpenChange,
  achievement,
  setAchievement,
  onSuccess,
}: AchievementResourcesDrawerProps) {
  const { toast } = useToast();
  const [resourceLoading, setResourceLoading] = useState(false);
  const form = useForm<ResourceFormValues>({
    resolver: zodResolver(resourceSchema),
    defaultValues: { resource_url: "" },
  });

  if (!achievement) return null;

  const handleAddResource = form.handleSubmit((values) => {
    setResourceLoading(true);
    Effect.runPromise(
      apiClient.post<{ success: boolean; data: AchievementResource }>(
        "/api/v1/achievement-resources",
        {
          achievement_id: achievement.id,
          resource_url: values.resource_url,
        },
      ),
    )
      .then((res) => {
        setAchievement({
          ...achievement,
          resources: [...(achievement.resources || []), res.data],
        });
        form.reset({ resource_url: "" });
        onSuccess();
        toast({
          title: "Success",
          description: "Resource link added successfully",
          variant: "success",
        });
      })
      .catch((err) => {
        toast({
          title: "Error",
          description: err.message || "Failed to add resource link",
          variant: "destructive",
        });
      })
      .finally(() => {
        setResourceLoading(false);
      });
  });

  const handleDeleteResource = (resId: string) => {
    Effect.runPromise(
      apiClient.delete(`/api/v1/achievement-resources/${resId}`, "?soft=false"),
    )
      .then(() => {
        setAchievement({
          ...achievement,
          resources: (achievement.resources || []).filter(
            (r) => r.id !== resId,
          ),
        });
        onSuccess();
        toast({
          title: "Deleted",
          description: "Resource link deleted successfully",
          variant: "success",
        });
      })
      .catch((err) => {
        toast({
          title: "Error",
          description: err.message || "Failed to delete resource",
          variant: "destructive",
        });
      });
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>Verification Resources</SheetTitle>
          <p className="text-lg text-muted-foreground font-medium mt-0.5">
            {achievement.title}
          </p>
        </SheetHeader>

        <form
          onSubmit={handleAddResource}
          className="flex min-h-0 flex-1 flex-col"
        >
          <div className="min-h-0 flex-1 space-y-4 overflow-y-auto px-6 py-6">
            <FormTextField
              name="resource_url"
              label="Resource URL"
              placeholder="https://verify.credentials.com/..."
              register={form.register}
              error={form.formState.errors.resource_url}
              required
            />

            <div className="space-y-2 max-h-[220px] overflow-y-auto pr-1 mt-5">
              {achievement.resources?.map((r) => (
                <div
                  key={r.id}
                  className="flex items-center justify-between gap-3 p-2.5 bg-muted/50 border border-border rounded-lg text-xs leading-normal"
                >
                  <span className="truncate flex-1 text-foreground font-mono">
                    {r.resource_url}
                  </span>
                  <button
                    type="button"
                    onClick={() => handleDeleteResource(r.id)}
                    className="text-destructive hover:text-destructive p-1 cursor-pointer flex-shrink-0 self-start"
                  >
                    <Trash2 size={12} />
                  </button>
                </div>
              ))}
              {(!achievement.resources ||
                achievement.resources.length === 0) && (
                <p className="text-xs text-muted-foreground italic mt-2 text-center">
                  No verification links added yet.
                </p>
              )}
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
              {resourceLoading && (
                <Loader2 size={12} className="animate-spin" />
              )}
              Add Resource
            </Button>
          </SheetFooter>
        </form>
      </SheetContent>
    </Sheet>
  );
}
