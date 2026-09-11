import { useEffect, useRef } from "react";
import { useQuery } from "@tanstack/react-query";
import { Effect } from "effect";
import type { WorkExperience } from "../types";
import { getWorkExperiences } from "../api";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const formatDate = (dateStr?: string | null) => {
  if (!dateStr) return "Present";
  const date = new Date(dateStr);
  if (isNaN(date.getTime())) return dateStr;
  return date.toLocaleDateString("en-US", { month: "short", year: "numeric" });
};

export function WorkExperienceList() {
  const containerRef = useRef<HTMLDivElement>(null);

  const { data } = useQuery<{ experiences: WorkExperience[] }>({
    queryKey: ["workExperiences"],
    queryFn: () => Effect.runPromise(getWorkExperiences()),
  });

  const experiences = data?.experiences ?? [];

  useEffect(() => {
    if (experiences.length === 0) return;

    const ctx = gsap.context(() => {
      const items = gsap.utils.toArray("[data-work-card]") as Element[];
      items.forEach((card) => {
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
  }, [experiences]);

  if (experiences.length === 0) return null;

  return (
    <section
      id="experience"
      ref={containerRef}
      className="px-4 py-16 md:py-24 border-t border-gray-100"
    >
      <div className="max-w-5xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-1 gap-y-4 mb-6 md:mb-8">
          <p className="md:sticky md:self-start md:top-4 text-lg tracking-[-0.64px] text-black">
            Experience
          </p>
          <div>
            <p className="text-sm leading-relaxed text-gray-500">
              Where I&apos;ve worked and what I did there.
            </p>
          </div>
        </div>

        <div className="space-y-0 divide-y divide-gray-100">
          {experiences.map((exp) => (
            <div
              key={exp.id}
              className="group py-6 first:pt-0 last:pb-0"
              data-work-card
            >
              <div className="flex flex-col sm:flex-row sm:items-start gap-3 sm:gap-4">
                <div className="flex items-center gap-3 sm:w-48 shrink-0">
                  {exp.company_url ? (
                    <img
                      src={exp.company_url}
                      alt={exp.title}
                      className="w-10 h-10 rounded-lg object-contain border border-gray-200 bg-gray-50 p-1 shrink-0"
                    />
                  ) : (
                    <div className="w-10 h-10 rounded-lg border border-gray-200 bg-gray-50 flex items-center justify-center shrink-0">
                      <span className="text-xs font-bold text-gray-400">
                        {exp.title.charAt(0)}
                      </span>
                    </div>
                  )}
                  <div className="flex flex-col">
                    <span className="text-sm font-medium text-[#111111]">
                      {exp.title}
                    </span>
                    <span className="text-xs text-gray-400 font-mono">
                      {formatDate(exp.start_date)} – {formatDate(exp.end_date)}
                    </span>
                  </div>
                </div>

                <div className="flex-1 min-w-0 sm:pl-4">
                  <p className="text-sm text-gray-500 leading-relaxed">
                    {exp.description}
                  </p>

                  {exp.job_descriptions && exp.job_descriptions.length > 0 && (
                    <ul className="mt-3 space-y-1.5">
                      {exp.job_descriptions.map((desc) => (
                        <li
                          key={desc.id}
                          className="flex gap-2 text-xs text-gray-400 leading-relaxed"
                        >
                          <span className="mt-1.5 w-1 h-1 rounded-full bg-gray-300 shrink-0" />
                          <span>{desc.description}</span>
                        </li>
                      ))}
                    </ul>
                  )}

                  {exp.redirect_url && (
                    <a
                      href={exp.redirect_url}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-block mt-3 text-xs underline underline-offset-4 text-gray-400 hover:text-[#111111] transition-colors"
                    >
                      Visit company →
                    </a>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
