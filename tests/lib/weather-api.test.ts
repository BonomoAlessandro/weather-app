import { describe, it, expect, vi, beforeEach } from 'vitest';
import { fetchWeatherForCity, fetchWeatherForAllCities } from '@/lib/weather-api';
import { createMockCityConfig, createMockApiResponse } from '../mocks/weather-data';

describe('fetchWeatherForCity', () => {
  beforeEach(() => {
    vi.resetAllMocks();
  });

  describe('API URL construction', () => {
    it('constructs correct API URL with city coordinates', async () => {
      const mockCity = createMockCityConfig({
        latitude: 47.3769,
        longitude: 8.5417,
      });

      global.fetch = vi.fn().mockResolvedValue({
        ok: true,
        json: () => Promise.resolve(createMockApiResponse()),
      });

      await fetchWeatherForCity(mockCity);

      expect(fetch).toHaveBeenCalledWith(
        expect.stringContaining('latitude=47.3769'),
        expect.any(Object)
      );
      expect(fetch).toHaveBeenCalledWith(
        expect.stringContaining('longitude=8.5417'),
        expect.any(Object)
      );
    });

    it('requests all required weather parameters', async () => {
      global.fetch = vi.fn().mockResolvedValue({
        ok: true,
        json: () => Promise.resolve(createMockApiResponse()),
      });

      await fetchWeatherForCity(createMockCityConfig());

      const calledUrl = (fetch as ReturnType<typeof vi.fn>).mock.calls[0][0] as string;
      expect(calledUrl).toContain('temperature_2m');
      expect(calledUrl).toContain('relative_humidity_2m');
      expect(calledUrl).toContain('apparent_temperature');
      expect(calledUrl).toContain('weather_code');
      expect(calledUrl).toContain('wind_speed_10m');
    });
  });

  describe('data transformation', () => {
    it('transforms API response to CityWeatherData correctly', async () => {
      const mockCity = createMockCityConfig({
        name: 'Zurich',
        country: 'CH',
        timezone: 'Europe/Zurich',
      });

      const mockResponse = createMockApiResponse({
        current: {
          time: '2024-01-15T12:00',
          interval: 900,
          temperature_2m: 20.3,
          relative_humidity_2m: 65,
          apparent_temperature: 18.7,
          weather_code: 0,
          wind_speed_10m: 12.34,
        },
      });

      global.fetch = vi.fn().mockResolvedValue({
        ok: true,
        json: () => Promise.resolve(mockResponse),
      });

      const result = await fetchWeatherForCity(mockCity);

      expect(result).toEqual({
        city: 'Zurich',
        country: 'CH',
        timezone: 'Europe/Zurich',
        temperature: 20, // rounded from 20.3
        feelsLike: 19, // rounded from 18.7
        humidity: 65,
        windSpeed: 12.3, // rounded to 1 decimal
        weatherCode: 0,
        weatherDescription: 'Clear sky',
        timestamp: '2024-01-15T12:00',
      });
    });
  });

  describe('temperature rounding', () => {
    it('rounds temperature down for values below .5', async () => {
      const mockResponse = createMockApiResponse({
        current: {
          ...createMockApiResponse().current,
          temperature_2m: 20.4,
        },
      });

      global.fetch = vi.fn().mockResolvedValue({
        ok: true,
        json: () => Promise.resolve(mockResponse),
      });

      const result = await fetchWeatherForCity(createMockCityConfig());
      expect(result.temperature).toBe(20);
    });

    it('rounds temperature up for values at .5', async () => {
      const mockResponse = createMockApiResponse({
        current: {
          ...createMockApiResponse().current,
          temperature_2m: 20.5,
        },
      });

      global.fetch = vi.fn().mockResolvedValue({
        ok: true,
        json: () => Promise.resolve(mockResponse),
      });

      const result = await fetchWeatherForCity(createMockCityConfig());
      expect(result.temperature).toBe(21);
    });

    it('rounds negative temperatures correctly', async () => {
      const mockResponse = createMockApiResponse({
        current: {
          ...createMockApiResponse().current,
          temperature_2m: -5.7,
        },
      });

      global.fetch = vi.fn().mockResolvedValue({
        ok: true,
        json: () => Promise.resolve(mockResponse),
      });

      const result = await fetchWeatherForCity(createMockCityConfig());
      expect(result.temperature).toBe(-6);
    });
  });

  describe('wind speed rounding', () => {
    it('rounds wind speed to one decimal place', async () => {
      const mockResponse = createMockApiResponse({
        current: {
          ...createMockApiResponse().current,
          wind_speed_10m: 12.345,
        },
      });

      global.fetch = vi.fn().mockResolvedValue({
        ok: true,
        json: () => Promise.resolve(mockResponse),
      });

      const result = await fetchWeatherForCity(createMockCityConfig());
      expect(result.windSpeed).toBe(12.3);
    });

    it('rounds wind speed up correctly at .05', async () => {
      const mockResponse = createMockApiResponse({
        current: {
          ...createMockApiResponse().current,
          wind_speed_10m: 12.35,
        },
      });

      global.fetch = vi.fn().mockResolvedValue({
        ok: true,
        json: () => Promise.resolve(mockResponse),
      });

      const result = await fetchWeatherForCity(createMockCityConfig());
      expect(result.windSpeed).toBe(12.4);
    });
  });

  describe('unknown weather codes', () => {
    it('handles unknown weather code with fallback description', async () => {
      const mockResponse = createMockApiResponse({
        current: {
          ...createMockApiResponse().current,
          weather_code: 999, // Unknown code
        },
      });

      global.fetch = vi.fn().mockResolvedValue({
        ok: true,
        json: () => Promise.resolve(mockResponse),
      });

      const result = await fetchWeatherForCity(createMockCityConfig());
      expect(result.weatherDescription).toBe('Unknown');
    });
  });

  describe('error handling', () => {
    it('throws error for non-ok response', async () => {
      global.fetch = vi.fn().mockResolvedValue({
        ok: false,
        statusText: 'Not Found',
      });

      const city = createMockCityConfig({ name: 'TestCity' });
      await expect(fetchWeatherForCity(city)).rejects.toThrow(
        'Failed to fetch weather for TestCity: Not Found'
      );
    });

    it('throws error for network failure', async () => {
      global.fetch = vi.fn().mockRejectedValue(new Error('Network error'));

      await expect(fetchWeatherForCity(createMockCityConfig())).rejects.toThrow(
        'Network error'
      );
    });
  });
});

describe('fetchWeatherForAllCities', () => {
  beforeEach(() => {
    vi.resetAllMocks();
  });

  it('returns success results for all successful fetches', async () => {
    global.fetch = vi.fn().mockResolvedValue({
      ok: true,
      json: () => Promise.resolve(createMockApiResponse()),
    });

    const results = await fetchWeatherForAllCities();

    // Should have results for all 5 cities defined in constants
    expect(results).toHaveLength(5);
    results.forEach((result) => {
      expect(result.success).toBe(true);
    });
  });

  it('handles partial failures gracefully', async () => {
    let callCount = 0;
    global.fetch = vi.fn().mockImplementation(() => {
      callCount++;
      if (callCount === 1) {
        return Promise.resolve({
          ok: true,
          json: () => Promise.resolve(createMockApiResponse()),
        });
      }
      return Promise.resolve({
        ok: false,
        statusText: 'Server Error',
      });
    });

    const results = await fetchWeatherForAllCities();

    expect(results).toHaveLength(5);
    expect(results[0].success).toBe(true);

    // Check error results have proper structure
    const errorResult = results[1];
    expect(errorResult.success).toBe(false);
    if (!errorResult.success) {
      expect(errorResult.city).toBeDefined();
      expect(errorResult.error).toContain('Failed to fetch');
    }
  });

  it('returns all error results when all requests fail', async () => {
    global.fetch = vi.fn().mockRejectedValue(new Error('Network error'));

    const results = await fetchWeatherForAllCities();

    expect(results).toHaveLength(5);
    results.forEach((result) => {
      expect(result.success).toBe(false);
    });
  });

  it('preserves city order in results', async () => {
    global.fetch = vi.fn().mockResolvedValue({
      ok: true,
      json: () => Promise.resolve(createMockApiResponse()),
    });

    const results = await fetchWeatherForAllCities();

    const cityNames = results.map((r) => (r.success ? r.data.city : r.city));
    // Cities are defined in order: Zürich, London, New York, Tokyo, Cape Town
    expect(cityNames[0]).toBe('Zürich');
    expect(cityNames[1]).toBe('London');
    expect(cityNames[2]).toBe('New York');
    expect(cityNames[3]).toBe('Tokyo');
    expect(cityNames[4]).toBe('Cape Town');
  });
});
