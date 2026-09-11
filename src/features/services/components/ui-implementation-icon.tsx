import { useLayoutEffect, useRef } from "react";
import { gsap } from "gsap";

export function UiImplementationIcon() {
  const ringRef = useRef<HTMLDivElement>(null)
  const squareRef = useRef<HTMLDivElement>(null)

  useLayoutEffect(() => {
    const ring = ringRef.current
    const square = squareRef.current
    if (!ring || !square) return

    const ctx = gsap.context(() => {
      gsap.fromTo(
        ring,
        { scale: 1, opacity: 0.5 },
        {
          scale: 1.7,
          opacity: 0,
          duration: 1.3,
          ease: "power2.out",
          repeat: -1,
        },
      )

      gsap.to(square, {
        rotation: 10,
        duration: 0.8,
        ease: "elastic.out(1, 0.4)",
        yoyo: true,
        repeat: -1,
        repeatDelay: 0.4,
      })
    }, ring.parentElement ?? undefined)

    return () => ctx.revert()
  }, [])

  return (
    <div className="relative w-10 h-10">
      <div
        ref={ringRef}
        className="absolute inset-0 bg-gray-300 rounded-lg border border-gray-400"
      />
      <div
        ref={squareRef}
        className="relative w-10 h-10 bg-gray-100 border border-gray-400 rounded-lg flex items-center justify-center"
      >
        <div className="w-4 h-4 bg-gray-600 rounded" />
      </div>
    </div>
  )
}
