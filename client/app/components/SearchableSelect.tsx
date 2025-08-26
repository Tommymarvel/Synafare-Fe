'use client';

import React, { useState, useRef, useEffect } from 'react';
import { ChevronDown, Search, X } from 'lucide-react';

interface Option {
  value: string;
  label: string;
  group?: string;
}

interface SearchableSelectProps {
  options: Option[];
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  disabled?: boolean;
  loading?: boolean;
  className?: string;
  onAddNew?: () => void;
  showAddNew?: boolean;
  showCustomOption?: boolean;
  customOptionLabel?: string;
}

export default function SearchableSelect({
  options,
  value,
  onChange,
  placeholder = 'Select option',
  disabled = false,
  loading = false,
  className = '',
  onAddNew,
  showAddNew = false,
  showCustomOption = false,
  customOptionLabel = 'Add custom item…',
}: SearchableSelectProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [highlightedIndex, setHighlightedIndex] = useState(-1);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Get the selected option's label
  const selectedOption = options.find((opt) => opt.value === value);
  const selectedLabel = selectedOption?.label || '';

  // Filter options based on search term
  const filteredOptions = options.filter((option) =>
    option.label.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Group filtered options
  const groupedOptions = filteredOptions.reduce((groups, option) => {
    const group = option.group || 'default';
    if (!groups[group]) {
      groups[group] = [];
    }
    groups[group].push(option);
    return groups;
  }, {} as Record<string, Option[]>);

  // Handle option selection
  const handleSelect = (optionValue: string) => {
    if (optionValue === '[add-new]' && onAddNew) {
      onAddNew();
      setIsOpen(false);
      return;
    }
    onChange(optionValue);
    setIsOpen(false);
    setSearchTerm('');
    setHighlightedIndex(-1);
  };

  // Handle keyboard navigation
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!isOpen) {
      if (e.key === 'Enter' || e.key === 'ArrowDown') {
        setIsOpen(true);
        setHighlightedIndex(0);
      }
      return;
    }

    const allOptions = [...filteredOptions];
    if (showAddNew) allOptions.push({ value: '[add-new]', label: '(Add New)' });
    if (showCustomOption)
      allOptions.push({ value: '[custom]', label: customOptionLabel });

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setHighlightedIndex((prev) =>
          prev < allOptions.length - 1 ? prev + 1 : prev
        );
        break;
      case 'ArrowUp':
        e.preventDefault();
        setHighlightedIndex((prev) => (prev > 0 ? prev - 1 : prev));
        break;
      case 'Enter':
        e.preventDefault();
        if (highlightedIndex >= 0 && allOptions[highlightedIndex]) {
          handleSelect(allOptions[highlightedIndex].value);
        }
        break;
      case 'Escape':
        setIsOpen(false);
        setSearchTerm('');
        setHighlightedIndex(-1);
        break;
    }
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
        setSearchTerm('');
        setHighlightedIndex(-1);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Reset search when dropdown closes
  useEffect(() => {
    if (!isOpen) {
      setSearchTerm('');
      setHighlightedIndex(-1);
    }
  }, [isOpen]);

  return (
    <div ref={dropdownRef} className={`relative ${className}`}>
      {/* Trigger */}
      <div
        className={`input w-full cursor-pointer flex items-center justify-between pr-3 ${
          disabled ? 'opacity-50 cursor-not-allowed' : ''
        }`}
        onClick={() => !disabled && setIsOpen(!isOpen)}
      >
        <span className={selectedLabel ? 'text-gray-900' : 'text-gray-500'}>
          {loading ? 'Loading...' : selectedLabel || placeholder}
        </span>
        <ChevronDown
          size={16}
          className={`text-gray-400 transition-transform ${
            isOpen ? 'rotate-180' : ''
          }`}
        />
      </div>

      {/* Dropdown */}
      {isOpen && !disabled && (
        <div className="absolute z-50 mt-1 w-full bg-white border border-gray-200 rounded-lg shadow-lg max-h-64 overflow-hidden">
          {/* Search input */}
          <div className="p-2 border-b border-gray-100">
            <div className="relative">
              <Search
                size={16}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
              />
              <input
                ref={inputRef}
                type="text"
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                  setHighlightedIndex(0);
                }}
                onKeyDown={handleKeyDown}
                placeholder="Search..."
                className="w-full pl-9 pr-8 py-2 text-sm border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-mikado focus:border-transparent"
                autoFocus
              />
              {searchTerm && (
                <button
                  onClick={() => {
                    setSearchTerm('');
                    setHighlightedIndex(-1);
                    inputRef.current?.focus();
                  }}
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  <X size={14} />
                </button>
              )}
            </div>
          </div>

          {/* Options */}
          <div className="max-h-48 overflow-y-auto">
            {Object.keys(groupedOptions).length === 0 &&
            !showAddNew &&
            !showCustomOption ? (
              <div className="px-3 py-2 text-sm text-gray-500">
                No options found
              </div>
            ) : (
              <>
                {/* Grouped options */}
                {Object.entries(groupedOptions).map(([group, groupOptions]) => (
                  <div key={group}>
                    {group !== 'default' && (
                      <div className="px-3 py-1 text-xs font-medium text-gray-500 bg-gray-50 border-b border-gray-100">
                        {group.charAt(0).toUpperCase() + group.slice(1)}
                      </div>
                    )}
                    {groupOptions.map((option) => {
                      const globalIndex = filteredOptions.findIndex(
                        (opt) => opt.value === option.value
                      );
                      const isHighlighted = globalIndex === highlightedIndex;
                      const isSelected = option.value === value;

                      return (
                        <button
                          key={option.value}
                          onClick={() => handleSelect(option.value)}
                          onMouseEnter={() => setHighlightedIndex(globalIndex)}
                          className={`w-full text-left px-3 py-2 text-sm hover:bg-gray-50 ${
                            isHighlighted ? 'bg-gray-50' : ''
                          } ${isSelected ? 'font-medium text-mikado' : ''}`}
                        >
                          {option.label}
                        </button>
                      );
                    })}
                  </div>
                ))}

                {/* Add New option */}
                {showAddNew && (
                  <button
                    onClick={() => handleSelect('[add-new]')}
                    onMouseEnter={() =>
                      setHighlightedIndex(filteredOptions.length)
                    }
                    className={`w-full text-left px-3 py-2 text-sm text-mikado hover:bg-gray-50 border-t border-gray-100 ${
                      highlightedIndex === filteredOptions.length
                        ? 'bg-gray-50'
                        : ''
                    }`}
                  >
                    (Add New)
                  </button>
                )}

                {/* Custom option */}
                {showCustomOption && (
                  <button
                    onClick={() => handleSelect('[custom]')}
                    onMouseEnter={() =>
                      setHighlightedIndex(
                        filteredOptions.length + (showAddNew ? 1 : 0)
                      )
                    }
                    className={`w-full text-left px-3 py-2 text-sm text-gray-600 hover:bg-gray-50 border-t border-gray-100 ${
                      highlightedIndex ===
                      filteredOptions.length + (showAddNew ? 1 : 0)
                        ? 'bg-gray-50'
                        : ''
                    }`}
                  >
                    {customOptionLabel}
                  </button>
                )}
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
