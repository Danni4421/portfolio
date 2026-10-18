// ponytail: work experiences crud page separated from unified dashboard layout
import { useState, useEffect } from "react";
import { Plus, Edit2, Trash2, BookOpen } from "lucide-react";
import { Button } from "@/shared/ui/button";
import { Card } from "@/shared/ui/card";
import { Skeleton } from "@/shared/ui/skeleton";
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from "@/components/ui/table";
import { apiClient } from "@/shared/api/client";
import { Effect } from "effect";
import { useToast } from "@/shared/ui/toast";
import { ConfirmDialog } from "@/shared/ui/confirm-dialog";
import type { WorkExperience } from "@/features/work-experience/types";
import { WorkExperienceDrawer } from "@/features/work-experience/components/work-experience-drawer";
import { WorkExperienceDescriptionsDrawer } from "@/features/work-experience/components/work-experience-descriptions-drawer";

export function AdminWorkPage() {
  const { toast } = useToast();
  const [experiences, setExperiences] = useState<WorkExperience[]>([]);
  const [loading, setLoading] = useState(true);
  const [formOpen, setFormOpen] = useState(false);
  const [editingExp, setEditingExp] = useState<WorkExperience | null>(null);
  const [descOpen, setDescOpen] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [deleting, setDeleting] = useState(false);

  const fetchExperiences = () => {
    setLoading(true);
    Effect.runPromise(
      apiClient.get<{ success: boolean; data?: WorkExperience[] | { experiences?: WorkExperience[] } }>(
        "/api/v1/work-experiences"
      )
    )
      .then((res) => {
        const data = res.data;
        setExperiences(Array.isArray(data) ? data : (data?.experiences ?? []));
      })
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  };

  useEffect(() => { fetchExperiences(); }, []);

  const handleOpenCreate = () => { setEditingExp(null); setFormOpen(true); };
  const handleOpenEdit = (exp: WorkExperience) => { setEditingExp(exp); setFormOpen(true); };
  const handleOpenDescriptions = (exp: WorkExperience) => { setEditingExp(exp); setDescOpen(true); };

  const handleDelete = () => {
    if (!deleteId) return;
    setDeleting(true);
    Effect.runPromise(apiClient.delete(`/api/v1/work-experiences/${deleteId}`))
      .then(() => { setDeleteId(null); fetchExperiences(); toast({ title: "Deleted", description: "Experience deleted", variant: "success" }); })
      .catch((err) => toast({ title: "Error", description: err.message, variant: "destructive" }))
      .finally(() => setDeleting(false));
  };

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-1.5 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-lg font-semibold tracking-tight">Work Experiences</h2>
          <p className="text-sm text-muted-foreground">Manage work experience records</p>
        </div>
        <Button onClick={handleOpenCreate} className="gap-2 self-start">
          <Plus size={16} /> Add Experience
        </Button>
      </div>

      <Card className="overflow-hidden py-0">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Title</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              Array.from({ length: 4 }).map((_, idx) => (
                <TableRow key={idx}>
                  <TableCell>
                    <Skeleton className="h-4 w-48" />
                  </TableCell>
                  <TableCell className="text-right">
                    <Skeleton className="ml-auto h-8 w-20" />
                  </TableCell>
                </TableRow>
              ))
            ) : experiences.length === 0 ? (
              <TableRow>
                <TableCell colSpan={2} className="p-8 text-center text-muted-foreground">
                  No work experiences configured.
                </TableCell>
              </TableRow>
            ) : (
              experiences.map((exp) => (
                <TableRow key={exp.id}>
                  <TableCell className="font-medium text-foreground">{exp.title}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-1">
                      <Button variant="outline" size="icon-sm" onClick={() => handleOpenDescriptions(exp)} aria-label="Manage job descriptions">
                        <BookOpen size={14} />
                      </Button>
                      <Button variant="default" size="icon-sm" onClick={() => handleOpenEdit(exp)} aria-label="Edit experience">
                        <Edit2 size={14} />
                      </Button>
                      <Button
                        variant="destructive"
                        size="icon-sm"
                        onClick={() => setDeleteId(exp.id)}
                        aria-label="Delete experience"
                      >
                        <Trash2 size={14} />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </Card>

      {formOpen && (
        <WorkExperienceDrawer open={formOpen} onOpenChange={setFormOpen} editingExperience={editingExp} onSuccess={fetchExperiences} />
      )}

      {descOpen && (
        <WorkExperienceDescriptionsDrawer
          open={descOpen}
          onOpenChange={setDescOpen}
          experience={editingExp}
          setExperience={setEditingExp}
          onSuccess={fetchExperiences}
        />
      )}

      <ConfirmDialog
        open={deleteId !== null}
        onOpenChange={(open) => { if (!open && !deleting) setDeleteId(null); }}
        title="Delete experience?"
        description="This will permanently delete the work experience. This action cannot be undone."
        confirmLabel="Delete"
        loading={deleting}
        onConfirm={handleDelete}
      />
    </div>
  );
}
