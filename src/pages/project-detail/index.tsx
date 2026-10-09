
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
      <main className="grid-pattern min-h-screen px-4 py-20 md:px-24 bg-white dark:bg-black">
        <div className="mx-auto max-w-4xl space-y-8" aria-hidden>
          {/* title */}
          <Skeleton className="h-12 w-2/3" />

          {/* thumbnail */}
          <Skeleton className="h-96 w-full rounded-2xl" />

          {/* short description */}
          <div className="flex flex-col gap-3">
            <Skeleton className="h-6 w-44" />
            <Skeleton className="h-5 w-full" />
            <Skeleton className="h-5 w-2/3" />
          </div>

          {/* story */}
          <div className="flex flex-col gap-3">
            <Skeleton className="h-6 w-40" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-11/12" />
            <Skeleton className="h-4 w-4/5" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-3/5" />
          </div>
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
        <h1 className="font-serif text-[3rem] leading-[1.1] tracking-[-0.02em] font-medium text-gray-900 dark:text-gray-100">{project.title}</h1>

        {project.thumbnail_url && (
          <img
            src={project.thumbnail_url}
            alt={project.title}
            className="h-96 w-full rounded-2xl object-cover"
          />
        )}

        {project.description && (
          <div className="flex flex-col">
            <p className="text-lg text-gray-700 dark:text-gray-300">
              {project.description}
            </p>
          </div>
        )}

        {storyMarkdown && (
          <div className="flex flex-col">
            <div className="flex items-center gap-4">
              <div className="flex-1 border-t border-dashed border-neutral-400" />
              <span className="text-neutral-400 whitespace-nowrap">
                Read the project story
              </span>
              <div className="flex-1 border-t border-dashed border-neutral-400" />
            </div>
            <div className="prose dark:prose-invert max-w-none space-y-6 mt-6">
              <Markdown>{storyMarkdown}</Markdown>
            </div>
          </div>
        )}
      </div>
    </main>
  )
}
