# Portfolio Restyle Plan — Inspired by arturospatino.com

> **Reference**: https://www.arturospatino.com/
> **Status**: Draft — Awaiting approval
> **Created**: 2026-09-09

---

## Goal

Restyle the portfolio to adopt the clean, minimal, typographically-driven aesthetic of arturospatino.com, including:

- **Visual style**: White background, clean `#111111` dark text, light gray dividers (`border-gray-100`), minimal borders — no decorative backgrounds
- **Layout**: Editorial two-column grid (text left / visual right), `max-w-5xl` container, generous vertical rhythm (`py-16 md:py-24`)
- **Typography**: Use **Geist Variable** (already installed via `@fontsource-variable/geist`) with tight letter-spacing on headings (`tracking-[-2.5px]`)
- **Mouse interaction**: Custom **magnetic cursor** — a circle that tracks the mouse with GSAP spring physics, scales and reacts on hover
- **Animations**: Per-character stagger-in on hero heading (letters: `translateY(18px) → 0, opacity: 0 → 1`), scroll-based `reveal` fade-in for sections
- **Header**: Dual-header pattern — static visible header + sticky one hidden above viewport that slides down on scroll
- **Sections**: Hero split (text + portrait placeholder), full-width banner image, Info, Services grid, Work grid, Logo marquee, Contact footer
- **Color palette**: `#ffffff` background · `#111111` primary text · `#b2b2b2` / `gray-400` muted text · `gray-100` / `gray-200` borders

> ⚠️ **Breaking change**: This restyle **removes** the dark Catppuccin theme, the TetrisGridBackground, the TerminalIdentity widget, and dark mode support entirely in favor of an all-light editorial design.

---

## Architecture Overview

```
src/
├── app/
│   ├── App.tsx                        [MODIFY]  Mount CustomCursor globally
│   └── styles/index.css               [MODIFY]  Reset theme, new font, cursor:none, reveal/marquee utils
│
├── shared/ui/
│   ├── custom-cursor.tsx              [NEW]     Magnetic cursor component (GSAP spring)
│   ├── tetris-grid-background.tsx     [DELETE]  No longer used
│   └── section-header.tsx             [MODIFY]  Match new typography style
│
├── widgets/
│   ├── header.tsx                     [MODIFY]  Dual-header (static + sticky slide-in)
│   ├── hero.tsx                       [MODIFY]  2-col split layout + per-char heading animation
│   ├── terminal-identity.tsx          [DELETE]  Replaced by portrait image in hero
│   ├── info-section.tsx               [NEW]     "About" sticky-label + bio text
│   ├── services-section.tsx           [NEW]     4-card services grid (001–004)
│   └── contact-form.tsx               [MODIFY]  Restyle to minimal footer contact
│
├── features/
│   ├── project/components/
│   │   └── project-list.tsx           [MODIFY]  3-col 3/4 aspect-ratio card grid
│   └── tech-stack/components/
│       └── tech-stack-list.tsx        [MODIFY]  Logo marquee with fade-edge mask
│
└── pages/home/index.tsx               [MODIFY]  New section order, remove TetrisGridBackground
```

---

## Proposed Changes

### 1. Global Styles & Theme Reset

**File**: `src/app/styles/index.css`

**Changes**:
- Remove SF Pro Display import → use Geist Variable
- Remove tetris grid CSS (`.tetris-*`, `.tetris-cell`, etc.)
- Remove dark mode overrides
- Set `cursor: none !important` globally for custom cursor
- Add `animate-marquee` keyframe
- Add `.reveal` scroll-reveal utility
- Add `.marquee-mask` fade-edge gradient
- Keep `scroll-behavior: smooth`

```diff
-@import url('https://fonts.cdnfonts.com/css/sf-pro-display');
+@import "@fontsource-variable/geist";
 @import "tailwindcss";
 @import "tw-animate-css";
 @import "shadcn/tailwind.css";

 @theme {
-    --font-sans: "SF Pro Display", -apple-system, BlinkMacSystemFont, ...;
-    --font-serif: "SF Pro Display", -apple-system, BlinkMacSystemFont, ...;
+    --font-sans: "Geist Variable", system-ui, sans-serif;
+    --font-serif: "Geist Variable", system-ui, sans-serif;
 }
```

New CSS additions:

```css
/* Hide OS cursor globally */
*, *::before, *::after { cursor: none !important; }

/* Marquee animation */
@keyframes marquee {
  0%   { transform: translateX(0); }
  100% { transform: translateX(-50%); }
}
.animate-marquee {
  animation: marquee 40s linear infinite;
  will-change: transform;
}
.animate-marquee:hover { animation-play-state: paused; }

/* Fade-edge marquee mask */
.marquee-mask {
  -webkit-mask-image: linear-gradient(to right, transparent, black 8%, black 92%, transparent);
  mask-image: linear-gradient(to right, transparent, black 8%, black 92%, transparent);
}

/* Scroll reveal — JS adds .is-visible via IntersectionObserver */
.reveal {
  opacity: 0;
  transform: translateY(18px);
  transition: opacity 0.6s ease, transform 0.6s ease;
}
.reveal.is-visible {
  opacity: 1;
  transform: translateY(0);
}
```

---

### 2. Custom Magnetic Cursor

**File**: `src/shared/ui/custom-cursor.tsx` ← **NEW**

A global overlay component with:
1. **Outer circle** (40×40px, `border border-[#111111]`) — follows mouse with GSAP spring lag
2. **Inner dot** (6×6px, `bg-[#111111]`) — follows mouse precisely
3. **Hover states** — circle scales to `2.5×` with reduced opacity when over `<a>`, `<button>`, or `[data-hover]` elements
4. Mounts via a `useEffect` that subscribes to `mousemove` and a GSAP ticker loop

```tsx
import { useEffect, useRef } from "react";
import { gsap } from "gsap";

export function CustomCursor() {
  const circleRef = useRef<HTMLDivElement>(null);
  const dotRef    = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const circle = circleRef.current!;
    const dot    = dotRef.current!;

    // quickSetter for high-frequency updates (skips React state)
    const setCircleX = gsap.quickSetter(circle, "x", "px");
    const setCircleY = gsap.quickSetter(circle, "y", "px");
    const setDotX    = gsap.quickSetter(dot, "x", "px");
    const setDotY    = gsap.quickSetter(dot, "y", "px");

    let mouse = { x: window.innerWidth / 2, y: window.innerHeight / 2 };
    let pos   = { x: mouse.x, y: mouse.y };

    const onMouseMove = (e: MouseEvent) => {
      mouse.x = e.clientX;
      mouse.y = e.clientY;
    };
    window.addEventListener("mousemove", onMouseMove);

    // Spring interpolation tick
    const tickerId = gsap.ticker.add(() => {
      const dt = 1 - Math.pow(0.88, gsap.ticker.deltaRatio());
      pos.x += (mouse.x - pos.x) * dt;
      pos.y += (mouse.y - pos.y) * dt;
      setCircleX(pos.x - 20);   // offset by half of 40px
      setCircleY(pos.y - 20);
      setDotX(mouse.x - 3);     // offset by half of 6px
      setDotY(mouse.y - 3);
    });

    // Hover scale interactions
    const hoverTargets = document.querySelectorAll("a, button, [data-hover]");
    const enterHandlers = new Map<Element, () => void>();
    const leaveHandlers = new Map<Element, () => void>();

    hoverTargets.forEach(el => {
      const enter = () => gsap.to(circle, { scale: 2.5, opacity: 0.15, duration: 0.3, ease: "power2.out" });
      const leave = () => gsap.to(circle, { scale: 1,   opacity: 1,    duration: 0.3, ease: "power2.out" });
      el.addEventListener("mouseenter", enter);
      el.addEventListener("mouseleave", leave);
      enterHandlers.set(el, enter);
      leaveHandlers.set(el, leave);
    });

    return () => {
      window.removeEventListener("mousemove", onMouseMove);
      gsap.ticker.remove(tickerId);
      hoverTargets.forEach(el => {
        el.removeEventListener("mouseenter", enterHandlers.get(el)!);
        el.removeEventListener("mouseleave", leaveHandlers.get(el)!);
      });
    };
  }, []);

  return (
    <>
      <div
        ref={circleRef}
        className="fixed top-0 left-0 w-10 h-10 rounded-full border border-[#111111] pointer-events-none z-[9999]"
        style={{ willChange: "transform", transform: "translate(-9999px, -9999px)" }}
      />
      <div
        ref={dotRef}
        className="fixed top-0 left-0 w-1.5 h-1.5 rounded-full bg-[#111111] pointer-events-none z-[9999]"
        style={{ willChange: "transform", transform: "translate(-9999px, -9999px)" }}
      />
    </>
  );
}
```

**File**: `src/app/App.tsx` ← **MODIFY**

Mount `<CustomCursor />` before routes so it overlays the entire app.

---

### 3. Header Redesign

**File**: `src/widgets/header.tsx` ← **MODIFY**

Replace the floating pill nav with Arturo's dual-header pattern:

**Static header** — sits at top of page, becomes part of layout flow:
```tsx
<header className="px-4 py-4 border-b border-gray-100">
  <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-2 items-start md:items-end justify-between gap-4">
    <div className="flex flex-col">
      <p className="text-md font-medium leading-none">Aji Hamdani.</p>
      <p className="block text-sm text-gray-400 mt-1">— Frontend Engineer</p>
    </div>
    <div className="md:justify-end flex">
      <nav className="flex gap-4 md:gap-5 shrink-0">
        <a className="text-sm text-[#111111]" href="/">Home</a>
        <a className="text-sm text-gray-400 hover:text-[#111111] transition-colors" href="#about">About</a>
        <a className="text-sm text-gray-400 hover:text-[#111111] transition-colors" href="#projects">Work</a>
        <a className="text-sm text-gray-400 hover:text-[#111111] transition-colors" href="#contact">Contact</a>
      </nav>
    </div>
  </div>
</header>
```

**Sticky header** — fixed, starts hidden, slides in via GSAP on scroll:
```tsx
<header
  ref={stickyRef}
  className="fixed top-0 left-0 right-0 z-50 bg-white border-b border-gray-100 px-4 py-4"
  style={{ transform: "translateY(-100%)" }}   // hidden initially
>
  <div className="max-w-5xl mx-auto flex-col md:flex-row flex md:items-center gap-2 justify-between">
    <p className="text-md font-medium">Aji Hamdani.</p>
    <nav className="flex gap-4 md:gap-5 shrink-0">
      {/* same nav links */}
    </nav>
  </div>
</header>
```

GSAP scroll handler:
```ts
useEffect(() => {
  const handleScroll = () => {
    const isScrolled = window.scrollY > 80;
    gsap.to(stickyRef.current, {
      y: isScrolled ? 0 : "-100%",
      duration: 0.4,
      ease: "power2.out",
    });
  };
  window.addEventListener("scroll", handleScroll, { passive: true });
  return () => window.removeEventListener("scroll", handleScroll);
}, []);
```

**Remove**: floating pill nav, mobile dropdown, GSAP pill animation, `Button` email link.

---

### 4. Hero Section Redesign

**File**: `src/widgets/hero.tsx` ← **MODIFY**

Replace centered layout + `TerminalIdentity` with 2-column editorial split:

```
┌──────────────────────────────────────────────────────┐
│ section.px-4.pt-4.pb-2                               │
│  max-w-5xl grid grid-cols-1 md:grid-cols-2 gap-x-1   │
│                                                      │
│  LEFT col: flex flex-col justify-end py-4 md:py-16   │
│  ┌────────────────────────────┐                      │
│  │ h1 (per-char animated)     │                      │
│  │ "Frontend                  │                      │
│  │  developer                 │   RIGHT col:         │
│  │  crafting digital          │   ┌────────────┐     │
│  │  experiences from          │   │  Portrait  │     │
│  │  code to UI."              │   │  image or  │     │
│  ├────────────────────────────┤   │  placeholder│    │
│  │ sub-paragraph (gray-400)   │   │ aspect-[3/4]│    │
│  └────────────────────────────┘   └────────────┘     │
└──────────────────────────────────────────────────────┘
│ Full-width banner image (aspect-square md:aspect-[2/1]) │
└──────────────────────────────────────────────────────┘
```

**Per-character heading animation** — split string into individual `<span>` elements, GSAP stagger:

```tsx
// Helper: split string into animated letter spans
function AnimatedText({ text, className }: { text: string; className?: string }) {
  return (
    <span style={{ display: "inline-block", whiteSpace: "nowrap" }}>
      {text.split("").map((char, i) => (
        <span
          key={i}
          className={className}
          style={{ display: "inline-block" }}
          data-char  // used by GSAP selector
        >
          {char}
        </span>
      ))}
      <span style={{ display: "inline-block" }}>&nbsp;</span>
    </span>
  );
}

// Hero heading — mix of dark and muted words (matching Arturo's pattern)
// "Frontend" = dark  |  "developer crafting digital experiences from" = muted gray
// "code" "to" "UI" "systems" = dark
<h1 className="text-2xl md:text-4xl leading-none tracking-[-2.5px]">
  <AnimatedText text="Frontend"    className="text-[#111111]" />
  <AnimatedText text="developer"   className="text-[#b2b2b2]" />
  <AnimatedText text="crafting"    className="text-[#b2b2b2]" />
  <AnimatedText text="digital"     className="text-[#b2b2b2]" />
  <AnimatedText text="experiences" className="text-[#b2b2b2]" />
  <AnimatedText text="from"        className="text-[#b2b2b2]" />
  <AnimatedText text="code"        className="text-[#111111]" />
  <AnimatedText text="to"          className="text-[#111111]" />
  <AnimatedText text="UI"          className="text-[#111111]" />
  <AnimatedText text="systems."    className="text-[#b2b2b2]" />
</h1>
```

GSAP animation on mount:
```ts
gsap.from("[data-char]", {
  y: 18,
  opacity: 0,
  duration: 0.6,
  stagger: 0.018,
  ease: "power3.out",
  delay: 0.1,
});
```

**Remove**: `TerminalIdentity` import and usage.

---

### 5. Info Section

**File**: `src/widgets/info-section.tsx` ← **NEW**

```tsx
export function InfoSection() {
  return (
    <section className="px-4 py-16 md:py-24 border-t border-gray-100">
      <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-x-1 gap-y-4">
        <p className="md:sticky md:self-start md:top-4 text-lg leading-[36.4px] tracking-[-0.64px] text-black">
          About
        </p>
        <div className="reveal">
          <p className="text-md leading-relaxed text-gray-500">
            I'm Aji Hamdani, a frontend engineer based in Indonesia with experience
            building fast, type-safe web applications across startups and consulting
            environments. I care about both the craft and the outcome.
          </p>
          <a
            className="inline-block mt-4 text-md underline underline-offset-4 text-gray-400 hover:text-[#111111] transition-colors"
            href="#experience"
          >
            Discover more
          </a>
        </div>
      </div>
    </section>
  );
}
```

---

### 6. Services Section

**File**: `src/widgets/services-section.tsx` ← **NEW**

4-card grid using numbered service cards (adapted from work experience):

```tsx
const SERVICES = [
  {
    id: "001",
    name: "Frontend Engineering",
    subtitle: "Code that performs.",
    description:
      "I turn designs into fast, accessible interfaces — reducing friction and shipping products users actually enjoy.",
  },
  {
    id: "002",
    name: "UI Implementation",
    subtitle: "Pixel-perfect builds.",
    description:
      "Interfaces that look sharp and match the design spec, with clean, maintainable component structure.",
  },
  {
    id: "003",
    name: "Performance",
    subtitle: "Speed as a feature.",
    description:
      "Optimized Core Web Vitals, lazy loading, bundle splitting — so your product loads fast on any device.",
  },
  {
    id: "004",
    name: "TypeScript & Systems",
    subtitle: "Type-safe by design.",
    description:
      "Robust, scalable codebases with strict typing, Effect-TS patterns, and clear domain boundaries.",
  },
];

export function ServicesSection() {
  return (
    <section className="px-4 py-16 md:py-24 border-t border-gray-100">
      <div className="max-w-5xl mx-auto">
        <p className="text-lg leading-[36.4px] tracking-[-0.64px] text-black mb-6 md:mb-8">
          Services
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2">
          {SERVICES.map((service) => (
            <div
              key={service.id}
              className="flex flex-col gap-28 border border-gray-200 rounded-lg p-6 reveal"
            >
              <div className="flex flex-col">
                <p className="text-xs text-gray-400">{service.id}</p>
              </div>
              <div className="flex flex-col">
                <p className="text-xl font-medium text-[#111111]">{service.name}</p>
                <p className="text-sm font-medium text-[#111111] mt-2 mb-4">{service.subtitle}</p>
                <p className="text-sm text-gray-400 leading-relaxed">{service.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
```

---

### 7. Work Section (Project Grid)

**File**: `src/features/project/components/project-list.tsx` ← **MODIFY**

Switch from 2-col `max-w-7xl` to 3-col `3/4` aspect-ratio card grid with sticky section label:

```tsx
// Section wrapper with 2-col header (sticky label + description + "View all")
<section className="px-4 py-16 md:py-24 border-t border-gray-100">
  <div className="max-w-5xl mx-auto">
    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-1 gap-y-4 mb-6 md:mb-8">
      <p className="md:sticky md:self-start md:top-4 text-lg tracking-[-0.64px] text-black">Work</p>
      <div>
        <p className="text-sm leading-relaxed text-gray-500">
          A selection of projects — built with focus on quality and performance.
        </p>
        <a className="inline-block mt-4 text-sm underline underline-offset-4 text-gray-400 hover:text-[#111111]" href="/projects">
          View all
        </a>
      </div>
    </div>

    {/* 3-col project cards */}
    <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
      {projects.map((project) => (
        <a key={project.id} className="block group" href={`/projects/${project.id}`}>
          <div className="aspect-[3/4] bg-gray-50 overflow-hidden rounded-lg relative mb-3">
            {project.thumbnail_url ? (
              <img
                alt={project.title}
                src={project.thumbnail_url}
                className="object-cover transition-transform duration-500 group-hover:scale-[1.02] w-full h-full"
              />
            ) : (
              <div className="w-full h-full bg-gray-100 flex items-center justify-center">
                <span className="text-gray-300 text-sm">No image</span>
              </div>
            )}
          </div>
          <p className="text-sm font-medium text-[#111111]">{project.title}</p>
          <p className="text-xs text-gray-400 mt-0.5">{project.description}</p>
        </a>
      ))}
    </div>
  </div>
</section>
```

---

### 8. Logo Marquee (Tech Stack)

**File**: `src/features/tech-stack/components/tech-stack-list.tsx` ← **MODIFY**

Restyle to Arturo's seamless infinite marquee:

```tsx
export function TechStackList() {
  // ... existing data fetching ...

  return (
    <section className="py-16 md:py-24 border-t border-gray-100 overflow-hidden">
      <div className="marquee-mask overflow-hidden">
        <div className="animate-marquee flex w-max items-center gap-5">
          {/* Duplicate for seamless loop */}
          {[...techStacks, ...techStacks].map((tech, i) => (
            <img
              key={i}
              alt={tech.name}
              src={tech.image_logo}
              className="h-12 md:h-20 w-auto object-contain shrink-0 grayscale opacity-60 hover:grayscale-0 hover:opacity-100 transition-all"
            />
          ))}
        </div>
      </div>
    </section>
  );
}
```

Note: Adjust `@keyframes marquee` to translate `-50%` (since logos are duplicated once, not 3×).

---

### 9. Contact Section

**File**: `src/widgets/contact-form.tsx` ← **MODIFY**

Restyle to a minimal footer contact block. Keep the form but simplify visually:

```tsx
<section id="contact" className="px-4 py-16 md:py-24 border-t border-gray-100">
  <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-x-1 gap-y-8">
    {/* Left: label + description */}
    <div>
      <p className="text-lg tracking-[-0.64px] text-black mb-4">Get in touch</p>
      <p className="text-sm text-gray-500 leading-relaxed max-w-sm">
        Available for freelance projects and full-time opportunities.
        Say hello at{" "}
        <a
          href="mailto:aji.ahmad.dev@gmail.com"
          className="text-[#111111] underline underline-offset-4 hover:text-gray-600 transition-colors"
        >
          aji.ahmad.dev@gmail.com
        </a>
      </p>
    </div>

    {/* Right: minimal form */}
    <form onSubmit={onSubmit} className="space-y-4">
      {/* email + message inputs — plain, no borders-radius overkill */}
      <input
        type="email"
        placeholder="your@email.com"
        className="w-full border-b border-gray-200 py-3 text-sm text-[#111111] placeholder:text-gray-400 focus:outline-none focus:border-[#111111] bg-transparent transition-colors"
      />
      <textarea
        rows={4}
        placeholder="Your message..."
        className="w-full border-b border-gray-200 py-3 text-sm text-[#111111] placeholder:text-gray-400 focus:outline-none focus:border-[#111111] bg-transparent resize-none transition-colors"
      />
      <button
        type="submit"
        className="text-sm font-medium text-[#111111] underline underline-offset-4 hover:text-gray-500 transition-colors"
      >
        Send message →
      </button>
    </form>
  </div>
</section>
```

---

### 10. Scroll Reveal Utility

**File**: `src/shared/lib/use-reveal.ts` ← **NEW**

A lightweight `IntersectionObserver` hook that adds `.is-visible` to `.reveal` elements:

```ts
import { useEffect } from "react";

export function useScrollReveal() {
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            observer.unobserve(entry.target); // fire once
          }
        });
      },
      { threshold: 0.15 }
    );

    document.querySelectorAll(".reveal").forEach((el) => observer.observe(el));

    return () => observer.disconnect();
  }, []);
}
```

Mount in `HomePage` or `App.tsx` with `useScrollReveal()`.

---

### 11. Home Page Restructure

**File**: `src/pages/home/index.tsx` ← **MODIFY**

```tsx
import { CustomCursor }    from "@/shared/ui/custom-cursor";
import { Header }          from "@/widgets/header";
import { Hero }            from "@/widgets/hero";
import { InfoSection }     from "@/widgets/info-section";
import { ServicesSection } from "@/widgets/services-section";
import { ProjectList }     from "@/features/project/components/project-list";
import { TechStackList }   from "@/features/tech-stack/components/tech-stack-list";
import { ContactForm }     from "@/widgets/contact-form";
import { useScrollReveal } from "@/shared/lib/use-reveal";

export function HomePage() {
  useScrollReveal();

  return (
    <div className="min-h-screen bg-white text-[#111111] font-sans">
      <CustomCursor />
      <Header />
      <main id="main-content">
        <Hero />
        <InfoSection />
        <ServicesSection />
        <ProjectList />
        <TechStackList />
        <ContactForm />
      </main>
    </div>
  );
}
```

**Removed**: `TetrisGridBackground`, `AchievementList`, `WorkExperienceTimeline` (replaced by `ServicesSection`).

---

### Files to Delete

| File | Reason |
|------|--------|
| `src/shared/ui/tetris-grid-background.tsx` | Replaced by plain white background |
| `src/widgets/terminal-identity.tsx` | Replaced by portrait image in Hero |

---

## Verification Plan

### Build Check
```bash
cd /home/inadio/personals/portfolio
bun run build
bun run lint
```

### Dev Server Preview
```bash
bun run dev
# Open http://localhost:5173
```

### Manual Checklist

| # | Check | Expected |
|---|-------|----------|
| 1 | Move mouse around the page | Custom circle cursor follows with spring lag; inner dot tracks precisely |
| 2 | Hover over `<a>` or `<button>` | Circle expands to ~2.5× size |
| 3 | Page load | Hero heading letters stagger in from bottom (translateY 18px) |
| 4 | Scroll down | Sticky header slides in from top after ~80px scroll |
| 5 | Scroll back to top | Sticky header slides back out |
| 6 | Tech stack section | Logos scroll in infinite marquee, pause on hover |
| 7 | Project cards | `3/4` portrait cards with subtle scale on hover |
| 8 | Scroll through sections | Each section fades up as it enters viewport |
| 9 | Background | Plain white — no grid, no Catppuccin dark |
| 10 | Mobile (375px) | Single column layout, no broken overflow |

---

## Open Questions / Decisions Needed

1. **Portrait photo** — Do you have a photo for the hero right column? If not, a gray placeholder card will be used initially.
2. **About bio copy** — The `InfoSection` uses a placeholder bio. Provide final copy when ready.
3. **Services content** — The 4 service cards above are placeholders. Confirm or customize the names/descriptions.
4. **AchievementList** — Currently removed from the home page. Should it live on a separate `/about` page?
5. **WorkExperienceTimeline** — Removed from home page (replaced by Services). Should it appear somewhere else?

---

*Last updated: 2026-09-09*
