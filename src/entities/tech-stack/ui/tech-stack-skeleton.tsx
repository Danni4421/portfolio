
import { Skeleton } from "@/shared/ui/skeleton"

export function TechStackSkeletonList() {
  return (
    <div className="flex gap-12">
      {Array.from({ length: 6 }).map((_, i) => (
        <div key={i} className="flex flex-col items-center">
          <Skeleton className="mb-4 h-32 w-32 rounded-md" />
          <Skeleton className="mb-2 h-6 w-3/4 rounded-md" />
        </div>
      ))}
    </div>
  )
}
