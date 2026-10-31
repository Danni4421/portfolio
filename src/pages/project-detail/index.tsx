import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Markdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { Skeleton } from "@/shared/ui/skeleton";
import FoldText from "@/shared/ui/fold-text";
import { useGetProjectDetail } from "@/features/project/services/use-get-project-detail";
import { Blobatar } from "@blobatar/react";
import { wink, unsure } from "blobatar/expression";
import "blobatar/motion.css";

function BackButton() {
  const navigate = useNavigate();

  return (
    <button
      type="button"
      onClick={() => {
        if ((window.history.state as { idx?: number } | null)?.idx) {
          navigate(-1);
        } else {
          navigate("/");
        }
      }}
      className="group flex w-fit items-center gap-2 rounded-full border border-neutral-200 bg-white py-1.5 pl-1.5 pr-4 text-sm text-[#111111] transition-all duration-300 cursor-pointer hover:border-neutral-300/95"
    >
      <Blobatar
        name="alain00"
        expression={unsure}
        animate="hover"
        className="w-8 h-8 shrink-0"
      />
      <span className="whitespace-nowrap">Tap to go back</span>
    </button>
  );
}

export function ProjectDetailPage() {
  const { slug } = useParams<{ slug: string }>();

  const [showScrollTop, setShowScrollTop] = useState(false);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "instant" });
  }, [slug]);

  useEffect(() => {
    const handleScroll = () => setShowScrollTop(window.scrollY > 300);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const {
    data: projectDetail,
    isLoading: loading,
    isError,
    error,
    refetch,
  } = useGetProjectDetail({ slug: slug ?? "" });

  const project = projectDetail?.project ?? null;
  const storyMarkdown = projectDetail?.markdown ?? "";

  if (loading) {
    return (
      <main className="min-h-screen px-4 py-20 md:px-24 bg-white">
        <div className="mx-auto max-w-4xl space-y-8" aria-hidden>
          {/* title */}
          <Skeleton className="h-12 w-2/3" />

          {/* thumbnail */}
          <Skeleton className="h-96 w-full rounded-2xl" />

          {/* short description */}
          <div className="flex flex-col gap-3">
            <Skeleton className="h-6 w-44" />
            <Skeleton className="h-5 w-full" />
            <Skeleton className="h-5 w-2/3" />
          </div>

          {/* story */}
          <div className="flex flex-col gap-3">
            <Skeleton className="h-6 w-40" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-11/12" />
            <Skeleton className="h-4 w-4/5" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-3/5" />
          </div>
        </div>
      </main>
    );
  }

  if (isError) {
    const notFound = error instanceof Error && error.message.includes("404");

    if (notFound) {
      return (
        <main className="min-h-screen px-4 py-20 md:px-24">
          <div className="mx-auto max-w-4xl space-y-8 text-center">
            <BackButton />
            <h1 className="text-3xl font-bold">
              <FoldText text="Project not found" />
            </h1>
          </div>
        </main>
      );
    }

    return (
      <main className="min-h-screen px-4 py-20 md:px-24 bg-white">
        <div className="mx-auto max-w-4xl text-center space-y-4">
          <BackButton />
          <p className="text-sm text-gray-400">
            <FoldText text="Failed to load the project." splitBy="word" duration={0.2} />
          </p>
          <button
            type="button"
            onClick={() => refetch()}
            className="bg-transparent border-0 p-0 cursor-pointer text-sm underline underline-offset-4 text-gray-400 hover:text-[#111111]"
          >
            Try again
          </button>
        </div>
      </main>
    );
  }

  if (!project) {
    return (
      <main className="min-h-screen px-4 py-20 md:px-24">
        <div className="mx-auto max-w-4xl space-y-8 text-center">
          <BackButton />
          <h1 className="text-3xl font-bold">
            <FoldText text="Project not found" />
          </h1>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen px-4 py-20 md:px-24 bg-white">
      <div className="mx-auto max-w-4xl space-y-8 animate-content-enter">
        <BackButton />
        <h1 className="font-serif text-[3rem] leading-[1.1] tracking-[-0.02em] font-medium text-gray-900">
          <FoldText text={project.title} />
        </h1>

        {project.thumbnail_url && (
          <div className="shine-enter rounded-2xl">
            <img
              src={project.thumbnail_url}
              alt={project.title}
              className="h-96 w-full rounded-2xl object-cover"
            />
          </div>
        )}

        {project.description && (
          <div className="flex flex-col">
            <p className="text-lg text-gray-700">
              {project.description}
            </p>
          </div>
        )}

        {storyMarkdown && (
          <div className="flex flex-col">
            <div className="flex items-center gap-4">
              <div className="flex-1 border-t border-dashed border-neutral-400" />
              <span className="text-neutral-400 whitespace-nowrap">
                Read the project story
              </span>
              <div className="flex-1 border-t border-dashed border-neutral-400" />
            </div>
            <div className="prose max-w-none space-y-6 mt-6">
              <Markdown remarkPlugins={[remarkGfm]}>{storyMarkdown}</Markdown>
            </div>
          </div>
        )}
      </div>

      {/* Scroll to top button */}
      <button
        type="button"
        aria-label="Scroll to top"
        onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
        className={`group fixed bottom-8 right-8 z-50 flex w-fit items-center gap-2 rounded-full border border-neutral-200 bg-white py-1.5 pl-4 pr-1.5 text-sm text-[#111111] transition-all duration-300 cursor-pointer hover:border-neutral-300/95 ${
          showScrollTop
            ? "opacity-100 translate-y-0"
            : "opacity-0 translate-y-4 pointer-events-none"
        }`}
      >
        <span className="whitespace-nowrap">Back to top</span>
        <Blobatar
          name="alain00"
          expression={wink}
          animate="hover"
          className="w-8 h-8 shrink-0"
        />
      </button>
    </main>
  );
}
