import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import { CityGrid } from '@/components/CityGrid';
import {
  createMockWeatherData,
  createSuccessResult,
  createErrorResult,
} from '../mocks/weather-data';

describe('CityGrid', () => {
  beforeEach(() => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date('2024-01-15T14:30:00Z'));
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  describe('success results', () => {
    it('renders WeatherCard for each successful result', () => {
      const results = [
        createSuccessResult(createMockWeatherData({ city: 'London' })),
        createSuccessResult(createMockWeatherData({ city: 'Paris' })),
      ];

      render(<CityGrid results={results} />);

      expect(screen.getByText('London')).toBeInTheDocument();
      expect(screen.getByText('Paris')).toBeInTheDocument();
    });

    it('displays weather data for successful cities', () => {
      const results = [
        createSuccessResult(
          createMockWeatherData({
            city: 'Tokyo',
            temperature: 25,
            weatherDescription: 'Clear sky',
          })
        ),
      ];

      render(<CityGrid results={results} />);

      expect(screen.getByText('Tokyo')).toBeInTheDocument();
      expect(screen.getByText('25°')).toBeInTheDocument();
      expect(screen.getByText('Clear sky')).toBeInTheDocument();
    });
  });

  describe('error results', () => {
    it('renders ErrorCard for failed results', () => {
      const results = [createErrorResult('Berlin', 'Network timeout')];

      render(<CityGrid results={results} />);

      expect(screen.getByText('Berlin')).toBeInTheDocument();
      expect(screen.getByText('Network timeout')).toBeInTheDocument();
    });

    it('shows error UI elements', () => {
      const results = [createErrorResult('Sydney', 'API error')];

      render(<CityGrid results={results} />);

      expect(
        screen.getByText('Unable to load weather data')
      ).toBeInTheDocument();
      expect(
        screen.getByText('Refresh the page to try again')
      ).toBeInTheDocument();
    });
  });

  describe('mixed results', () => {
    it('renders appropriate card type for each result', () => {
      const results = [
        createSuccessResult(createMockWeatherData({ city: 'London' })),
        createErrorResult('Paris', 'API error'),
        createSuccessResult(createMockWeatherData({ city: 'Tokyo' })),
      ];

      render(<CityGrid results={results} />);

      // Success cities
      expect(screen.getByText('London')).toBeInTheDocument();
      expect(screen.getByText('Tokyo')).toBeInTheDocument();

      // Error city
      expect(screen.getByText('Paris')).toBeInTheDocument();
      expect(screen.getByText('API error')).toBeInTheDocument();
    });
  });

  describe('empty results', () => {
    it('renders empty grid with no cards', () => {
      const { container } = render(<CityGrid results={[]} />);

      // Grid container should exist but be empty
      const grid = container.firstChild;
      expect(grid?.childNodes).toHaveLength(0);
    });
  });

  describe('grid structure', () => {
    it('renders cards inside grid container', () => {
      const results = [
        createSuccessResult(createMockWeatherData({ city: 'City1' })),
        createSuccessResult(createMockWeatherData({ city: 'City2' })),
        createSuccessResult(createMockWeatherData({ city: 'City3' })),
      ];

      const { container } = render(<CityGrid results={results} />);

      // Grid should have 3 children
      const grid = container.firstChild;
      expect(grid?.childNodes).toHaveLength(3);
    });
  });
});
