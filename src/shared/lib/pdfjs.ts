import workerSrc from "pdfjs-dist/legacy/build/pdf.worker.min.mjs?url";

export type PdfjsModule = typeof import("pdfjs-dist/legacy/build/pdf.mjs");

let pdfjsPromise: Promise<PdfjsModule> | null = null;

/**
 * Load the PDF.js library on demand. The library is always reached through a
 * dynamic `import()`, so the bundler emits it as its own chunk and it can
 * never end up in the main bundle. Uses the legacy build, which ships
 * polyfills (e.g. `Promise.try`) for the older browsers Vite's default build
 * target still supports.
 */
export function loadPdfjs(): Promise<PdfjsModule> {
  pdfjsPromise ??= import("pdfjs-dist/legacy/build/pdf.mjs")
    .then((pdfjs) => {
      pdfjs.GlobalWorkerOptions.workerSrc = workerSrc;
      return pdfjs;
    })
    .catch((error) => {
      // Don't cache a failed load; a later attempt should retry.
      pdfjsPromise = null;
      throw error;
    });
  return pdfjsPromise;
}

/**
 * Warm up the PDF.js chunk before a viewer is shown (e.g. on hover/focus of a
 * dialog trigger) so rendering doesn't wait for the download on open.
 */
export function preloadPdfjs(): void {
  void loadPdfjs().catch(() => {
    // Preload failures are non-fatal; opening a viewer retries the load.
  });
}
