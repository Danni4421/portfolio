import { useLayoutEffect, useRef } from "react"
import { cn } from "@/shared/lib/utils"
import { gsap } from "gsap"

interface LoadingAnimationProps {
  className?: string
}

const BLOCK = 32
const GAP = 6
const PILL_WIDTH = BLOCK * 2 + GAP // 70px

const SHAPES = [
  {
    key: "red",
    color: "#FF4229",
    position: { left: 0, top: 0 },
    isPill: true,
  },
  {
    key: "cream",
    color: "#FFF0D4",
    position: { left: BLOCK + GAP + 36, top: 0 },
    circleLeft: BLOCK + GAP,
    isPill: false,
  },
  {
    key: "purple",
    color: "#C6B0FF",
    position: { left: 0, top: BLOCK + GAP },
    isPill: false,
  },
  {
    key: "blue",
    color: "#7C9FFE",
    position: { left: BLOCK + GAP, top: BLOCK + GAP },
    isPill: true,
  },
] as const

const CLOCKWISE_ORDER = [0, 1, 3, 2]

function LoadingAnimation({ className }: LoadingAnimationProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const innerRef = useRef<HTMLDivElement>(null)
  const shapeRefs = useRef<(HTMLDivElement | null)[]>([])

  useLayoutEffect(() => {
    const container = containerRef.current
    const inner = innerRef.current
    if (!container || !inner) return

    const shapesInVisualOrder = CLOCKWISE_ORDER.map(
      (i) => shapeRefs.current[i],
    ).filter(Boolean) as HTMLDivElement[]

    const circleLeftTargets = CLOCKWISE_ORDER.map((i) => {
      const shape = SHAPES[i] as { circleLeft?: number; position: { left: number } }
      return shape.circleLeft ?? shape.position.left
    })

    const ctx = gsap.context(() => {
      const timeline = gsap.timeline({
        repeat: -1,
        yoyo: true,
        repeatDelay: 0.3,
      })

      timeline.to(
        shapesInVisualOrder,
        {
          width: BLOCK,
          left: (i: number) => circleLeftTargets[i],
          borderRadius: "50%",
          duration: 0.4,
          stagger: 0.05,
          ease: "power3.out",
        },
        0,
      )

      timeline.fromTo(
        shapesInVisualOrder,
        { scale: 1 },
        {
          scale: 1.1,
          duration: 0.2,
          stagger: 0.05,
          ease: "power1.out",
          yoyo: true,
          repeat: 1,
        },
        0.1,
      )

      timeline.to(
        inner,
        {
          rotation: "+=180",
          duration: 0.85,
          ease: "back.out(1.5)",
        },
        "-=0.2",
      )
    }, container)

    return () => ctx.revert()
  }, [])

  return (
    <div
      ref={containerRef}
      className={cn(
        "relative flex h-40 w-40 items-center justify-center",
        className,
      )}
      role="status"
      aria-label="Loading"
    >
      {/* 2x2 Rotated Container Box */}
      <div
        ref={innerRef}
        className="relative rotate-45"
        style={{
          width: BLOCK * 2 + GAP,
          height: BLOCK * 2 + GAP,
        }}
      >
        {SHAPES.map((shape, index) => (
          <div
            key={shape.key}
            ref={(el) => {
              shapeRefs.current[index] = el
            }}
            className="absolute"
            style={{
              left: shape.position.left,
              top: shape.position.top,
              width: shape.isPill ? PILL_WIDTH : BLOCK,
              height: BLOCK,
              borderRadius: "12px",
              backgroundColor: shape.color,
            }}
          />
        ))}
      </div>
    </div>
  )
}

export { LoadingAnimation }
