import React from 'react';
import clsx from 'clsx';

export type ButtonVariant = 'default' | 'outline' | 'secondary';

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  /** Which visual variant to use */
  variant?: ButtonVariant;
}

const baseClasses =
  'relative inline-flex items-center justify-center space-x-2 self-stretch text-center font-medium';

const variantClasses: Record<ButtonVariant, string> = {
  default:
    'p-4 text-base leading-[1.45] bg-mikado text-raisin rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-mikado focus:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none hover:bg-mikado/90 active:bg-mikado/80',
  outline:
    'p-4 text-base leading-[1.45] bg-transparent text-raisin rounded-lg transition-colors focus:outline-none disabled:opacity-50 disabled:pointer-events-none border border-[#D0D5DD] ',
  secondary:
    'p-4 text-base leading-[1.45] bg-gray-200 text-gray-700 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-gray-300 focus:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none hover:bg-gray-300 active:bg-gray-400',
};

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ variant = 'default', className, children, ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={clsx(baseClasses, variantClasses[variant], className)}
        {...props}
      >
        {children}
      </button>
    );
  }
);

Button.displayName = 'Button';
