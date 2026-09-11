// ponytail: stacks crud page separated from unified dashboard layout
import { useState, useEffect } from "react";
import {
  Plus,
  Edit2,
  Trash2,
  Upload,
  Loader2,
  Globe,
  Layers,
  Image as ImageIcon
} from "lucide-react";
import { Button } from "@/shared/ui/button";
import { apiClient } from "@/shared/api/client";
import { Effect } from "effect";
import { useToast } from "@/shared/ui/toast";
import { TechStackDrawer } from "@/features/tech-stack/components/tech-stack-drawer";
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from "@/components/ui/table";
import { Skeleton } from "@/shared/ui/skeleton";

interface ApiResponse<T> {
  success: boolean;
  data: T;
}

interface TechStack {
  id: string;
  name: string;
  image_logo: string;
  redirect_url: string;
  sort_order?: number;
}

export function AdminStacksPage() {
  const { toast } = useToast();
  const [stacks, setStacks] = useState<TechStack[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingStack, setEditingStack] = useState<TechStack | null>(null);
  const [formOpen, setFormOpen] = useState(false);

  const fetchStacks = () => {
    setLoading(true);
    Effect.runPromise(apiClient.get<ApiResponse<TechStack[]>>("/api/v1/tech-stacks"))
      .then((res) => {
        const sorted = [...res.data].sort((a, b) => (a.sort_order ?? 0) - (b.sort_order ?? 0));
        setStacks(sorted);
      })
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchStacks();
  }, []);



  const handleOpenCreate = () => {
    setEditingStack(null);
    setFormOpen(true);
  };

  const handleOpenEdit = (stack: TechStack) => {
    setEditingStack(stack);
    setFormOpen(true);
  };

  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);

  const handleDragStart = (e: React.DragEvent, index: number) => {
    setDraggedIndex(index);
    e.dataTransfer.effectAllowed = "move";
  };

  const handleDragOver = (e: React.DragEvent, index: number) => {
    e.preventDefault();
    if (draggedIndex === null || draggedIndex === index) return;

    const items = [...stacks];
    const draggedItem = items[draggedIndex];
    items.splice(draggedIndex, 1);
    items.splice(index, 0, draggedItem);

    setDraggedIndex(index);
    setStacks(items);
  };

  const handleDragEnd = () => {
    setDraggedIndex(null);
    saveNewSortOrder();
  };

  const saveNewSortOrder = () => {
    const ids = stacks.map((s) => s.id);
    const task = apiClient.put<{ success: boolean; message: string }>("/api/v1/tech-stacks/reorder", { ids });

    Effect.runPromise(task)
      .then(() => {
        toast({ title: "Reordered", description: "Tech stacks order updated", variant: "success" });
      })
      .catch((err) => {
        toast({ title: "Order Update Failed", description: err.message || "Failed to update sort order", variant: "destructive" });
      });
  };

  const handleDelete = (id: string) => {
    const hardDelete = window.confirm("Do you want to permanently delete this tech stack? Click Cancel for soft delete.");
    Effect.runPromise(apiClient.delete(`/api/v1/tech-stacks/${id}`, `?soft=${!hardDelete}`))
      .then(() => {
        fetchStacks();
        toast({ title: "Deleted", description: "Tech stack deleted successfully", variant: "success" });
      })
      .catch((err) => {
        toast({ title: "Deletion Failed", description: err.message || "Deletion failed", variant: "destructive" });
      });
  };


  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg tracking-[-0.64px] text-[#111111] font-medium">Tech Stacks</h2>
          <p className="text-gray-500 mt-1 text-sm">Manage languages, tools, and logos displayed on your portfolio</p>
        </div>
        <Button
          onClick={handleOpenCreate}
          className="bg-[#ff5c06] hover:opacity-90 text-white font-semibold rounded-2xl shadow-[0_6px_10px_rgba(255,255,255,0.5)_inset,-10px_40px_41px_-4px_rgba(0,0,0,0.01)] cursor-pointer flex items-center gap-2 will-change-transform transition-opacity"
        >
          <Plus size={16} /> Add Stack
        </Button>
      </div>

      <div className="w-full overflow-x-auto border border-gray-200 rounded-lg bg-white">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-12 text-center">Order</TableHead>
              <TableHead className="w-24">Logo</TableHead>
              <TableHead>Name</TableHead>
              <TableHead>Redirect URL</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              Array.from({ length: 5 }).map((_, idx) => (
                <TableRow key={idx}>
                  <TableCell className="text-center">
                    <Skeleton className="h-4 w-4 mx-auto bg-gray-200" />
                  </TableCell>
                  <TableCell>
                    <Skeleton className="h-10 w-10 rounded-lg bg-gray-200" />
                  </TableCell>
                  <TableCell>
                    <Skeleton className="h-4 w-32 bg-gray-200" />
                  </TableCell>
                  <TableCell>
                    <Skeleton className="h-4 w-28 bg-gray-200" />
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Skeleton className="h-8 w-12 bg-gray-200" />
                      <Skeleton className="h-8 w-12 bg-gray-200" />
                    </div>
                  </TableCell>
                </TableRow>
              ))
            ) : stacks.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="p-8 text-center text-gray-500 italic">
                  No tech stacks loaded yet. Click 'Add Stack' to publish new entries.
                </TableCell>
              </TableRow>
            ) : (
              stacks.map((stack, index) => (
                <TableRow
                  key={stack.id}
                  draggable
                  onDragStart={(e) => handleDragStart(e, index)}
                  onDragOver={(e) => handleDragOver(e, index)}
                  onDragEnd={handleDragEnd}
                  className={`cursor-grab active:cursor-grabbing ${
                    draggedIndex === index ? "opacity-40 bg-gray-100/50" : ""
                  }`}
                >
                  <TableCell className="text-center text-gray-400 select-none">
                    <div className="flex items-center justify-center">
                      <Layers size={14} className="opacity-45 hover:opacity-100" />
                    </div>
                  </TableCell>
                  <TableCell>
                    <img
                      src={stack.image_logo}
                      alt={stack.name}
                      className="w-10 h-10 rounded-lg object-contain bg-gray-50 p-1 border border-gray-200"
                    />
                  </TableCell>
                  <TableCell className="font-semibold text-[#111111]">{stack.name}</TableCell>
                  <TableCell className="text-gray-500 font-mono text-xs">
                    <a
                      href={stack.redirect_url}
                      target="_blank"
                      rel="noreferrer"
                      className="hover:text-[#ff5c06] flex items-center gap-1 w-fit"
                    >
                      <Globe size={12} /> {stack.redirect_url}
                    </a>
                  </TableCell>
                  <TableCell className="text-right space-x-2">
                    <button
                      onClick={() => handleOpenEdit(stack)}
                      className="p-1.5 text-gray-500 hover:text-[#111111] hover:bg-gray-100 rounded cursor-pointer transition-all inline-flex items-center gap-1 text-xs font-semibold"
                    >
                      <Edit2 size={12} /> Edit
                    </button>
                    <button
                      onClick={() => handleDelete(stack.id)}
                      className="p-1.5 text-red-500 hover:text-red-600 hover:bg-red-50 rounded cursor-pointer transition-all inline-flex items-center gap-1 text-xs font-semibold"
                    >
                      <Trash2 size={12} /> Delete
                    </button>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      <TechStackDrawer
        open={formOpen}
        onOpenChange={setFormOpen}
        editingStack={editingStack}
        stacksCount={stacks.length}
        onSuccess={fetchStacks}
      />
    </div>
  );
}
