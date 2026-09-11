import { useEffect, useState, useRef, type RefObject } from "react";
import { Effect } from "effect";
import { SectionHeader } from "@/shared/ui/section-header";
import { getWorkExperiences } from "../api";
import type { WorkExperience } from "../types";
import { ExternalLink, Building2 } from "lucide-react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const formatDate = (dateStr?: string | null) => {
  if (!dateStr) return "Present";
  const date = new Date(dateStr);
  if (isNaN(date.getTime())) return dateStr;
  return date.toLocaleDateString("en-US", { month: "short", year: "numeric" });
};

export function WorkExperienceTimeline() {
  const [experiences, setExperiences] = useState<WorkExperience[]>([]);
  const [loading, setLoading] = useState(true);

  const containerRef: RefObject<HTMLDivElement | null> =
    useRef<HTMLDivElement>(null);

  useEffect(() => {
    Effect.runPromise(getWorkExperiences())
      .then(({ experiences }) => {
        setExperiences(experiences);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Failed to load experiences", err);
        setLoading(false);
      });
  }, []);

  useEffect(() => {
    if (experiences.length === 0) return;

    const ctx = gsap.context(() => {
      // Animate each timeline line segment as it enters viewport
      const lineSegments = gsap.utils.toArray(".timeline-line-animate");
      lineSegments.forEach((line: unknown) => {
        const lineElem = line as HTMLElement;
        gsap.fromTo(
          lineElem,
          { scaleY: 0 },
          {
            scaleY: 1,
            ease: "none",
            scrollTrigger: {
              trigger: lineElem.parentElement as gsap.DOMTarget,
              start: "top 80%",
              end: "bottom 70%",
              scrub: true,
            },
          },
        );
      });

      // Animate timeline cards
      const items = gsap.utils.toArray(".timeline-item-animate");
      items.forEach((item: unknown) => {
        gsap.from(item as gsap.TweenTarget, {
          opacity: 0,
          y: 40,
          duration: 0.7,
          ease: "power2.out",
          scrollTrigger: {
            trigger: item as gsap.DOMTarget,
            start: "top 85%",
            toggleActions: "play none none none",
          },
        });
      });
    }, containerRef);

    return () => ctx.revert();
  }, [experiences]);

  if (!loading && experiences.length === 0) return null;

  return (
    <section
      ref={containerRef}
      className="space-y-12 sm:space-y-16 md:space-y-20 px-3 sm:px-6 md:px-16 md:py-24 py-12 lg:px-24 select-none relative overflow-hidden"
    >
      {/* Decorative background glow for rich aesthetics */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[300px] sm:w-[400px] h-[300px] sm:h-[400px] bg-amber-500/10 dark:bg-amber-500/5 blur-[100px] sm:blur-[120px] rounded-full pointer-events-none" />

      <div className="space-y-10 sm:space-y-16 max-w-5xl mx-auto">
        <SectionHeader
          title="Work Experience"
          description="A timeline of my professional journey, highlighting key roles, achievements, and technology environments."
        />

        {loading ? (
          <div className="flex flex-col items-center justify-center py-12 gap-3 text-neutral-400">
            <div className="w-8 h-8 border-4 border-amber-500/20 border-t-amber-500 rounded-full animate-spin" />
            <span className="text-xs uppercase tracking-wider font-semibold">
              Loading Journey...
            </span>
          </div>
        ) : experiences.length > 0 ? (
          <div className="relative timeline-container-animate pl-7 sm:pl-8 md:pl-0">
            <div className="space-y-8 sm:space-y-12">
              {experiences.map((exp, index) => {
                const isEven = index % 2 === 0;
                const isLast = index === experiences.length - 1;

                return (
                  <div
                    key={exp.id}
                    className={`timeline-item-animate flex flex-col md:flex-row items-start relative w-full ${
                      isEven ? "md:flex-row-reverse" : ""
                    }`}
                  >
                    {/* Line Segment to next node (omitted on last item so line terminates cleanly at last dot) */}
                    {!isLast && (
                      <div className="absolute left-[-1.75rem] sm:left-[-2rem] md:left-1/2 top-6 h-[calc(100%+2rem)] sm:h-[calc(100%+3rem)] w-[3px] bg-neutral-200 dark:bg-neutral-800 -translate-x-1/2 rounded-full overflow-hidden z-0">
                        <div className="w-full h-full bg-gradient-to-b from-[#ec7211] to-amber-400 origin-top scale-y-0 timeline-line-animate" />
                      </div>
                    )}

                    {/* Timeline Node / Circle Indicator */}
                    <div className="absolute left-[-1.75rem] sm:left-[-2rem] md:left-1/2 top-6 w-5 h-5 sm:w-6 sm:h-6 rounded-full border-4 border-neutral-50 dark:border-[#0d1116] bg-gradient-to-tr from-[#ec7211] to-amber-400 -translate-x-1/2 -translate-y-1/2 z-10 shadow-[0_0_12px_rgba(236,114,17,0.4)] transition-all duration-300 hover:scale-125" />

                    {/* Timeline Card */}
                    <div className="w-full md:w-[calc(50%-2rem)]">
                      <div className="group relative backdrop-blur-md bg-white/60 dark:bg-[#161b22]/40 border border-neutral-200/50 dark:border-neutral-800/40 p-4 sm:p-6 md:p-8 rounded-2xl shadow-sm hover:shadow-lg transition-all duration-500 hover:-translate-y-1.5 overflow-hidden">
                        {/* Interactive glow border top */}
                        <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-[#ec7211] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                        <div className="flex gap-3 sm:gap-4 items-start">
                          {exp.company_url ? (
                            <img
                              src={exp.company_url}
                              alt="Company Logo"
                              className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl object-contain border border-neutral-200 dark:border-neutral-800 bg-white p-1 shrink-0 shadow-xs"
                            />
                          ) : (
                            <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-[#161b22] flex items-center justify-center shrink-0 shadow-xs">
                              <Building2 className="w-5 h-5 sm:w-6 sm:h-6 opacity-80 text-neutral-500" />
                            </div>
                          )}
                          <div className="flex-1 min-w-0 space-y-1">
                            <div className="flex items-start justify-between gap-2 sm:gap-4">
                              <h3 className="font-serif text-base sm:text-xl font-bold text-neutral-900 dark:text-neutral-50 group-hover:text-[#ec7211] dark:group-hover:text-amber-400 transition-colors duration-300 break-words">
                                {exp.title}
                              </h3>
                              {exp.redirect_url && (
                                <a
                                  href={exp.redirect_url}
                                  target="_blank"
                                  rel="noreferrer"
                                  className="p-1.5 rounded-lg bg-neutral-100 dark:bg-neutral-800/60 text-neutral-500 dark:text-neutral-400 hover:text-[#ec7211] dark:hover:text-amber-400 hover:bg-[#ec7211]/10 dark:hover:bg-amber-400/10 transition-all duration-300 shrink-0"
                                >
                                  <ExternalLink size={14} />
                                </a>
                              )}
                            </div>
                            <div className="flex flex-col gap-1 mt-1 text-xs sm:text-sm text-neutral-600 dark:text-neutral-400 font-medium">
                              <span className="break-words">{exp.description}</span>
                              <span className="text-[11px] sm:text-xs text-neutral-450 dark:text-neutral-550 font-mono mt-0.5">
                                {formatDate(exp.start_date)} – {formatDate(exp.end_date)}
                              </span>
                            </div>
                          </div>
                        </div>

                        {/* Job Description Bullet Points */}
                        {exp.job_descriptions &&
                          exp.job_descriptions.length > 0 && (
                            <ul className="mt-4 sm:mt-5 space-y-2.5 sm:space-y-3.5 border-t border-neutral-100 dark:border-neutral-800/60 pt-3.5 sm:pt-4">
                              {exp.job_descriptions.map((desc) => (
                                <li
                                  key={desc.id}
                                  className="flex gap-2 sm:gap-2.5 text-xs sm:text-sm text-neutral-600 dark:text-neutral-300 leading-relaxed"
                                >
                                  <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-[#ec7211] shrink-0" />
                                  <span className="break-words flex-1 min-w-0">{desc.description}</span>
                                </li>
                              ))}
                            </ul>
                          )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        ) : (
          <div className="text-center py-12 text-neutral-500 font-medium">
            No work experiences found.
          </div>
        )}
      </div>
    </section>
  );
}



