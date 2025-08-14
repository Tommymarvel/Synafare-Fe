// app/components/wallet/CurrencyInput.tsx
'use client';

import { useMemo } from 'react';
import { useField } from 'formik';
import clsx from 'clsx';

export default function CurrencyInput({
  name,
  placeholder = 'Input amount',
  className,
  disabled = false,
}: {
  name: string;
  placeholder?: string;
  className?: string;
  disabled?: boolean;
}) {
  const [field, meta, helpers] = useField<number | ''>(name);

  function onlyDigits(s: string) {
    return s.replace(/[^\d]/g, '');
  }
  function formatNaira(n: number | '') {
    if (n === '' || Number.isNaN(n)) return '';
    return new Intl.NumberFormat('en-NG').format(Number(n));
  }

  const display = useMemo(() => formatNaira(field.value), [field.value]);

  return (
    <div>
      <div className="relative">
        <span className="pointer-events-none absolute inset-y-0 left-3 flex items-center text-neutral-400">
          ₦
        </span>
        <input
          inputMode="numeric"
          autoComplete="off"
          disabled={disabled}
          value={display}
          placeholder={placeholder}
          onChange={(e) => {
            const raw = onlyDigits(e.target.value);
            helpers.setValue(raw ? Number(raw) : '');
          }}
          onBlur={() => helpers.setTouched(true)}
          className={clsx(
            'w-full rounded-xl border border-neutral-200 bg-white px-9 py-3 outline-none',
            'placeholder:text-neutral-400 focus:border-neutral-400',
            disabled && 'opacity-60',
            className
          )}
        />
      </div>
      {meta.touched && meta.error ? (
        <p className="mt-1 text-sm text-red-500">{meta.error}</p>
      ) : null}
    </div>
  );
}
