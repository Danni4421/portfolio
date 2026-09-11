import { FormField } from './form-field'
import type {
  FieldError,
  FieldValues,
  Path,
  UseFormRegister,
} from 'react-hook-form'
import type { ReactNode } from 'react'
import { Input } from '@/shared/ui/input'
import { cn } from '@/shared/lib/utils'

export interface FormTextFieldProps<TFieldValues extends FieldValues> {
  name: Path<TFieldValues>
  label: string
  type?: string
  placeholder?: string
  required?: boolean
  disabled?: boolean
  register: UseFormRegister<TFieldValues>
  error?: FieldError
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void
  tooltip?: ReactNode
  className?: string
  inputClassName?: string
  prefixIcon?: ReactNode
}

export function FormTextField<TFieldValues extends FieldValues>({
  name,
  label,
  type = 'text',
  placeholder,
  required = false,
  disabled = false,
  register,
  error,
  onChange,
  tooltip,
  className,
  inputClassName,
  prefixIcon,
}: FormTextFieldProps<TFieldValues>) {
  // ponytail: standard input wrapper supporting relative prefix icons
  return (
    <FormField
      label={label}
      htmlFor={name}
      required={required}
      error={error?.message}
      tooltip={tooltip}
      className={className}
    >
      <div className="relative">
        {prefixIcon && (
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400">
            {prefixIcon}
          </span>
        )}
        <Input
          id={name}
          type={type}
          placeholder={placeholder}
          disabled={disabled}
          className={cn(prefixIcon && 'pl-10', inputClassName)}
          {...register(name, { onChange })}
        />
      </div>
    </FormField>
  )
}
