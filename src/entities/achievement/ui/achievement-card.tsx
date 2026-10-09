
import type { Achievement } from "../model/types"

export function AchievementCard({ achievement }: { achievement: Achievement }) {
  return (
    <div className="flex cursor-pointer flex-col-reverse justify-between gap-4 rounded-2xl border border-gray-200 bg-white p-8 transition hover:shadow-sm md:flex-row shine-enter">
      <div className="flex flex-col justify-between gap-4">
        <div className="max-w-2xl space-y-4">
          <h3 className="font-serif text-[1.5rem] leading-[1.3] font-semibold text-gray-900">
            {achievement.title}
          </h3>
          <p className="text-md leading-relaxed text-gray-600">
            {achievement.description}
          </p>
        </div>

        {achievement.redirect_url && (
          <a
            href={achievement.redirect_url}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-6 inline-block text-sm font-medium text-blue-600 px-3 py-1.5 bracket-hover"
          >
            View more &rarr;
          </a>
        )}
      </div>

      <div className="h-48 w-fit overflow-hidden rounded-lg object-cover">
        <img src={achievement.source_logo_url || "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='150' height='150'%3E%3Crect fill='%23e5e7eb' width='150' height='150'/%3E%3C/svg%3E"} alt={achievement.title} className="h-full w-full object-cover" />
      </div>
    </div>
  )
}
