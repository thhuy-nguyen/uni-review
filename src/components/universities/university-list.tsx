'use client';

import { useState, useMemo, useEffect } from 'react';
import UniversityCard from './university-card';
import SearchBar from './search-bar';
import CountryFilter from './country-filter';
import { ChevronDownIcon, SliderIcon, GridIcon, ListIcon, FilterIcon, XCircleIcon, PlusIcon } from '@/components/ui/icons';
import { createClient } from '@/lib/supabase';
import SuggestionModal from './suggestion-modal';

interface Country {
  id: string;
  name: string;
  code: string;
}

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
  description?: string;
  slug?: string;
}

interface UniversityListProps {
  universities: University[];
}

type SortOption = 'name' | 'rating' | 'reviews';
type ViewMode = 'grid' | 'list';

export default function UniversityList({ universities }: UniversityListProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCountry, setSelectedCountry] = useState<string | null>(null);
  const [sortBy, setSortBy] = useState<SortOption>('name');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
  const [isLoading, setIsLoading] = useState(true);
  const [viewMode, setViewMode] = useState<ViewMode>('grid');
  const [showMobileFilters, setShowMobileFilters] = useState(false);
  const [activeFilters, setActiveFilters] = useState<string[]>([]);
  
  // State for university suggestion modal
  const [showSuggestionModal, setShowSuggestionModal] = useState(false);

  // State for countries data
  const [countries, setCountries] = useState<Country[]>([]);
  // State for user session
  const [userEmail, setUserEmail] = useState<string | null>(null);

  // Fetch countries from Supabase
  useEffect(() => {
    const fetchCountries = async () => {
      const supabase = createClient();
      const { data, error } = await supabase
        .from('countries')
        .select('id, name, code')
        .order('name');
      
      if (!error && data) {
        setCountries(data);
      } else {
        console.error('Error loading countries:', error);
      }
    };
    
    fetchCountries();
  }, []);

  // Fetch user session to get email
  useEffect(() => {
    const fetchUserSession = async () => {
      const supabase = createClient();
      const { data, error } = await supabase.auth.getSession();
      
      if (!error && data.session?.user?.email) {
        setUserEmail(data.session.user.email);
      }
    };
    
    fetchUserSession();
  }, []);

  // Listen for custom events to open the suggestion modal from outside the component
  useEffect(() => {
    const handleOpenSuggestionModal = () => {
      setShowSuggestionModal(true);
    };

    // Add event listener
    document.addEventListener('open-university-suggestion-modal', handleOpenSuggestionModal);

    // Clean up event listener
    return () => {
      document.removeEventListener('open-university-suggestion-modal', handleOpenSuggestionModal);
    };
  }, []);

  // Simulate loading for better UX
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 600);
    return () => clearTimeout(timer);
  }, []);

  // Track active filters for mobile UI
  useEffect(() => {
    const filters = [];
    if (selectedCountry) filters.push('country');
    if (searchQuery) filters.push('search');
    if (sortBy !== 'name' || sortOrder !== 'asc') filters.push('sort');
    setActiveFilters(filters);
  }, [selectedCountry, searchQuery, sortBy, sortOrder]);

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
    })).sort((a, b) => a.name.localeCompare(b.name));
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
        uni.city?.toLowerCase().includes(query) || 
        uni.country.toLowerCase().includes(query) ||
        uni.type?.toLowerCase().includes(query)
      );
    }
    
    // Apply sorting
    filtered = [...filtered].sort((a, b) => {
      if (sortBy === 'name') {
        return sortOrder === 'asc' 
          ? a.name.localeCompare(b.name)
          : b.name.localeCompare(a.name);
      } else if (sortBy === 'rating') {
        return sortOrder === 'asc'
          ? (a.avg_rating || 0) - (b.avg_rating || 0)
          : (b.avg_rating || 0) - (a.avg_rating || 0);
      } else if (sortBy === 'reviews') {
        return sortOrder === 'asc'
          ? (a.review_count || 0) - (b.review_count || 0)
          : (b.review_count || 0) - (a.review_count || 0);
      }
      return 0;
    });
    
    return filtered;
  }, [universities, searchQuery, selectedCountry, sortBy, sortOrder]);

  const handleSort = (option: SortOption) => {
    if (sortBy === option) {
      // Toggle sort order if clicking the same option
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      // Set new sort option with default order
      setSortBy(option);
      setSortOrder(option === 'name' ? 'asc' : 'desc');
    }
  };

  const resetFilters = () => {
    setSelectedCountry(null);
    setSearchQuery('');
    setSortBy('name');
    setSortOrder('asc');
  };

  return (
    <div className="space-y-6">
      {/* Desktop Filters */}
      <div className="bg-base-100 p-4 rounded-xl border shadow-sm hidden md:block">
        <div className="mb-6 grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="md:col-span-2">
            <label className="block text-sm font-medium mb-2 flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              Search Universities
            </label>
            <SearchBar 
              onSearch={setSearchQuery}
              initialValue={searchQuery}
              placeholder="Search by name, city, country, or type..."
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-2 flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              Filter by Country
            </label>
            <CountryFilter 
              countries={countryOptions}
              selectedCountry={selectedCountry}
              onChange={setSelectedCountry}
            />
          </div>
        </div>
        
        <div className="flex flex-wrap justify-between items-center gap-4">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1">
              <button 
                onClick={() => setViewMode('grid')}
                className={`p-1.5 rounded-md transition-colors ${
                  viewMode === 'grid' ? 'bg-primary text-primary-foreground' : 'bg-base-200 hover:bg-base-300 text-muted-foreground'
                }`}
                title="Grid view"
              >
                <GridIcon className="h-4 w-4" />
              </button>
              <button 
                onClick={() => setViewMode('list')}
                className={`p-1.5 rounded-md transition-colors ${
                  viewMode === 'list' ? 'bg-primary text-primary-foreground' : 'bg-base-200 hover:bg-base-300 text-muted-foreground'
                }`}
                title="List view"
              >
                <ListIcon className="h-4 w-4" />
              </button>
            </div>
            
            <div className="text-sm text-muted-foreground">
              <span className="font-medium">{filteredUniversities.length}</span> {filteredUniversities.length === 1 ? 'university' : 'universities'} found
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1.5">
              <span className="text-sm font-medium">Sort:</span>
              <div className="dropdown dropdown-end">
                <div tabIndex={0} role="button" className="btn btn-sm btn-ghost gap-1 h-8 min-h-8 px-2">
                  {sortBy === 'name' ? 'Name' : sortBy === 'rating' ? 'Rating' : 'Reviews'}
                  <span className="text-xs opacity-60">{sortOrder === 'asc' ? '↑' : '↓'}</span>
                  <ChevronDownIcon className="h-3 w-3 opacity-60" />
                </div>
                <ul tabIndex={0} className="dropdown-content z-[1] menu p-1 shadow-lg bg-base-100 rounded-lg border w-40">
                  <li>
                    <button 
                      onClick={() => handleSort('name')}
                      className={sortBy === 'name' ? 'active font-medium' : ''}
                    >
                      Name {sortBy === 'name' && (sortOrder === 'asc' ? '↑' : '↓')}
                    </button>
                  </li>
                  <li>
                    <button 
                      onClick={() => handleSort('rating')}
                      className={sortBy === 'rating' ? 'active font-medium' : ''}
                    >
                      Rating {sortBy === 'rating' && (sortOrder === 'asc' ? '↑' : '↓')}
                    </button>
                  </li>
                  <li>
                    <button 
                      onClick={() => handleSort('reviews')}
                      className={sortBy === 'reviews' ? 'active font-medium' : ''}
                    >
                      Reviews {sortBy === 'reviews' && (sortOrder === 'asc' ? '↑' : '↓')}
                    </button>
                  </li>
                </ul>
              </div>
            </div>
            
            {(selectedCountry || searchQuery || sortBy !== 'name' || sortOrder !== 'asc') && (
              <button 
                onClick={resetFilters}
                className="btn btn-sm btn-outline gap-1 h-8 min-h-8 border-muted-foreground/30 hover:bg-base-200 hover:border-base-content hover:text-base-content"
              >
                <XCircleIcon className="h-3 w-3" />
                Reset filters
              </button>
            )}
          </div>
        </div>
      </div>
      
      {/* Mobile Filters Button */}
      <div className="bg-base-100 p-3 rounded-xl border shadow-sm flex justify-between items-center sticky top-16 z-20 md:hidden">
        <div className="text-sm">
          <span className="font-medium">{filteredUniversities.length}</span> {filteredUniversities.length === 1 ? 'university' : 'universities'}
        </div>
        <div className="flex gap-2">
          <button 
            onClick={() => setShowMobileFilters(true)}
            className={`btn btn-sm gap-1.5 ${activeFilters.length > 0 ? 'btn-primary' : 'btn-outline'}`}
          >
            <FilterIcon className="h-3.5 w-3.5" />
            Filters
            {activeFilters.length > 0 && (
              <div className="badge badge-sm">{activeFilters.length}</div>
            )}
          </button>
          <div className="dropdown dropdown-end">
            <div tabIndex={0} role="button" className="btn btn-sm btn-outline gap-1">
              <SliderIcon className="h-3.5 w-3.5" />
              Sort
            </div>
            <ul tabIndex={0} className="dropdown-content z-[1] menu p-1 shadow-lg bg-base-100 rounded-lg border w-40">
              <li>
                <button 
                  onClick={() => handleSort('name')}
                  className={sortBy === 'name' ? 'active font-medium' : ''}
                >
                  Name {sortBy === 'name' && (sortOrder === 'asc' ? '↑' : '↓')}
                </button>
              </li>
              <li>
                <button 
                  onClick={() => handleSort('rating')}
                  className={sortBy === 'rating' ? 'active font-medium' : ''}
                >
                  Rating {sortBy === 'rating' && (sortOrder === 'asc' ? '↑' : '↓')}
                </button>
              </li>
              <li>
                <button 
                  onClick={() => handleSort('reviews')}
                  className={sortBy === 'reviews' ? 'active font-medium' : ''}
                >
                  Reviews {sortBy === 'reviews' && (sortOrder === 'asc' ? '↑' : '↓')}
                </button>
              </li>
            </ul>
          </div>
        </div>
      </div>
      
      {/* Mobile Filters Modal */}
      {showMobileFilters && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-end md:hidden">
          <div className="bg-base-100 rounded-t-xl p-4 w-full max-h-[90vh] overflow-auto">
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-bold text-lg">Filters</h3>
              <button 
                onClick={() => setShowMobileFilters(false)}
                className="btn btn-sm btn-ghost"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">Search</label>
                <SearchBar 
                  onSearch={setSearchQuery}
                  initialValue={searchQuery}
                  placeholder="Search universities..."
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-2">Country</label>
                <CountryFilter 
                  countries={countryOptions}
                  selectedCountry={selectedCountry}
                  onChange={setSelectedCountry}
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-2">View Mode</label>
                <div className="flex gap-2">
                  <button 
                    onClick={() => setViewMode('grid')}
                    className={`flex-1 py-2 px-3 rounded-lg border flex items-center justify-center gap-2 ${
                      viewMode === 'grid' 
                        ? 'bg-primary/10 border-primary text-primary' 
                        : 'border-base-300'
                    }`}
                  >
                    <GridIcon className="h-4 w-4" />
                    Grid
                  </button>
                  <button 
                    onClick={() => setViewMode('list')}
                    className={`flex-1 py-2 px-3 rounded-lg border flex items-center justify-center gap-2 ${
                      viewMode === 'list' 
                        ? 'bg-primary/10 border-primary text-primary' 
                        : 'border-base-300'
                    }`}
                  >
                    <ListIcon className="h-4 w-4" />
                    List
                  </button>
                </div>
              </div>
            </div>
            
            <div className="mt-6 flex gap-2">
              {(selectedCountry || searchQuery) && (
                <button 
                  onClick={resetFilters}
                  className="btn btn-outline flex-1"
                >
                  Reset filters
                </button>
              )}
              <button 
                onClick={() => setShowMobileFilters(false)}
                className="btn btn-primary flex-1"
              >
                Apply filters
              </button>
            </div>
          </div>
        </div>
      )}
      
      {isLoading ? (
        <div className={`grid gap-6 ${
          viewMode === 'grid' 
            ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3' 
            : 'grid-cols-1'
        }`}>
          {[...Array(6)].map((_, i) => (
            <div key={i} className="card bg-base-100 border animate-pulse">
              <div className="card-body">
                <div className="flex items-center gap-4">
                  <div className="h-16 w-16 bg-base-200 rounded-md"></div>
                  <div className="space-y-2">
                    <div className="h-5 bg-base-200 rounded w-36"></div>
                    <div className="h-3 bg-base-200 rounded w-24"></div>
                  </div>
                </div>
                <div className="mt-4 flex items-center justify-between">
                  <div className="h-4 bg-base-200 rounded w-24"></div>
                  <div className="h-3 bg-base-200 rounded w-16"></div>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : filteredUniversities.length === 0 ? (
        <div className="text-center py-12 bg-base-100 rounded-lg border">
          <div className="max-w-md mx-auto">
            <div className="bg-base-200 h-24 w-24 rounded-full flex items-center justify-center mx-auto mb-6">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-muted-foreground" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h3 className="text-xl font-medium mb-2">No universities found</h3>
            <p className="text-muted-foreground mb-4">We couldn't find any universities matching your search criteria.</p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
              <button 
                onClick={resetFilters}
                className="btn btn-primary"
              >
                Reset filters
              </button>
              <button 
                onClick={() => setShowSuggestionModal(true)}
                className="btn btn-outline btn-secondary gap-2"
              >
                <PlusIcon className="h-4 w-4" />
                Suggest a university
              </button>
            </div>
          </div>
        </div>
      ) : (
        <>
          {/* Grid View */}
          {viewMode === 'grid' && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredUniversities.map((university) => (
                <UniversityCard key={university.id} university={university} />
              ))}
            </div>
          )}
          
          {/* List View */}
          {viewMode === 'list' && (
            <div className="space-y-4">
              {filteredUniversities.map((university) => (
                <div key={university.id} className="bg-base-100 rounded-xl border hover:shadow-md transition-shadow hover:border-primary/20">
                  <div className="p-4 flex gap-4">
                    <div className="flex-shrink-0">
                      <div className="h-20 w-20 bg-base-200 rounded-lg flex items-center justify-center overflow-hidden relative shadow-sm">
                        {university.logo_url ? (
                          <img 
                            src={university.logo_url} 
                            alt={`${university.name} logo`} 
                            className="object-cover w-full h-full"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center bg-primary/10">
                            <span className="text-3xl font-bold text-primary">{university.name.charAt(0)}</span>
                          </div>
                        )}
                        {university.country_code && (
                          <div className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full overflow-hidden border-2 border-white shadow-sm">
                            <img 
                              src={`https://flagcdn.com/w20/${university.country_code.toLowerCase()}.png`}
                              alt={university.country}
                              className="object-cover w-full h-full"
                            />
                          </div>
                        )}
                      </div>
                    </div>
                    
                    <div className="flex-1">
                      <div className="flex flex-wrap justify-between gap-2">
                        <h3 className="text-lg font-semibold">{university.name}</h3>
                        <div className="flex items-center gap-1 bg-base-100 px-2 py-1 rounded-lg shadow-sm">
                          <div className="flex items-center">
                            {Array(5).fill(0).map((_, i) => (
                              <svg 
                                key={i}
                                xmlns="http://www.w3.org/2000/svg"
                                className={`w-3.5 h-3.5 ${
                                  i < Math.floor(university.avg_rating) 
                                    ? 'text-yellow-400 fill-yellow-400' 
                                    : i < university.avg_rating
                                      ? 'text-yellow-400 fill-yellow-400 opacity-60'
                                      : 'text-gray-300'
                                }`}
                                viewBox="0 0 20 20"
                              >
                                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                              </svg>
                            ))}
                          </div>
                          <span className="text-xs font-medium">{university.avg_rating.toFixed(1)}</span>
                          <span className="text-xs text-muted-foreground">({university.review_count})</span>
                        </div>
                      </div>
                      <p className="text-sm text-muted-foreground flex items-center gap-1.5 mt-1">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5 text-muted-foreground/70" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        {university.city ? `${university.city}, ` : ''}{university.country}
                      </p>
                      
                      <div className="mt-2 flex flex-wrap gap-2">
                        {university.type && (
                          <div className="text-xs px-2 py-1 bg-base-200 rounded-full">
                            <span className="font-medium">{university.type}</span>
                          </div>
                        )}
                        {university.established && (
                          <div className="text-xs px-2 py-1 bg-base-200 rounded-full">
                            <span className="font-medium">Est. {university.established}</span>
                          </div>
                        )}
                      </div>
                      
                      {university.description && (
                        <p className="text-sm mt-2 line-clamp-1 text-muted-foreground">{university.description}</p>
                      )}
                      
                      <div className="mt-3 flex justify-end">
                        <a 
                          href={university.slug ? `/universities/${university.slug}` : `/universities/${university.id}`}
                          className="btn btn-sm btn-ghost text-primary hover:bg-primary/10"
                        >
                          View details
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                          </svg>
                        </a>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </>
      )}

      {/* Use the separate SuggestionModal component */}
      <SuggestionModal 
        isOpen={showSuggestionModal}
        onClose={() => setShowSuggestionModal(false)}
      />
    </div>
  );
}