// components/form/Input.tsx
'use client';

import React, {
  useId,
  forwardRef,
  InputHTMLAttributes,
  KeyboardEvent,
  ClipboardEvent,
  useCallback,
} from 'react';
import clsx from 'clsx';

type Variant = 'outline' | 'filled' | 'ghost';
type Size = 'sm' | 'md' | 'lg';

export interface InputProps
  extends Omit<InputHTMLAttributes<HTMLInputElement>, 'size'> {
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

  /** Functional blocking modes (opt-in) */
  numericOnly?: boolean; // digits only 0-9
  lettersOnly?: boolean; // letters + space + - + '
  phoneMode?: boolean; // optional leading + at pos 0, then digits
}

const sizeClasses: Record<Size, string> = {
  sm: 'px-2 py-1 text-sm',
  md: 'px-3 py-2 text-base',
  lg: 'px-4 py-3 text-lg',
};

const ALLOWED_NAV_KEYS = new Set<string>([
  'Backspace',
  'Delete',
  'ArrowLeft',
  'ArrowRight',
  'ArrowUp',
  'ArrowDown',
  'Tab',
  'Home',
  'End',
  'Escape',
  'Enter',
]);

function allowShortcut(e: KeyboardEvent<HTMLInputElement>): boolean {
  // Allow Ctrl/⌘ combos: A/C/V/X/Z/Y, etc.
  return e.ctrlKey || e.metaKey;
}

function isLetterChar(ch: string): boolean {
  return /[A-Za-z]/.test(ch);
}

function isDigitChar(ch: string): boolean {
  return /[0-9]/.test(ch);
}

type BlockMode = 'free' | 'numeric' | 'letters' | 'phone';

function charAllowed(
  ch: string,
  mode: BlockMode,
  currentValue: string,
  caretPos: number
): boolean {
  switch (mode) {
    case 'numeric':
      return isDigitChar(ch);
    case 'letters':
      return isLetterChar(ch) || ch === ' ' || ch === '-' || ch === "'";
    case 'phone':
      if (ch === '+') {
        // Only one '+' and only at the very start
        return caretPos === 0 && !currentValue.includes('+');
      }
      return isDigitChar(ch);
    default:
      return true;
  }
}

export const Input = forwardRef<HTMLInputElement, InputProps>(function Input(
  {
    variant = 'outline',
    size = 'md',
    hasError = false,
    label,
    id,
    className,
    numericOnly = false,
    lettersOnly = false,
    phoneMode = false,
    inputMode, // will be set based on mode for better mobile keyboards
    pattern, // optional hint; functional blocking does the real work
    onKeyDown,
    onPaste,
    ...props
  },
  ref
) {
  const autoId = useId();
  const inputId = id ?? `input-${autoId}`;

  // Determine active blocking mode
  const mode: BlockMode = numericOnly
    ? 'numeric'
    : lettersOnly
    ? 'letters'
    : phoneMode
    ? 'phone'
    : 'free';

  // Choose helpful inputMode for mobile keyboards
  const computedInputMode =
    mode === 'numeric' ? 'numeric' : mode === 'phone' ? 'tel' : inputMode;

  // Keep type text to preserve leading zeros (IDs, BVN, etc.)
  const computedType = 'text';

  // Pattern hint only (browsers may ignore); logic is enforced by handlers
  const computedPattern =
    mode === 'numeric' ? '[0-9]*' : mode === 'phone' ? '[+0-9]*' : pattern;

  const handleKeyDown = useCallback(
    (e: KeyboardEvent<HTMLInputElement>) => {
      if (mode === 'free') {
        onKeyDown?.(e);
        return;
      }

      // Always allow navigation keys & shortcuts
      if (ALLOWED_NAV_KEYS.has(e.key) || allowShortcut(e)) {
        onKeyDown?.(e);
        return;
      }

      if (e.key.length === 1) {
        const el = e.currentTarget;
        const pos = el.selectionStart ?? el.value.length;
        const selLen = (el.selectionEnd ?? pos) - pos;

        // Enforce maxLength proactively on key press
        const maxLen =
          typeof props.maxLength === 'number'
            ? props.maxLength
            : Number.POSITIVE_INFINITY;
        const wouldLength = el.value.length - selLen + 1;

        const allowed =
          charAllowed(e.key, mode, el.value, pos) && wouldLength <= maxLen;

        if (!allowed) {
          e.preventDefault();
          return;
        }
      }

      onKeyDown?.(e);
    },
    [mode, onKeyDown, props.maxLength]
  );

  const handlePaste = useCallback(
    (e: ClipboardEvent<HTMLInputElement>) => {
      if (mode === 'free') {
        onPaste?.(e);
        return;
      }

      const el = e.currentTarget;
      const pasted = e.clipboardData.getData('text');

      const start = el.selectionStart ?? el.value.length;
      const end = el.selectionEnd ?? start;
      const selLen = end - start;

      // Validate all pasted characters for the target positions
      for (let i = 0; i < pasted.length; i += 1) {
        const ch = pasted[i] ?? '';
        if (!charAllowed(ch, mode, el.value, start + i)) {
          e.preventDefault();
          return;
        }
      }

      // Enforce maxLength on paste
      const maxLen =
        typeof props.maxLength === 'number'
          ? props.maxLength
          : Number.POSITIVE_INFINITY;
      const wouldLength = el.value.length - selLen + pasted.length;

      if (wouldLength > maxLen) {
        e.preventDefault();
        return;
      }

      onPaste?.(e);
    },
    [mode, onPaste, props.maxLength]
  );

  // Clean value on change for blocking modes
  const { onChange, ...restProps } = props;
  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      let value = e.target.value;
      if (mode === 'numeric') {
        value = value.replace(/[^0-9]/g, '');
      } else if (mode === 'letters') {
        value = value.replace(/[^A-Za-z\s\-']/g, '');
      } else if (mode === 'phone') {
        // Only one + at start, rest digits
        value = value.replace(/[^0-9+]/g, '');
        if (value.indexOf('+') > 0) value = value.replace(/\+/g, '');
        // Only allow + at start
        if (value.startsWith('+')) {
          value = '+' + value.slice(1).replace(/\+/g, '');
        } else {
          value = value.replace(/\+/g, '');
        }
      }

      // Update value if it changed after filtering
      if (e.target.value !== value) {
        const event = { ...e, target: { ...e.target, value } };
        onChange?.(event as React.ChangeEvent<HTMLInputElement>);
      } else {
        onChange?.(e);
      }
    },
    [mode, onChange]
  );

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
        type={computedType}
        inputMode={computedInputMode}
        pattern={computedPattern}
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
        onKeyDown={handleKeyDown}
        onPaste={handlePaste}
        onChange={handleChange}
        {...restProps}
      />
    </div>
  );
});

Input.displayName = 'Input';
