'use client';

import { useState, useMemo } from 'react';
import UniversityCard from './university-card';
import SearchBar from './search-bar';
import CountryFilter from './country-filter';

interface University {
  id: string;
  name: string;
  city: string;
  country: string;
  country_code: string;
  logo_url?: string;
  established?: number;
  type?: string;
  avg_rating: number;
  review_count: number;
}

interface UniversityListProps {
  universities: University[];
}

export default function UniversityList({ universities }: UniversityListProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCountry, setSelectedCountry] = useState<string | null>(null);

  // Extract unique countries with counts
  const countryOptions = useMemo(() => {
    const countryCounts = universities.reduce((counts: Record<string, { name: string; count: number }>, uni) => {
      if (!counts[uni.country_code]) {
        counts[uni.country_code] = { 
          name: uni.country, 
          count: 0 
        };
      }
      counts[uni.country_code].count++;
      return counts;
    }, {});

    return Object.entries(countryCounts).map(([code, { name, count }]) => ({
      code,
      name,
      count
    }));
  }, [universities]);

  const filteredUniversities = useMemo(() => {
    let filtered = universities;
    
    // Apply country filter if selected
    if (selectedCountry) {
      filtered = filtered.filter(uni => uni.country_code === selectedCountry);
    }
    
    // Apply search filter
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(uni => 
        uni.name.toLowerCase().includes(query) || 
        uni.city.toLowerCase().includes(query) || 
        uni.country.toLowerCase().includes(query)
      );
    }
    
    return filtered;
  }, [universities, searchQuery, selectedCountry]);

  return (
    <>
      <div className="mb-8 space-y-6">
        <SearchBar 
          onSearch={setSearchQuery}
          placeholder="Search universities by name, city or country..."
        />
        
        <div>
          <h3 className="text-sm font-medium mb-2">Filter by Country</h3>
          <CountryFilter 
            countries={countryOptions}
            selectedCountry={selectedCountry}
            onChange={setSelectedCountry}
          />
        </div>
      </div>
      
      <div className="flex justify-between items-center mb-4">
        <p className="text-sm text-muted-foreground">
          {filteredUniversities.length} {filteredUniversities.length === 1 ? 'university' : 'universities'} found
        </p>
        {(selectedCountry || searchQuery) && (
          <button 
            onClick={() => {
              setSelectedCountry(null);
              setSearchQuery('');
            }}
            className="btn btn-sm btn-ghost"
          >
            Clear all filters
          </button>
        )}
      </div>
      
      {filteredUniversities.length === 0 ? (
        <div className="text-center py-10">
          <h3 className="text-lg font-medium">No universities found</h3>
          <p className="text-muted-foreground">Try changing your search criteria or check back later.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredUniversities.map((university) => (
            <UniversityCard key={university.id} university={university} />
          ))}
        </div>
      )}
    </>
  );
}