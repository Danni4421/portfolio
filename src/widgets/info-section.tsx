export function InfoSection() {
  return (
    <section className="px-4 py-16 md:py-24 border-t border-gray-100">
      <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-x-1 gap-y-4">
        <p className="md:sticky md:self-start md:top-4 text-lg leading-[36.4px] tracking-[-0.64px] text-black">
          About
        </p>
        <div className="reveal">
          <p className="text-md leading-relaxed text-gray-500">
            I&apos;m Aji Hamdani, a frontend engineer based in Indonesia. I
            build fast, type-safe web applications across startups and consulting
            work.
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
