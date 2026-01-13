import {
  CityConfig,
  CityWeatherData,
  OpenMeteoResponse,
  WeatherResult,
} from '@/types/weather';
import { CACHE_DURATION, CITIES, WMO_CODES } from './constants';

const API_BASE_URL = 'https://api.open-meteo.com/v1/forecast';

export async function fetchWeatherForCity(
  city: CityConfig
): Promise<CityWeatherData> {
  const params = new URLSearchParams({
    latitude: city.latitude.toString(),
    longitude: city.longitude.toString(),
    current: [
      'temperature_2m',
      'relative_humidity_2m',
      'apparent_temperature',
      'weather_code',
      'wind_speed_10m',
    ].join(','),
    timezone: 'auto',
  });

  const url = `${API_BASE_URL}?${params}`;

  const response = await fetch(url, {
    next: { revalidate: CACHE_DURATION },
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch weather for ${city.name}: ${response.statusText}`);
  }

  const data: OpenMeteoResponse = await response.json();

  return transformWeatherData(data, city);
}

export async function fetchWeatherForAllCities(): Promise<WeatherResult[]> {
  const results = await Promise.allSettled(
    CITIES.map((city) => fetchWeatherForCity(city))
  );

  return results.map((result, index) => {
    if (result.status === 'fulfilled') {
      return { success: true as const, data: result.value };
    }
    return {
      success: false as const,
      city: CITIES[index].name,
      error: result.reason?.message || 'Unknown error',
    };
  });
}

function transformWeatherData(
  data: OpenMeteoResponse,
  city: CityConfig
): CityWeatherData {
  const weatherCode = data.current.weather_code;
  const weatherInfo = WMO_CODES[weatherCode] || {
    description: 'Unknown',
    theme: 'cloudy' as const,
  };

  return {
    city: city.name,
    country: city.country,
    timezone: city.timezone,
    temperature: Math.round(data.current.temperature_2m),
    feelsLike: Math.round(data.current.apparent_temperature),
    humidity: data.current.relative_humidity_2m,
    windSpeed: Math.round(data.current.wind_speed_10m * 10) / 10,
    weatherCode,
    weatherDescription: weatherInfo.description,
    timestamp: data.current.time,
  };
}
