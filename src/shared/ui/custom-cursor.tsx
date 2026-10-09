import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { Blobatar } from "@blobatar/react";
import "blobatar/motion.css";

function isMobileDevice(): boolean {
  return (
    typeof window !== "undefined" &&
    (navigator.maxTouchPoints > 0 ||
      window.innerWidth <= 1024 ||
      window.matchMedia("(pointer: coarse)").matches ||
      window.matchMedia("(hover: none)").matches ||
      window.matchMedia("(any-pointer: coarse)").matches ||
      window.matchMedia("(any-hover: none)").matches ||
      /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
        navigator.userAgent
      ))
  );
}

export function CustomCursor() {
  const [isMobile, setIsMobile] = useState(
    typeof window !== "undefined" && isMobileDevice()
  );

  useEffect(() => {
    const check = () => setIsMobile(isMobileDevice());
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  const circleRef = useRef<HTMLDivElement>(null);
  const dotRef = useRef<HTMLDivElement>(null);

  if (isMobile) return null;

  useEffect(() => {
    const circle = circleRef.current!;
    const dot = dotRef.current!;

    const setCircleX = gsap.quickSetter(circle, "x", "px");
    const setCircleY = gsap.quickSetter(circle, "y", "px");
    const setDotX = gsap.quickSetter(dot, "x", "px");
    const setDotY = gsap.quickSetter(dot, "y", "px");

    let mouse = { x: window.innerWidth / 2, y: window.innerHeight / 2 };
    let pos = { x: mouse.x, y: mouse.y };

    const onMouseMove = (e: MouseEvent) => {
      mouse.x = e.clientX;
      mouse.y = e.clientY;
    };
    window.addEventListener("mousemove", onMouseMove);

    const tickerId = gsap.ticker.add(() => {
      const dt = 1 - Math.pow(0.88, gsap.ticker.deltaRatio());
      pos.x += (mouse.x - pos.x) * dt;
      pos.y += (mouse.y - pos.y) * dt;
      setCircleX(pos.x - 20);
      setCircleY(pos.y - 20);
      setDotX(mouse.x - 10);
      setDotY(mouse.y - 10);
    });

    const hoverTargets = document.querySelectorAll("a, button, [data-hover]");
    const enterHandlers = new Map<Element, () => void>();
    const leaveHandlers = new Map<Element, () => void>();

    hoverTargets.forEach((el) => {
      const enter = () =>
        gsap.to(circle, { scale: 2.5, opacity: 0.15, duration: 0.3, ease: "power2.out" });
      const leave = () =>
        gsap.to(circle, { scale: 1, opacity: 1, duration: 0.3, ease: "power2.out" });
      el.addEventListener("mouseenter", enter);
      el.addEventListener("mouseleave", leave);
      enterHandlers.set(el, enter);
      leaveHandlers.set(el, leave);
    });

    return () => {
      window.removeEventListener("mousemove", onMouseMove);
      gsap.ticker.remove(tickerId);
      hoverTargets.forEach((el) => {
        el.removeEventListener("mouseenter", enterHandlers.get(el)!);
        el.removeEventListener("mouseleave", leaveHandlers.get(el)!);
      });
    };
  }, []);

  return (
    <>
      <div
        ref={circleRef}
        className="fixed top-0 left-0 w-16 h-16 rounded-full bg-neutral-400/30 pointer-events-none z-9999"
        style={{ willChange: "transform", transform: "translate(-9999px, -9999px)" }}
      />
      <div
        ref={dotRef}
        className="fixed -top-3 -left-2 w-12 h-12 pointer-events-none z-9999"
        style={{ willChange: "transform", transform: "translate(-9999px, -9999px)" }}
      >
        <Blobatar
          name="simone"
          animate="always"
          background="circle"
          amplitude={20}
          className="block w-full h-full"
        />
      </div>
    </>
  );
}
