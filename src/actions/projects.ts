import db from "@/lib/client";
import { project } from "@/lib/schema";
import { Project } from "@/types";

export const getProjects = async (): Promise<Project[]> => {
  try {
    const projects = await db.select().from(project).execute();
    return projects;
  } catch (error) {
    if (error instanceof Error) {
      throw new Error("An error occurred while fetching projects");
    }
  }
  return [];
};
