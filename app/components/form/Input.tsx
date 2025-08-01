// components/form/Input.tsx
import React, { useId } from 'react';
import clsx from 'clsx';

type Variant = 'outline' | 'filled' | 'ghost';
type Size = 'sm' | 'md' | 'lg';

export interface InputProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'size'> {
  /** Visual variant of the input */
  variant?: Variant;
  /** Size of the input */
  size?: Size;
  /** Show error state styles */
  hasError?: boolean;
  /** Text for the input label */
  label?: string;
  /** Optional id; auto-generated if omitted */
  id?: string;
}

const sizeClasses: Record<Size, string> = {
  sm: 'px-2 py-1 text-sm',
  md: 'px-3 py-2 text-base',
  lg: 'px-4 py-3 text-lg',
};

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  (
    {
      variant = 'outline',
      size = 'md',
      hasError = false,
      label,
      id,
      className,
      ...props
    },
    ref
  ) => {
    const autoId = useId();
    const inputId = id ?? `input-${autoId}`;

    return (
      <div className={clsx('w-full', label && 'space-y-1')}>
        {label && (
          <label
            htmlFor={inputId}
            className="block text-sm font-medium text-gray-700"
          >
            {label}
          </label>
        )}
        <input
          id={inputId}
          ref={ref}
          className={clsx(
            'w-full rounded-md transition focus:outline-none text-raisin',
            variant === 'outline' &&
              'border border-[#D0D5DD] p-4  placeholder:text-[#98A2B3] focus:border-mikado focus:ring-2 focus:ring-mikado',
            variant === 'filled' &&
              'bg-gray-100 border-transparent focus:bg-white focus:ring-2 focus:ring-orange-200',
            variant === 'ghost' &&
              'bg-transparent border-transparent focus:ring-0',
            hasError && 'border-red-500 focus:ring-red-200',
            sizeClasses[size],
            className
          )}
          {...props}
        />
      </div>
    );
  }
);

Input.displayName = 'Input';
