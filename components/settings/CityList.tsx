'use client';

import { useCities } from '@/context/CityContext';

export function CityList() {
  const { cities, removeCity, resetToDefaults } = useCities();

  return (
    <div>
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-sm font-medium text-slate-700">Your cities</h3>
        <span className="text-xs text-slate-400">{cities.length} cities</span>
      </div>

      {cities.length === 0 ? (
        <div className="py-8 text-center">
          <p className="text-slate-500 mb-4">No cities added yet</p>
          <button
            onClick={resetToDefaults}
            className="
              px-4 py-2
              text-sm font-medium
              text-blue-600 hover:text-blue-700
              hover:bg-blue-50
              rounded-lg
              transition-colors duration-200
            "
          >
            Load default cities
          </button>
        </div>
      ) : (
        <>
          <div
            className="
              bg-white/50 rounded-xl
              border border-slate-200
              divide-y divide-slate-100
              max-h-72 overflow-y-auto
            "
          >
            {cities.map((city) => (
              <div
                key={`${city.name}-${city.latitude}-${city.longitude}`}
                className="
                  flex items-center justify-between
                  px-4 py-3
                  group
                  hover:bg-white/80
                  transition-colors duration-150
                "
              >
                <div className="flex items-center gap-3">
                  <span className="font-medium text-slate-800">{city.name}</span>
                  <span className="text-sm text-slate-400">{city.country}</span>
                </div>
                <button
                  onClick={() => removeCity(city.name)}
                  className="
                    p-1.5 rounded-lg
                    text-slate-400 hover:text-red-500
                    hover:bg-red-50
                    opacity-0 group-hover:opacity-100
                    transition-all duration-200
                  "
                  aria-label={`Remove ${city.name}`}
                  title={`Remove ${city.name}`}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={2}
                    stroke="currentColor"
                    className="w-4 h-4"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M6 18 18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              </div>
            ))}
          </div>

          <div className="mt-4 pt-4 border-t border-slate-200">
            <button
              onClick={resetToDefaults}
              className="
                w-full px-4 py-2.5
                text-sm font-medium
                text-slate-600 hover:text-slate-800
                bg-slate-100 hover:bg-slate-200
                rounded-xl
                transition-colors duration-200
              "
            >
              Reset to default cities
            </button>
          </div>
        </>
      )}
    </div>
  );
}
