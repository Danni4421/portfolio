import { useState, useEffect, useRef } from "react";
import { gsap } from "gsap";

const navItems = [
  { name: "Home", href: "/" },
  { name: "About", href: "#about" },
  { name: "Work", href: "#projects" },
  { name: "Contact", href: "#contact" },
];

export function Header() {
  const [scrolled, setScrolled] = useState(false);
  const stickyRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 80);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    if (!stickyRef.current) return;
    gsap.to(stickyRef.current, {
      y: scrolled ? 0 : "-100%",
      duration: 0.4,
      ease: "power2.out",
    });
  }, [scrolled]);

  return (
    <>
      {/* Static header — part of layout flow */}
      <header className="px-4 py-4 border-b border-gray-100">
        <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-2 items-start md:items-end justify-between gap-4">
          <div className="flex flex-col">
            <p className="text-md font-medium leading-none">Aji Hamdani.</p>
            <p className="block text-sm text-gray-400 mt-1">
              Full Stack, now as a Frontend Engineer
            </p>
          </div>
          <div className="md:justify-end flex">
            <nav className="flex gap-4 md:gap-5 shrink-0">
              {navItems.map((item) => (
                <a
                  key={item.name}
                  className="text-sm text-[#111111] hover:text-gray-400 transition-colors"
                  href={item.href}
                >
                  {item.name}
                </a>
              ))}
            </nav>
          </div>
        </div>
      </header>

      {/* Sticky header — hidden above viewport, slides in on scroll */}
      <header
        ref={stickyRef}
        className="fixed top-0 left-0 right-0 z-50 bg-white border-b border-gray-100 px-4 py-4"
        style={{ transform: "translateY(-100%)" }}
      >
        <div className="max-w-5xl mx-auto flex-col md:flex-row flex md:items-center gap-2 justify-between">
          <p className="text-md font-medium">Aji Hamdani.</p>
          <nav className="flex gap-4 md:gap-5 shrink-0">
            {navItems.map((item) => (
              <a
                key={item.name}
                className="text-sm text-gray-400 hover:text-[#111111] transition-colors"
                href={item.href}
              >
                {item.name}
              </a>
            ))}
          </nav>
        </div>
      </header>
    </>
  );
}
