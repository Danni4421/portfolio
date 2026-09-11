import { FrontendEngineeringIcon } from "@/features/services/components/frontend-engineering-icon";
import { PerformanceIcon } from "@/features/services/components/performance-icon";
import { TypeScriptSystemsIcon } from "@/features/services/components/typescript-system-icon";
import { UiImplementationIcon } from "@/features/services/components/ui-implementation-icon";

const SERVICES = [
  {
    id: "001",
    animation: <FrontendEngineeringIcon />,
    name: "Frontend Engineering",
    subtitle: "Code that performs.",
    description:
      "I turn designs into fast, accessible interfaces, cut friction, and ship products people enjoy using.",
  },
  {
    id: "002",
    animation: <UiImplementationIcon />,
    name: "UI Implementation",
    subtitle: "Pixel-perfect builds.",
    description:
      "Interfaces that match the design spec, with clean component structure you can maintain.",
  },
  {
    id: "003",
    animation: <PerformanceIcon />,
    name: "Performance",
    subtitle: "Speed as a feature.",
    description:
      "Core Web Vitals, lazy loading, bundle splitting. Your product loads fast on any device.",
  },
  {
    id: "004",
    animation: <TypeScriptSystemsIcon />,
    name: "TypeScript & Systems",
    subtitle: "Type-safe by design.",
    description:
      "Solid codebases with strict typing, Effect-TS patterns, and clear domain boundaries.",
  },
]


export function ServicesSection() {
  return (
    <section className="px-6 py-20 md:py-32 border-t border-gray-100">
      <div className="max-w-6xl mx-auto">
        <p className="text-xl md:text-2xl leading-[36.4px] tracking-[-0.64px] text-black mb-8 md:mb-12">
          Services
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {SERVICES.map((service) => (
            <div
              key={service.id}
              className="flex flex-col gap-16 border border-gray-200 rounded-xl p-8 reveal"
            >
              <div className="flex flex-col">
                {service.animation}
              </div>
              <div className="flex flex-col">
                <p className="text-2xl font-medium text-[#111111]">
                  {service.name}
                </p>
                <p className="text-base font-medium text-[#111111] mt-3 mb-5">
                  {service.subtitle}
                </p>
                <p className="text-base text-gray-400 leading-relaxed">
                  {service.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
