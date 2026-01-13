import { CityConfig, WeatherTheme, WeatherThemeConfig } from '@/types/weather';

export const CITIES: CityConfig[] = [
  { name: 'Zürich', country: 'CH', latitude: 47.3769, longitude: 8.5417, timezone: 'Europe/Zurich' },
  { name: 'London', country: 'GB', latitude: 51.5074, longitude: -0.1278, timezone: 'Europe/London' },
  { name: 'New York', country: 'US', latitude: 40.7128, longitude: -74.006, timezone: 'America/New_York' },
  { name: 'Tokyo', country: 'JP', latitude: 35.6762, longitude: 139.6503, timezone: 'Asia/Tokyo' },
  { name: 'Cape Town', country: 'ZA', latitude: -33.9249, longitude: 18.4241, timezone: 'Africa/Johannesburg' },
];

export const WEATHER_THEMES: Record<WeatherTheme, WeatherThemeConfig> = {
  sunny: {
    gradient: 'from-amber-400 via-orange-300 to-yellow-200',
    cardBg: 'bg-white/80 backdrop-blur-md',
    textPrimary: 'text-amber-900',
    textSecondary: 'text-amber-700',
  },
  cloudy: {
    gradient: 'from-slate-400 via-gray-300 to-zinc-200',
    cardBg: 'bg-white/70 backdrop-blur-md',
    textPrimary: 'text-slate-800',
    textSecondary: 'text-slate-600',
  },
  rainy: {
    gradient: 'from-blue-600 via-blue-400 to-cyan-300',
    cardBg: 'bg-white/75 backdrop-blur-md',
    textPrimary: 'text-blue-900',
    textSecondary: 'text-blue-700',
  },
  stormy: {
    gradient: 'from-slate-800 via-purple-900 to-slate-700',
    cardBg: 'bg-white/20 backdrop-blur-md',
    textPrimary: 'text-white',
    textSecondary: 'text-slate-200',
  },
  snowy: {
    gradient: 'from-sky-100 via-blue-50 to-white',
    cardBg: 'bg-white/90 backdrop-blur-md',
    textPrimary: 'text-sky-900',
    textSecondary: 'text-sky-700',
  },
  misty: {
    gradient: 'from-gray-300 via-slate-200 to-zinc-100',
    cardBg: 'bg-white/60 backdrop-blur-md',
    textPrimary: 'text-gray-800',
    textSecondary: 'text-gray-600',
  },
  night: {
    gradient: 'from-slate-900 via-indigo-900 to-slate-800',
    cardBg: 'bg-white/10 backdrop-blur-md',
    textPrimary: 'text-white',
    textSecondary: 'text-indigo-200',
  },
};

// WMO Weather interpretation codes
// https://open-meteo.com/en/docs
export const WMO_CODES: Record<number, { description: string; theme: WeatherTheme }> = {
  0: { description: 'Clear sky', theme: 'sunny' },
  1: { description: 'Mainly clear', theme: 'sunny' },
  2: { description: 'Partly cloudy', theme: 'cloudy' },
  3: { description: 'Overcast', theme: 'cloudy' },
  45: { description: 'Fog', theme: 'misty' },
  48: { description: 'Depositing rime fog', theme: 'misty' },
  51: { description: 'Light drizzle', theme: 'rainy' },
  53: { description: 'Moderate drizzle', theme: 'rainy' },
  55: { description: 'Dense drizzle', theme: 'rainy' },
  56: { description: 'Light freezing drizzle', theme: 'rainy' },
  57: { description: 'Dense freezing drizzle', theme: 'rainy' },
  61: { description: 'Slight rain', theme: 'rainy' },
  63: { description: 'Moderate rain', theme: 'rainy' },
  65: { description: 'Heavy rain', theme: 'rainy' },
  66: { description: 'Light freezing rain', theme: 'rainy' },
  67: { description: 'Heavy freezing rain', theme: 'rainy' },
  71: { description: 'Slight snow fall', theme: 'snowy' },
  73: { description: 'Moderate snow fall', theme: 'snowy' },
  75: { description: 'Heavy snow fall', theme: 'snowy' },
  77: { description: 'Snow grains', theme: 'snowy' },
  80: { description: 'Slight rain showers', theme: 'rainy' },
  81: { description: 'Moderate rain showers', theme: 'rainy' },
  82: { description: 'Violent rain showers', theme: 'stormy' },
  85: { description: 'Slight snow showers', theme: 'snowy' },
  86: { description: 'Heavy snow showers', theme: 'snowy' },
  95: { description: 'Thunderstorm', theme: 'stormy' },
  96: { description: 'Thunderstorm with slight hail', theme: 'stormy' },
  99: { description: 'Thunderstorm with heavy hail', theme: 'stormy' },
};

export const CACHE_DURATION = 300; // 5 minutes in seconds
