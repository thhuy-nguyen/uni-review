'use client';

interface CountryOption {
  code: string;
  name: string;
  count: number;
}

interface CountryFilterProps {
  countries: CountryOption[];
  selectedCountry: string | null;
  onChange: (country: string | null) => void;
}

export default function CountryFilter({ countries, selectedCountry, onChange }: CountryFilterProps) {
  // Sort countries by name
  const sortedCountries = [...countries].sort((a, b) => a.name.localeCompare(b.name));
  
  return (
    <div className="flex items-center gap-2">
      <select 
        className="select select-bordered w-full max-w-xs"
        value={selectedCountry || ""}
        onChange={(e) => {
          const value = e.target.value;
          onChange(value === "" ? null : value);
        }}
      >
        <option value="">All Countries</option>
        {sortedCountries.map((country) => (
          <option key={country.code} value={country.code}>
            {country.name} ({country.count})
          </option>
        ))}
      </select>
      
      {selectedCountry && (
        <button 
          onClick={() => onChange(null)}
          className="btn btn-ghost btn-sm"
          aria-label="Clear country filter"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      )}
    </div>
  );
}