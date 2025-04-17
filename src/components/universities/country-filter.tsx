'use client';

import { useState, useEffect, useRef } from 'react';
import { SearchIcon, CheckIcon, ChevronDownIcon, XCircleIcon } from '@/components/ui/icons';

interface Country {
  code: string;
  name: string;
  count: number;
}

interface CountryFilterProps {
  countries: Country[];
  selectedCountry: string | null;
  onChange: (countryCode: string | null) => void;
  className?: string;
}

export default function CountryFilter({
  countries,
  selectedCountry,
  onChange,
  className = ''
}: CountryFilterProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState('');
  const dropdownRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Handle clicks outside the dropdown to close it
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Focus search input when dropdown opens
  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  // Filter countries based on search input
  const filteredCountries = search
    ? countries.filter(country => 
        country.name.toLowerCase().includes(search.toLowerCase())
      )
    : countries;

  const handleSelect = (countryCode: string) => {
    onChange(countryCode === selectedCountry ? null : countryCode);
    setIsOpen(false);
    setSearch('');
  };

  const clearSelection = () => {
    onChange(null);
  };

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
    setSearch('');
  };

  // Find the selected country object
  const selected = countries.find(country => country.code === selectedCountry);

  return (
    <div className={`relative ${className}`} ref={dropdownRef}>
      <button
        type="button"
        onClick={toggleDropdown}
        className={`flex w-full items-center justify-between rounded-lg border bg-base-100 px-3 py-2.5 text-left transition-all ${
          selectedCountry 
            ? 'border-primary/50 text-primary font-medium'
            : 'border-base-300 text-base-content'
        }`}
        aria-haspopup="listbox"
        aria-expanded={isOpen}
      >
        <div className="flex items-center gap-2">
          {selectedCountry && (
            <div className="flex-shrink-0">
              <img
                src={`https://flagcdn.com/w20/${selectedCountry.toLowerCase()}.png`}
                alt={selected?.name || ''}
                className="h-4 w-6 object-cover rounded-sm shadow-sm"
              />
            </div>
          )}
          <span className="truncate">
            {selected 
              ? `${selected.name} (${selected.count})`
              : 'All Countries'}
          </span>
        </div>
        <div className="flex items-center gap-1">
          {selectedCountry && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                clearSelection();
              }}
              className="text-muted-foreground hover:text-primary"
              aria-label="Clear selection"
              type="button"
            >
              <XCircleIcon className="h-4 w-4" />
            </button>
          )}
          <ChevronDownIcon className="h-4 w-4 text-muted-foreground" />
        </div>
      </button>

      {isOpen && (
        <div className="absolute left-0 z-10 mt-1 w-full rounded-md bg-base-100 shadow-lg border ring-1 ring-base-300 ring-opacity-5 max-h-60 flex flex-col">
          <div className="flex items-center px-3 py-2 sticky top-0 bg-base-100 border-b z-10">
            <SearchIcon className="h-4 w-4 text-muted-foreground mr-2" />
            <input
              ref={inputRef}
              type="text"
              className="w-full bg-transparent focus:outline-none text-sm placeholder:text-muted-foreground/70"
              placeholder="Search countries..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              onClick={(e) => e.stopPropagation()}
            />
          </div>

          <div className="overflow-auto flex-grow max-h-52 pt-1 pb-2">
            <ul className="max-h-full" role="listbox">
              <li className="px-2">
                <button
                  type="button"
                  className={`flex w-full items-center gap-2 px-2 py-1.5 text-sm rounded-md ${
                    !selectedCountry 
                      ? 'bg-primary/10 text-primary font-medium'
                      : 'hover:bg-base-200'
                  }`}
                  onClick={() => handleSelect('')}
                >
                  <div className="flex-shrink-0 w-6"></div>
                  <span>All Countries</span>
                  {!selectedCountry && (
                    <CheckIcon className="ml-auto h-4 w-4 text-primary" />
                  )}
                </button>
              </li>
              
              {filteredCountries.length > 0 ? (
                filteredCountries.map((country) => (
                  <li key={country.code} className="px-2">
                    <button
                      type="button"
                      className={`flex w-full items-center gap-2 px-2 py-1.5 text-sm rounded-md ${
                        selectedCountry === country.code 
                          ? 'bg-primary/10 text-primary font-medium'
                          : 'hover:bg-base-200'
                      }`}
                      onClick={() => handleSelect(country.code)}
                    >
                      <div className="flex-shrink-0">
                        <img
                          src={`https://flagcdn.com/w20/${country.code.toLowerCase()}.png`}
                          alt={country.name}
                          className="h-4 w-6 object-cover rounded-sm shadow-sm"
                        />
                      </div>
                      <span>{country.name}</span>
                      <span className="ml-auto text-xs text-muted-foreground">
                        {country.count}
                      </span>
                      {selectedCountry === country.code && (
                        <CheckIcon className="ml-1 h-4 w-4 text-primary" />
                      )}
                    </button>
                  </li>
                ))
              ) : (
                <li className="px-4 py-3 text-center text-sm text-muted-foreground">
                  No countries found
                </li>
              )}
            </ul>
          </div>
        </div>
      )}
    </div>
  );
}