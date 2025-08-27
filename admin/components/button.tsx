import { cn } from '@/lib/utils';

type ButtonTypes = 'Colored' | undefined;

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonTypes;
  className?: string;
}
export const Button = ({
  variant,
  children,
  className,
  ...props
}: ButtonProps) => {
  if (!variant)
    return (
      <button
        {...props}
        className={cn(
          'bg-mikado-yellow hover:bg-mikado-yellow/70  px-[30px] py-2 rounded-lg',
          className
        )}
      >
        {children}
      </button>
    );
  return (
    <button
      {...props}
      className={cn(
        'border border-resin-black hover:bg-raisin hover:text-gray-4   px-[30px] py-2 rounded-lg',
        className
      )}
    >
      {children}
    </button>
  );
};

export default Button;
