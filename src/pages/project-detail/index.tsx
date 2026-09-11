
import { useParams } from "react-router-dom"
import Markdown from "react-markdown"
import { Effect } from "effect"
import { getProjectBySlug } from "@/entities/project/api/project"
import { Skeleton } from "@/shared/ui/skeleton"
import { useQuery } from "@tanstack/react-query"
import type { Project } from "@/entities/project/model/types"

interface ProjectDetailData {
  project: Project | null
  markdown: string
}

export function ProjectDetailPage() {
  const { slug } = useParams<{ slug: string }>()

  // ponytail: useQuery handles loading, error states, and caches the project detail
  const { data: projectDetail, isLoading: loading } = useQuery<ProjectDetailData>({
    queryKey: ["project", slug],
    queryFn: () =>
      Effect.runPromise(
        Effect.gen(function* () {
          const { project: fetchedProject } = yield* getProjectBySlug(slug!)
          
          let markdown = ""
          if (fetchedProject && fetchedProject.stories && fetchedProject.stories.length > 0) {
            // Concatenate all stories content
            markdown = fetchedProject.stories.map((s) => s.content).join("\n\n")
          }

          return { project: fetchedProject, markdown }
        })
      ),
    enabled: !!slug,
  })

  const project = projectDetail?.project ?? null
  const storyMarkdown = projectDetail?.markdown ?? ""


  if (loading) {
    return (
      <main className="grid-pattern min-h-screen px-4 py-20 md:px-24">
        <div className="mx-auto max-w-4xl space-y-8">
          <Skeleton className="h-10 w-3/4" />
          <Skeleton className="h-96 w-full rounded-2xl" />
        </div>
      </main>
    )
  }

  if (!project) {
    return (
      <main className="grid-pattern min-h-screen px-4 py-20 md:px-24">
        <div className="mx-auto max-w-4xl text-center">
          <h1 className="text-3xl font-bold">Project not found</h1>
        </div>
      </main>
    )
  }

  return (
    <main className="grid-pattern min-h-screen px-4 py-20 md:px-24 bg-white dark:bg-black">
      <div className="mx-auto max-w-4xl space-y-8">
        <h1 className="font-serif text-[3rem] leading-[1.1] tracking-[-0.02em] font-bold text-gray-900 dark:text-gray-100">{project.title}</h1>

        {project.thumbnail_url && (
          <img
            src={project.thumbnail_url}
            alt={project.title}
            className="h-96 w-full rounded-2xl object-cover"
          />
        )}

        {project.description && (
          <div className="flex flex-col">
            <h6 className="text-xl font-bold text-neutral-800 dark:text-neutral-200">Short Description:</h6>
            <p className="text-lg text-gray-700 dark:text-gray-300">
              {project.description}
            </p>
          </div>
        )}

        {storyMarkdown && (
          <div className="flex flex-col">
            <h6 className="mb-4 text-xl font-bold text-neutral-800 dark:text-neutral-200">Read the story:</h6>
            <div className="prose dark:prose-invert max-w-none space-y-6">
              <Markdown>{storyMarkdown}</Markdown>
            </div>
          </div>
        )}
      </div>
    </main>
  )
}
