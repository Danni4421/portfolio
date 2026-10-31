
import { Skeleton } from "@/shared/ui/skeleton";

export function ProjectListSkeleton() {
  return (
    <section
      id="projects"
      className="scroll-mt-24 border-t border-gray-100 px-4 py-16 md:scroll-mt-20 md:py-24"
    >
      <div className="mx-auto max-w-5xl">
        <div className="mb-6 grid grid-cols-1 gap-x-1 gap-y-4 md:mb-8 md:grid-cols-2">
          <p className="text-lg tracking-[-0.64px] text-black">
            What have I been working on?
          </p>

          <p className="text-sm leading-relaxed text-gray-500">
            Projects I've created and built with care.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-10 md:grid-cols-[0.95fr_1fr] md:gap-16 lg:gap-24">
          <div className="flex flex-col gap-5">
            <Skeleton className="aspect-7/5 w-full rounded-[2rem]" />
            <Skeleton className="aspect-7/5 w-full rounded-[2rem]" />
          </div>

          <div className="space-y-5">
            <Skeleton className="h-3 w-28" />
            <Skeleton className="h-8 w-3/4" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-5/6" />
            <Skeleton className="h-4 w-2/3" />
          </div>
        </div>
      </div>
    </section>
  );
}
