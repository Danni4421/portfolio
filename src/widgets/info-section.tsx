import { GoTo } from "@/shared/ui/go-to";

export function InfoSection() {
  return (
    <section id="about" className="px-4 py-16 md:py-24 border-t border-gray-100">
      <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-x-1 gap-y-4">
        <p className="md:sticky md:self-start md:top-4 text-lg leading-[36.4px] tracking-[-0.64px] text-black">
          About
        </p>
        <div className="reveal">
          <p className="text-md leading-relaxed text-gray-500">
            Hi I&apos;m Aji Hamdani, software engineer based in Indonesia. People often call me Aji, Ajik, Jik (Ya, Whatever it is).
            I started my journey in software development in high school, so if I count from when I first began learning, I’ve been working in this field for almost 6 years. But professionally, I’ve only been doing this for the past two years.
            My focus is on web development, and I’m currently starting to get into artificial intelligence, learning about computer vision and deep learning.
          </p>
          <GoTo
            to="/about"
            className="inline-block mt-4 text-md underline underline-offset-4 text-gray-400 hover:text-[#111111] transition-colors"
          >
            Discover me
          </GoTo>
        </div>
      </div>
    </section>
  );
}
