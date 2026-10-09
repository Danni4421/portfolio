import { useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { Blobatar } from "@blobatar/react";
import { useGaze } from "@blobatar/react/gaze";
import "blobatar/motion.css";
import "blobatar/gaze.css";

import { Header } from "@/widgets/header";

export function NotFoundPage() {
  const { pathname } = useLocation();
  const { ref: gazeRef } = useGaze({ travel: 3, lookAt: "pointer" });

  useEffect(() => {
    document.title = "404 — Page not found";
    return () => {
      document.title = "Portfolio - Aji Hamdani Ahmad";
    };
  }, []);

  return (
    <div className="min-h-screen bg-white text-[#111111] font-sans">
      <Header />
      <main
        id="main-content"
        className="px-4 py-16 md:py-28 border-t border-gray-100 flex items-center"
      >
        <div className="max-w-5xl mx-auto w-full flex flex-col items-center text-center gap-5">
          <Blobatar
            ref={gazeRef}
            name="lost-and-found"
            animate="always"
            title="I could not find it either"
            className="w-36 h-36 md:w-44 md:h-44"
          />

          <p className="text-sm tracking-[0.24px] text-gray-400">Error 404</p>

          <h1 className="text-3xl md:text-5xl leading-none tracking-[-2.5px]">
            This page wandered off.
          </h1>

          <p className="text-md text-gray-400 max-w-md leading-relaxed">
            Nothing lives at{" "}
            <span className="text-[#111111] break-all">{pathname}</span>. It may have been
            renamed, moved, or never existed at all.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-3 mt-4">
            <Link
              to="/"
              className="text-sm font-medium text-[#111111] underline underline-offset-4 hover:text-gray-500 transition-colors"
            >
              ← Back home
            </Link>
            <Link
              to="/projects"
              className="text-sm font-medium text-[#111111] underline underline-offset-4 hover:text-gray-500 transition-colors"
            >
              See the work
            </Link>
            <Link
              to="/#contact"
              className="text-sm font-medium text-[#111111] underline underline-offset-4 hover:text-gray-500 transition-colors"
            >
              Say hello
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}
