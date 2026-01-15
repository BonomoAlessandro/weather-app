import type {
  CityConfig,
  CityWeatherData,
  OpenMeteoResponse,
  WeatherResult,
} from '@/types/weather';

export function createMockCityConfig(
  overrides: Partial<CityConfig> = {}
): CityConfig {
  return {
    name: 'Test City',
    country: 'TC',
    latitude: 0,
    longitude: 0,
    timezone: 'UTC',
    ...overrides,
  };
}

export function createMockWeatherData(
  overrides: Partial<CityWeatherData> = {}
): CityWeatherData {
  return {
    city: 'Test City',
    country: 'TC',
    timezone: 'UTC',
    temperature: 20,
    feelsLike: 18,
    humidity: 65,
    windSpeed: 12.5,
    weatherCode: 0,
    weatherDescription: 'Clear sky',
    timestamp: '2024-01-15T12:00',
    ...overrides,
  };
}

export function createMockApiResponse(
  overrides: Partial<OpenMeteoResponse> = {}
): OpenMeteoResponse {
  return {
    latitude: 0,
    longitude: 0,
    generationtime_ms: 0.1,
    utc_offset_seconds: 0,
    timezone: 'UTC',
    timezone_abbreviation: 'UTC',
    elevation: 100,
    current_units: {
      time: 'iso8601',
      interval: 'seconds',
      temperature_2m: '°C',
      relative_humidity_2m: '%',
      apparent_temperature: '°C',
      weather_code: 'wmo code',
      wind_speed_10m: 'km/h',
    },
    current: {
      time: '2024-01-15T12:00',
      interval: 900,
      temperature_2m: 20.5,
      relative_humidity_2m: 65,
      apparent_temperature: 18.2,
      weather_code: 0,
      wind_speed_10m: 12.3,
    },
    ...overrides,
  };
}

export function createSuccessResult(data: CityWeatherData): WeatherResult {
  return { success: true, data };
}

export function createErrorResult(city: string, error: string): WeatherResult {
  return { success: false, city, error };
}
