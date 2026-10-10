// ponytail: premium drag-and-drop file uploader component styled after shadcn studio
import * as React from "react";
import { useState } from "react";
import { UploadCloud, Loader2, X } from "lucide-react";
import { cn } from "@/shared/lib/utils";

interface FileUploaderProps {
  onFileSelect: (file: File) => void;
  previewUrl?: string | null;
  loading?: boolean;
  accept?: string;
  subLabel?: string;
  className?: string;
  onRemovePreview?: () => void;
}

export function FileUploader({
  onFileSelect,
  previewUrl,
  loading = false,
  accept = "image/*",
  subLabel = "PNG, JPG, or SVG (max. 5MB)",
  className,
  onRemovePreview,
}: FileUploaderProps) {
  const [dragActive, setDragActive] = useState(false);
  const inputRef = React.useRef<HTMLInputElement>(null);

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      onFileSelect(e.dataTransfer.files[0]);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    if (e.target.files && e.target.files[0]) {
      onFileSelect(e.target.files[0]);
    }
  };

  const onButtonClick = (e: React.MouseEvent) => {
    e.preventDefault();
    inputRef.current?.click();
  };

  return (
    <div className="w-full">
      <input
        ref={inputRef}
        type="file"
        className="hidden"
        accept={accept}
        onChange={handleChange}
        disabled={loading}
      />
      <div
        onDragEnter={handleDrag}
        onDragOver={handleDrag}
        onDragLeave={handleDrag}
        onDrop={handleDrop}
        onClick={onButtonClick}
        className={cn(
          "relative flex flex-col items-center justify-center w-full min-h-[140px] border-2 border-dashed rounded-xl cursor-pointer transition-all duration-200 p-4 select-none bg-muted/50 hover:bg-muted group",
          dragActive
            ? "border-ring bg-accent"
            : "border-input hover:border-ring/50",
          className
        )}
      >
        {loading ? (
          <div className="flex flex-col items-center gap-2 text-muted-foreground font-semibold text-xs">
            <Loader2 className="h-6 w-6 animate-spin" />
            <span>Uploading file...</span>
          </div>
        ) : previewUrl ? (
          <div className="relative flex flex-col items-center justify-center w-full h-full gap-2" onClick={(e) => e.stopPropagation()}>
            <div className="relative rounded-lg overflow-hidden border border-border bg-background max-h-[100px] max-w-[160px] p-1">
              <img src={previewUrl} alt="Preview" className="object-contain max-h-[90px] w-full rounded" />
              {onRemovePreview && (
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    onRemovePreview();
                  }}
                  className="absolute top-1 right-1 p-1 bg-black/60 hover:bg-black/80 text-white rounded-full transition-all cursor-pointer"
                >
                  <X size={12} />
                </button>
              )}
            </div>
            <button
              type="button"
              onClick={onButtonClick}
              className="text-[11px] font-semibold text-foreground hover:underline cursor-pointer"
            >
              Change File
            </button>
          </div>
        ) : (
          <div className="flex flex-col items-center text-center gap-2 pointer-events-none">
            <div className="p-2.5 bg-card rounded-xl shadow-xs border border-border text-muted-foreground group-hover:text-foreground transition-colors">
              <UploadCloud size={20} className="group-hover:scale-105 transition-transform" />
            </div>
            <div className="flex flex-col gap-0.5 mt-0.5">
              <p className="text-xs font-semibold text-foreground">
                <span className="group-hover:underline">Click to upload</span> or drag and drop
              </p>
              <p className="text-[10px] text-muted-foreground">{subLabel}</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
