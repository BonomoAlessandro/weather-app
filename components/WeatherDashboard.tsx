'use client';

import { useState } from 'react';
import { CityProvider, useCities } from '@/context/CityContext';
import { getDominantTheme } from '@/lib/weather-utils';
import { CityWeatherData, WeatherTheme } from '@/types/weather';
import { Header } from './Header';
import { Footer } from './Footer';
import { CityGrid } from './CityGrid';
import { LoadingCard } from './LoadingCard';
import { SettingsButton, SettingsModal } from './settings';

const backgroundGradients: Record<WeatherTheme, string> = {
  sunny: 'from-amber-200 via-orange-100 to-yellow-50',
  cloudy: 'from-slate-300 via-gray-200 to-zinc-100',
  rainy: 'from-blue-300 via-cyan-200 to-sky-100',
  stormy: 'from-slate-700 via-purple-800 to-slate-900',
  snowy: 'from-sky-100 via-blue-50 to-white',
  misty: 'from-gray-300 via-slate-200 to-zinc-100',
  night: 'from-indigo-900 via-slate-800 to-violet-900',
};

function DashboardContent() {
  const { weatherData, isLoading, isInitialized, cities } = useCities();
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  // Get successful weather data for theme calculation
  const successfulWeather = weatherData
    .filter((r): r is { success: true; data: CityWeatherData } => r.success)
    .map((r) => r.data);

  // Determine dominant theme for page background
  const dominantTheme = getDominantTheme(successfulWeather);
  const bgGradient = backgroundGradients[dominantTheme];

  const showLoading = !isInitialized || (isLoading && weatherData.length === 0);

  return (
    <div
      className={`
        min-h-screen
        bg-gradient-to-br ${bgGradient}
        weather-gradient
      `}
    >
      {/* Settings Button - Fixed Position */}
      <div className="fixed top-4 right-4 z-40">
        <SettingsButton onClick={() => setIsSettingsOpen(true)} />
      </div>

      <Header theme={dominantTheme} />

      <main className="pb-12">
        {showLoading ? (
          <div
            className="
              grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3
              gap-6 md:gap-8
              w-full max-w-7xl mx-auto
              px-4 sm:px-6 lg:px-8
            "
          >
            {Array.from({ length: cities.length || 5 }).map((_, index) => (
              <LoadingCard key={index} index={index} />
            ))}
          </div>
        ) : weatherData.length === 0 ? (
          <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center py-16">
              <p className="text-slate-600 text-lg mb-4">No cities to display</p>
              <button
                onClick={() => setIsSettingsOpen(true)}
                className="
                  px-6 py-3
                  bg-white/80 hover:bg-white
                  text-slate-800 font-medium
                  rounded-xl shadow-lg
                  transition-all duration-200
                  hover:scale-105
                "
              >
                Add your first city
              </button>
            </div>
          </div>
        ) : (
          <CityGrid results={weatherData} />
        )}
      </main>

      <Footer theme={dominantTheme} />

      {/* Settings Modal */}
      <SettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
      />
    </div>
  );
}

export function WeatherDashboard() {
  return (
    <CityProvider>
      <DashboardContent />
    </CityProvider>
  );
}
