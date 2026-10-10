/* eslint-disable react-refresh/only-export-components */
// ponytail: toast entry point — keeps the useToast() API, renders the sonner Toaster
import * as React from "react";
import { toast as sonnerToast } from "sonner";
import { Toaster } from "@/shared/ui/sonner";

interface ToastOptions {
  title?: React.ReactNode;
  description?: React.ReactNode;
  variant?: "default" | "destructive" | "success";
}

export function ToastProviderWrapper({ children }: { children: React.ReactNode }) {
  return (
    <>
      {children}
      <Toaster position="top-right" />
    </>
  );
}

export function useToast() {
  const toast = React.useCallback(
    ({ title, description, variant }: ToastOptions) => {
      const message = title ?? description;
      const options = { description: title ? description : undefined };
      if (variant === "success") {
        sonnerToast.success(message, options);
      } else if (variant === "destructive") {
        sonnerToast.error(message, options);
      } else {
        sonnerToast(message, options);
      }
    },
    []
  );

  return { toast };
}
