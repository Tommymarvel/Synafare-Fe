'use client';

import React, { useState } from 'react';
import { Calendar } from 'lucide-react';
import CustomCalendar from './CustomCalendar';

interface DateInputProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  required?: boolean;
  className?: string;
}

export default function DateInput({
  label,
  value,
  onChange,
  placeholder = 'Select date',
  required = false,
  className = '',
}: DateInputProps) {
  const [showCalendar, setShowCalendar] = useState(false);

  // Format date for display
  const formatDisplayDate = (dateString: string) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  return (
    <div className={className}>
      <label className="mb-1 block text-sm font-medium">
        {label} {required && '*'}
      </label>

      <button
        type="button"
        onClick={() => setShowCalendar(true)}
        className="input w-full text-left flex items-center justify-between"
      >
        <span className={value ? 'text-gray-900' : 'text-gray-500'}>
          {value ? formatDisplayDate(value) : placeholder}
        </span>
        <Calendar size={16} className="text-gray-400" />
      </button>

      {showCalendar && (
        <CustomCalendar
          value={value}
          onChange={(date) => {
            onChange(date);
            setShowCalendar(false);
          }}
          onClose={() => setShowCalendar(false)}
        />
      )}
    </div>
  );
}
