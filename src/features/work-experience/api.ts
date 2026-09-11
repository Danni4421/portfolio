import { Effect } from "effect"
import data from "@/shared/data.json"
import type { WorkExperience } from "./types"

const API_BASE = "/api/v1"

export const getWorkExperiences = (): Effect.Effect<{ experiences: Array<WorkExperience> }, Error> =>
  Effect.tryPromise({
    try: async () => {
      const res = await fetch(`${API_BASE}/work-experiences`)
      if (!res.ok) throw new Error("Failed to fetch work experiences")
      const json = await res.json()
      const experiences = (json.data ?? []) as WorkExperience[]
      // ponytail: Fallback to mock if empty
      return { experiences: experiences.length > 0 ? experiences : (data.workExperiences as WorkExperience[]) }
    },
    catch: (unknownError) => new Error(String(unknownError))
  }).pipe(
    Effect.catchAll(() => Effect.succeed({ experiences: data.workExperiences as WorkExperience[] }))
  )
