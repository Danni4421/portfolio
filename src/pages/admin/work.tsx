// ponytail: work experiences crud page separated from unified dashboard layout
import { useState, useEffect } from "react";
import {
  Plus,
  Edit2,
  Trash2,
  Upload,
  Loader2,
  Image as ImageIcon
} from "lucide-react";
import { Button } from "@/shared/ui/button";
import { apiClient } from "@/shared/api/client";
import { Effect } from "effect";
import type { WorkExperience } from "@/features/work-experience/types";
import { useToast } from "@/shared/ui/toast";
import { WorkExperienceDrawer } from "@/features/work-experience/components/work-experience-drawer";
import { WorkExperienceDescriptionsDrawer } from "@/features/work-experience/components/work-experience-descriptions-drawer";
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

export function AdminWorkPage() {
  const { toast } = useToast();
  const [experiences, setExperiences] = useState<WorkExperience[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingExperience, setEditingExperience] = useState<WorkExperience | null>(null);
  const [formOpen, setFormOpen] = useState(false);
  const [descOpen, setDescOpen] = useState(false);

  const handleOpenJobDescs = (exp: WorkExperience) => {
    setEditingExperience(exp);
    setDescOpen(true);
  };

  const fetchExperiences = () => {
    setLoading(true);
    Effect.runPromise(apiClient.get<ApiResponse<WorkExperience[]>>("/api/v1/work-experiences"))
      .then((res) => setExperiences(res.data))
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchExperiences();
  }, []);

  const handleOpenCreate = () => {
    setEditingExperience(null);
    setFormOpen(true);
  };

  const handleOpenEdit = (exp: WorkExperience) => {
    setEditingExperience(exp);
    setFormOpen(true);
  };

  const handleDelete = (id: string) => {
    const hardDelete = window.confirm("Delete experience permanently? Cancel for soft delete.");
    Effect.runPromise(apiClient.delete(`/api/v1/work-experiences/${id}`, `?soft=${!hardDelete}`))
      .then(() => {
        fetchExperiences();
        toast({ title: "Deleted", description: "Work experience deleted successfully", variant: "success" });
      })
      .catch((err) => {
        toast({ title: "Deletion Failed", description: err.message || "Deletion failed", variant: "destructive" });
      });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg tracking-[-0.64px] text-[#111111] font-medium">Work Experience</h2>
          <p className="text-gray-500 mt-1 text-sm">Manage employment records and job roles</p>
        </div>
        <Button
          onClick={handleOpenCreate}
          className="bg-[#ff5c06] hover:opacity-90 text-white font-semibold rounded-2xl shadow-[0_6px_10px_rgba(255,255,255,0.5)_inset,-10px_40px_41px_-4px_rgba(0,0,0,0.01)] cursor-pointer flex items-center gap-2 will-change-transform transition-opacity"
        >
          <Plus size={16} /> Add Experience
        </Button>
      </div>

      <div className="w-full overflow-x-auto border border-gray-200 rounded-lg bg-white">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-24">Company Logo</TableHead>
              <TableHead>Role / Title</TableHead>
              <TableHead>Description Summary</TableHead>
              <TableHead>Job Descriptions</TableHead>
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
                    <Skeleton className="h-3 w-20 bg-gray-200 mt-1" />
                  </TableCell>
                  <TableCell>
                    <Skeleton className="h-4 w-48 bg-gray-200" />
                  </TableCell>
                  <TableCell>
                    <Skeleton className="h-6 w-16 rounded bg-gray-200" />
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Skeleton className="h-8 w-12 bg-gray-200" />
                      <Skeleton className="h-8 w-12 bg-gray-200" />
                    </div>
                  </TableCell>
                </TableRow>
              ))
            ) : experiences.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="p-8 text-center text-gray-500 italic">
                  No work experience items added yet. Click 'Add Experience' to configure.
                </TableCell>
              </TableRow>
            ) : (
              experiences.map((exp) => (
                <TableRow key={exp.id}>
                  <TableCell>
                    <img
                      src={exp.company_url}
                      alt={exp.title}
                      className="w-10 h-10 rounded-lg object-contain bg-gray-50 p-1 border border-gray-200"
                    />
                  </TableCell>
                  <TableCell>
                    <div className="font-semibold text-[#111111]">{exp.title}</div>
                    <div className="text-[10px] text-gray-400 font-mono mt-0.5">
                      {exp.start_date ? exp.start_date.split("T")[0] : ""} - {exp.end_date ? exp.end_date.split("T")[0] : "Present"}
                    </div>
                  </TableCell>
                  <TableCell className="text-gray-600 text-xs max-w-xs truncate">{exp.description}</TableCell>
                  <TableCell>
                    <span className="bg-gray-100 text-gray-700 px-2.5 py-0.5 rounded border border-gray-200 font-semibold text-xs">
                      {exp.job_descriptions?.length || 0} Job Desc
                    </span>
                  </TableCell>
                  <TableCell className="text-right space-x-2 whitespace-nowrap">
                    <button
                      onClick={() => handleOpenJobDescs(exp)}
                      className="p-1.5 text-[#ff5c06] hover:text-[#d65f0e] hover:bg-orange-50 rounded cursor-pointer transition-all inline-flex items-center gap-1 text-xs font-semibold"
                    >
                      <Plus size={12} /> Job Desc
                    </button>
                    <button
                      onClick={() => handleOpenEdit(exp)}
                      className="p-1.5 text-gray-500 hover:text-[#111111] hover:bg-gray-100 rounded cursor-pointer transition-all inline-flex items-center gap-1 text-xs font-semibold"
                    >
                      <Edit2 size={12} /> Edit
                    </button>
                    <button
                      onClick={() => handleDelete(exp.id)}
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

      <WorkExperienceDrawer
        open={formOpen}
        onOpenChange={setFormOpen}
        editingExperience={editingExperience}
        onSuccess={fetchExperiences}
      />

      <WorkExperienceDescriptionsDrawer
        open={descOpen}
        onOpenChange={setDescOpen}
        experience={editingExperience}
        setExperience={setEditingExperience}
        onSuccess={fetchExperiences}
      />
    </div>
  );
}
