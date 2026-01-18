import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import { CityGrid } from '@/components/CityGrid';
import { CityProvider } from '@/context/CityContext';
import { fetchWeatherForCities } from '@/lib/weather-api';
import { loadCities } from '@/lib/storage';
import {
  createMockWeatherData,
  createSuccessResult,
  createErrorResult,
  createMockCityConfig,
} from '../mocks/weather-data';
import type { ReactNode } from 'react';

vi.mock('@/lib/weather-api', () => ({
  fetchWeatherForCities: vi.fn(),
}));

vi.mock('@/lib/storage', () => ({
  loadCities: vi.fn(),
  saveCities: vi.fn(),
}));

const mockFetchWeatherForCities = fetchWeatherForCities as ReturnType<typeof vi.fn>;
const mockLoadCities = loadCities as ReturnType<typeof vi.fn>;

function Wrapper({ children }: { children: ReactNode }) {
  return <CityProvider>{children}</CityProvider>;
}

describe('CityGrid', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  describe('success results', () => {
    it('renders WeatherCard for each successful result', async () => {
      const cities = [
        createMockCityConfig({ name: 'London', latitude: 51.5, longitude: -0.1 }),
        createMockCityConfig({ name: 'Paris', latitude: 48.8, longitude: 2.3 }),
      ];
      const results = [
        createSuccessResult(createMockWeatherData({ city: 'London' })),
        createSuccessResult(createMockWeatherData({ city: 'Paris' })),
      ];

      mockLoadCities.mockReturnValue(cities);
      mockFetchWeatherForCities.mockResolvedValue(results);

      render(<CityGrid />, { wrapper: Wrapper });

      await waitFor(() => {
        expect(screen.getByText('London')).toBeInTheDocument();
        expect(screen.getByText('Paris')).toBeInTheDocument();
      });
    });

    it('displays weather data for successful cities', async () => {
      const cities = [
        createMockCityConfig({ name: 'Tokyo', latitude: 35.6, longitude: 139.6 }),
      ];
      const results = [
        createSuccessResult(
          createMockWeatherData({
            city: 'Tokyo',
            temperature: 25,
            weatherDescription: 'Clear sky',
          })
        ),
      ];

      mockLoadCities.mockReturnValue(cities);
      mockFetchWeatherForCities.mockResolvedValue(results);

      render(<CityGrid />, { wrapper: Wrapper });

      await waitFor(() => {
        expect(screen.getByText('Tokyo')).toBeInTheDocument();
        expect(screen.getByText('25°')).toBeInTheDocument();
        expect(screen.getByText('Clear sky')).toBeInTheDocument();
      });
    });
  });

  describe('error results', () => {
    it('renders ErrorCard for failed results', async () => {
      const cities = [
        createMockCityConfig({ name: 'Berlin', latitude: 52.5, longitude: 13.4 }),
      ];
      const results = [createErrorResult('Berlin', 'Network timeout')];

      mockLoadCities.mockReturnValue(cities);
      mockFetchWeatherForCities.mockResolvedValue(results);

      render(<CityGrid />, { wrapper: Wrapper });

      await waitFor(() => {
        expect(screen.getByText('Berlin')).toBeInTheDocument();
        expect(screen.getByText('Network timeout')).toBeInTheDocument();
      });
    });

    it('shows error UI elements', async () => {
      const cities = [
        createMockCityConfig({ name: 'Sydney', latitude: -33.8, longitude: 151.2 }),
      ];
      const results = [createErrorResult('Sydney', 'API error')];

      mockLoadCities.mockReturnValue(cities);
      mockFetchWeatherForCities.mockResolvedValue(results);

      render(<CityGrid />, { wrapper: Wrapper });

      await waitFor(() => {
        expect(
          screen.getByText('Unable to load weather data')
        ).toBeInTheDocument();
        expect(
          screen.getByText('Refresh the page to try again')
        ).toBeInTheDocument();
      });
    });
  });

  describe('mixed results', () => {
    it('renders appropriate card type for each result', async () => {
      const cities = [
        createMockCityConfig({ name: 'London', latitude: 51.5, longitude: -0.1 }),
        createMockCityConfig({ name: 'Paris', latitude: 48.8, longitude: 2.3 }),
        createMockCityConfig({ name: 'Tokyo', latitude: 35.6, longitude: 139.6 }),
      ];
      const results = [
        createSuccessResult(createMockWeatherData({ city: 'London' })),
        createErrorResult('Paris', 'API error'),
        createSuccessResult(createMockWeatherData({ city: 'Tokyo' })),
      ];

      mockLoadCities.mockReturnValue(cities);
      mockFetchWeatherForCities.mockResolvedValue(results);

      render(<CityGrid />, { wrapper: Wrapper });

      await waitFor(() => {
        // Success cities
        expect(screen.getByText('London')).toBeInTheDocument();
        expect(screen.getByText('Tokyo')).toBeInTheDocument();

        // Error city
        expect(screen.getByText('Paris')).toBeInTheDocument();
        expect(screen.getByText('API error')).toBeInTheDocument();
      });
    });
  });

  describe('empty results', () => {
    it('renders empty grid with no cards', async () => {
      mockLoadCities.mockReturnValue([]);
      mockFetchWeatherForCities.mockResolvedValue([]);

      const { container } = render(<CityGrid />, { wrapper: Wrapper });

      await waitFor(() => {
        // The DndContext wraps the grid, so we need to find the grid inside
        const grid = container.querySelector('.grid');
        expect(grid?.childNodes).toHaveLength(0);
      });
    });
  });

  describe('grid structure', () => {
    it('renders cards inside grid container', async () => {
      const cities = [
        createMockCityConfig({ name: 'City1', latitude: 1, longitude: 1 }),
        createMockCityConfig({ name: 'City2', latitude: 2, longitude: 2 }),
        createMockCityConfig({ name: 'City3', latitude: 3, longitude: 3 }),
      ];
      const results = [
        createSuccessResult(createMockWeatherData({ city: 'City1' })),
        createSuccessResult(createMockWeatherData({ city: 'City2' })),
        createSuccessResult(createMockWeatherData({ city: 'City3' })),
      ];

      mockLoadCities.mockReturnValue(cities);
      mockFetchWeatherForCities.mockResolvedValue(results);

      const { container } = render(<CityGrid />, { wrapper: Wrapper });

      await waitFor(() => {
        // The grid is wrapped by DndContext/SortableContext
        const grid = container.querySelector('.grid');
        expect(grid?.childNodes).toHaveLength(3);
      });
    });
  });
});
