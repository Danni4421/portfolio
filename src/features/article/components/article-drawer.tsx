// ponytail: separate article edit/create dialog component
import * as React from "react";
import { Loader2, BookOpen } from "lucide-react";
import { Button } from "@/shared/ui/button";
import { Label } from "@/shared/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/shared/ui/dialog";
import { useArticleForm } from "@/features/article/hooks/use-article-form";
import { FormTextField, FormTextAreaField } from "@/shared/ui/form";
import { FileUploader } from "@/shared/ui/file-uploader";

interface Article {
  id: string;
  title: string;
  content: string;
  thumbnail_url: string;
  author: string[];
}

interface ArticleDrawerProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  editingArticle: Article | null;
  onSuccess: () => void;
}

export function ArticleDrawer({
  open,
  onOpenChange,
  editingArticle,
  onSuccess,
}: ArticleDrawerProps) {
  const { form, uploading, submitting, handleFileUpload, onSubmit } = useArticleForm({
    editingArticle,
    setFormOpen: onOpenChange,
    fetchArticles: onSuccess,
  });

  const thumbnailUrl = form.watch("thumbnailUrl");

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader className="border-b border-neutral-200 dark:border-neutral-800 pb-3">
          <DialogTitle className="font-sans text-lg font-bold text-neutral-955 dark:text-neutral-50">
            {editingArticle ? "Edit Article" : "Write Article"}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={onSubmit}>
          <div className="space-y-4 p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
              <div className="space-y-4">
                <FormTextField
                  name="title"
                  label="Title"
                  placeholder="Article title"
                  register={form.register}
                  error={form.formState.errors.title}
                  required
                  className="space-y-1.5"
                  inputClassName="bg-white border-neutral-300 focus:border-[#ec7211] focus:ring-1 focus:ring-[#ec7211] text-neutral-900 rounded-lg text-sm"
                />

                <FormTextField
                  name="authorInput"
                  label="Authors (Comma-separated)"
                  placeholder="e.g. Aji, Antigravity"
                  register={form.register}
                  error={form.formState.errors.authorInput}
                  required
                  className="space-y-1.5"
                  inputClassName="bg-white border-neutral-300 focus:border-[#ec7211] focus:ring-1 focus:ring-[#ec7211] text-neutral-900 rounded-lg text-sm"
                />
              </div>

              <div className="space-y-1.5">
                <Label className="text-neutral-700 font-semibold text-xs uppercase tracking-wider">Thumbnail Image</Label>
                <FileUploader
                  onFileSelect={handleFileUpload}
                  previewUrl={thumbnailUrl}
                  loading={uploading}
                  onRemovePreview={() => form.setValue("thumbnailUrl", "")}
                  subLabel="PNG, JPG, or SVG (max. 5MB)"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <Label htmlFor="art-content" className="text-neutral-700 font-semibold text-xs uppercase tracking-wider">Content (Supports Markdown)</Label>
                <span className="text-[10px] text-neutral-500 font-mono flex items-center gap-1">
                  <BookOpen size={10} /> Markdown supported
                </span>
              </div>
              <FormTextAreaField
                name="content"
                label="Content (Supports Markdown)"
                rows={10}
                placeholder="# Enter your markdown article title here..."
                register={form.register}
                error={form.formState.errors.content}
                required
                className="space-y-1.5"
                inputClassName="bg-white border-neutral-300 focus:border-[#ec7211] focus:ring-1 focus:ring-[#ec7211] text-neutral-900 rounded-lg text-sm font-mono leading-relaxed"
              />
            </div>
          </div>

          <DialogFooter>
            <Button
              type="button"
              onClick={() => onOpenChange(false)}
              className="bg-neutral-100 hover:bg-neutral-200 text-neutral-700! font-semibold rounded-lg border border-neutral-300 cursor-pointer"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              className="bg-[#ec7211] hover:bg-[#d65f0e] text-white font-bold rounded-lg cursor-pointer flex items-center gap-1.5"
              disabled={submitting || uploading}
            >
              {submitting && <Loader2 size={12} className="animate-spin" />}
              Save Article
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
