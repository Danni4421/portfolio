

import * as React from "react"
import { tv, type VariantProps } from "tailwind-variants"
import { cn } from "@/shared/lib/utils"

// ponytail: glossy embossed surface ported from dwifi_admin_lite_fe button
const embossShadow =
  "shadow-[0_6px_10px_rgba(255,255,255,0.5)_inset,-10px_40px_41px_-4px_rgba(0,0,0,0.01)]"
const emboss = `border-white/35 ${embossShadow}`

const buttonVariants = tv({
  base: "focus-visible:border-ring focus-visible:ring-ring/50 aria-invalid:ring-destructive/20 aria-invalid:border-destructive inline-flex shrink-0 items-center justify-center gap-1.5 whitespace-nowrap rounded-md text-sm font-medium outline-none transition-all focus-visible:ring-[3px] disabled:pointer-events-none disabled:opacity-50 aria-disabled:pointer-events-none aria-disabled:opacity-50 [&_svg:not([class*='size-'])]:size-4 [&_svg]:pointer-events-none [&_svg]:shrink-0 cursor-pointer border border-transparent select-none active:not-aria-[haspopup]:translate-y-px",
  variants: {
    variant: {
      default: `bg-primary text-primary-foreground hover:bg-primary/80 ${emboss}`,
      destructive: `bg-destructive text-white hover:bg-destructive/80 focus-visible:border-destructive/40 focus-visible:ring-destructive/20 ${emboss}`,
      outline: `border-border bg-background hover:bg-muted hover:text-foreground aria-expanded:bg-muted aria-expanded:text-foreground ${embossShadow}`,
      secondary: `bg-secondary text-secondary-foreground hover:bg-[color-mix(in_oklch,var(--secondary),var(--foreground)_5%)] ${emboss}`,
      ghost: "hover:bg-muted hover:text-foreground aria-expanded:bg-muted aria-expanded:text-foreground",
      link: "text-primary underline-offset-4 hover:underline",
    },
    size: {
      default: "h-9 px-4 py-2 has-[>svg]:px-3",
      sm: "h-8 gap-1 rounded-md px-2.5 has-[>svg]:px-2",
      lg: "h-10 gap-1.5 px-6 has-[>svg]:px-4",
      icon: "size-9",
      "icon-sm": "size-8 rounded-md",
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
