"use server";

import db from "@/lib/client";
import { workExperience, workExperienceTask } from "@/lib/schema";
import { Job } from "@/types";
import { eq } from "drizzle-orm/expressions";

export const getWorkExperiences = async (): Promise<Job[]> => {
  try {
    const workExperiences = await db
      .select()
      .from(workExperience)
      .innerJoin(
        workExperienceTask,
        eq(workExperience.id, workExperienceTask.wo_id)
      )
      .execute();

    if (!workExperiences) {
      throw new Error("Failed to fetch work experiences");
    }

    const groupedWorkExperiences: { [key: number]: Job } = {};

    workExperiences.forEach(({ work_experience, work_experience_task }) => {
      if (!groupedWorkExperiences[work_experience.id]) {
        groupedWorkExperiences[work_experience.id] = {
          id: work_experience.id,
          title: work_experience.title,
          createdAt: work_experience.createdAt,
          updatedAt: work_experience.updatedAt,
          logo: work_experience.logo,
          place: work_experience.place,
          isDone: work_experience.isDone,
          startDate: work_experience.startDate,
          endDate: work_experience.endDate,
          tasks: [],
        };
      }

      (groupedWorkExperiences[work_experience.id]?.tasks ?? []).push(
        work_experience_task
      );
    });

    return Object.values(groupedWorkExperiences);
  } catch (error) {
    console.error(error);
    throw new Error("An error occurred while fetching work experiences");
  }
};
