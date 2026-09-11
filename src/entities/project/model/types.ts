
import type { TechStack } from "../../tech-stack/model/types"

export interface ProjectStory {
  id: string
  project_id: string
  content: string
  author: string[]
  created_at: string
}

export interface ProjectImage {
  id: string
  project_id: string
  image_url: string
}

export interface ProjectResource {
  id: string
  project_id: string
  resource_url: string
  type: string
  title: string
}

export interface Project {
  id: string
  title: string
  slug?: string // Computed dynamically for routing
  description: string
  thumbnail_url: string
  created_at: string
  updated_at: string
  deleted_at: string | null
  stories: ProjectStory[]
  tech_stacks: TechStack[]
  images: ProjectImage[]
  resources: ProjectResource[]
}
