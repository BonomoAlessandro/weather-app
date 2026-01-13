'use client';

import { CityWeatherData } from '@/types/weather';
import {
  getWeatherTheme,
  formatTemperature,
  formatLocalTime,
} from '@/lib/weather-utils';
import { WeatherDetails } from './WeatherDetails';
import { WeatherIcon } from './WeatherIcon';

interface WeatherCardProps {
  weather: CityWeatherData;
  index?: number;
}

const themeStyles = {
  sunny: {
    card: 'bg-gradient-to-br from-amber-50 to-orange-50',
    border: 'border-amber-200/60',
    text: 'text-amber-950',
    textSecondary: 'text-amber-700',
    icon: 'text-amber-500',
  },
  cloudy: {
    card: 'bg-gradient-to-br from-slate-50 to-gray-100',
    border: 'border-slate-200/60',
    text: 'text-slate-900',
    textSecondary: 'text-slate-600',
    icon: 'text-slate-400',
  },
  rainy: {
    card: 'bg-gradient-to-br from-blue-50 to-cyan-50',
    border: 'border-blue-200/60',
    text: 'text-blue-950',
    textSecondary: 'text-blue-700',
    icon: 'text-blue-500',
  },
  stormy: {
    card: 'bg-gradient-to-br from-slate-800 to-purple-900',
    border: 'border-purple-500/30',
    text: 'text-white',
    textSecondary: 'text-purple-200',
    icon: 'text-purple-300',
  },
  snowy: {
    card: 'bg-gradient-to-br from-sky-50 to-blue-50',
    border: 'border-sky-200/60',
    text: 'text-sky-950',
    textSecondary: 'text-sky-700',
    icon: 'text-sky-400',
  },
  misty: {
    card: 'bg-gradient-to-br from-gray-100 to-slate-100',
    border: 'border-gray-200/60',
    text: 'text-gray-900',
    textSecondary: 'text-gray-600',
    icon: 'text-gray-400',
  },
  night: {
    card: 'bg-gradient-to-br from-indigo-950 to-slate-900',
    border: 'border-indigo-500/30',
    text: 'text-white',
    textSecondary: 'text-indigo-200',
    icon: 'text-indigo-300',
  },
};

export function WeatherCard({ weather, index = 0 }: WeatherCardProps) {
  const theme = getWeatherTheme(weather.weatherCode);
  const styles = themeStyles[theme];
  const localTime = formatLocalTime(weather.timezone);

  return (
    <div
      className={`
        relative overflow-hidden rounded-2xl
        ${styles.card} ${styles.border}
        border shadow-sm
        transition-shadow duration-300
        hover:shadow-md
      `}
      style={{
        animationDelay: `${index * 80}ms`,
        animation: 'fadeInUp 0.5s ease-out backwards',
      }}
    >
      <div className="p-6">
        {/* Header: City, Country & Time */}
        <div className="flex items-start justify-between mb-6">
          <div>
            <h2 className={`text-xl font-semibold tracking-tight ${styles.text}`}>
              {weather.city}
            </h2>
            <div className={`flex items-center gap-2 mt-0.5 ${styles.textSecondary}`}>
              <span className="text-sm font-medium">{weather.country}</span>
              {localTime && (
                <>
                  <span className="text-xs opacity-40">•</span>
                  <span className="text-sm tabular-nums">{localTime}</span>
                </>
              )}
            </div>
          </div>

          {/* Weather icon */}
          <div className={`w-14 h-14 ${styles.icon}`}>
            <WeatherIcon theme={theme} className="w-full h-full" />
          </div>
        </div>

        {/* Temperature */}
        <div className="mb-6">
          <div className={`text-6xl font-light tracking-tight ${styles.text}`}>
            {formatTemperature(weather.temperature)}
            <span className="text-3xl font-normal ml-0.5">C</span>
          </div>
          <p className={`text-sm ${styles.textSecondary} mt-1 capitalize`}>
            {weather.weatherDescription}
          </p>
        </div>

        {/* Weather Details */}
        <WeatherDetails
          humidity={weather.humidity}
          windSpeed={weather.windSpeed}
          feelsLike={weather.feelsLike}
          theme={theme}
        />
      </div>
    </div>
  );
}
