

import * as React from "react"
import { tv, type VariantProps } from "tailwind-variants"
import { cn } from "@/shared/lib/utils"

const buttonVariants = tv({
  base: "focus-visible:border-ring focus-visible:ring-ring/50 aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive inline-flex shrink-0 items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium outline-none transition-all focus-visible:ring-[3px] disabled:pointer-events-none disabled:opacity-50 aria-disabled:pointer-events-none aria-disabled:opacity-50 [&_svg:not([class*='size-'])]:size-4 [&_svg]:pointer-events-none [&_svg]:shrink-0 cursor-pointer border border-transparent",
  variants: {
    variant: {
      default: "bg-[#ff5c06] text-white! border-white/35 font-semibold! rounded-2xl shadow-[0_6px_10px_rgba(255,255,255,0.5)_inset,-10px_40px_41px_-4px_rgba(0,0,0,0.01)] hover:opacity-90 will-change-transform transition-opacity",
      destructive:
        "bg-destructive text-white! shadow-xs hover:bg-destructive/90 focus-visible:ring-destructive/20 dark:focus-visible:ring-destructive/40 dark:bg-destructive/60 text-white",
      outline:
        "bg-background text-black! shadow-xs hover:bg-accent hover:text-accent-foreground dark:bg-input/30 dark:border-input dark:hover:bg-input/50 border-input",
      secondary: "bg-secondary text-black text-secondary-foreground shadow-xs hover:bg-secondary/80",
      ghost: "hover:bg-accent text-black! hover:text-accent-foreground dark:hover:bg-accent/50",
      link: "text-primary underline-offset-4 hover:underline",
    },
    size: {
      default: "h-9 px-4 py-2 has-[>svg]:px-3",
      sm: "h-8 gap-1.5 rounded-md px-3 has-[>svg]:px-2.5",
      lg: "h-10 rounded-md px-6 has-[>svg]:px-4",
      icon: "size-9",
    },
  },
  defaultVariants: {
    variant: "default",
    size: "default",
  },
})

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
  href?: string
}

const Button = React.forwardRef<HTMLButtonElement | HTMLAnchorElement, ButtonProps>(
  ({ className, variant, size, asChild = false, href, type = "button", ...props }, ref) => {
    if (href) {
      return (
        <a
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          ref={ref as any}
          className={cn(buttonVariants({ variant, size, className }))}
          href={href}
          {...(props as React.AnchorHTMLAttributes<HTMLAnchorElement>)}
        >
          {props.children}
        </a>
      )
    }

    return (
      <button
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        ref={ref as any}
        className={cn(buttonVariants({ variant, size, className }))}
        type={type}
        {...props}
      />
    )
  }
)
Button.displayName = "Button"

export { Button, buttonVariants }
