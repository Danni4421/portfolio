import { FormField } from './form-field'
import type {
  FieldError,
  FieldValues,
  Path,
  UseFormRegister,
} from 'react-hook-form'
import type { ReactNode } from 'react'
import { Textarea } from '@/shared/ui/textarea'
import { cn } from '@/shared/lib/utils'

export interface FormTextAreaFieldProps<TFieldValues extends FieldValues> {
  name: Path<TFieldValues>
  label: string
  placeholder?: string
  rows?: number
  required?: boolean
  disabled?: boolean
  register: UseFormRegister<TFieldValues>
  error?: FieldError
  onChange?: (e: React.ChangeEvent<HTMLTextAreaElement>) => void
  tooltip?: ReactNode
  className?: string
  inputClassName?: string
}

export function FormTextAreaField<TFieldValues extends FieldValues>({
  name,
  label,
  placeholder,
  rows = 4,
  required = false,
  disabled = false,
  register,
  error,
  onChange,
  tooltip,
  className,
  inputClassName,
}: FormTextAreaFieldProps<TFieldValues>) {
  // ponytail: standard textarea wrapper using RHF registration and unified FormField wrapper
  return (
    <FormField
      label={label}
      htmlFor={name}
      required={required}
      error={error?.message}
      tooltip={tooltip}
      className={className}
    >
      <Textarea
        id={name}
        placeholder={placeholder}
        rows={rows}
        disabled={disabled}
        className={cn(inputClassName)}
        {...register(name, { onChange })}
      />
    </FormField>
  )
}
