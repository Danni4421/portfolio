import { useLayoutEffect, useRef } from "react";
import { gsap } from "gsap";

export function PerformanceIcon() {
  const ringRef = useRef<HTMLSpanElement>(null)
  const dotRef = useRef<HTMLSpanElement>(null)
  const arcRef = useRef<HTMLDivElement>(null)

  useLayoutEffect(() => {
    const ring = ringRef.current
    const dot = dotRef.current
    const arc = arcRef.current
    if (!ring || !dot || !arc) return

    const ctx = gsap.context(() => {
      gsap.fromTo(
        ring,
        { scale: 0.6, opacity: 0.75 },
        {
          scale: 1.8,
          opacity: 0,
          duration: 1.2,
          ease: "power3.out",
          repeat: -1,
        },
      )

      gsap.fromTo(
        dot,
        { scale: 0.7 },
        {
          scale: 1,
          duration: 0.6,
          ease: "elastic.out(1, 0.45)",
          repeat: -1,
          repeatDelay: 0.6,
        },
      )

      gsap.to(arc, {
        rotation: 360,
        duration: 1.6,
        ease: "none",
        repeat: -1,
      })
    })
    return () => ctx.revert()
  }, [])

  return (
    <div className="relative flex items-center justify-center w-10 h-10">
      <div
        ref={arcRef}
        className="absolute inset-0 rounded-full border-[3px] border-transparent border-t-gray-400"
      />
      <span
        ref={ringRef}
        className="absolute inline-flex h-full w-full rounded-full bg-gray-300"
      />
      <span
        ref={dotRef}
        className="relative inline-flex rounded-full h-5 w-5 bg-gray-600"
      />
    </div>
  )
}
