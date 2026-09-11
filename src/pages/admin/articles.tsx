// ponytail: articles crud page separated from unified dashboard layout
import { useState, useEffect } from "react";
import {
  Plus,
  Edit2,
  Trash2,
  Upload,
  Loader2,
  Image as ImageIcon,
  BookOpen
} from "lucide-react";
import { Button } from "@/shared/ui/button";
import { apiClient } from "@/shared/api/client";
import { Effect } from "effect";
import { useToast } from "@/shared/ui/toast";
import { ArticleDrawer } from "@/features/article/components/article-drawer";
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

interface Article {
  id: string;
  title: string;
  content: string;
  thumbnail_url: string;
  author: string[];
}

export function AdminArticlesPage() {
  const { toast } = useToast();
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingArticle, setEditingArticle] = useState<Article | null>(null);
  const [formOpen, setFormOpen] = useState(false);

  const fetchArticles = () => {
    setLoading(true);
    Effect.runPromise(apiClient.get<ApiResponse<Article[]>>("/api/v1/articles"))
      .then((res) => setArticles(res.data))
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchArticles();
  }, []);



  const handleOpenCreate = () => {
    setEditingArticle(null);
    setFormOpen(true);
  };

  const handleOpenEdit = (article: Article) => {
    setEditingArticle(article);
    setFormOpen(true);
  };

  const handleDelete = (id: string) => {
    const hardDelete = window.confirm("Delete this article permanently? Click Cancel for soft delete.");
    Effect.runPromise(apiClient.delete(`/api/v1/articles/${id}`, `?soft=${!hardDelete}`))
      .then(() => {
        fetchArticles();
        toast({ title: "Deleted", description: "Article deleted successfully", variant: "success" });
      })
      .catch((err) => {
        toast({ title: "Deletion Failed", description: err.message || "Deletion failed", variant: "destructive" });
      });
  };


  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg tracking-[-0.64px] text-[#111111] font-medium">Articles</h2>
          <p className="text-gray-500 mt-1 text-sm">Write and publish markdown engineering articles</p>
        </div>
        <Button
          onClick={handleOpenCreate}
          className="bg-[#ff5c06] hover:opacity-90 text-white font-semibold rounded-2xl shadow-[0_6px_10px_rgba(255,255,255,0.5)_inset,-10px_40px_41px_-4px_rgba(0,0,0,0.01)] cursor-pointer flex items-center gap-2 will-change-transform transition-opacity"
        >
          <Plus size={16} /> Write Article
        </Button>
      </div>

      <div className="w-full overflow-x-auto border border-gray-200 rounded-lg bg-white">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-28">Thumbnail</TableHead>
              <TableHead>Title</TableHead>
              <TableHead>Authors</TableHead>
              <TableHead>Snippet</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              Array.from({ length: 5 }).map((_, idx) => (
                <TableRow key={idx}>
                  <TableCell>
                    <Skeleton className="w-16 h-12 rounded-lg bg-gray-200" />
                  </TableCell>
                  <TableCell>
                    <Skeleton className="h-4 w-32 bg-gray-200" />
                  </TableCell>
                  <TableCell>
                    <Skeleton className="h-4 w-24 bg-gray-200" />
                  </TableCell>
                  <TableCell>
                    <Skeleton className="h-4 w-48 bg-gray-200" />
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Skeleton className="h-8 w-12 bg-gray-200" />
                      <Skeleton className="h-8 w-12 bg-gray-200" />
                    </div>
                  </TableCell>
                </TableRow>
              ))
            ) : articles.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="p-8 text-center text-gray-500 italic">
                  No articles written yet. Click 'Write Article' to create one.
                </TableCell>
              </TableRow>
            ) : (
              articles.map((article) => (
                <TableRow key={article.id}>
                  <TableCell>
                    <img
                      src={article.thumbnail_url}
                      alt={article.title}
                      className="w-16 h-12 rounded-lg object-cover bg-gray-100 border border-gray-200"
                    />
                  </TableCell>
                  <TableCell className="font-semibold text-[#111111]">{article.title}</TableCell>
                  <TableCell className="text-gray-500 text-xs font-mono">{article.author.join(", ")}</TableCell>
                  <TableCell className="text-gray-400 text-xs max-w-xs truncate">
                    {article.content.replace(/[#*`]/g, "")}
                  </TableCell>
                  <TableCell className="text-right space-x-2 whitespace-nowrap">
                    <button
                      onClick={() => handleOpenEdit(article)}
                      className="p-1.5 text-gray-500 hover:text-[#111111] hover:bg-gray-100 rounded cursor-pointer transition-all inline-flex items-center gap-1 text-xs font-semibold"
                    >
                      <Edit2 size={12} /> Edit
                    </button>
                    <button
                      onClick={() => handleDelete(article.id)}
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

      <ArticleDrawer
        open={formOpen}
        onOpenChange={setFormOpen}
        editingArticle={editingArticle}
        onSuccess={fetchArticles}
      />
    </div>
  );
}
