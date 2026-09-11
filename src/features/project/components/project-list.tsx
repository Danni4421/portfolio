import { useEffect, useRef } from "react";
import { useQuery } from "@tanstack/react-query";
import { Effect } from "effect";
import type { Project } from "@/entities/project/model/types";
import { getRecentProjects } from "@/entities/project/api/project";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export function ProjectList() {
  const containerRef = useRef<HTMLDivElement>(null);

  const { data: projects } = useQuery<Array<Project>>({
    queryKey: ["recentProjects"],
    queryFn: () =>
      Effect.runPromise(
        getRecentProjects().pipe(
          Effect.map(
            ({ projects }: { projects: Array<Project> }): Array<Project> =>
              projects,
          ),
        ),
      ),
  });

  useEffect(() => {
    if (!projects || projects.length === 0) return;

    const ctx = gsap.context(() => {
      const cards = gsap.utils.toArray("[data-project-card]") as Element[];
      cards.forEach((card) => {
        gsap.from(card as gsap.TweenTarget, {
          opacity: 0,
          y: 18,
          duration: 0.6,
          scrollTrigger: {
            trigger: card,
            start: "top 85%",
            toggleActions: "play none none none",
          },
        });
      });
    }, containerRef);

    return () => ctx.revert();
  }, [projects]);

  if (!projects || projects.length === 0) return null;

  return (
    <section className="px-4 py-16 md:py-24 border-t border-gray-100">
      <div className="max-w-5xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-1 gap-y-4 mb-6 md:mb-8">
          <p className="md:sticky md:self-start md:top-4 text-lg tracking-[-0.64px] text-black">
            What have I been working on?
          </p>
          <div>
            <p className="text-sm leading-relaxed text-gray-500">
              Projects I've created and build with care.
            </p>
            <a
              className="inline-block mt-4 text-sm underline underline-offset-4 text-gray-400 hover:text-[#111111]"
              href="/projects"
            >
              View all
            </a>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
          {projects.map((project) => (
            <a
              key={project.id}
              href={`/projects/${project.id}`}
              className="block group"
              data-project-card
            >
              <div className="aspect-7/5 bg-gray-50 overflow-hidden rounded-lg relative mb-3">
                {project.thumbnail_url ? (
                  <img
                    alt={project.title}
                    src={project.thumbnail_url}
                    className="object-cover transition-transform duration-500 group-hover:scale-[1.02] w-full h-full"
                  />
                ) : (
                  <div className="w-full h-full bg-gray-100 flex items-center justify-center">
                    <span className="text-gray-300 text-sm">No image</span>
                  </div>
                )}
              </div>
              <p className="text-sm font-medium text-[#111111]">
                {project.title}
              </p>
              <p className="text-xs text-gray-400 mt-0.5">
                {project.description}
              </p>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}
