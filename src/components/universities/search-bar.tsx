'use client';

import { ChangeEvent, FormEvent, useState } from 'react';

interface SearchBarProps {
  initialSearch?: string;
  onSearch: (searchTerm: string) => void;
}

export default function SearchBar({ initialSearch = '', onSearch }: SearchBarProps) {
  const [searchTerm, setSearchTerm] = useState(initialSearch);

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    onSearch(searchTerm);
  };

  const handleClear = () => {
    setSearchTerm('');
    onSearch('');
  };

  return (
    <div className="w-full">
      <form onSubmit={handleSubmit} className="relative">
        <div className="relative">
          <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
            <svg 
              className="w-5 h-5 text-muted-foreground" 
              aria-hidden="true" 
              fill="none" 
              stroke="currentColor" 
              strokeWidth={2}
              viewBox="0 0 24 24" 
              xmlns="http://www.w3.org/2000/svg"
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" 
              />
            </svg>
          </div>
          <input
            type="search"
            id="search"
            className="block w-full p-4 pl-10 pr-10 text-base rounded-lg bg-base-200 outline-none focus:ring-2 focus:ring-primary/50 transition-all"
            placeholder="Search universities by name, country, or city..."
            value={searchTerm}
            onChange={handleChange}
            autoComplete="off"
          />
          {searchTerm && (
            <button
              type="button"
              onClick={handleClear}
              className="absolute inset-y-0 right-0 flex items-center pr-3 text-muted-foreground hover:text-foreground"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                  clipRule="evenodd"
                />
              </svg>
            </button>
          )}
        </div>
        <button
          type="submit"
          className="absolute right-2.5 bottom-2.5 btn btn-primary btn-sm"
        >
          Search
        </button>
      </form>
    </div>
  );
}