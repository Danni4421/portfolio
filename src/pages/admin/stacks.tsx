// ponytail: stacks crud page separated from unified dashboard layout
import { useState, useEffect } from "react";
import { Plus, Edit2, Trash2 } from "lucide-react";
import { Button } from "@/shared/ui/button";
import { Card } from "@/shared/ui/card";
import { Skeleton } from "@/shared/ui/skeleton";
import { apiClient } from "@/shared/api/client";
import { Effect } from "effect";
import { useToast } from "@/shared/ui/toast";
import { ConfirmDialog } from "@/shared/ui/confirm-dialog";
import { TechStackDrawer } from "@/features/tech-stack/components/tech-stack-drawer";
import type { TechStack } from "@/features/tech-stack/types";

export function AdminStacksPage() {
  const { toast } = useToast();
  const [stacks, setStacks] = useState<TechStack[]>([]);
  const [loading, setLoading] = useState(true);
  const [formOpen, setFormOpen] = useState(false);
  const [editingStack, setEditingStack] = useState<TechStack | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [deleting, setDeleting] = useState(false);

  const fetchStacks = () => {
    setLoading(true);
    Effect.runPromise(apiClient.get("/api/v1/tech-stacks"))
      .then((res) => {
        const data = res as { data: TechStack[] };
        setStacks(data.data);
      })
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  };

  useEffect(() => { fetchStacks(); }, []);

  const handleOpenCreate = () => { setEditingStack(null); setFormOpen(true); };
  const handleOpenEdit = (stack: TechStack) => { setEditingStack(stack); setFormOpen(true); };

  const handleDelete = () => {
    if (!deleteId) return;
    setDeleting(true);
    Effect.runPromise(apiClient.delete(`/api/v1/tech-stacks/${deleteId}`))
      .then(() => { setDeleteId(null); fetchStacks(); toast({ title: "Deleted", description: "Stack deleted", variant: "success" }); })
      .catch((err) => toast({ title: "Error", description: err.message, variant: "destructive" }))
      .finally(() => setDeleting(false));
  };

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-1.5 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-xl font-bold tracking-tight text-foreground">Tech Stacks</h1>
          <p className="text-xs text-muted-foreground mt-0.5">Manage the technical competencies and skills displayed on the showcase.</p>
        </div>
        <Button onClick={handleOpenCreate} className="gap-2 shadow-xs cursor-pointer">
          <Plus size={16} /> Add Stack
        </Button>
      </div>

      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
        {loading ? (
          Array.from({ length: 6 }).map((_, i) => (
            <Card key={i} className="flex flex-col items-center justify-center p-6 gap-3">
              <Skeleton className="h-12 w-12 rounded-full" />
              <Skeleton className="h-4 w-20" />
            </Card>
          ))
        ) : stacks.length === 0 ? (
          <div className="col-span-full py-12 text-center text-muted-foreground border border-dashed rounded-xl border-border">
            No tech stacks configured yet.
          </div>
        ) : (
          stacks.map((stack) => (
            <Card key={stack.id} className="relative group overflow-hidden border-border/60 hover:border-border transition-all flex flex-col items-center justify-center p-5 text-center">
              <div className="absolute top-2 right-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                <Button variant="ghost" size="icon" className="h-7 w-7 text-muted-foreground hover:text-foreground" onClick={() => handleOpenEdit(stack)}>
                  <Edit2 size={13} />
                </Button>
                <Button variant="ghost" size="icon" className="h-7 w-7 text-destructive hover:bg-destructive/10" onClick={() => setDeleteId(stack.id)}>
                  <Trash2 size={13} />
                </Button>
              </div>

              <div className="h-12 w-12 flex items-center justify-center mb-3">
                <img
                  src={stack.image_logo || "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='150' height='150'%3E%3Crect fill='%23e5e7eb' width='150' height='150'/%3E%3C/svg%3E"}
                  alt={stack.name}
                  className="max-h-full max-w-full object-contain"
                />
              </div>

              <span className="font-semibold text-sm text-foreground mb-1">{stack.name}</span>
              {stack.redirect_url && (
                <a
                  href={stack.redirect_url}
                  target="_blank"
                  rel="noreferrer"
                  className="text-[11px] text-muted-foreground hover:underline truncate max-w-[120px]"
                >
                  {stack.redirect_url}
                </a>
              )}
            </Card>
          ))
        )}
      </div>

      <TechStackDrawer
        open={formOpen}
        onOpenChange={setFormOpen}
        editingStack={editingStack}
        stacksCount={stacks.length}
        onSuccess={fetchStacks}
      />

      <ConfirmDialog
        open={!!deleteId}
        onOpenChange={(open) => !open && setDeleteId(null)}
        title="Delete Tech Stack"
        description="Are you sure you want to delete this tech stack? It will also be removed from any linked projects."
        confirmLabel="Delete"
        loading={deleting}
        onConfirm={handleDelete}
      />
    </div>
  );
}
