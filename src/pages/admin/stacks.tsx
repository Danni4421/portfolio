// ponytail: stacks crud page separated from unified dashboard layout
import { useState, useEffect } from "react";
import { Plus, Edit2, Trash2 } from "lucide-react";
import { Button } from "@/shared/ui/button";
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
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg tracking-[-0.64px] text-[#111111] font-medium">Tech Stacks</h2>
          <p className="text-gray-500 mt-1 text-sm">Manage tech stack records</p>
        </div>
        <Button onClick={handleOpenCreate} className="bg-[#ff5c06] hover:opacity-90 text-white font-semibold rounded-2xl cursor-pointer">
          <Plus size={16} /> Add Stack
        </Button>
      </div>

      {loading ? (
        <div className="text-center py-8 text-gray-500">Loading...</div>
      ) : stacks.length === 0 ? (
        <div className="text-center py-8 text-gray-500 italic">No tech stacks configured.</div>
      ) : (
        <div className="grid gap-4">
          {stacks.map((stack) => (
            <div key={stack.id} className="flex items-center justify-between p-4 border rounded-lg">
              <div>
                <p className="font-medium">{stack.name}</p>
                <p className="text-sm text-gray-500">{stack.image_logo}</p>
              </div>
              <div className="flex gap-2">
                <button onClick={() => handleOpenEdit(stack)} className="text-blue-600 hover:underline text-sm">Edit</button>
                <button onClick={() => handleDelete(stack.id)} className="text-red-600 hover:underline text-sm">Delete</button>
              </div>
            </div>
          ))}
        </div>
      )}

      {formOpen && (
        <TechStackDrawer open={formOpen} onOpenChange={setFormOpen} editingStack={editingStack} onSuccess={fetchStacks} stacksCount={stacks.length} />
      )}
    </div>
  );
}
