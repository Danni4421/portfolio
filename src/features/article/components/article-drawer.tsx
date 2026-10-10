// ponytail: separate article edit/create sheet component

import { Loader2 } from "lucide-react";
import { Button } from "@/shared/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetFooter,
} from "@/shared/ui/sheet";
import { useArticleForm } from "@/features/article/hooks/use-article-form";
import { FormField, FormTextField, FormTextAreaField } from "@/shared/ui/form";
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
  const { form, uploading, submitting, handleFileUpload, onSubmit } =
    useArticleForm({
      editingArticle,
      setFormOpen: onOpenChange,
      fetchArticles: onSuccess,
    });

  const thumbnailUrl = form.watch("thumbnailUrl");

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="sm:max-w-3xl">
        <SheetHeader>
          <SheetTitle>
            {editingArticle ? "Edit Article" : "Write Article"}
          </SheetTitle>
        </SheetHeader>

        <form onSubmit={onSubmit} className="flex min-h-0 flex-1 flex-col">
          <div className="min-h-0 flex-1 space-y-4 overflow-y-auto px-6 py-6">
            <FormTextField
              name="title"
              label="Title"
              placeholder="Article title"
              register={form.register}
              error={form.formState.errors.title}
              required
              className="space-y-1.5"
            />

            <FormTextField
              name="authorInput"
              label="Authors (Comma-separated)"
              placeholder="e.g. Aji, Antigravity"
              register={form.register}
              error={form.formState.errors.authorInput}
              required
              className="space-y-1.5"
            />

            <FormField label="Thumbnail Image" htmlFor="thumbnailUrl">
              <FileUploader
                onFileSelect={handleFileUpload}
                previewUrl={thumbnailUrl}
                loading={uploading}
                onRemovePreview={() => form.setValue("thumbnailUrl", "")}
                subLabel="PNG, JPG, or SVG (max. 5MB)"
              />
            </FormField>

            <FormTextAreaField
              name="content"
              label="Content (Supports Markdown)"
              rows={10}
              placeholder="# Enter your markdown article title here..."
              register={form.register}
              error={form.formState.errors.content}
              required
              className="space-y-1.5"
            />
          </div>

          <SheetFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              className="gap-1.5"
              disabled={submitting || uploading}
            >
              {submitting && <Loader2 size={12} className="animate-spin" />}
              Save Article
            </Button>
          </SheetFooter>
        </form>
      </SheetContent>
    </Sheet>
  );
}
