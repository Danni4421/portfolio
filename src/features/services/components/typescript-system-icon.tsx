import { useLayoutEffect, useRef } from "react";
import { gsap } from "gsap";

export function TypeScriptSystemsIcon() {
  const dotsRef = useRef<(HTMLDivElement | null)[]>([])
  const dashesRef = useRef<(HTMLDivElement | null)[]>([])

  useLayoutEffect(() => {
    const dots = dotsRef.current.filter(Boolean) as HTMLDivElement[]
    const dashes = dashesRef.current.filter(Boolean) as HTMLDivElement[]

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ repeat: -1, repeatDelay: 0.3 })

      dots.forEach((dot, i) => {
        tl.to(
          dot,
          {
            y: -8,
            rotation: i % 2 === 0 ? 12 : -12,
            duration: 0.35,
            ease: "elastic.out(1, 0.5)",
            yoyo: true,
            repeat: 1,
          },
          i * 0.15,
        )
      })

      dashes.forEach((dash, i) => {
        tl.to(
          dash,
          {
            scaleX: 1.4,
            opacity: 1,
            duration: 0.25,
            ease: "power1.out",
            yoyo: true,
            repeat: 1,
          },
          i * 0.15 + 0.1,
        )
      })
    })

    return () => ctx.revert()
  }, [])

  const colors = ["bg-gray-500", "bg-gray-400", "bg-gray-600"]

  return (
    <div className="flex items-center space-x-1.5">
      {colors.map((color, i) => (
        <div key={i} className="flex items-center space-x-1.5">
          <div
            ref={(el) => {
              dotsRef.current[i] = el
            }}
            className={`w-3 h-3 rounded-full ${color}`}
          />
          {i < colors.length - 1 && (
            <div
              ref={(el) => {
                dashesRef.current[i] = el
              }}
              className="w-2 h-1 bg-gray-300 opacity-60"
              style={{ transformOrigin: "left center" }}
            />
          )}
        </div>
      ))}
    </div>
  )
}
