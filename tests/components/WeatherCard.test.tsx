import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import { WeatherCard } from '@/components/WeatherCard';
import { createMockWeatherData } from '../mocks/weather-data';

describe('WeatherCard', () => {
  beforeEach(() => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date('2024-01-15T14:30:00Z'));
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  describe('content rendering', () => {
    it('displays city name', () => {
      const weather = createMockWeatherData({ city: 'Tokyo' });
      render(<WeatherCard weather={weather} />);
      expect(screen.getByText('Tokyo')).toBeInTheDocument();
    });

    it('displays country code', () => {
      const weather = createMockWeatherData({ country: 'JP' });
      render(<WeatherCard weather={weather} />);
      expect(screen.getByText('JP')).toBeInTheDocument();
    });

    it('displays formatted temperature', () => {
      const weather = createMockWeatherData({ temperature: 25 });
      render(<WeatherCard weather={weather} />);
      expect(screen.getByText('25°')).toBeInTheDocument();
    });

    it('displays temperature unit', () => {
      const weather = createMockWeatherData({ temperature: 25 });
      render(<WeatherCard weather={weather} />);
      expect(screen.getByText('C')).toBeInTheDocument();
    });

    it('displays weather description', () => {
      const weather = createMockWeatherData({
        weatherDescription: 'Partly cloudy',
      });
      render(<WeatherCard weather={weather} />);
      expect(screen.getByText('Partly cloudy')).toBeInTheDocument();
    });

    it('displays local time for valid timezone', () => {
      const weather = createMockWeatherData({ timezone: 'UTC' });
      render(<WeatherCard weather={weather} />);
      // Should show 2:30 PM for UTC when system time is 14:30 UTC
      expect(screen.getByText(/2:30\s?PM/i)).toBeInTheDocument();
    });

    it('handles invalid timezone gracefully (no time shown)', () => {
      const weather = createMockWeatherData({ timezone: 'Invalid/Timezone' });
      render(<WeatherCard weather={weather} />);
      // City name should still be present
      expect(screen.getByText('Test City')).toBeInTheDocument();
    });
  });

  describe('weather details', () => {
    it('passes humidity to WeatherDetails', () => {
      const weather = createMockWeatherData({ humidity: 75 });
      render(<WeatherCard weather={weather} />);
      expect(screen.getByText('75%')).toBeInTheDocument();
    });

    it('passes wind speed to WeatherDetails', () => {
      const weather = createMockWeatherData({ windSpeed: 15 });
      render(<WeatherCard weather={weather} />);
      expect(screen.getByText('15 km/h')).toBeInTheDocument();
    });

    it('passes feels like to WeatherDetails', () => {
      const weather = createMockWeatherData({ feelsLike: 22 });
      render(<WeatherCard weather={weather} />);
      expect(screen.getByText('22°C')).toBeInTheDocument();
    });
  });

  describe('theme application', () => {
    it('applies sunny theme styles for clear weather (code 0)', () => {
      const weather = createMockWeatherData({ weatherCode: 0 });
      const { container } = render(<WeatherCard weather={weather} />);
      const card = container.firstChild as HTMLElement;
      expect(card.className).toContain('from-amber');
    });

    it('applies cloudy theme styles for overcast (code 3)', () => {
      const weather = createMockWeatherData({ weatherCode: 3 });
      const { container } = render(<WeatherCard weather={weather} />);
      const card = container.firstChild as HTMLElement;
      expect(card.className).toContain('from-slate');
    });

    it('applies rainy theme styles for rain (code 61)', () => {
      const weather = createMockWeatherData({ weatherCode: 61 });
      const { container } = render(<WeatherCard weather={weather} />);
      const card = container.firstChild as HTMLElement;
      expect(card.className).toContain('from-blue');
    });

    it('applies stormy theme styles for thunderstorm (code 95)', () => {
      const weather = createMockWeatherData({ weatherCode: 95 });
      const { container } = render(<WeatherCard weather={weather} />);
      const card = container.firstChild as HTMLElement;
      expect(card.className).toContain('from-slate-800');
    });

    it('applies snowy theme styles for snow (code 71)', () => {
      const weather = createMockWeatherData({ weatherCode: 71 });
      const { container } = render(<WeatherCard weather={weather} />);
      const card = container.firstChild as HTMLElement;
      expect(card.className).toContain('from-sky');
    });

    it('applies misty theme styles for fog (code 45)', () => {
      const weather = createMockWeatherData({ weatherCode: 45 });
      const { container } = render(<WeatherCard weather={weather} />);
      const card = container.firstChild as HTMLElement;
      expect(card.className).toContain('from-gray');
    });
  });

  describe('animation', () => {
    it('applies animation delay based on index', () => {
      const weather = createMockWeatherData();
      const { container } = render(<WeatherCard weather={weather} index={2} />);
      const card = container.firstChild as HTMLElement;
      expect(card.style.animationDelay).toBe('160ms'); // 2 * 80ms
    });

    it('defaults to 0ms delay when no index provided', () => {
      const weather = createMockWeatherData();
      const { container } = render(<WeatherCard weather={weather} />);
      const card = container.firstChild as HTMLElement;
      expect(card.style.animationDelay).toBe('0ms');
    });

    it('applies fadeInUp animation', () => {
      const weather = createMockWeatherData();
      const { container } = render(<WeatherCard weather={weather} />);
      const card = container.firstChild as HTMLElement;
      expect(card.style.animation).toContain('fadeInUp');
    });
  });

  describe('edge cases', () => {
    it('handles negative temperatures', () => {
      const weather = createMockWeatherData({ temperature: -15 });
      render(<WeatherCard weather={weather} />);
      expect(screen.getByText('-15°')).toBeInTheDocument();
    });

    it('handles zero temperature', () => {
      const weather = createMockWeatherData({ temperature: 0 });
      render(<WeatherCard weather={weather} />);
      expect(screen.getByText('0°')).toBeInTheDocument();
    });

    it('handles special characters in city name', () => {
      const weather = createMockWeatherData({ city: 'Zürich' });
      render(<WeatherCard weather={weather} />);
      expect(screen.getByText('Zürich')).toBeInTheDocument();
    });
  });
});
