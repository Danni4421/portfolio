import { useEffect, useRef, type RefObject } from "react";
import { Effect } from "effect";
import { SectionHeader } from "@/shared/ui/section-header";
import { AchievementCard } from "@/entities/achievement/ui/achievement-card";
import { getAchievements } from "@/entities/achievement/api/achievement";
import { useQuery } from "@tanstack/react-query";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import type { Achievement } from "@/entities/achievement/model/types";

gsap.registerPlugin(ScrollTrigger);

export function AchievementList() {
  const containerRef: RefObject<HTMLDivElement | null> =
    useRef<HTMLDivElement>(null);

  const { data: achievements } = useQuery<Array<Achievement>>({
    queryKey: ["achievements"],
    queryFn: () =>
      Effect.runPromise(
        getAchievements().pipe(
          Effect.map(
            ({
              achievements,
            }: {
              achievements: Array<Achievement>;
            }): Array<Achievement> => achievements,
          ),
        ),
      ),
  });

  useEffect(() => {
    if (!achievements || achievements.length === 0) return;

    const ctx = gsap.context(() => {
      const cards = gsap.utils.toArray(".achievement-card-animate");
      cards.forEach((card: unknown) => {
        gsap.from(card as gsap.TweenTarget, {
          opacity: 0,
          y: 40,
          duration: 0.8,
          scrollTrigger: {
            trigger: card as gsap.DOMTarget,
            start: "top 85%",
            toggleActions: "play none none none",
          },
        });
      });
    }, containerRef);

    return () => ctx.revert();
  }, [achievements]);

  if (!achievements || achievements.length === 0) return null;

  return (
    <section
      id="achievements"
      ref={containerRef}
      className="space-y-20 px-4 py-4 md:px-16 md:py-12 lg:px-24 border-b border-border scroll-mt-20 md:scroll-mt-24"
    >
      <div className="space-y-12">
        <SectionHeader
          title="Achievements"
          description="Milestones that showcase my dedication to delivering exceptional design and creating meaningful impact."
        />

        <div className="grid grid-cols-1 gap-8">
          {achievements?.map((achievement) => (
            <div key={achievement.id} className="achievement-card-animate">
              <AchievementCard achievement={achievement} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
