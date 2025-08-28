// components/form/CustomSelectReliable.tsx
'use client';

import React, {
  useState,
  useRef,
  useEffect,
  KeyboardEvent,
  useId,
} from 'react';
import { useField } from 'formik';
import clsx from 'clsx';

export interface Option {
  value: string;
  label: string;
}

interface CustomSelectReliableProps {
  name: string;
  label: string;
  options: Option[];
  placeholder?: string;
  className?: string;
  disabled?: boolean;
}

export function CustomSelect({
  name,
  label,
  options,
  placeholder = 'Select…',
  className,
  disabled = false,
}: CustomSelectReliableProps) {
  const [field, meta, helpers] = useField<string>(name);
  const { value } = field;
  const { error, touched } = meta;
  const { setValue, setTouched } = helpers;

  const [isOpen, setIsOpen] = useState(false);
  const [highlightedIndex, setHighlightedIndex] = useState(0);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const buttonId = useId();
  const listboxId = useId();

  // Close on outside click/touch
  useEffect(() => {
    const handleMouseDown = (e: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(e.target as Node)
      ) {
        setIsOpen(false);
      }
    };
    const handleTouchStart = (e: TouchEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(e.target as Node)
      ) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleMouseDown);
    document.addEventListener('touchstart', handleTouchStart);
    return () => {
      document.removeEventListener('mousedown', handleMouseDown);
      document.removeEventListener('touchstart', handleTouchStart);
    };
  }, []);

  // Sync highlighted when opening or value changes
  useEffect(() => {
    if (isOpen) {
      const currentIndex = options.findIndex((o) => o.value === value);
      setHighlightedIndex(currentIndex >= 0 ? currentIndex : 0);
    }
  }, [isOpen, value, options]);

  // Defensive: if selected value is no longer in options, reset highlight
  useEffect(() => {
    if (options.every((o) => o.value !== value)) {
      setHighlightedIndex(0);
    }
  }, [options, value]);

  const selectOption = (opt: Option) => {
    setValue(opt.value, true); // immediate validation
    setTouched(true, true); // mark as touched
    setIsOpen(false);

    // Force validation update to clear any existing errors
    setTimeout(() => {
      if (opt.value) {
        // Clear any existing error for this field if a valid option is selected
        const currentError = meta.error;
        if (currentError && opt.value !== '') {
          // Trigger revalidation to clear the error
          setValue(opt.value, true);
        }
      }
    }, 0);
  };

  const onButtonKeyDown = (e: KeyboardEvent<HTMLButtonElement>) => {
    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        if (!isOpen) {
          setIsOpen(true);
          return;
        }
        setHighlightedIndex((hi) => Math.min(hi + 1, options.length - 1));
        break;
      case 'ArrowUp':
        e.preventDefault();
        if (!isOpen) {
          setIsOpen(true);
          return;
        }
        setHighlightedIndex((hi) => Math.max(hi - 1, 0));
        break;
      case 'Enter':
      case ' ':
        e.preventDefault();
        if (!isOpen) {
          setIsOpen(true);
          return;
        }
        const opt = options[highlightedIndex];
        if (opt) {
          selectOption(opt);
        }
        break;
      case 'Escape':
        e.preventDefault();
        setIsOpen(false);
        break;
      default:
        break;
    }
  };

  const handleBlur = () => {
    // allow internal interactions; defer closing slightly
    setTimeout(() => {
      if (
        containerRef.current &&
        !containerRef.current.contains(document.activeElement)
      ) {
        setIsOpen(false);
        setTouched(true, true);
      }
    }, 100);
  };

  return (
    <div
      className={clsx('relative', className)}
      ref={(el) => {
        containerRef.current = el;
      }}
      onBlur={handleBlur}
    >
      <label
        htmlFor={buttonId}
        className="block text-sm font-medium text-raisin"
      >
        {label}
        {error && touched && <span className="text-red-500"> *</span>}
      </label>

      {/* Hidden native select for Formik + fallback */}
      <select
        {...field}
        aria-label={label}
        value={value || ''}
        onChange={(e) => {
          const newValue = e.target.value;
          setValue(newValue, true);
          setTouched(true, true);

          // Force validation update
          setTimeout(() => {
            if (newValue && newValue !== '') {
              setValue(newValue, true);
            }
          }, 0);
        }}
        onBlur={() => setTouched(true, true)}
        className="absolute inset-0 w-full h-full text-raisin opacity-0 pointer-events-none"
        tabIndex={-1}
        aria-hidden="true"
        disabled={disabled}
      />

      {/* Custom trigger */}
      <button
        type="button"
        id={buttonId}
        aria-haspopup="listbox"
        aria-expanded={isOpen}
        aria-controls={listboxId}
        onClick={() => {
          if (disabled) return;
          setIsOpen((o) => !o);
        }}
        onKeyDown={onButtonKeyDown}
        className={clsx(
          'w-full cursor-pointer border rounded-md py-3 px-4 mt-1 text-sm md:text-base lg:text-lg text-left',
          'text-raisin',
          touched && error ? 'border-red-500' : 'border-gray-300',
          disabled
            ? 'opacity-60 cursor-not-allowed'
            : 'focus:outline-none focus:ring-2 focus:ring-mikado',
          'relative flex justify-between items-center bg-white'
        )}
        disabled={disabled}
      >
        <span>
          {options.find((o) => o.value === value)?.label || placeholder}
        </span>
        <svg
          aria-hidden="true"
          width={16}
          height={16}
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth={2}
          strokeLinecap="round"
          strokeLinejoin="round"
          className="w-4 h-4 ml-2"
        >
          <path d="M6 9l6 6 6-6" />
        </svg>
      </button>

      {/* Dropdown list */}
      {isOpen && (
        <ul
          role="listbox"
          id={listboxId}
          aria-labelledby={buttonId}
          tabIndex={-1}
          className="absolute z-20 mt-1 max-h-60 w-full overflow-auto rounded-md border bg-white p-0 shadow-lg text-raisin"
          aria-activedescendant={
            options[highlightedIndex]
              ? `option-${options[highlightedIndex].value}`
              : undefined
          }
        >
          {options.map((opt, idx) => {
            const isSelected = value === opt.value;
            const isHighlighted = highlightedIndex === idx;
            return (
              <li
                key={opt.value}
                id={`option-${opt.value}`}
                role="option"
                aria-selected={isSelected}
                onClick={() => selectOption(opt)}
                onMouseEnter={() => setHighlightedIndex(idx)}
                className={clsx(
                  'cursor-pointer px-4 py-2 text-lg flex justify-between items-center',
                  'text-raisin',
                  isHighlighted ? 'bg-peach' : 'bg-white',
                  isSelected && 'font-semibold'
                )}
              >
                <span>{opt.label}</span>
                {isSelected && (
                  <span aria-hidden="true" className="ml-2">
                    ✓
                  </span>
                )}
              </li>
            );
          })}
          {options.length === 0 && (
            <li className="px-4 py-2 text-sm text-raisin">No options</li>
          )}
        </ul>
      )}

      {/* Error */}
      {touched && error && (
        <div className="text-red-500 text-sm mt-1">{error}</div>
      )}
    </div>
  );
}
