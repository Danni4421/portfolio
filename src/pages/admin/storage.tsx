// ponytail: storage manager — upload + preview any binary asset.
// Listing comes from GET /api/v1/storage (admin-only); binaries are served
// via GET /api/v1/storage/raw/{id}.
import { useState, useEffect, useCallback, useRef } from "react";
import { Plus, Copy, ExternalLink, Eye, Loader2, FileIcon, UploadCloud, X, Trash2 } from "lucide-react";
import { Button } from "@/shared/ui/button";
import { Badge } from "@/shared/ui/badge";
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
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/shared/ui/dialog";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetFooter,
} from "@/shared/ui/sheet";
import { cn } from "@/shared/lib/utils";
import { apiClient } from "@/shared/api/client";
import { Effect } from "effect";
import { useToast } from "@/shared/ui/toast";
import { ConfirmDialog } from "@/shared/ui/confirm-dialog";

interface StoredFile {
  id: string;
  url: string;
  type: string;
  size: number;
  createdAt: string;
}

interface StorageListEntry {
  id: string;
  url: string;
  content_type: string;
  size: number;
  created_at: string;
}

const formatSize = (bytes: number): string => {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
};

const fileCategory = (type: string): "image" | "pdf" | "video" | "audio" | "other" => {
  if (type.startsWith("image/")) return "image";
  if (type === "application/pdf") return "pdf";
  if (type.startsWith("video/")) return "video";
  if (type.startsWith("audio/")) return "audio";
  return "other";
};

function FilePreview({ file, className }: { file: StoredFile; className?: string }) {
  const category = fileCategory(file.type);

  if (category === "image") {
    return (
      <img
        src={file.url}
        alt={file.id}
        loading="lazy"
        className={`object-cover ${className ?? ""}`}
      />
    );
  }

  if (category === "pdf") {
    return (
      <iframe
        src={`${file.url}#toolbar=0&view=FitH`}
        title={file.id}
        className={`border-0 bg-muted ${className ?? ""}`}
      />
    );
  }

  if (category === "video") {
    return (
      <video src={file.url} controls preload="metadata" className={`bg-black ${className ?? ""}`} />
    );
  }

  if (category === "audio") {
    return (
      <div className={`flex items-center justify-center bg-muted ${className ?? ""}`}>
        <audio src={file.url} controls preload="metadata" className="w-11/12" />
      </div>
    );
  }

  return (
    <div className={`flex flex-col items-center justify-center gap-2 bg-muted ${className ?? ""}`}>
      <FileIcon size={32} className="text-muted-foreground" />
      <span className="px-2 text-xs text-muted-foreground text-center break-all font-mono">
        {file.id}
      </span>
    </div>
  );
}

export function AdminStoragePage() {
  const { toast } = useToast();
  const [files, setFiles] = useState<StoredFile[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [uploadOpen, setUploadOpen] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [dragActive, setDragActive] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [deleting, setDeleting] = useState(false);
  const [previewFile, setPreviewFile] = useState<StoredFile | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const fetchFiles = useCallback(() => {
    setLoading(true);
    return Effect.runPromise(apiClient.get<{ success: boolean; data: StorageListEntry[] }>("/api/v1/storage"))
      .then((res) => {
        setFiles(
          res.data.map((entry) => ({
            id: entry.id,
            url: entry.url,
            type: entry.content_type,
            size: entry.size,
            createdAt: entry.created_at,
          }))
        );
      })
      .catch((err: Error) => {
        toast({ title: "Error", description: err.message, variant: "destructive" });
      })
      .finally(() => setLoading(false));
  }, [toast]);

  useEffect(() => {
    // same fetch-on-mount pattern as the other admin pages
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchFiles();
  }, [fetchFiles]);

  const addFiles = (incoming: FileList | File[]) => {
    setSelectedFiles((prev) => [...prev, ...Array.from(incoming)]);
  };

  const removeSelected = (index: number) => {
    setSelectedFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const handleUpload = () => {
    if (selectedFiles.length === 0) return;

    setUploading(true);
    const uploads = selectedFiles.map((file) => Effect.runPromise(apiClient.uploadFile(file)));

    Promise.all(uploads)
      .then(() => {
        toast({
          title: "Uploaded",
          description: `${selectedFiles.length} file${selectedFiles.length > 1 ? "s" : ""} uploaded`,
          variant: "success",
        });
        setUploadOpen(false);
        setSelectedFiles([]);
        return fetchFiles();
      })
      .catch((err: Error) => {
        toast({ title: "Upload Failed", description: err.message, variant: "destructive" });
      })
      .finally(() => setUploading(false));
  };

  const handleDropzoneDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files?.length) addFiles(e.dataTransfer.files);
  };

  const handleCopy = async (url: string) => {
    try {
      await navigator.clipboard.writeText(url);
      toast({ title: "Copied", description: "URL copied to clipboard", variant: "success" });
    } catch {
      toast({ title: "Error", description: "Failed to copy URL", variant: "destructive" });
    }
  };

  const handleDelete = () => {
    if (!deleteId) return;
    setDeleting(true);

    Effect.runPromise(apiClient.delete(`/api/v1/storage/${deleteId}`))
      .then(() => {
        toast({ title: "Deleted", description: "File deleted", variant: "success" });
        if (previewFile?.id === deleteId) setPreviewFile(null);
        setDeleteId(null);
        return fetchFiles();
      })
      .catch((err: Error) => {
        toast({ title: "Delete Failed", description: err.message, variant: "destructive" });
      })
      .finally(() => setDeleting(false));
  };

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-1.5 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-lg font-semibold tracking-tight">Storage</h2>
          <p className="text-sm text-muted-foreground">
            Upload and preview binary assets — images, PDFs, videos, and more
          </p>
        </div>
        <Button className="gap-2 self-start" onClick={() => setUploadOpen(true)}>
          <Plus size={16} />
          Upload File
        </Button>
      </div>

      <Card className="overflow-hidden py-0">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-24">Preview</TableHead>
              <TableHead>File ID</TableHead>
              <TableHead className="w-28">Type</TableHead>
              <TableHead className="w-24">Size</TableHead>
              <TableHead className="w-32">Uploaded</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              Array.from({ length: 5 }).map((_, idx) => (
                <TableRow key={idx}>
                  <TableCell>
                    <Skeleton className="h-10 w-16" />
                  </TableCell>
                  <TableCell>
                    <Skeleton className="h-4 w-48" />
                  </TableCell>
                  <TableCell>
                    <Skeleton className="h-4 w-14" />
                  </TableCell>
                  <TableCell>
                    <Skeleton className="h-4 w-12" />
                  </TableCell>
                  <TableCell>
                    <Skeleton className="h-4 w-20" />
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-1">
                      <Skeleton className="h-8 w-8" />
                      <Skeleton className="h-8 w-8" />
                      <Skeleton className="h-8 w-8" />
                      <Skeleton className="h-8 w-8" />
                    </div>
                  </TableCell>
                </TableRow>
              ))
            ) : files.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="p-8 text-center text-muted-foreground">
                  No files uploaded yet. Click 'Upload File' to get started.
                </TableCell>
              </TableRow>
            ) : (
              files.map((file, idx) => (
                <TableRow
                  key={file.id}
                  className="animate-content-enter"
                  style={{ animationDelay: `${idx * 60}ms` }}
                >
                  <TableCell>
                    {fileCategory(file.type) === "image" ? (
                      <img
                        src={file.url}
                        alt=""
                        loading="lazy"
                        className="h-10 w-16 rounded-md object-cover border border-border bg-muted"
                      />
                    ) : (
                      <div className="flex h-10 w-16 items-center justify-center rounded-md border border-border bg-muted text-muted-foreground">
                        <FileIcon size={16} />
                      </div>
                    )}
                  </TableCell>
                  <TableCell className="font-mono text-sm text-foreground max-w-xs truncate">
                    {file.id}
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline" className="uppercase">{fileCategory(file.type)}</Badge>
                  </TableCell>
                  <TableCell className="text-muted-foreground text-xs">
                    {formatSize(file.size)}
                  </TableCell>
                  <TableCell className="text-muted-foreground text-xs whitespace-nowrap">
                    {new Date(file.createdAt).toLocaleDateString()}
                  </TableCell>
                  <TableCell className="text-right whitespace-nowrap">
                    <div className="flex justify-end gap-1">
                      <Button
                        variant="ghost"
                        size="icon-sm"
                        onClick={() => setPreviewFile(file)}
                        aria-label="Preview"
                      >
                        <Eye size={14} />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon-sm"
                        onClick={() => handleCopy(file.url)}
                        aria-label="Copy URL"
                      >
                        <Copy size={14} />
                      </Button>
                      <a
                        href={file.url}
                        target="_blank"
                        rel="noreferrer"
                        aria-label="Open in new tab"
                        className="inline-flex size-8 shrink-0 cursor-pointer items-center justify-center rounded-md text-sm font-medium transition-colors hover:bg-muted hover:text-foreground"
                      >
                        <ExternalLink size={14} />
                      </a>
                      <Button
                        variant="ghost"
                        size="icon-sm"
                        onClick={() => setDeleteId(file.id)}
                        aria-label="Delete"
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

      <Sheet
        open={uploadOpen}
        onOpenChange={(open) => {
          setUploadOpen(open);
          if (!open && !uploading) setSelectedFiles([]);
        }}
      >
        <SheetContent className="sm:max-w-lg">
          <SheetHeader>
            <SheetTitle>Upload File</SheetTitle>
          </SheetHeader>

          <div className="min-h-0 flex-1 overflow-y-auto px-6 py-6 space-y-4">
            <div
              onDragEnter={(e) => { e.preventDefault(); e.stopPropagation(); setDragActive(true); }}
              onDragOver={(e) => { e.preventDefault(); e.stopPropagation(); setDragActive(true); }}
              onDragLeave={(e) => { e.preventDefault(); e.stopPropagation(); setDragActive(false); }}
              onDrop={handleDropzoneDrop}
              onClick={() => fileInputRef.current?.click()}
              className={cn(
                "relative flex flex-col items-center justify-center w-full min-h-[140px] border-2 border-dashed rounded-xl cursor-pointer transition-all duration-200 p-4 select-none bg-muted/50 hover:bg-muted group",
                dragActive ? "border-ring bg-accent" : "border-input hover:border-ring/50"
              )}
            >
              <input
                ref={fileInputRef}
                type="file"
                multiple
                className="hidden"
                onChange={(e) => {
                  if (e.target.files?.length) addFiles(e.target.files);
                  e.target.value = "";
                }}
              />
              <div className="flex flex-col items-center text-center gap-2 pointer-events-none">
                <div className="p-2.5 bg-card rounded-xl shadow-xs border border-border text-muted-foreground group-hover:text-foreground transition-colors">
                  <UploadCloud size={20} className="group-hover:scale-105 transition-transform" />
                </div>
                <div className="flex flex-col gap-0.5 mt-0.5">
                  <p className="text-xs font-semibold text-foreground">
                    <span className="group-hover:underline">Click to upload</span> or drag and drop
                  </p>
                  <p className="text-[10px] text-muted-foreground">Any binary asset — images, PDFs, videos, audio</p>
                </div>
              </div>
            </div>

            {selectedFiles.length > 0 && (
              <ul className="divide-y divide-border rounded-lg border border-border">
                {selectedFiles.map((file, idx) => (
                  <li key={`${file.name}-${idx}`} className="flex items-center justify-between gap-2 px-3 py-2">
                    <div className="min-w-0">
                      <p className="truncate text-sm text-foreground">{file.name}</p>
                      <p className="text-xs text-muted-foreground">{file.type || "unknown type"} · {formatSize(file.size)}</p>
                    </div>
                    <Button
                      variant="ghost"
                      size="icon-sm"
                      aria-label="Remove file"
                      disabled={uploading}
                      onClick={() => removeSelected(idx)}
                    >
                      <X size={14} />
                    </Button>
                  </li>
                ))}
              </ul>
            )}
          </div>

          <SheetFooter className="flex flex-col!">
            <Button type="button" variant="outline" onClick={() => setUploadOpen(false)} disabled={uploading}>
              Cancel
            </Button>
            <Button
              type="button"
              className="gap-1.5"
              disabled={uploading || selectedFiles.length === 0}
              onClick={handleUpload}
            >
              {uploading && <Loader2 size={12} className="animate-spin" />}
              {uploading ? "Uploading…" : `Upload${selectedFiles.length > 0 ? ` (${selectedFiles.length})` : ""}`}
            </Button>
          </SheetFooter>
        </SheetContent>
      </Sheet>

      <Dialog open={!!previewFile} onOpenChange={(open) => !open && setPreviewFile(null)}>
        <DialogContent className="max-w-3xl w-[calc(100%-2rem)] p-0 gap-0 overflow-hidden">
          <DialogHeader className="px-6 pt-6 pb-4">
            <DialogTitle className="truncate font-mono text-base">{previewFile?.id}</DialogTitle>
            <DialogDescription>
              {previewFile ? `${fileCategory(previewFile.type)} · ${previewFile.type} · ${formatSize(previewFile.size)}` : ""}
            </DialogDescription>
          </DialogHeader>
          {previewFile && (
            <div className="px-6">
              <FilePreview file={previewFile} className="w-full max-h-[60vh] rounded-lg" />
            </div>
          )}
          <div className="flex justify-end gap-2 px-6 py-5">
            <Button variant="outline" onClick={() => previewFile && handleCopy(previewFile.url)} className="gap-2">
              <Copy size={14} /> Copy URL
            </Button>
            {previewFile && (
              <a
                href={previewFile.url}
                target="_blank"
                rel="noreferrer"
                className="inline-flex h-9 shrink-0 items-center justify-center gap-1.5 whitespace-nowrap rounded-md px-4 py-2 text-sm font-medium bg-primary text-primary-foreground hover:bg-primary/80 transition-colors"
              >
                <ExternalLink size={14} /> Open
              </a>
            )}
          </div>
        </DialogContent>
      </Dialog>

      <ConfirmDialog
        open={deleteId !== null}
        onOpenChange={(open) => {
          if (!open && !deleting) setDeleteId(null);
        }}
        title="Delete file?"
        description="This will permanently delete the file. This action cannot be undone."
        confirmLabel="Delete"
        loading={deleting}
        onConfirm={handleDelete}
      />
    </div>
  );
}
