import { FrontendEngineeringIcon } from "@/features/services/components/frontend-engineering-icon";
import { PerformanceIcon } from "@/features/services/components/performance-icon";
import { TypeScriptSystemsIcon } from "@/features/services/components/typescript-system-icon";
import { UiImplementationIcon } from "@/features/services/components/ui-implementation-icon";

const SERVICES = [
  {
    id: "001",
    animation: <FrontendEngineeringIcon />,
    name: "Web Development",
    subtitle: "Crafting modern web experiences",
    description:
      "Create responsive, accessible interfaces that turn ideas and designs into intuitive, user-friendly websites",
  },
  {
    id: "002",
    animation: <UiImplementationIcon />,
    name: "Mobile Development",
    subtitle: "Experiences that go wherever you go",
    description:
      "Build mobile apps focused on seamless interactions, device capabilities, and reliable experiences on the go",
  },
  {
    id: "003",
    animation: <PerformanceIcon />,
    name: "AI Engineering",
    subtitle: "Making intelligence practical",
    description:
      "Develop AI-powered features that transform models, data, and algorithms into useful real-world solutions",
  },
  {
    id: "004",
    animation: <TypeScriptSystemsIcon />,
    name: "Full-Stack Development",
    subtitle: "Connecting every layer",
    description:
      "Design and build end-to-end systems, integrating frontend interfaces, backend services, databases, and APIs into cohesive products",
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
