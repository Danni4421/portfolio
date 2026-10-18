import { useEffect, useRef, useState } from "react";
import type {
  PDFDocumentLoadingTask,
  PDFDocumentProxy,
  RenderTask,
} from "pdfjs-dist/legacy/build/pdf.mjs";

import { loadPdfjs } from "@/shared/lib/pdfjs";
import { cn } from "@/shared/lib/utils";

/** Extra distance (px) before a page scrolls into view that triggers its render. */
const RENDER_MARGIN = "400px 0px";

type PdfViewerProps = {
  /** URL of the PDF to preview. */
  src: string;
  className?: string;
};

/**
 * Lightweight, embeddable PDF preview rendered with PDF.js on <canvas>.
 * Pages render lazily as they scroll into view and re-render on resize.
 */
export function PdfViewer({ src, className }: PdfViewerProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [state, setState] = useState<{
    src: string;
    status: "loading" | "ready" | "error";
    doc: PDFDocumentProxy | null;
  }>({ src, status: "loading", doc: null });
  const [width, setWidth] = useState(0);

  // Always starts the document load when the viewer mounts, whether or not
  // the library was preloaded earlier.
  useEffect(() => {
    let cancelled = false;
    let task: PDFDocumentLoadingTask | undefined;

    loadPdfjs()
      .then((pdfjs) => {
        if (cancelled) return null;
        task = pdfjs.getDocument({ url: src });
        return task.promise;
      })
      .then((pdf) => {
        if (cancelled || !pdf) return;
        setState({ src, status: "ready", doc: pdf });
      })
      .catch(() => {
        if (!cancelled) setState({ src, status: "error", doc: null });
      });

    return () => {
      cancelled = true;
      void task?.destroy();
    };
  }, [src]);

  // Ignore a document loaded for a previous `src`.
  const doc = state.src === src ? state.doc : null;
  const status = state.src === src ? state.status : "loading";

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const observer = new ResizeObserver(([entry]) => {
      const next = Math.floor(entry.contentRect.width);
      setWidth((prev) => (Math.abs(prev - next) > 1 ? next : prev));
    });
    observer.observe(el);
    setWidth(Math.floor(el.clientWidth));

    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={containerRef}
      className={cn("relative h-[55vh] overflow-y-auto bg-white", className)}
    >
      {status === "loading" && (
        <div className="flex flex-col">
          <div className="w-full aspect-[1/1.414] animate-pulse bg-neutral-100" />
          <div className="w-full aspect-[1/1.414] animate-pulse bg-neutral-50" />
        </div>
      )}

      {status === "error" && (
        <div className="flex h-full items-center justify-center px-6 text-sm text-neutral-400">
          Couldn&apos;t load the preview. Use the download button below.
        </div>
      )}

      {status === "ready" && doc && width > 0 && (
        <div className="flex flex-col">
          {Array.from({ length: doc.numPages }, (_, index) => (
            <PdfPage key={index + 1} doc={doc} pageNumber={index + 1} width={width} />
          ))}
        </div>
      )}
    </div>
  );
}

type PdfPageProps = {
  doc: PDFDocumentProxy;
  pageNumber: number;
  width: number;
};

function PdfPage({ doc, pageNumber, width }: PdfPageProps) {
  const holderRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [visible, setVisible] = useState(pageNumber === 1);
  const [aspectRatio, setAspectRatio] = useState<number | null>(null);
  const [rendered, setRendered] = useState(false);

  useEffect(() => {
    let cancelled = false;

    doc.getPage(pageNumber).then((page) => {
      if (cancelled) return;
      const { width: pageWidth, height: pageHeight } = page.getViewport({
        scale: 1,
      });
      setAspectRatio(pageWidth / pageHeight);
      page.cleanup();
    });

    return () => {
      cancelled = true;
    };
  }, [doc, pageNumber]);

  useEffect(() => {
    const el = holderRef.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.disconnect();
        }
      },
      { rootMargin: RENDER_MARGIN },
    );
    observer.observe(el);

    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!visible || !canvas || width <= 0) return;

    let cancelled = false;
    let task: RenderTask | undefined;

    doc.getPage(pageNumber).then((page) => {
      if (cancelled) return;

      const baseViewport = page.getViewport({ scale: 1 });
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const viewport = page.getViewport({
        scale: (width / baseViewport.width) * dpr,
      });

      canvas.width = Math.floor(viewport.width);
      canvas.height = Math.floor(viewport.height);
      canvas.style.width = `${width}px`;
      canvas.style.height = `${Math.floor(viewport.height / dpr)}px`;

      task = page.render({
        canvas,
        viewport,
        background: "rgb(255 255 255)",
      });
      task.promise
        .then(() => {
          page.cleanup();
          if (!cancelled) setRendered(true);
        })
        .catch(() => {
          // Rendering was cancelled (unmount/resize); ignore.
        });
    });

    return () => {
      cancelled = true;
      task?.cancel();
    };
  }, [doc, pageNumber, width, visible]);

  return (
    <div
      ref={holderRef}
      className="relative w-full"
      style={aspectRatio ? { aspectRatio, width } : { width }}
    >
      {!rendered && (
        <div className="absolute inset-0 animate-pulse rounded-sm bg-neutral-200/70" />
      )}
      <canvas ref={canvasRef} className="block bg-white" />
    </div>
  );
}

export default PdfViewer;
