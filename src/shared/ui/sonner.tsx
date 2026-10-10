import { AlertTriangle, Check, Info, X } from "lucide-react"
import { Toaster as Sonner, toast } from "sonner"
import type { LucideIcon } from "lucide-react"
import type { ToastT, ToasterProps } from "sonner"
import { cn } from "@/shared/lib/utils"

export const DEFAULT_TOAST_DURATION = 5000

const toastIcon = (Icon: LucideIcon, colorClass: string) => (
  <span
    className={cn(
      "mt-2 flex size-5 shrink-0 items-center justify-center rounded-full text-white",
      colorClass
    )}
  >
    <Icon className="size-3" />
  </span>
)

// Restart toast timers when the pointer leaves the toaster so a hovered toast
// regains its full duration instead of resuming a partially elapsed one
const restartToastTimers = () =>
  toast
    .getToasts()
    .filter((t): t is ToastT => "title" in t && t.type !== "loading")
    .forEach((t) =>
      toast(t.title as string, {
        ...t,
        duration: (t.duration ?? DEFAULT_TOAST_DURATION) + 1,
      })
    )

const Toaster = ({ ...props }: ToasterProps) => {
  return (
    <div
      onMouseLeave={restartToastTimers}
      onPointerDown={(e) => e.stopPropagation()}
      onFocus={(e) => e.stopPropagation()}
    >
      <Sonner
        theme="light"
        className="toaster group pointer-events-auto"
        closeButton
        duration={DEFAULT_TOAST_DURATION}
        icons={{
          success: toastIcon(Check, "bg-emerald-500"),
          error: toastIcon(X, "bg-destructive"),
          warning: toastIcon(AlertTriangle, "bg-amber-500"),
          info: toastIcon(Info, "bg-sky-500"),
        }}
        toastOptions={{
          classNames: {
            toast:
              "group toast pointer-events-auto shadow-none! !items-start !p-4 group-[.toaster]:bg-background group-[.toaster]:text-foreground group-[.toaster]:border-neutral-200 group-[.toaster]:shadow-sm group-[.toaster]:rounded-xl",
            content: "pr-6",
            title: "text-sm font-semibold",
            description:
              "text-sm group-[.toast]:text-neutral-500!",
            actionButton:
              "group-[.toast]:bg-primary group-[.toast]:text-primary-foreground",
            cancelButton:
              "group-[.toast]:bg-neutral-100 group-[.toast]:text-neutral-500",
            closeButton:
              "!absolute !top-3 !right-3 !left-auto !translate-none !size-5 !rounded-md !border-0 !bg-transparent !opacity-100 !text-neutral-400 hover:!text-neutral-700",
          },
        }}
        style={
          {
            "--normal-bg": "var(--popover)",
            "--normal-text": "var(--popover-foreground)",
            "--normal-border": "var(--border)",
            fontFamily: "var(--font-sans)",
          } as React.CSSProperties
        }
        {...props}
      />
    </div>
  )
}

export { Toaster }
