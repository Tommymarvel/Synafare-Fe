// components/form/CustomSelect.tsx
'use client';

import React, { useState, useRef, useEffect, KeyboardEvent } from 'react';
import { useField, useFormikContext, FormikContextType } from 'formik';
import clsx from 'clsx';

export interface Option {
  value: string;
  label: string;
}

interface CustomSelectProps {
  name: string;
  label: string;
  options: Option[];
  placeholder?: string;
  className?: string;
}

export function CustomSelect({
  name,
  label,
  options,
  placeholder = 'Select…',
  className,
}: CustomSelectProps) {
  // field.value is string
  const [field, meta, helpers] = useField<string>(name);
  // Form values are string → Record<fieldName, string>
  const { setTouched } = useFormikContext<
    Record<string, string>
  >() as FormikContextType<Record<string, string>>;

  const [isOpen, setIsOpen] = useState(false);
  const [highlightedIndex, setHighlightedIndex] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);

  // Close dropdown on outside click/touch
  useEffect(() => {
    const handleClickOutside: EventListener = (event) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('touchstart', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('touchstart', handleClickOutside);
    };
  }, []);

  // Keyboard navigation
  const onKeyDown = (e: KeyboardEvent<HTMLButtonElement>) => {
    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setIsOpen(true);
        setHighlightedIndex((hi) => (hi < options.length - 1 ? hi + 1 : hi));
        break;
      case 'ArrowUp':
        e.preventDefault();
        setHighlightedIndex((hi) => (hi > 0 ? hi - 1 : hi));
        break;
      case 'Enter':
        e.preventDefault();
        const opt = options[highlightedIndex];
        helpers.setValue(opt.value);
        setIsOpen(false);
        break;
      case 'Escape':
        setIsOpen(false);
        break;
    }
  };

  // Mouse click selection
  const handleOptionClick = (opt: Option) => {
    helpers.setValue(opt.value);
    setIsOpen(false);
    setTouched({ [name]: true });
  };

  return (
    <div className={clsx('relative', className)} ref={containerRef}>
      <label htmlFor={name} className="block text-sm font-medium text-raisin">
        {label}
        {meta.error && meta.touched && <span className="text-red-500"> *</span>}
      </label>

      {/* Trigger */}
      <button
        type="button"
        id={name}
        aria-haspopup="listbox"
        aria-expanded={isOpen}
        onClick={() => {
          setIsOpen((open) => !open);
          setTouched({ [name]: true });
        }}
        onKeyDown={onKeyDown}
        className={clsx(
          'w-full cursor-pointer border rounded-md py-3 px-4 mt-1 text-sm md:text-base lg:text-lg text-left text-raisin',
          meta.touched && meta.error ? 'border-red-500' : 'border-gray-300',
          'focus:outline-none focus:ring-2 focus:ring-mikado'
        )}
      >
        {options.find((o) => o.value === field.value)?.label || placeholder}
      </button>

      {/* Options List */}
      {isOpen && (
        <ul
          role="listbox"
          aria-labelledby={name}
          tabIndex={-1}
          className="absolute z-10 mt-1 max-h-60 text-lg w-full overflow-auto border-mikado rounded-md border bg-white text-raisin p-0 shadow-lg focus:outline-none"
        >
          {options.map((opt, idx) => (
            <li
              key={opt.value}
              role="option"
              aria-selected={field.value === opt.value}
              onClick={() => handleOptionClick(opt)}
              onMouseEnter={() => setHighlightedIndex(idx)}
              className={clsx(
                'cursor-pointer px-4 py-2 text-lg',
                highlightedIndex === idx ? 'bg-peach' : 'bg-white',
                field.value === opt.value && 'font-semibold'
              )}
            >
              {opt.label}
            </li>
          ))}
        </ul>
      )}

      {/* Error message */}
      {meta.touched && meta.error && (
        <div className="text-red-500 text-sm mt-1">{meta.error}</div>
      )}
    </div>
  );
}
