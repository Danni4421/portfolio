
import { apiClient } from "@/shared/api/client";
import { Effect } from "effect";
import { toast } from "sonner";
import {
  useMutation,
  type UseMutationOptions,
} from "@tanstack/react-query";

export interface DeleteProjectStoryParams {
  story_id: string;
}

export interface DeleteProjectStoryResponse {
  success: boolean;
  message?: string;
}

export function deleteProjectStory({
  story_id,
}: DeleteProjectStoryParams): Promise<DeleteProjectStoryResponse> {
  return Effect.runPromise(
    apiClient.delete<DeleteProjectStoryResponse>(
      `/api/v1/project-stories/${story_id}`,
      "?soft=false",
    ),
  ).catch((err) => {
    toast.error(err.message || "Failed to delete project story")
    return Promise.reject(err);
  });
}

export type UseDeleteProjectStoryOptions = Omit<
  UseMutationOptions<
    DeleteProjectStoryResponse,
    Error,
    DeleteProjectStoryParams
  >,
  "mutationKey" | "mutationFn"
>;

export function useDeleteProjectStory(
  options?: UseDeleteProjectStoryOptions,
) {
  return useMutation({
    mutationKey: ["delete", "project-story"],
    mutationFn: deleteProjectStory,
    ...options,
  });
}
