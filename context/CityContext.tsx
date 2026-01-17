'use client';

import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  ReactNode,
} from 'react';
import { CityConfig, WeatherResult } from '@/types/weather';
import { DEFAULT_CITIES } from '@/lib/constants';
import { loadCities, saveCities } from '@/lib/storage';
import { fetchWeatherForCities } from '@/lib/weather-api';

interface CityContextValue {
  cities: CityConfig[];
  weatherData: WeatherResult[];
  isLoading: boolean;
  isInitialized: boolean;
  addCity: (city: CityConfig) => void;
  removeCity: (cityName: string) => void;
  resetToDefaults: () => void;
  refreshWeather: () => void;
}

const CityContext = createContext<CityContextValue | null>(null);

interface CityProviderProps {
  children: ReactNode;
}

export function CityProvider({ children }: CityProviderProps) {
  const [cities, setCities] = useState<CityConfig[]>(DEFAULT_CITIES);
  const [weatherData, setWeatherData] = useState<WeatherResult[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isInitialized, setIsInitialized] = useState(false);

  // Fetch weather for given cities
  const fetchWeather = useCallback(async (citiesToFetch: CityConfig[]) => {
    if (citiesToFetch.length === 0) {
      setWeatherData([]);
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    try {
      const results = await fetchWeatherForCities(citiesToFetch);
      setWeatherData(results);
    } catch (error) {
      console.error('Failed to fetch weather:', error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Load cities from localStorage and fetch initial weather data
  useEffect(() => {
    const storedCities = loadCities();
    const initialCities = storedCities && storedCities.length > 0
      ? storedCities
      : DEFAULT_CITIES;

    setCities(initialCities);
    fetchWeather(initialCities);
    setIsInitialized(true);
  }, [fetchWeather]);

  // Save cities to localStorage whenever they change (after initialization)
  useEffect(() => {
    if (isInitialized) {
      saveCities(cities);
    }
  }, [cities, isInitialized]);

  // Add city - only fetches weather for the new city
  const addCity = useCallback(async (city: CityConfig) => {
    // Check for duplicates by coordinates
    const isDuplicate = cities.some(
      (c) =>
        Math.abs(c.latitude - city.latitude) < 0.01 &&
        Math.abs(c.longitude - city.longitude) < 0.01
    );
    if (isDuplicate) {
      return;
    }

    // Add city to list
    setCities((prev) => [...prev, city]);

    // Fetch only the new city's weather
    try {
      const results = await fetchWeatherForCities([city]);
      if (results.length > 0) {
        setWeatherData((prev) => [...prev, results[0]]);
      }
    } catch (error) {
      console.error('Failed to fetch weather for new city:', error);
    }
  }, [cities]);

  // Remove city - no API calls, just filter existing data
  const removeCity = useCallback((cityName: string) => {
    setCities((prev) => prev.filter((c) => c.name !== cityName));
    setWeatherData((prev) =>
      prev.filter((r) =>
        r.success ? r.data.city !== cityName : r.city !== cityName
      )
    );
  }, []);

  // Reset to defaults - fetches all default cities
  const resetToDefaults = useCallback(() => {
    setCities(DEFAULT_CITIES);
    fetchWeather(DEFAULT_CITIES);
  }, [fetchWeather]);

  // Manual refresh - fetches all current cities
  const refreshWeather = useCallback(() => {
    fetchWeather(cities);
  }, [cities, fetchWeather]);

  return (
    <CityContext.Provider
      value={{
        cities,
        weatherData,
        isLoading,
        isInitialized,
        addCity,
        removeCity,
        resetToDefaults,
        refreshWeather,
      }}
    >
      {children}
    </CityContext.Provider>
  );
}

export function useCities(): CityContextValue {
  const context = useContext(CityContext);
  if (!context) {
    throw new Error('useCities must be used within a CityProvider');
  }
  return context;
}
