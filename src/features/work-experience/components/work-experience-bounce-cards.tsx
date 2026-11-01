// ponytail: measured wrapper that adapts ReactBits BounceCards to a timeline panel
import { useLayoutEffect, useRef, useState } from "react";
import BounceCards from "@/shared/ui/bounce-cards/bounce-cards";
import type { WorkExperienceImage } from "../types";

const clamp = (value: number, min: number, max: number) =>
  Math.min(max, Math.max(min, value));

interface WorkExperienceBounceCardsProps {
  images: WorkExperienceImage[];
  alt: string;
  fallbackInitial: string;
}

export function WorkExperienceBounceCards({
  images,
  alt,
  fallbackInitial,
}: WorkExperienceBounceCardsProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [width, setWidth] = useState(400);

  useLayoutEffect(() => {
    const element = containerRef.current;
    if (!element) return;

    const observer = new ResizeObserver(([entry]) => {
      if (!entry) return;
      setWidth(clamp(entry.contentRect.width, 280, 440));
    });

    observer.observe(element);
    return () => observer.disconnect();
  }, []);

  const cards = images.slice(0, 6).map((image, index) => ({
    src: image.image_url,
    alt: `${alt} photo ${index + 1}`,
  }));

  if (cards.length === 0) {
    return (
      <div
        ref={containerRef}
        className="flex aspect-5/4 w-full max-w-[420px] items-center justify-center rounded-[1.5rem] border border-neutral-200 bg-neutral-50"
      >
        <span className="text-4xl font-medium text-neutral-300">
          {fallbackInitial}
        </span>
      </div>
    );
  }

  const cardSize = Math.round(width * 0.44);
  const spread = Math.round(cardSize * 0.36);

  return (
    <div
      ref={containerRef}
      className="flex w-full max-w-[440px] items-center justify-center"
    >
      <BounceCards
        images={cards}
        containerWidth={width}
        containerHeight={Math.round(width * 0.82)}
        cardSize={cardSize}
        spread={spread}
        rotation={10}
        arc={18}
        animationDelay={0.15}
        animationStagger={0.06}
        bounciness={0.6}
        enableHover
        pushDistance={Math.round(cardSize * 0.9)}
        hoverScale={1.06}
        borderWidth={6}
        borderColor="#ffffff"
        radius={22}
        shadow
      />
    </div>
  );
}
