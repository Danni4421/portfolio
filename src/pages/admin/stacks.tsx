// ponytail: stacks crud page separated from unified dashboard layout
import { useState, useEffect } from "react";
import { Plus, Edit2, Trash2 } from "lucide-react";
import { Button } from "@/shared/ui/button";
import { Card, CardContent } from "@/shared/ui/card";
import { Skeleton } from "@/shared/ui/skeleton";
import { apiClient } from "@/shared/api/client";
import { Effect } from "effect";
import { useToast } from "@/shared/ui/toast";
import { TechStackDrawer } from "@/features/tech-stack/components/tech-stack-drawer";
import type { TechStack } from "@/entities/tech-stack/model/types";

export function AdminStacksPage() {
  const { toast } = useToast();
  const [stacks, setStacks] = useState<TechStack[]>([]);
  const [loading, setLoading] = useState(true);
  const [formOpen, setFormOpen] = useState(false);
  const [editingStack, setEditingStack] = useState<TechStack | null>(null);

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

  const handleDelete = (id: string) => {
    if (window.confirm("Delete stack permanently?")) {
      Effect.runPromise(apiClient.delete(`/api/v1/tech-stacks/${id}`))
        .then(() => { fetchStacks(); toast({ title: "Deleted", description: "Stack deleted", variant: "success" }); })
        .catch((err) => toast({ title: "Error", description: err.message, variant: "destructive" }));
    }
  };

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-1.5 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-lg font-semibold tracking-tight">Tech Stacks</h2>
          <p className="text-sm text-muted-foreground">Manage tech stack records</p>
        </div>
        <Button onClick={handleOpenCreate} className="gap-2 self-start">
          <Plus size={16} /> Add Stack
        </Button>
      </div>

      {loading ? (
        <div className="grid gap-4">
          {Array.from({ length: 4 }).map((_, idx) => (
            <Card key={idx} className="py-4">
              <div className="flex items-center justify-between px-4">
                <div className="space-y-2">
                  <Skeleton className="h-4 w-32" />
                  <Skeleton className="h-3 w-48" />
                </div>
                <Skeleton className="h-8 w-20" />
              </div>
            </Card>
          ))}
        </div>
      ) : stacks.length === 0 ? (
        <Card>
          <CardContent className="py-8 text-center text-muted-foreground">No tech stacks configured.</CardContent>
        </Card>
      ) : (
        <div className="grid gap-4">
          {stacks.map((stack) => (
            <Card key={stack.id} className="py-4">
              <div className="flex items-center justify-between gap-4 px-4">
                <div className="min-w-0">
                  <p className="font-medium text-foreground">{stack.name}</p>
                  <p className="text-sm text-muted-foreground truncate">{stack.image_logo}</p>
                </div>
                <div className="flex shrink-0 gap-1">
                  <Button variant="default" size="icon-sm" onClick={() => handleOpenEdit(stack)} aria-label="Edit stack">
                    <Edit2 size={14} />
                  </Button>
                  <Button
                    variant="destructive"
                    size="icon-sm"
                    onClick={() => handleDelete(stack.id)}
                    aria-label="Delete stack"
                  >
                    <Trash2 size={14} />
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}

      {formOpen && (
        <TechStackDrawer open={formOpen} onOpenChange={setFormOpen} editingStack={editingStack} onSuccess={fetchStacks} stacksCount={stacks.length} />
      )}
    </div>
  );
}
