// ponytail: achievements crud page separated from unified dashboard layout
import { useState, useEffect } from "react";
import { Plus, Edit2, Trash2 } from "lucide-react";
import { Button } from "@/shared/ui/button";
import { Badge } from "@/shared/ui/badge";
import { Card, CardContent } from "@/shared/ui/card";
import { Skeleton } from "@/shared/ui/skeleton";
import { apiClient } from "@/shared/api/client";
import { Effect } from "effect";
import { useToast } from "@/shared/ui/toast";
import { AchievementDrawer } from "@/features/achievement/components/achievement-drawer";
import { AchievementResourcesDrawer } from "@/features/achievement/components/achievement-resources-drawer";
import type { Achievement } from "@/entities/achievement/model/types";

export function AdminAchievementsPage() {
  const { toast } = useToast();
  const [achievements, setAchievements] = useState<Achievement[]>([]);
  const [loading, setLoading] = useState(true);
  const [formOpen, setFormOpen] = useState(false);
  const [resourcesOpen, setResourcesOpen] = useState(false);
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
  const handleOpenResources = (achievement: Achievement) => { setEditingAchievement(achievement); setResourcesOpen(true); };

  const handleDelete = (id: string) => {
    if (window.confirm("Delete achievement permanently?")) {
      Effect.runPromise(apiClient.delete(`/api/v1/achievements/${id}`))
        .then(() => { fetchAchievements(); toast({ title: "Deleted", description: "Achievement deleted", variant: "success" }); })
        .catch((err) => toast({ title: "Error", description: err.message, variant: "destructive" }));
    }
  };

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-1.5 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-lg font-semibold tracking-tight">Achievements</h2>
          <p className="text-sm text-muted-foreground">Manage achievement records</p>
        </div>
        <Button onClick={handleOpenCreate} className="gap-2 self-start">
          <Plus size={16} /> Add Achievement
        </Button>
      </div>

      {loading ? (
        <div className="grid gap-4">
          {Array.from({ length: 4 }).map((_, idx) => (
            <Card key={idx} className="py-4">
              <div className="flex items-center justify-between px-4">
                <div className="space-y-2">
                  <Skeleton className="h-4 w-40" />
                  <Skeleton className="h-3 w-64" />
                </div>
                <Skeleton className="h-8 w-20" />
              </div>
            </Card>
          ))}
        </div>
      ) : achievements.length === 0 ? (
        <Card>
          <CardContent className="py-8 text-center text-muted-foreground">No achievements configured.</CardContent>
        </Card>
      ) : (
        <div className="grid gap-4">
          {achievements.map((ach) => (
            <Card key={ach.id} className="py-4">
              <div className="flex items-center justify-between gap-4 px-4">
                <div className="min-w-0">
                  <p className="font-medium text-foreground">{ach.title}</p>
                  <p className="text-sm text-muted-foreground truncate">{ach.description}</p>
                </div>
                <div className="flex shrink-0 items-center gap-1">
                  <Badge variant="secondary" asChild className="cursor-pointer mr-1">
                    <button onClick={() => handleOpenResources(ach)} aria-label="Manage resources">
                      {ach.resources?.length || 0} Links
                    </button>
                  </Badge>
                  <Button variant="default" size="icon-sm" onClick={() => handleOpenEdit(ach)} aria-label="Edit achievement">
                    <Edit2 size={14} />
                  </Button>
                  <Button
                    variant="destructive"
                    size="icon-sm"
                    onClick={() => handleDelete(ach.id)}
                    aria-label="Delete achievement"
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
        <AchievementDrawer
          open={formOpen}
          onOpenChange={setFormOpen}
          editingAchievement={editingAchievement}
          onSuccess={fetchAchievements}
        />
      )}

      <AchievementResourcesDrawer
        open={resourcesOpen}
        onOpenChange={setResourcesOpen}
        achievement={editingAchievement}
        setAchievement={setEditingAchievement}
        onSuccess={fetchAchievements}
      />
    </div>
  );
}
