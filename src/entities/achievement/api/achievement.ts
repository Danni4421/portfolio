import { Effect } from "effect"
import data from "@/shared/data.json"
import type { Achievement } from "../model/types"

const API_BASE = "/api/v1"

export const getAchievements = (): Effect.Effect<{ achievements: Array<Achievement> }, Error> =>
  Effect.tryPromise({
    try: async () => {
      const res = await fetch(`${API_BASE}/achievements`)
      if (!res.ok) throw new Error("Failed to fetch achievements")
      const json = await res.json()
      const achievements = (json.data ?? []) as Achievement[]
      // ponytail: Fallback to mock if empty
      return { achievements: achievements.length > 0 ? achievements : [] }
    },
    catch: (unknownError) => new Error(String(unknownError))
  }).pipe(
    Effect.catchAll(() => Effect.succeed({ achievements: data.achievements as Achievement[] }))
  )
