import type { ComponentProps } from 'react'
import { cn } from '@/shared/lib/utils'

export interface FormErrorMessageProps extends ComponentProps<'div'> {
  showError: boolean
  message: string
}

export function FormErrorMessage({
  showError,
  message,
  className,
}: FormErrorMessageProps) {
  if (!showError) return null

  // ponytail: use Tailwind transition classes to animate error entrance smoothly
  return (
    <div className="transition-all duration-300 ease-in-out overflow-hidden">
      <div
        className={cn(
          'text-red-500 text-sm block animate-in fade-in slide-in-from-top-1 duration-300',
          className,
        )}
      >
        {message}
      </div>
    </div>
  )
}
