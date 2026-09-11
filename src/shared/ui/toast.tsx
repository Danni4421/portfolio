/* eslint-disable react-refresh/only-export-components */
// ponytail: clean, high-performance Shadcn Toast component powered by Radix Toast primitives
import * as React from "react";
import * as ToastPrimitives from "@radix-ui/react-toast";
import { X, AlertCircle, CheckCircle } from "lucide-react";
import { cn } from "@/shared/lib/utils";

const ToastProvider = ToastPrimitives.Provider;

const ToastViewport = React.forwardRef<
  React.ElementRef<typeof ToastPrimitives.Viewport>,
  React.ComponentPropsWithoutRef<typeof ToastPrimitives.Viewport>
>(({ className, ...props }, ref) => (
  <ToastPrimitives.Viewport
    ref={ref}
    className={cn(
      "fixed top-0 z-[100] flex max-h-screen w-full flex-col-reverse p-4 sm:bottom-0 sm:right-0 sm:top-auto sm:flex-col md:max-w-[420px]",
      className
    )}
    {...props}
  />
));
ToastViewport.displayName = ToastPrimitives.Viewport.displayName;

const Toast = React.forwardRef<
  React.ElementRef<typeof ToastPrimitives.Root>,
  React.ComponentPropsWithoutRef<typeof ToastPrimitives.Root> & {
    variant?: "default" | "destructive" | "success";
  }
>(({ className, variant = "default", ...props }, ref) => {
  return (
    <ToastPrimitives.Root
      ref={ref}
      className={cn(
        "group pointer-events-auto relative flex w-full items-center justify-between space-x-4 overflow-hidden rounded-xl border p-4 pr-8 shadow-lg transition-all data-[state=open]:animate-in data-[state=closed]:animate-out data-[swipe=end]:animate-out data-[state=closed]:fade-out-80 data-[state=open]:slide-in-from-top-full data-[state=open]:sm:slide-in-from-bottom-full data-[state=closed]:slide-out-to-right-full",
        variant === "default" && "bg-white/90 dark:bg-neutral-900/90 text-neutral-950 dark:text-neutral-50 border-neutral-200 dark:border-neutral-800 backdrop-blur-md",
        variant === "destructive" && "destructive border-red-500/30 bg-red-50/90 dark:bg-red-950/20 text-red-900 dark:text-red-200 backdrop-blur-md",
        variant === "success" && "border-emerald-500/30 bg-emerald-50/90 dark:bg-emerald-950/20 text-emerald-900 dark:text-emerald-200 backdrop-blur-md",
        className
      )}
      {...props}
    />
  );
});
Toast.displayName = ToastPrimitives.Root.displayName;

const ToastClose = React.forwardRef<
  React.ElementRef<typeof ToastPrimitives.Close>,
  React.ComponentPropsWithoutRef<typeof ToastPrimitives.Close>
>(({ className, ...props }, ref) => (
  <ToastPrimitives.Close
    ref={ref}
    className={cn(
      "absolute right-2 top-2 rounded-md p-1 text-neutral-500 hover:text-neutral-950 dark:text-neutral-400 dark:hover:text-neutral-50 opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer",
      className
    )}
    toast-close=""
    {...props}
  >
    <X className="h-4 w-4" />
  </ToastPrimitives.Close>
));
ToastClose.displayName = ToastPrimitives.Close.displayName;

const ToastTitle = React.forwardRef<
  React.ElementRef<typeof ToastPrimitives.Title>,
  React.ComponentPropsWithoutRef<typeof ToastPrimitives.Title>
>(({ className, ...props }, ref) => (
  <ToastPrimitives.Title
    ref={ref}
    className={cn("text-sm font-semibold leading-none tracking-tight", className)}
    {...props}
  />
));
ToastTitle.displayName = ToastPrimitives.Title.displayName;

const ToastDescription = React.forwardRef<
  React.ElementRef<typeof ToastPrimitives.Description>,
  React.ComponentPropsWithoutRef<typeof ToastPrimitives.Description>
>(({ className, ...props }, ref) => (
  <ToastPrimitives.Description
    ref={ref}
    className={cn("text-xs opacity-90 leading-normal mt-1", className)}
    {...props}
  />
));
ToastDescription.displayName = ToastPrimitives.Description.displayName;



interface ToastItem {
  id: string;
  title?: React.ReactNode;
  description?: React.ReactNode;
  variant?: "default" | "destructive" | "success";
  open?: boolean;
}

const ToastContext = React.createContext<{
  toast: (props: Omit<ToastItem, "id">) => void;
  toasts: ToastItem[];
  dismiss: (id: string) => void;
} | null>(null);

export function ToastProviderWrapper({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = React.useState<ToastItem[]>([]);

  const toast = React.useCallback(({ title, description, variant }: Omit<ToastItem, "id">) => {
    const id = Math.random().toString(36).substring(2, 9);
    setToasts((prev) => [...prev, { id, title, description, variant, open: true }]);
  }, []);

  const dismiss = React.useCallback((id: string) => {
    setToasts((prev) => prev.map((t) => (t.id === id ? { ...t, open: false } : t)));
    // Clean up after exit animation
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 1000);
  }, []);

  return (
    <ToastContext.Provider value={{ toast, toasts, dismiss }}>
      <ToastProvider>
        {children}
        {toasts.map(({ id, title, description, variant, open }) => (
          <Toast
            key={id}
            variant={variant}
            open={open}
            onOpenChange={(isOpen) => {
              if (!isOpen) dismiss(id);
            }}
          >
            <div className="flex gap-3 items-start">
              {variant === "destructive" && <AlertCircle className="h-5 w-5 text-red-650 shrink-0 mt-0.5" />}
              {variant === "success" && <CheckCircle className="h-5 w-5 text-emerald-600 shrink-0 mt-0.5" />}
              <div className="grid gap-1">
                {title && <ToastTitle>{title}</ToastTitle>}
                {description && <ToastDescription>{description}</ToastDescription>}
              </div>
            </div>
            <ToastClose />
          </Toast>
        ))}
        <ToastViewport />
      </ToastProvider>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const context = React.useContext(ToastContext);
  if (!context) {
    throw new Error("useToast must be used within a ToastProviderWrapper");
  }
  return context;
}
