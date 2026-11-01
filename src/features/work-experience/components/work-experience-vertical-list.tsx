// ponytail: mobile and reduced-motion fallback list for work experiences
import { useEffect, useRef } from "react";
import { ArrowRight } from "lucide-react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import type { WorkExperience } from "../types";
import { formatDateRange } from "../utils/format-date";

gsap.registerPlugin(ScrollTrigger);

interface WorkExperienceVerticalListProps {
  experiences: WorkExperience[];
}

export function WorkExperienceVerticalList({
  experiences,
}: WorkExperienceVerticalListProps) {
  const containerRef = useRef<HTMLDivElement>(null);

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

  return (
    <div ref={containerRef} className="space-y-0 divide-y divide-gray-100">
      {experiences.map((exp) => (
        <div
          key={exp.id}
          className="group py-6 first:pt-0 last:pb-0"
          data-work-card
        >
          <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:gap-4">
            <div className="flex shrink-0 items-center gap-3 sm:w-48">
              {exp.company_url ? (
                <img
                  src={exp.company_url}
                  alt={exp.title}
                  className="h-10 w-10 shrink-0 rounded-full border border-gray-200 bg-gray-50 object-contain p-1"
                />
              ) : (
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border border-gray-200 bg-gray-50">
                  <span className="text-xs font-bold text-gray-400">
                    {exp.title.charAt(0)}
                  </span>
                </div>
              )}
              <div className="flex flex-col">
                <span className="text-sm font-medium text-[#111111]">
                  {exp.title}
                </span>
                <span className="text-xs text-neutral-400">
                  {formatDateRange(exp.start_date, exp.end_date)}
                </span>
              </div>
            </div>

            <div className="min-w-0 flex-1 sm:pl-4">
              <p className="text-sm leading-relaxed text-neutral-400">
                {exp.description}
              </p>

              {exp.job_descriptions && exp.job_descriptions.length > 0 && (
                <ul className="mt-3 space-y-1.5">
                  {exp.job_descriptions.map((desc) => (
                    <li
                      key={desc.id}
                      className="flex gap-2 text-sm leading-relaxed text-gray-400"
                    >
                      <span className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-gray-300" />
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
                  className="mt-3 flex w-fit items-center justify-center gap-1 rounded-full border border-neutral-200 px-4 py-2 text-xs text-neutral-400 underline underline-offset-4 transition-colors duration-300 hover:bg-neutral-100 hover:text-[#111111]"
                >
                  <span>Visit company</span>
                  <ArrowRight size={12} />
                </a>
              )}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
