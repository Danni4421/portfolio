// ponytail: one horizontally-scrolled experience panel with timeline node and bounce cards
import { ArrowRight } from "lucide-react";
import { cn } from "@/shared/lib/utils";
import type { WorkExperience } from "../types";
import { formatDateRange } from "../utils/format-date";
import { WorkExperienceBounceCards } from "./work-experience-bounce-cards";

interface WorkExperiencePanelProps {
  experience: WorkExperience;
  index: number;
  total: number;
  isActive: boolean;
}

export function WorkExperiencePanel({
  experience,
  index,
  total,
  isActive,
}: WorkExperiencePanelProps) {
  return (
    <article
      data-timeline-panel
      aria-label={`Experience ${index + 1} of ${total}: ${experience.title}`}
      aria-hidden={!isActive}
      inert={!isActive}
      className="relative h-full w-[78vw] max-w-[980px] shrink-0 pt-32"
    >
      <p
        className={cn(
          "absolute left-0 top-14 text-sm tracking-[-0.01em] transition-colors duration-300",
          isActive ? "text-#939efb" : "text-neutral-400",
        )}
      >
        {formatDateRange(experience.start_date, experience.end_date)}
      </p>

      <span
        aria-hidden="true"
        className={cn(
          "absolute left-0 top-24 h-4 w-4 -translate-y-1/2 rounded-full border-2 border-[#111111] transition-all duration-300",
          isActive ? "scale-125 bg-[#111111]" : "bg-white",
        )}
      />

      <div className="grid grid-cols-[minmax(0,420px)_minmax(0,1fr)] items-center gap-12">
        <WorkExperienceBounceCards
          images={experience.images ?? []}
          alt={experience.title}
          fallbackInitial={experience.title.charAt(0)}
        />

        <div className="min-w-0">
          <div className="flex items-center gap-3">
            {experience.company_url ? (
              <img
                src={experience.company_url}
                alt={`${experience.title} logo`}
                className="h-10 w-10 shrink-0 rounded-full border border-gray-200 bg-gray-50 object-contain p-1"
              />
            ) : null}
            <h3 className="text-[clamp(1.5rem,2.4vw,2.25rem)] leading-[1.1] tracking-[-0.02em] text-[#111111]">
              {experience.title}
            </h3>
          </div>

          <p className="mt-5 text-sm leading-relaxed text-neutral-400">
            {experience.description}
          </p>

          {experience.job_descriptions &&
            experience.job_descriptions.length > 0 && (
              <ul className="mt-5 space-y-2">
                {experience.job_descriptions.map((description) => (
                  <li
                    key={description.id}
                    className="flex gap-2 text-sm leading-relaxed text-gray-400"
                  >
                    <span className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-gray-300" />
                    <span>{description.description}</span>
                  </li>
                ))}
              </ul>
            )}

          {experience.redirect_url && (
            <a
              href={experience.redirect_url}
              target="_blank"
              rel="noreferrer"
              tabIndex={isActive ? 0 : -1}
              className="mt-6 flex w-fit items-center justify-center gap-1 rounded-full border border-neutral-200 px-4 py-2 text-xs text-neutral-400 underline underline-offset-4 transition-colors duration-300 hover:bg-neutral-100 hover:text-[#111111]"
            >
              <span>Visit company</span>
              <ArrowRight size={12} />
            </a>
          )}
        </div>
      </div>
    </article>
  );
}
