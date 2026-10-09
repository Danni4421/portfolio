import { Effect } from "effect"
import type { TechStack } from "../model/types"

const API_BASE = "/api/v1"

export const getTechStacks = (): Effect.Effect<{ stacks: Array<TechStack> }, Error> =>
  Effect.tryPromise({
    try: async () => {
      const res = await fetch(`${API_BASE}/tech-stacks`)
      if (!res.ok) throw new Error("Failed to fetch tech stacks")
      const json = await res.json()
      const stacks = (json.data ?? []) as TechStack[]
      return { stacks }
    },
    catch: (unknownError) => new Error(String(unknownError))
  })
