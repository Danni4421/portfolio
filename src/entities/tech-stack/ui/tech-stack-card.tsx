
import type { TechStack } from "../model/types"

export function TechStackCard({ stack }: { stack: TechStack }) {
  return (
    <div className="flex min-w-24 flex-col items-center">
      <img
        src={stack.image_logo ?? "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='150' height='150'%3E%3Crect fill='%23e5e7eb' width='150' height='150'/%3E%3C/svg%3E"}
        alt={`${stack.name} icon`}
        className="mb-4 h-12 w-auto object-contain grayscale transition duration-300 hover:grayscale-0"
        draggable="false"
      />
      <h3 className="mb-2 text-center text-lg font-semibold text-gray-900">{stack.name}</h3>
    </div>
  )
}
