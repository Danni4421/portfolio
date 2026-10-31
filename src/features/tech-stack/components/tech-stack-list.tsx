import { useGetTechStacks } from "../services/use-get-tech-stacks";
import FoldText from "@/shared/ui/fold-text";

export function TechStackList() {
  const {
    data: techStacks,
    isLoading: loading,
    isError,
  } = useGetTechStacks();

  if (loading) {
    return (
      <section className="py-16 md:py-24 border-t border-gray-100 overflow-hidden">
        <div className="marquee-mask overflow-hidden">
          <div className="flex w-max items-center">
            {Array.from({ length: 8 }).map((_, i) => (
              <div
                key={i}
                className="mr-5 h-12 md:h-20 w-24 md:w-32 rounded-lg bg-neutral-200 animate-pulse shrink-0"
              />
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (isError || !techStacks || techStacks.length === 0) {
    return (
      <section className="py-16 md:py-24 border-t border-gray-100">
        <p className="px-4 text-sm text-gray-400 text-center">
          <FoldText text="There are no related tech stacks for now." splitBy="word" />
        </p>
      </section>
    );
  }

  const stacks = [...techStacks, ...techStacks];

  return (
    <section className="py-16 md:py-24 border-t border-gray-100 overflow-hidden">
      <div className="marquee-mask overflow-hidden animate-content-enter shine-enter">
        <div className="animate-marquee flex w-max items-center">
          {stacks.map((tech, i) => (
            <img
              key={i}
              alt={tech.name}
              src={tech.image_logo}
              className="h-12 md:h-20 w-auto object-contain shrink-0 grayscale opacity-60 hover:grayscale-0 hover:opacity-100 transition-all mr-5"
            />
          ))}
        </div>
      </div>
    </section>
  );
}
