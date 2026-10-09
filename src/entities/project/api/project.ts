import { Effect } from "effect"
import type { Project } from "../model/types"

const API_BASE = "/api/v1"

const generateSlug = (title: string): string =>
  title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "")

export const getRecentProjects = (): Effect.Effect<{ projects: Array<Project> }, Error> =>
  Effect.tryPromise({
    try: async () => {
      const res = await fetch(`${API_BASE}/projects`)
      if (!res.ok) throw new Error("Failed to fetch projects")
      const json = await res.json()
      const projects = (json.data ?? []) as Array<Project>
      const projectsWithSlugs = projects.map(p => ({
        ...p,
        slug: p.slug || generateSlug(p.title)
      }))
      const sorted = [...projectsWithSlugs].sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
      return { projects: sorted }
    },
    catch: (unknownError) => new Error(String(unknownError))
  })


export const getProjectBySlug = (slug: string): Effect.Effect<{ project: Project | null }, Error> =>
  Effect.tryPromise({
    try: async () => {
      const res = await fetch(`${API_BASE}/projects/slug/${encodeURIComponent(slug)}`)
      if (!res.ok) throw new Error(`Failed to fetch project: ${res.status}`)
      const json = await res.json()
      const project = json.data as Project | undefined
      if (!project) return { project: null }
      return { project: { ...project, slug } }
    },
    catch: (unknownError) => new Error(String(unknownError))
  })
