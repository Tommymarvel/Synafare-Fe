// components/search.input.tsx
'use client';

import Image from 'next/image';
import React from 'react';

type SearchInputProps = {
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string;
  className?: string;
};

const SearchInput: React.FC<SearchInputProps> = ({
  value,
  onChange,
  placeholder = 'Search',
  className = '',
}) => {
  return (
    <div className={`relative w-full ${className}`}>
      <input
        type="search"
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className="w-full ps-4 peer border border-border-gray rounded-[16px] text-[16px]/[24px] placeholder:ps-[26px] py-2 focus:placeholder-transparent"
      />
      <Image
        className="absolute peer-focus:hidden transition-all left-[14px] top-1/2 -translate-y-1/2"
        src="/search-icon.svg"
        alt="search icon"
        width={20}
        height={20}
      />
    </div>
  );
};

export default SearchInput;
