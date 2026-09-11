import { FormErrorMessage } from './form-error-message'
import type { ReactNode } from 'react'
import { Label } from '@/shared/ui/label'
import { cn } from '@/shared/lib/utils'

export interface FormFieldProps {
  label: string
  htmlFor: string
  required?: boolean
  error?: string
  tooltip?: ReactNode
  children: ReactNode
  className?: string
}

export function FormField({
  label,
  htmlFor,
  required = false,
  error,
  tooltip,
  children,
  className,
}: FormFieldProps) {
  // ponytail: group field grid layout and handle required * marker and validation messages
  return (
    <div className={cn('grid gap-1.5', className)}>
      <Label className="flex items-center gap-1" htmlFor={htmlFor}>
        {required && <span className="text-red-500 font-bold">*</span>}
        <span>{label}</span>
        {tooltip}
      </Label>
      {children}
      <FormErrorMessage showError={!!error} message={error || ''} />
    </div>
  )
}
