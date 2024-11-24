"use server";

import db from "@/lib/client";
import { achievement } from "@/lib/schema";
import { Achievement } from "@/types";

export const getAchievements = async (): Promise<Achievement[]> => {
  try {
    const achievements = await db.select().from(achievement).execute();

    if (!achievements) {
      throw new Error("Failed to fetch achievements");
    }

    return achievements;
  } catch (error) {
    return [];
  }
};
