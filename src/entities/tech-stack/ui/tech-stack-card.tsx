
import type { TechStack } from "../model/types"

export function TechStackCard({ stack }: { stack: TechStack }) {
  return (
    <div className="flex min-w-24 flex-col items-center">
      <img
        src={stack.image_logo ?? "https://via.placeholder.com/150"}
        alt={`${stack.name} icon`}
        className="mb-4 h-12 w-auto object-contain grayscale transition duration-300 hover:grayscale-0"
        draggable="false"
      />
      <h3 className="mb-2 text-center text-lg font-semibold text-gray-900 dark:text-gray-100">{stack.name}</h3>
    </div>
  )
}
