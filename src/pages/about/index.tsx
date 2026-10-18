import { lazy, Suspense, useEffect } from "react";
import { Link } from "react-router-dom";
import { Blobatar } from "@blobatar/react";
import { useGaze } from "@blobatar/react/gaze";
import "blobatar/motion.css";
import "blobatar/gaze.css";

import { Header } from "@/widgets/header";
import { AchievementList } from "@/features/achievement/components/achievement-list";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/shared/ui/dialog";
import FoldText from "@/shared/ui/fold-text";

// PDF.js is heavy; only load it when the CV preview dialog opens.
const PdfViewer = lazy(() => import("@/shared/ui/pdf-viewer"));

const HIGHLIGHTS = [
  {
    title: "Full-Stack Development",
    description:
      "Building features end to end, from APIs and data flows to interfaces, with a focus on making the whole system work well.",
  },
  {
    title: "Frontend Engineering",
    description:
      "Building responsive, accessible interfaces with thoughtful interactions and components that are easy to maintain.",
  },
  {
    title: "Performance & Reliability",
    description:
      "Finding bottlenecks, reducing unnecessary work, and keeping applications responsive across devices and network conditions.",
  },
  {
    title: "TypeScript & Architecture",
    description:
      "Using strong types, clear boundaries, and well-structured code to catch mistakes early and keep changes manageable.",
  },
];

const STORY = [
  "I started out in full-stack development, working on everything from APIs to user interfaces. Over time, I found myself drawn more toward frontend development, while still enjoying the backend work that makes an application run.",
  "Working in a corporate environment with a fast development cycle has taught me to move quickly, adapt to changing requirements, and work with other teams to get things shipped. I enjoy that pace, especially when there's room to solve problems and improve how things are built.",
  "I pay attention to the small stuff, too: how an app performs on a slow connection, whether TypeScript catches mistakes early, and whether an interaction feels right. I want to write code that's easy to work with, even when deadlines are tight.",
];

// Served same-origin (Vite proxy in dev, Vercel rewrite in prod) so the PDF
// can be fetched and rendered with PDF.js without CORS issues.
const CV_HREF = "/api/v1/storage/raw/8021e426-7271-4b17-8f9d-7d763c5fabf1";

function CvDownloadLink({ className }: { className?: string }) {
  const triggerClass =
    className ??
    "inline-flex items-center gap-2 text-sm rounded-full px-5 py-2.5 bg-white border border-neutral-200 hover:bg-neutral-100 duration-300 text-neutral-400 hover:text-[#111111] transition-colors cursor-pointer";

  return (
    <Dialog>
      <DialogTrigger className={triggerClass}>Download CV ↓</DialogTrigger>
      <DialogContent className="max-w-3xl w-[calc(100%-2rem)] p-0 gap-0 overflow-hidden">
        <DialogHeader className="px-6 pt-6 pb-4">
          <DialogTitle className="text-2xl font-medium">Curriculum Vitae</DialogTitle>
          <DialogDescription>
            Preview of Aji Hamdani&apos;s curriculum vitae.
          </DialogDescription>
        </DialogHeader>
        <div className="px-6">
          <Suspense
            fallback={
              <div className="h-[55vh] animate-pulse rounded-sm border border-neutral-200 bg-neutral-100" />
            }
          >
            <PdfViewer src={CV_HREF} />
          </Suspense>
        </div>
        <div className="flex justify-end gap-2 px-6 py-5">
          <a
            href={CV_HREF}
            download
            className="inline-flex items-center gap-2 text-sm rounded-full px-5 py-2.5 cursor-pointer"
          >
            Download CV ↓
          </a>
        </div>
      </DialogContent>
    </Dialog>
  );
}

export function AboutPage() {
  const { ref: gazeRef } = useGaze({ travel: 3, lookAt: "pointer" });

  useEffect(() => {
    document.title = "About — Aji Hamdani";
    return () => {
      document.title = "Portfolio - Aji Hamdani Ahmad";
    };
  }, []);

  return (
    <div className="min-h-screen bg-white text-[#111111] font-sans">
      <Header />
      <main id="main-content">
        {/* Intro */}
        <section className="relative grid-pattern px-4 pt-10 pb-16 md:pt-16 md:pb-24">
          <div className="blur-fade blur-fade-bottom" aria-hidden="true" />
          <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-x-1 gap-y-8 items-center">
            <div>
              <p className="text-sm text-gray-400 mb-3">About</p>
              <h1 className="text-3xl md:text-5xl leading-none tracking-[-2.5px]">
                <FoldText text="Hi, I'm Aji Hamdani." />
              </h1>
              <p className="text-md leading-relaxed text-gray-500 mt-6 max-w-md">
                People often call me Aji, Ajik, or Jik 😅. Yeah, there are so
                many LOL (never mind). I like building apps, breaking things
                (well, just kidding), and figuring out how to fix them. I enjoy
                exploring new technologies and building things from scratch.
              </p>
              <div className="flex flex-wrap items-center gap-4 mt-8">
                <Link
                  to="/"
                  className="text-sm font-medium text-[#111111] underline underline-offset-4 hover:text-gray-500 transition-colors"
                >
                  ← Back home
                </Link>
                <CvDownloadLink />
              </div>
            </div>
            <div className="flex justify-center md:justify-end">
              <Blobatar
                ref={gazeRef}
                name="ajikkk"
                animate="always"
                title="This is me"
                className="w-48 h-48 md:w-72 md:h-72"
              />
            </div>
          </div>
        </section>

        {/* My story */}
        <section className="px-4 py-16 md:py-24 border-b border-gray-100">
          <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-x-1 gap-y-4">
            <p className="md:sticky md:self-start md:top-4 text-lg leading-[36.4px] tracking-[-0.64px] text-black">
              <FoldText text="My story" />
            </p>
            <div className="space-y-6">
              {STORY.map((paragraph) => (
                <p
                  key={paragraph.slice(0, 24)}
                  className="text-md leading-relaxed text-gray-500"
                >
                  {paragraph}
                </p>
              ))}
            </div>
          </div>
        </section>

        {/* What I do */}
        <section className="px-4 py-16 md:py-24 border-b border-gray-100">
          <div className="max-w-5xl mx-auto">
            <p className="text-lg leading-[36.4px] tracking-[-0.64px] text-black mb-8">
              <FoldText text="What I do" />
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {HIGHLIGHTS.map((item) => (
                <div
                  key={item.title}
                  className="flex flex-col gap-3 border border-gray-200 rounded-xl p-8"
                >
                  <p className="text-xl font-medium text-[#111111]">
                    {item.title}
                  </p>
                  <p className="text-base text-gray-400 leading-relaxed">
                    {item.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Achievements */}
        <AchievementList />

        {/* Contact CTA */}
        <section className="px-4 py-16 md:py-24">
          <div className="max-w-5xl mx-auto">
            <p className="text-lg leading-[36.4px] tracking-[-0.64px] text-black mb-4">
              Let&apos;s work together
            </p>
            <p className="text-md text-gray-500 leading-relaxed max-w-md">
              Available for freelance projects and part-time opportunities. Say
              hello at{" "}
              <a
                href="mailto:aji.ahmad.dev@gmail.com"
                className="text-[#111111] underline underline-offset-4 hover:text-gray-600 transition-colors"
              >
                aji.ahmad.dev@gmail.com
              </a>
            </p>
            <div className="mt-6">
              <CvDownloadLink />
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
