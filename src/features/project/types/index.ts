import type { RefObject } from "react";
import type { TechStack } from "@/features/tech-stack/types";

export interface ProjectStory {
  id: string;
  project_id: string;
  content: string;
  author: Array<string>;
  created_at: string;
}

export interface ProjectImage {
  id: string;
  project_id: string;
  image_url: string;
}

export interface ProjectResource {
  id: string;
  project_id: string;
  resource_url: string;
  type: string;
  title: string;
}

export interface Project {
  id: string;
  title: string;
  slug?: string;
  description: string;
  thumbnail_url: string;
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
  stories: Array<ProjectStory>;
  tech_stacks: Array<TechStack>;
  images: Array<ProjectImage>;
  resources: Array<ProjectResource>;
}

export interface ProjectListState {
  activeIndex: number;
  setActiveIndex: (index: number) => void;
  reducedMotion: boolean;
}

export interface ProjectScrollOptions {
  stageRef: RefObject<HTMLDivElement | null>;
  railRef: RefObject<HTMLDivElement | null>;
  activeIndex: number;
  projectCount: number;
  onActiveChange: (index: number) => void;
  enabled?: boolean;
}
