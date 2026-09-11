// ponytail: achievements crud page separated from unified dashboard layout
import { useState, useEffect } from "react";
import {
  Plus,
  Edit2,
  Trash2,
  Upload,
  Loader2,
  Globe,
  Image as ImageIcon
} from "lucide-react";
import { Button } from "@/shared/ui/button";
import { apiClient } from "@/shared/api/client";
import { Effect } from "effect";
import { useToast } from "@/shared/ui/toast";
import { AchievementDrawer } from "@/features/achievement/components/achievement-drawer";
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

interface AchievementResource {
  id: string;
  achievement_id: string;
  resource_url: string;
}

interface Achievement {
  id: string;
  title: string;
  description: string;
  source_logo_url: string;
  redirect_url: string;
  resources: AchievementResource[];
}

export function AdminAchievementsPage() {
  const { toast } = useToast();
  const [achievements, setAchievements] = useState<Achievement[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingAchievement, setEditingAchievement] = useState<Achievement | null>(null);
  const [formOpen, setFormOpen] = useState(false);

  const fetchAchievements = () => {
    setLoading(true);
    Effect.runPromise(apiClient.get<ApiResponse<Achievement[]>>("/api/v1/achievements"))
      .then((res) => setAchievements(res.data))
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchAchievements();
  }, []);

  const handleOpenCreate = () => {
    setEditingAchievement(null);
    setFormOpen(true);
  };

  const handleOpenEdit = (ach: Achievement) => {
    setEditingAchievement(ach);
    setFormOpen(true);
  };

  const handleDelete = (id: string) => {
    const hardDelete = window.confirm("Delete permanently? Cancel for soft delete.");
    Effect.runPromise(apiClient.delete(`/api/v1/achievements/${id}`, `?soft=${!hardDelete}`))
      .then(() => {
        fetchAchievements();
        toast({ title: "Deleted", description: "Achievement deleted successfully", variant: "success" });
      })
      .catch((err) => {
        toast({ title: "Deletion Failed", description: err.message || "Deletion failed", variant: "destructive" });
      });
  };



  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg tracking-[-0.64px] text-[#111111] font-medium">Achievements</h2>
          <p className="text-gray-500 mt-1 text-sm">Manage certifications, awards, and credentials</p>
        </div>
        <Button
          onClick={handleOpenCreate}
          className="bg-[#ff5c06] hover:opacity-90 text-white font-semibold rounded-2xl shadow-[0_6px_10px_rgba(255,255,255,0.5)_inset,-10px_40px_41px_-4px_rgba(0,0,0,0.01)] cursor-pointer flex items-center gap-2 will-change-transform transition-opacity"
        >
          <Plus size={16} /> Add Achievement
        </Button>
      </div>
      <div className="w-full overflow-x-auto border border-gray-200 rounded-lg bg-white">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-24">Issuer Logo</TableHead>
              <TableHead>Credential Title</TableHead>
              <TableHead>Description</TableHead>
              <TableHead>Verification URL</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              Array.from({ length: 5 }).map((_, idx) => (
                <TableRow key={idx}>
                  <TableCell>
                    <Skeleton className="h-10 w-10 rounded-lg bg-gray-200" />
                  </TableCell>
                  <TableCell>
                    <Skeleton className="h-4 w-32 bg-gray-200" />
                  </TableCell>
                  <TableCell>
                    <Skeleton className="h-4 w-48 bg-gray-200" />
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
            ) : achievements.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="p-8 text-center text-gray-500 italic">
                  No achievements added yet. Click 'Add Achievement' to create one.
                </TableCell>
              </TableRow>
            ) : (
              achievements.map((ach) => (
                <TableRow key={ach.id}>
                  <TableCell>
                    <img
                      src={ach.source_logo_url}
                      alt={ach.title}
                      className="w-10 h-10 rounded-lg object-contain bg-gray-50 p-1 border border-gray-200"
                    />
                  </TableCell>
                  <TableCell className="font-semibold text-[#111111]">{ach.title}</TableCell>
                  <TableCell className="text-gray-600 text-xs max-w-xs truncate">{ach.description}</TableCell>
                  <TableCell className="text-gray-500 font-mono text-xs">
                    <a
                      href={ach.redirect_url}
                      target="_blank"
                      rel="noreferrer"
                      className="hover:text-[#ff5c06] flex items-center gap-1 w-fit"
                    >
                      <Globe size={12} /> {ach.redirect_url}
                    </a>
                  </TableCell>
                  <TableCell className="text-right space-x-2 whitespace-nowrap">
                    <button
                      onClick={() => handleOpenEdit(ach)}
                      className="p-1.5 text-gray-500 hover:text-[#111111] hover:bg-gray-100 rounded cursor-pointer transition-all inline-flex items-center gap-1 text-xs font-semibold"
                    >
                      <Edit2 size={12} /> Edit
                    </button>
                    <button
                      onClick={() => handleDelete(ach.id)}
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
      <AchievementDrawer
        open={formOpen}
        onOpenChange={setFormOpen}
        editingAchievement={editingAchievement}
        setEditingAchievement={setEditingAchievement}
        onSuccess={fetchAchievements}
      />
    </div>
  );
}
