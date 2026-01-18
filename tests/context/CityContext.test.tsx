import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { renderHook, act, waitFor } from '@testing-library/react';
import { CityProvider, useCities } from '@/context/CityContext';
import { fetchWeatherForCities } from '@/lib/weather-api';
import { loadCities } from '@/lib/storage';
import { DEFAULT_CITIES } from '@/lib/constants';
import { createMockCityConfig, createSuccessResult, createMockWeatherData } from '../mocks/weather-data';
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

function createWrapper() {
  return function Wrapper({ children }: { children: ReactNode }) {
    return <CityProvider>{children}</CityProvider>;
  };
}

describe('CityContext API call optimization', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockLoadCities.mockReturnValue(null);
    mockFetchWeatherForCities.mockResolvedValue(
      DEFAULT_CITIES.map((city) =>
        createSuccessResult(createMockWeatherData({ city: city.name, country: city.country }))
      )
    );
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  describe('removeCity', () => {
    it('does not call API when removing a city', async () => {
      const { result } = renderHook(() => useCities(), {
        wrapper: createWrapper(),
      });

      await waitFor(() => {
        expect(result.current.isInitialized).toBe(true);
      });

      const initialCallCount = mockFetchWeatherForCities.mock.calls.length;

      act(() => {
        result.current.removeCity('London');
      });

      expect(mockFetchWeatherForCities).toHaveBeenCalledTimes(initialCallCount);
    });

    it('filters out the removed city from the cities list', async () => {
      const { result } = renderHook(() => useCities(), {
        wrapper: createWrapper(),
      });

      await waitFor(() => {
        expect(result.current.isInitialized).toBe(true);
      });

      const initialCityCount = result.current.cities.length;
      const hadLondon = result.current.cities.some((c) => c.name === 'London');

      act(() => {
        result.current.removeCity('London');
      });

      expect(result.current.cities.length).toBe(initialCityCount - 1);
      expect(result.current.cities.some((c) => c.name === 'London')).toBe(false);
      expect(hadLondon).toBe(true);
    });

    it('filters out weather data for the removed city', async () => {
      const { result } = renderHook(() => useCities(), {
        wrapper: createWrapper(),
      });

      await waitFor(() => {
        expect(result.current.isInitialized).toBe(true);
        expect(result.current.weatherData.length).toBeGreaterThan(0);
      });

      act(() => {
        result.current.removeCity('London');
      });

      const hasLondonWeather = result.current.weatherData.some(
        (r) => (r.success && r.data.city === 'London') || (!r.success && r.city === 'London')
      );
      expect(hasLondonWeather).toBe(false);
    });
  });

  describe('addCity', () => {
    it('calls API only for the new city when adding', async () => {
      const newCity = createMockCityConfig({
        name: 'Paris',
        country: 'FR',
        latitude: 48.8566,
        longitude: 2.3522,
        timezone: 'Europe/Paris',
      });

      const newCityWeather = createSuccessResult(
        createMockWeatherData({ city: 'Paris', country: 'FR' })
      );

      const { result } = renderHook(() => useCities(), {
        wrapper: createWrapper(),
      });

      await waitFor(() => {
        expect(result.current.isInitialized).toBe(true);
      });

      mockFetchWeatherForCities.mockClear();
      mockFetchWeatherForCities.mockResolvedValueOnce([newCityWeather]);

      await act(async () => {
        result.current.addCity(newCity);
      });

      expect(mockFetchWeatherForCities).toHaveBeenCalledTimes(1);
      expect(mockFetchWeatherForCities).toHaveBeenCalledWith([newCity]);
    });

    it('appends new city to the cities list', async () => {
      const newCity = createMockCityConfig({
        name: 'Paris',
        country: 'FR',
        latitude: 48.8566,
        longitude: 2.3522,
      });

      const { result } = renderHook(() => useCities(), {
        wrapper: createWrapper(),
      });

      await waitFor(() => {
        expect(result.current.isInitialized).toBe(true);
      });

      const initialCityCount = result.current.cities.length;

      mockFetchWeatherForCities.mockResolvedValueOnce([
        createSuccessResult(createMockWeatherData({ city: 'Paris' })),
      ]);

      await act(async () => {
        result.current.addCity(newCity);
      });

      expect(result.current.cities.length).toBe(initialCityCount + 1);
      expect(result.current.cities.some((c) => c.name === 'Paris')).toBe(true);
    });

    it('appends weather data for the new city', async () => {
      const newCity = createMockCityConfig({
        name: 'Paris',
        country: 'FR',
        latitude: 48.8566,
        longitude: 2.3522,
      });

      const { result } = renderHook(() => useCities(), {
        wrapper: createWrapper(),
      });

      await waitFor(() => {
        expect(result.current.isInitialized).toBe(true);
      });

      mockFetchWeatherForCities.mockResolvedValueOnce([
        createSuccessResult(createMockWeatherData({ city: 'Paris', country: 'FR' })),
      ]);

      await act(async () => {
        result.current.addCity(newCity);
      });

      await waitFor(() => {
        const hasParisWeather = result.current.weatherData.some(
          (r) => r.success && r.data.city === 'Paris'
        );
        expect(hasParisWeather).toBe(true);
      });
    });

    it('does not call API for duplicate city (same coordinates)', async () => {
      const { result } = renderHook(() => useCities(), {
        wrapper: createWrapper(),
      });

      await waitFor(() => {
        expect(result.current.isInitialized).toBe(true);
      });

      const existingCity = result.current.cities[0];
      const duplicateCity = createMockCityConfig({
        name: 'Duplicate City',
        country: 'XX',
        latitude: existingCity.latitude,
        longitude: existingCity.longitude,
      });

      mockFetchWeatherForCities.mockClear();

      await act(async () => {
        result.current.addCity(duplicateCity);
      });

      expect(mockFetchWeatherForCities).not.toHaveBeenCalled();
    });

    it('does not add duplicate city to the list', async () => {
      const { result } = renderHook(() => useCities(), {
        wrapper: createWrapper(),
      });

      await waitFor(() => {
        expect(result.current.isInitialized).toBe(true);
      });

      const initialCityCount = result.current.cities.length;
      const existingCity = result.current.cities[0];
      const duplicateCity = createMockCityConfig({
        name: 'Duplicate City',
        latitude: existingCity.latitude,
        longitude: existingCity.longitude,
      });

      await act(async () => {
        result.current.addCity(duplicateCity);
      });

      expect(result.current.cities.length).toBe(initialCityCount);
    });
  });

  describe('resetToDefaults', () => {
    it('calls API for all default cities when resetting', async () => {
      const customCity = createMockCityConfig({
        name: 'Custom City',
        latitude: 10,
        longitude: 10,
      });

      mockLoadCities.mockReturnValue([customCity]);
      mockFetchWeatherForCities.mockResolvedValue([
        createSuccessResult(createMockWeatherData({ city: 'Custom City' })),
      ]);

      const { result } = renderHook(() => useCities(), {
        wrapper: createWrapper(),
      });

      await waitFor(() => {
        expect(result.current.isInitialized).toBe(true);
      });

      mockFetchWeatherForCities.mockClear();
      mockFetchWeatherForCities.mockResolvedValueOnce(
        DEFAULT_CITIES.map((city) =>
          createSuccessResult(createMockWeatherData({ city: city.name }))
        )
      );

      await act(async () => {
        result.current.resetToDefaults();
      });

      expect(mockFetchWeatherForCities).toHaveBeenCalledTimes(1);
      expect(mockFetchWeatherForCities).toHaveBeenCalledWith(DEFAULT_CITIES);
    });

    it('replaces cities with default cities', async () => {
      const customCity = createMockCityConfig({
        name: 'Custom City',
        latitude: 10,
        longitude: 10,
      });

      mockLoadCities.mockReturnValue([customCity]);
      mockFetchWeatherForCities.mockResolvedValue([
        createSuccessResult(createMockWeatherData({ city: 'Custom City' })),
      ]);

      const { result } = renderHook(() => useCities(), {
        wrapper: createWrapper(),
      });

      await waitFor(() => {
        expect(result.current.isInitialized).toBe(true);
        expect(result.current.cities[0].name).toBe('Custom City');
      });

      mockFetchWeatherForCities.mockResolvedValueOnce(
        DEFAULT_CITIES.map((city) =>
          createSuccessResult(createMockWeatherData({ city: city.name }))
        )
      );

      await act(async () => {
        result.current.resetToDefaults();
      });

      expect(result.current.cities).toEqual(DEFAULT_CITIES);
    });
  });

  describe('initial load', () => {
    it('fetches weather for cities from localStorage on mount', async () => {
      const savedCities = [
        createMockCityConfig({ name: 'Saved City 1', latitude: 1, longitude: 1 }),
        createMockCityConfig({ name: 'Saved City 2', latitude: 2, longitude: 2 }),
      ];

      mockLoadCities.mockReturnValue(savedCities);
      mockFetchWeatherForCities.mockResolvedValue(
        savedCities.map((city) =>
          createSuccessResult(createMockWeatherData({ city: city.name }))
        )
      );

      renderHook(() => useCities(), {
        wrapper: createWrapper(),
      });

      await waitFor(() => {
        expect(mockFetchWeatherForCities).toHaveBeenCalledWith(savedCities);
      });
    });

    it('fetches weather for default cities when localStorage is empty', async () => {
      mockLoadCities.mockReturnValue(null);

      renderHook(() => useCities(), {
        wrapper: createWrapper(),
      });

      await waitFor(() => {
        expect(mockFetchWeatherForCities).toHaveBeenCalledWith(DEFAULT_CITIES);
      });
    });

    it('fetches weather for default cities when localStorage has empty array', async () => {
      mockLoadCities.mockReturnValue([]);

      renderHook(() => useCities(), {
        wrapper: createWrapper(),
      });

      await waitFor(() => {
        expect(mockFetchWeatherForCities).toHaveBeenCalledWith(DEFAULT_CITIES);
      });
    });
  });

  describe('refreshWeather', () => {
    it('calls API for all current cities when refreshing', async () => {
      const { result } = renderHook(() => useCities(), {
        wrapper: createWrapper(),
      });

      await waitFor(() => {
        expect(result.current.isInitialized).toBe(true);
      });

      mockFetchWeatherForCities.mockClear();

      await act(async () => {
        result.current.refreshWeather();
      });

      expect(mockFetchWeatherForCities).toHaveBeenCalledTimes(1);
      expect(mockFetchWeatherForCities).toHaveBeenCalledWith(result.current.cities);
    });
  });
});
