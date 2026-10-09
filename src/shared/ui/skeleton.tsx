
import { cn } from "@/shared/lib/utils"

function Skeleton({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn("bg-neutral-200 animate-pulse rounded-md", className)}
      {...props}
    />
  )
}

export { Skeleton }
