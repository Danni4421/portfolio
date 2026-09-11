
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/shared/ui/tooltip"

interface PersonBadgeProps {
  name: string
  is_man: boolean
  href?: string | null
}

export function PersonBadge({ name, is_man, href }: PersonBadgeProps) {
  const imageSrc = is_man ? "/port-man.png" : "/port-woman.png"

  const Content = (
    <div className="flex h-12 w-12 items-center justify-center rounded-full border border-gray-200 bg-white p-2 transition-shadow hover:shadow-md dark:border-gray-700 dark:bg-gray-800">
      <img src={imageSrc} alt={name} className="h-full w-full object-contain" />
    </div>
  )

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          {href ? (
            <a href={href} target="_blank" rel="noopener noreferrer">
              {Content}
            </a>
          ) : (
            Content
          )}
        </TooltipTrigger>
        <TooltipContent side="bottom">
          <p>{name}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  )
}
