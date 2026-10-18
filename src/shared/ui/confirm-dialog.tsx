// ponytail: shared confirmation dialog replacing window.confirm across admin pages
// The dialog stays open until the caller closes it (on success); pass `loading` to
// show a spinner and block interactions while the async action is in flight.
import { Loader2 } from "lucide-react";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogFooter,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogAction,
  AlertDialogCancel,
} from "@/shared/ui/alert-dialog";

interface ConfirmDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  description: string;
  confirmLabel?: string;
  cancelLabel?: string;
  onConfirm: () => void;
  /** Disables actions and shows a spinner on the confirm button; caller closes the dialog on success */
  loading?: boolean;
  /** Optional middle action, e.g. "Soft delete" alongside a permanent delete */
  secondaryAction?: {
    label: string;
    onAction: () => void;
  };
}

const actionDisabled =
  "disabled:pointer-events-none disabled:opacity-50";

export function ConfirmDialog({
  open,
  onOpenChange,
  title,
  description,
  confirmLabel = "Delete",
  cancelLabel = "Cancel",
  onConfirm,
  loading = false,
  secondaryAction,
}: ConfirmDialogProps) {
  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{title}</AlertDialogTitle>
          <AlertDialogDescription>{description}</AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={loading}>{cancelLabel}</AlertDialogCancel>
          {secondaryAction && (
            <AlertDialogAction
              disabled={loading}
              className={actionDisabled}
              onClick={(e) => {
                e.preventDefault();
                if (!loading) secondaryAction.onAction();
              }}
            >
              {secondaryAction.label}
            </AlertDialogAction>
          )}
          <AlertDialogAction
            disabled={loading}
            className={`bg-destructive text-white hover:bg-destructive/80 focus-visible:border-destructive/40 focus-visible:ring-destructive/20 ${actionDisabled}`}
            onClick={(e) => {
              e.preventDefault();
              if (!loading) onConfirm();
            }}
          >
            {loading && <Loader2 size={14} className="animate-spin" />}
            {confirmLabel}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
