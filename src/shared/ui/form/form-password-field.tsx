import { useState } from 'react'
import { Eye, EyeOff } from 'lucide-react'
import { FormField } from './form-field'
import type { ReactNode } from 'react'
import type {
  FieldError,
  FieldValues,
  Path,
  UseFormRegister,
} from 'react-hook-form'
import { Input } from '@/shared/ui/input'
import { cn } from '@/shared/lib/utils'

export interface FormPasswordFieldProps<TFieldValues extends FieldValues> {
  name: Path<TFieldValues>
  label: string
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

export function FormPasswordField<TFieldValues extends FieldValues>({
  name,
  label,
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
}: FormPasswordFieldProps<TFieldValues>) {
  const [showPassword, setShowPassword] = useState(false)

  // ponytail: absolute positioned show/hide eye toggle button inside relative container
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
          type={showPassword ? 'text' : 'password'}
          placeholder={placeholder}
          disabled={disabled}
          className={cn('pr-10 bg-white border-neutral-300 focus:border-[#ec7211] focus:ring-1 focus:ring-[#ec7211] text-neutral-900 placeholder:text-neutral-400 rounded-lg text-sm h-10', prefixIcon && 'pl-10', inputClassName)}
          {...register(name, { onChange })}
        />

        <button
          type="button"
          onClick={() => setShowPassword((prev) => !prev)}
          disabled={disabled}
          className="absolute inset-y-0 right-0 flex items-center justify-center px-3 text-neutral-400 hover:text-neutral-600 disabled:pointer-events-none cursor-pointer"
          aria-label={showPassword ? 'Hide password' : 'Show password'}
        >
          {showPassword ? (
            <EyeOff className="h-4 w-4" />
          ) : (
            <Eye className="h-4 w-4" />
          )}
        </button>
      </div>
    </FormField>
  )
}
