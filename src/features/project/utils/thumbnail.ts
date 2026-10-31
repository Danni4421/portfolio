import type { Project } from "../types";

export class ProjectThumbnail {
  static get(project: Project) {
    return (
      project.thumbnail_url ||
      "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='800' height='600'%3E%3Crect fill='%23f4f4f5' width='800' height='600'/%3E%3C/svg%3E"
    );
  }
}
