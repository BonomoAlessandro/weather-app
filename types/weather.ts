// Open-Meteo API Response Types
export interface OpenMeteoResponse {
  latitude: number;
  longitude: number;
  generationtime_ms: number;
  utc_offset_seconds: number;
  timezone: string;
  timezone_abbreviation: string;
  elevation: number;
  current_units: CurrentUnits;
  current: CurrentWeather;
}

export interface CurrentUnits {
  time: string;
  interval: string;
  temperature_2m: string;
  relative_humidity_2m: string;
  apparent_temperature: string;
  weather_code: string;
  wind_speed_10m: string;
}

export interface CurrentWeather {
  time: string;
  interval: number;
  temperature_2m: number;
  relative_humidity_2m: number;
  apparent_temperature: number;
  weather_code: number;
  wind_speed_10m: number;
}

// Application Types
export interface CityConfig {
  name: string;
  country: string;
  latitude: number;
  longitude: number;
  timezone: string;
}

export interface CityWeatherData {
  city: string;
  country: string;
  timezone: string;
  temperature: number;
  feelsLike: number;
  humidity: number;
  windSpeed: number;
  weatherCode: number;
  weatherDescription: string;
  timestamp: string;
}

export type WeatherTheme =
  | 'sunny'
  | 'cloudy'
  | 'rainy'
  | 'stormy'
  | 'snowy'
  | 'misty'
  | 'night';

export interface WeatherThemeConfig {
  gradient: string;
  cardBg: string;
  textPrimary: string;
  textSecondary: string;
}

export type WeatherResult =
  | { success: true; data: CityWeatherData }
  | { success: false; city: string; error: string };

// Re-export geocoding types for convenience
export type { GeocodingResult } from '@/lib/geocoding-api';
