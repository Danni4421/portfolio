// ponytail: achievements crud page separated from unified dashboard layout
import { useState, useEffect } from "react";
import { Plus, Edit2, Trash2 } from "lucide-react";
import { Button } from "@/shared/ui/button";
import { apiClient } from "@/shared/api/client";
import { Effect } from "effect";
import { useToast } from "@/shared/ui/toast";
import { AchievementDrawer } from "@/features/achievement/components/achievement-drawer";
import type { Achievement } from "@/entities/achievement/model/types";

export function AdminAchievementsPage() {
  const { toast } = useToast();
  const [achievements, setAchievements] = useState<Achievement[]>([]);
  const [loading, setLoading] = useState(true);
  const [formOpen, setFormOpen] = useState(false);
  const [editingAchievement, setEditingAchievement] = useState<Achievement | null>(null);

  const fetchAchievements = () => {
    setLoading(true);
    Effect.runPromise(apiClient.get("/api/v1/achievements"))
      .then((res: any) => {
        setAchievements(res.data);
      })
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  };

  useEffect(() => { fetchAchievements(); }, []);

  const handleOpenCreate = () => { setEditingAchievement(null); setFormOpen(true); };
  const handleOpenEdit = (achievement: Achievement) => { setEditingAchievement(achievement); setFormOpen(true); };

  const handleDelete = (id: string) => {
    if (window.confirm("Delete achievement permanently?")) {
      Effect.runPromise(apiClient.delete(`/api/v1/achievements/${id}`))
        .then(() => { fetchAchievements(); toast({ title: "Deleted", description: "Achievement deleted", variant: "success" }); })
        .catch((err) => toast({ title: "Error", description: err.message, variant: "destructive" }));
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg tracking-[-0.64px] text-[#111111] font-medium">Achievements</h2>
          <p className="text-gray-500 mt-1 text-sm">Manage achievement records</p>
        </div>
        <Button onClick={handleOpenCreate} className="bg-[#ff5c06] hover:opacity-90 text-white font-semibold rounded-2xl cursor-pointer">
          <Plus size={16} /> Add Achievement
        </Button>
      </div>

      {loading ? (
        <div className="text-center py-8 text-gray-500">Loading...</div>
      ) : achievements.length === 0 ? (
        <div className="text-center py-8 text-gray-500 italic">No achievements configured.</div>
      ) : (
        <div className="grid gap-4">
          {achievements.map((ach) => (
            <div key={ach.id} className="flex items-center justify-between p-4 border rounded-lg">
              <div>
                <p className="font-medium">{ach.title}</p>
                <p className="text-sm text-gray-500">{ach.description}</p>
              </div>
              <div className="flex gap-2">
                <button onClick={() => handleOpenEdit(ach)} className="text-blue-600 hover:underline text-sm">Edit</button>
                <button onClick={() => handleDelete(ach.id)} className="text-red-600 hover:underline text-sm">Delete</button>
              </div>
            </div>
          ))}
        </div>
      )}

      {formOpen && (
        <AchievementDrawer
          open={formOpen}
          onOpenChange={setFormOpen}
          editingAchievement={editingAchievement}
          setEditingAchievement={(v) => setEditingAchievement(v as any)}
          onSuccess={fetchAchievements}
        />
      )}
    </div>
  );
}
