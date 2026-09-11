import { useLayoutEffect, useRef } from "react";
import { gsap } from "gsap";

export function FrontendEngineeringIcon() {
  const barsRef = useRef<(HTMLSpanElement | null)[]>([]);

  useLayoutEffect(() => {
    const bars = barsRef.current.filter(Boolean) as HTMLSpanElement[];
    const ctx = gsap.context(() => {
      bars.forEach((bar, i) => {
        gsap.to(bar, {
          scaleY: 0.35,
          rotation: i % 2 === 0 ? 4 : -4,
          duration: 0.5 + i * 0.08,
          ease: "sine.inOut",
          yoyo: true,
          repeat: -1,
          transformOrigin: "bottom center",
          delay: i * 0.12,
        });
      });
    });
    return () => ctx.revert();
  }, []);

  return (
    <div className="flex items-end space-x-2 h-10">
      {[
        { h: "h-7", c: "bg-gray-400" },
        { h: "h-4", c: "bg-gray-300" },
        { h: "h-7", c: "bg-gray-400" },
      ].map((bar, i) => (
        <span
          key={i}
          ref={(el) => {
            barsRef.current[i] = el;
          }}
          className={`w-2.5 ${bar.h} ${bar.c} rounded-full`}
        />
      ))}
    </div>
  );
}
