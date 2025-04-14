'use client';

import { useState, useEffect, ChangeEvent } from 'react';

interface SearchBarProps {
  onSearch: (query: string) => void;
  placeholder?: string;
}

export default function SearchBar({ onSearch, placeholder = "Search universities..." }: SearchBarProps) {
  const [searchTerm, setSearchTerm] = useState('');
  
  useEffect(() => {
    // Debounce function with 300ms delay
    const timeoutId = setTimeout(() => {
      onSearch(searchTerm);
    }, 300);
    
    // Clean up the timeout when the component unmounts or when searchTerm changes
    return () => clearTimeout(timeoutId);
  }, [searchTerm, onSearch]);

  const handleSearchChange = (e: ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  return (
    <div className="flex flex-col sm:flex-row gap-4 w-full">
      <input
        type="text"
        placeholder={placeholder}
        value={searchTerm}
        onChange={handleSearchChange}
        className="input input-bordered w-full"
      />
    </div>
  );
}