import { useState, useEffect } from "react";
import { Plus, Edit2, Trash2 } from "lucide-react";
import { Button } from "@/shared/ui/button";
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
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg tracking-[-0.64px] text-[#111111] font-medium">Articles</h2>
          <p className="text-gray-500 mt-1 text-sm">Manage article records</p>
        </div>
        <Button onClick={handleOpenCreate} className="bg-[#ff5c06] hover:opacity-90 text-white font-semibold rounded-2xl cursor-pointer">
          <Plus size={16} /> Add Article
        </Button>
      </div>
      {loading ? <div className="text-center py-8 text-gray-500">Loading...</div> :
        articles.length === 0 ? <div className="text-center py-8 text-gray-500 italic">No articles configured.</div> :
        <div className="grid gap-4">{articles.map((art) => (
          <div key={art.id} className="flex items-center justify-between p-4 border rounded-lg">
            <div><p className="font-medium">{art.title}</p></div>
            <div className="flex gap-2">
              <button onClick={() => handleOpenEdit(art)} className="text-blue-600 hover:underline text-sm">Edit</button>
              <button onClick={() => handleDelete(art.id)} className="text-red-600 hover:underline text-sm">Delete</button>
            </div>
          </div>
        ))}</div>
      }
      {formOpen && <ArticleDrawer open={formOpen} onOpenChange={setFormOpen} editingArticle={editingArticle} onSuccess={fetchArticles} />}
    </div>
  );
}
