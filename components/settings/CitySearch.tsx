'use client';

import { useCitySearch } from '@/hooks';
import { useCities } from '@/context/CityContext';
import { geocodingResultToCity } from '@/lib/geocoding-api';
import { GeocodingResult } from '@/lib/geocoding-api';

export function CitySearch() {
  const { query, setQuery, results, isLoading, error, clearResults } =
    useCitySearch();
  const { cities, addCity } = useCities();

  const handleAddCity = (result: GeocodingResult) => {
    const city = geocodingResultToCity(result);
    addCity(city);
    clearResults();
  };

  // Filter out cities that are already added
  const filteredResults = results.filter((result) => {
    return !cities.some(
      (city) =>
        Math.abs(city.latitude - result.latitude) < 0.01 &&
        Math.abs(city.longitude - result.longitude) < 0.01
    );
  });

  return (
    <div className="mb-6">
      <label
        htmlFor="city-search"
        className="block text-sm font-medium text-slate-700 mb-2"
      >
        Add a city
      </label>
      <div className="relative">
        <div className="relative">
          <input
            id="city-search"
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search for a city..."
            className="
              w-full px-4 py-3 pl-10
              bg-white/50 border border-slate-200
              rounded-xl
              text-slate-800 placeholder-slate-400
              focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent
              transition-all duration-200
            "
          />
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z"
            />
          </svg>
          {isLoading && (
            <div className="absolute right-3 top-1/2 -translate-y-1/2">
              <div className="w-5 h-5 border-2 border-slate-300 border-t-blue-500 rounded-full animate-spin" />
            </div>
          )}
        </div>

        {/* Search Results Dropdown */}
        {(filteredResults.length > 0 || error) && query.length >= 2 && (
          <div
            className="
              absolute z-10 w-full mt-2
              bg-white/95 backdrop-blur-lg
              border border-slate-200
              rounded-xl shadow-lg
              max-h-64 overflow-y-auto
            "
          >
            {error ? (
              <div className="px-4 py-3 text-sm text-red-600">{error}</div>
            ) : filteredResults.length === 0 ? (
              <div className="px-4 py-3 text-sm text-slate-500">
                {results.length > 0
                  ? 'All matching cities are already added'
                  : 'No cities found'}
              </div>
            ) : (
              filteredResults.map((result) => (
                <button
                  key={result.id}
                  onClick={() => handleAddCity(result)}
                  className="
                    w-full px-4 py-3
                    flex items-center justify-between
                    hover:bg-blue-50
                    transition-colors duration-150
                    border-b border-slate-100 last:border-0
                    text-left
                  "
                >
                  <div>
                    <span className="font-medium text-slate-800">
                      {result.name}
                    </span>
                    {result.admin1 && (
                      <span className="text-slate-500">, {result.admin1}</span>
                    )}
                    <span className="text-slate-400 ml-1">
                      ({result.country_code})
                    </span>
                  </div>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={2}
                    stroke="currentColor"
                    className="w-5 h-5 text-blue-500"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M12 4.5v15m7.5-7.5h-15"
                    />
                  </svg>
                </button>
              ))
            )}
          </div>
        )}
      </div>
    </div>
  );
}
