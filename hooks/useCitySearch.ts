'use client';

import { useState, useEffect } from 'react';
import { GeocodingResult, searchCities } from '@/lib/geocoding-api';
import { useDebounce } from './useDebounce';

interface UseCitySearchReturn {
  query: string;
  setQuery: (query: string) => void;
  results: GeocodingResult[];
  isLoading: boolean;
  error: string | null;
  clearResults: () => void;
}

export function useCitySearch(): UseCitySearchReturn {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<GeocodingResult[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const debouncedQuery = useDebounce(query, 300);

  useEffect(() => {
    if (debouncedQuery.trim().length < 2) {
      setResults([]);
      setError(null);
      return;
    }

    let cancelled = false;

    async function performSearch() {
      setIsLoading(true);
      setError(null);

      try {
        const searchResults = await searchCities(debouncedQuery);
        if (!cancelled) {
          setResults(searchResults);
        }
      } catch {
        if (!cancelled) {
          setError('Search failed. Please try again.');
          setResults([]);
        }
      } finally {
        if (!cancelled) {
          setIsLoading(false);
        }
      }
    }

    performSearch();

    return () => {
      cancelled = true;
    };
  }, [debouncedQuery]);

  const clearResults = () => {
    setQuery('');
    setResults([]);
    setError(null);
  };

  return {
    query,
    setQuery,
    results,
    isLoading,
    error,
    clearResults,
  };
}
