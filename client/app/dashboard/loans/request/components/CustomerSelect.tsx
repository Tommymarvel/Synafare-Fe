'use client';

import React from 'react';
import { useFormikContext } from 'formik';

export default function CustomerSelect({
  name,
  options,
  loading,
  disabled,
  placeholder = 'Search customers…',
}: {
  name: string;
  options: { id: string; label: string }[];
  loading?: boolean;
  disabled?: boolean;
  placeholder?: string;
}) {
  const { values, setFieldValue, setFieldTouched } = useFormikContext<Record<string, string>>();
  const selectedId: string = (values[name] as string) ?? '';
  const selectedLabel = options.find((o) => o.id === selectedId)?.label ?? '';

  const [open, setOpen] = React.useState(false);
  const [query, setQuery] = React.useState<string>(selectedLabel);
  const [highlight, setHighlight] = React.useState(0);
  const wrapRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    const onDoc = (e: MouseEvent) => {
      if (!wrapRef.current) return;
      if (!wrapRef.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener('mousedown', onDoc);
    return () => document.removeEventListener('mousedown', onDoc);
  }, []);

  React.useEffect(() => {
    if (!open) setQuery(selectedLabel);
  }, [selectedLabel, open]);

  const filtered = React.useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return options.slice(0, 50);
    return options
      .filter((o) => o.label.toLowerCase().includes(q))
      .slice(0, 50);
  }, [options, query]);

  const choose = (opt: { id: string; label: string }) => {
    setFieldValue(name, opt.id);
    setFieldTouched(name, true, true);
    setQuery(opt.label);
    setOpen(false);
  };

  const clear = () => {
    setFieldValue(name, '');
    setFieldTouched(name, true, true);
    setQuery('');
    setOpen(true);
  };

  const onKeyDown: React.KeyboardEventHandler<HTMLInputElement> = (e) => {
    if (!open && (e.key === 'ArrowDown' || e.key === 'Enter')) {
      setOpen(true);
      return;
    }
    if (!open) return;

    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setHighlight((h) => Math.min(filtered.length - 1, h + 1));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setHighlight((h) => Math.max(0, h - 1));
    } else if (e.key === 'Enter') {
      e.preventDefault();
      const opt = filtered[highlight];
      if (opt) choose(opt);
    } else if (e.key === 'Escape') {
      setOpen(false);
    }
  };

  return (
    <div ref={wrapRef} className="relative">
      <div className="flex items-center gap-2">
        <input
          type="text"
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            if (!open) setOpen(true);
          }}
          onFocus={() => setOpen(true)}
          onKeyDown={onKeyDown}
          disabled={disabled || loading}
          placeholder={placeholder}
          className="w-full rounded-md text-sm border py-3 px-4 bg-white focus:outline-none focus:ring-2 focus:ring-mikado"
          role="combobox"
          aria-autocomplete="list"
          aria-expanded={open}
          aria-controls="customer-combobox-list"
        />
        {selectedId && (
          <button
            type="button"
            onClick={clear}
            className="text-sm px-2 py-2 rounded-md border hover:bg-gray-50"
            aria-label="Clear selection"
          >
            Clear
          </button>
        )}
      </div>

      {open && !disabled && (
        <div
          id="customer-combobox-list"
          className="absolute z-50 mt-1 max-h-64 w-full overflow-auto rounded-md border bg-white shadow-lg"
          role="listbox"
        >
          {loading ? (
            <div className="px-3 py-2 text-sm text-[#797979]">Loading…</div>
          ) : filtered.length === 0 ? (
            <div className="px-3 py-2 text-sm text-[#797979]">No matches</div>
          ) : (
            filtered.map((opt, idx) => {
              const isActive = idx === highlight;
              const isSelected = opt.id === selectedId;
              return (
                <button
                  key={opt.id}
                  type="button"
                  role="option"
                  aria-selected={isSelected}
                  onMouseEnter={() => setHighlight(idx)}
                  onMouseDown={(e) => {
                    e.preventDefault();
                    choose(opt);
                  }}
                  className={`block w-full text-left px-3 py-2 text-sm ${
                    isActive ? 'bg-gray-100' : ''
                  } ${isSelected ? 'font-medium' : ''}`}
                >
                  {opt.label}
                </button>
              );
            })
          )}
        </div>
      )}

      <input type="hidden" name={name} value={selectedId} />
    </div>
  );
}
