import { useState, useEffect } from "react";
import { Plus, Edit2, Trash2 } from "lucide-react";
import { Button } from "@/shared/ui/button";
import { Card, CardContent } from "@/shared/ui/card";
import { Skeleton } from "@/shared/ui/skeleton";
import { apiClient } from "@/shared/api/client";
import { Effect } from "effect";
import { useToast } from "@/shared/ui/toast";
import { ArticleDrawer } from "@/features/article/components/article-drawer";

export function AdminArticlesPage() {
  const { toast } = useToast();
  const [articles, setArticles] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [formOpen, setFormOpen] = useState(false);
  const [editingArticle, setEditingArticle] = useState<any | null>(null);

  const fetchArticles = () => {
    setLoading(true);
    Effect.runPromise(apiClient.get("/api/v1/articles"))
      .then((res: any) => { setArticles(res.data); })
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  };

  useEffect(() => { fetchArticles(); }, []);

  const handleOpenCreate = () => { setEditingArticle(null); setFormOpen(true); };
  const handleOpenEdit = (article: any) => { setEditingArticle(article); setFormOpen(true); };

  const handleDelete = (id: string) => {
    if (window.confirm("Delete article permanently?")) {
      Effect.runPromise(apiClient.delete(`/api/v1/articles/${id}`))
        .then(() => { fetchArticles(); toast({ title: "Deleted", description: "Article deleted", variant: "success" }); })
        .catch((err) => toast({ title: "Error", description: err.message, variant: "destructive" }));
    }
  };

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-1.5 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-lg font-semibold tracking-tight">Articles</h2>
          <p className="text-sm text-muted-foreground">Manage article records</p>
        </div>
        <Button onClick={handleOpenCreate} className="gap-2 self-start">
          <Plus size={16} /> Add Article
        </Button>
      </div>
      {loading ? (
        <div className="grid gap-4">
          {Array.from({ length: 4 }).map((_, idx) => (
            <Card key={idx} className="py-4">
              <div className="flex items-center justify-between px-4">
                <Skeleton className="h-4 w-48" />
                <Skeleton className="h-8 w-20" />
              </div>
            </Card>
          ))}
        </div>
      ) : articles.length === 0 ? (
        <Card>
          <CardContent className="py-8 text-center text-muted-foreground">No articles configured.</CardContent>
        </Card>
      ) : (
        <div className="grid gap-4">
          {articles.map((art) => (
            <Card key={art.id} className="py-4">
              <div className="flex items-center justify-between gap-4 px-4">
                <p className="font-medium text-foreground truncate">{art.title}</p>
                <div className="flex shrink-0 gap-1">
                  <Button variant="default" size="icon-sm" onClick={() => handleOpenEdit(art)} aria-label="Edit article">
                    <Edit2 size={14} />
                  </Button>
                  <Button
                    variant="destructive"
                    size="icon-sm"
                    onClick={() => handleDelete(art.id)}
                    aria-label="Delete article"
                  >
                    <Trash2 size={14} />
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
      {formOpen && <ArticleDrawer open={formOpen} onOpenChange={setFormOpen} editingArticle={editingArticle} onSuccess={fetchArticles} />}
    </div>
  );
}
