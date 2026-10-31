
import { apiClient } from "@/shared/api/client";
import { Effect } from "effect";
import type { ProjectStory } from "../types";
import { toast } from "sonner";
import {
  useMutation,
  type UseMutationOptions,
} from "@tanstack/react-query";

export interface CreateProjectStoryParams {
  project_id: string;
  content: string;
  authors: string;
}

export interface CreateProjectStoryResponse {
  success: boolean;
  data: ProjectStory;
}

export function createProjectStory({
  project_id,
  content,
  authors,
}: CreateProjectStoryParams): Promise<CreateProjectStoryResponse> {
  const author = authors
    .split(",")
    .map((a) => a.trim())
    .filter(Boolean);

  return Effect.runPromise(
    apiClient.post<CreateProjectStoryResponse>(
      "/api/v1/project-stories",
      {
        project_id,
        content,
        author,
      },
    ),
  ).catch((err: unknown) => {
    const message =
      err instanceof Error
        ? err.message
        : "Failed to create project story";

    toast.error(message);
    throw err;
  });
}

export type UseCreateProjectStoryOptions = Omit<
  UseMutationOptions<
    CreateProjectStoryResponse,
    Error,
    CreateProjectStoryParams
  >,
  "mutationKey" | "mutationFn"
>;

export function useCreateProjectStory(
  options?: UseCreateProjectStoryOptions,
) {
  return useMutation({
    mutationKey: ["create", "project-story"],
    mutationFn: createProjectStory,
    ...options,
  });
}
