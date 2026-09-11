// ponytail: work experiences crud page separated from unified dashboard layout
import { useState, useEffect } from "react";
import { Plus, Edit2, Trash2 } from "lucide-react";
import { Button } from "@/shared/ui/button";
import { apiClient } from "@/shared/api/client";
import { Effect } from "effect";
import { useToast } from "@/shared/ui/toast";
import type { WorkExperience } from "@/features/work-experience/types";
import { WorkExperienceDrawer } from "@/features/work-experience/components/work-experience-drawer";

export function AdminWorkPage() {
  const { toast } = useToast();
  const [experiences, setExperiences] = useState<WorkExperience[]>([]);
  const [loading, setLoading] = useState(true);
  const [formOpen, setFormOpen] = useState(false);
  const [editingExp, setEditingExp] = useState<WorkExperience | null>(null);

  const fetchExperiences = () => {
    setLoading(true);
    Effect.runPromise(apiClient.get("/api/v1/work-experiences"))
      .then((res: any) => {
        setExperiences(res.data.experiences);
      })
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  };

  useEffect(() => { fetchExperiences(); }, []);

  const handleOpenCreate = () => { setEditingExp(null); setFormOpen(true); };
  const handleOpenEdit = (exp: WorkExperience) => { setEditingExp(exp); setFormOpen(true); };

  const handleDelete = (id: string) => {
    if (window.confirm("Delete experience permanently?")) {
      Effect.runPromise(apiClient.delete(`/api/v1/work-experiences/${id}`))
        .then(() => { fetchExperiences(); toast({ title: "Deleted", description: "Experience deleted", variant: "success" }); })
        .catch((err) => toast({ title: "Error", description: err.message, variant: "destructive" }));
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg tracking-[-0.64px] text-[#111111] font-medium">Work Experiences</h2>
          <p className="text-gray-500 mt-1 text-sm">Manage work experience records</p>
        </div>
        <Button onClick={handleOpenCreate} className="bg-[#ff5c06] hover:opacity-90 text-white font-semibold rounded-2xl cursor-pointer">
          <Plus size={16} /> Add Experience
        </Button>
      </div>

      {loading ? (
        <div className="text-center py-8 text-gray-500">Loading...</div>
      ) : (
        <table className="w-full border border-gray-200 rounded-lg">
          <thead>
            <tr className="bg-gray-50">
              <th className="p-3 text-left text-xs font-semibold uppercase">Title</th>
              <th className="p-3 text-left text-xs font-semibold uppercase">Actions</th>
            </tr>
          </thead>
          <tbody>
            {experiences.map((exp) => (
              <tr key={exp.id} className="border-t">
                <td className="p-3 text-sm">{exp.title}</td>
                <td className="p-3">
                  <button onClick={() => handleOpenEdit(exp)} className="text-blue-600 hover:underline text-sm mr-3">Edit</button>
                  <button onClick={() => handleDelete(exp.id)} className="text-red-600 hover:underline text-sm">Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {formOpen && (
        <WorkExperienceDrawer open={formOpen} onOpenChange={setFormOpen} editingExperience={editingExp} onSuccess={fetchExperiences} />
      )}
    </div>
  );
}
