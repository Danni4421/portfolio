import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { tv, type VariantProps } from "tailwind-variants"
import { cn } from "@/shared/lib/utils"

const badgeVariants = tv({
  base: "inline-flex w-fit shrink-0 items-center justify-center gap-1 whitespace-nowrap rounded-md px-2 py-0.5 text-xs font-medium transition-colors [&>svg]:pointer-events-none [&>svg]:size-3",
  variants: {
    variant: {
      default: "bg-primary text-primary-foreground border border-transparent",
      secondary: "bg-secondary text-secondary-foreground border border-transparent hover:bg-accent hover:text-accent-foreground",
      destructive: "bg-destructive/10 text-destructive border border-transparent hover:bg-destructive/20",
      outline: "border border-border bg-background text-foreground",
    },
  },
  defaultVariants: {
    variant: "secondary",
  },
})

export interface BadgeProps
  extends React.HTMLAttributes<HTMLSpanElement>,
    VariantProps<typeof badgeVariants> {
  asChild?: boolean
}

function Badge({ className, variant, asChild = false, ...props }: BadgeProps) {
  const Comp = asChild ? Slot : "span"
  return <Comp className={cn(badgeVariants({ variant }), className)} {...props} />
}

export { Badge, badgeVariants }
