import { useEffect, useRef } from "react";
import { gsap } from "gsap";

import heroMe from '@/assets/hero-me.jpeg'

function AnimatedText({
  text,
  className,
}: {
  text: string;
  className?: string;
}) {
  return (
    <span style={{ display: "inline-block", whiteSpace: "nowrap" }}>
      {text.split("").map((char, i) => (
        <span
          key={i}
          className={className}
          style={{ display: "inline-block" }}
          data-char
        >
          {char}
        </span>
      ))}
      <span style={{ display: "inline-block" }}>&nbsp;</span>
    </span>
  );
}

export function Hero() {
  const heroRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from("[data-char]", {
        y: 18,
        opacity: 0,
        duration: 0.6,
        stagger: 0.018,
        ease: "power3.out",
        delay: 0.1,
      });
    }, heroRef);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={heroRef} className="px-4 pt-4 pb-2">
      <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-x-1">
        {/* Left column */}
        <div className="flex flex-col justify-end py-4 md:py-16">
          <h1 className="text-2xl md:text-4xl leading-none tracking-[-2.5px]">
            <AnimatedText text="Frontend" className="text-[#111111]" />
            <AnimatedText text="developer" className="text-[#b2b2b2]" />
            <AnimatedText text="crafting" className="text-[#b2b2b2]" />
            <AnimatedText text="digital" className="text-[#b2b2b2]" />
            <AnimatedText text="experiences" className="text-[#b2b2b2]" />
            <AnimatedText text="from" className="text-[#b2b2b2]" />
            <AnimatedText text="code" className="text-[#111111]" />
            <AnimatedText text="to" className="text-[#111111]" />
            <AnimatedText text="UI" className="text-[#111111]" />
            <AnimatedText text="systems." className="text-[#b2b2b2]" />
          </h1>
          <p className="text-md leading-relaxed text-gray-400 mt-6">
            I build fast, type-safe web applications. From code to interface,
            built with care.
          </p>
        </div>

        {/* Right column — portrait placeholder */}
        <div className="hidden md:flex justify-end">
          <img src={heroMe} alt="This is me" className="aspect-3/4 w-64 md:w-80 rounded-lg" />
        </div>
      </div>
    </section>
  );
}
