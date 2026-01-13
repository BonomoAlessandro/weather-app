import { WeatherTheme, CityWeatherData } from '@/types/weather';
import { WMO_CODES, WEATHER_THEMES } from './constants';

export function getWeatherTheme(weatherCode: number): WeatherTheme {
  const weatherInfo = WMO_CODES[weatherCode];
  return weatherInfo?.theme || 'cloudy';
}

export function formatLocalTime(timezone: string): string {
  try {
    return new Intl.DateTimeFormat('en-US', {
      timeZone: timezone,
      hour: 'numeric',
      minute: '2-digit',
      hour12: true,
    }).format(new Date());
  } catch {
    return '';
  }
}

export function getDominantTheme(weatherData: CityWeatherData[]): WeatherTheme {
  if (weatherData.length === 0) return 'sunny';

  const themeCounts = weatherData.reduce(
    (acc, weather) => {
      const theme = getWeatherTheme(weather.weatherCode);
      acc[theme] = (acc[theme] || 0) + 1;
      return acc;
    },
    {} as Record<WeatherTheme, number>
  );

  const entries = Object.entries(themeCounts) as [WeatherTheme, number][];
  const dominant = entries.reduce((a, b) => (b[1] > a[1] ? b : a));
  return dominant[0];
}

export function formatTemperature(temp: number): string {
  return `${temp}°`;
}

export function formatWindSpeed(speed: number): string {
  return `${speed} km/h`;
}

export function formatHumidity(humidity: number): string {
  return `${humidity}%`;
}

export function getThemeConfig(theme: WeatherTheme) {
  return WEATHER_THEMES[theme];
}
