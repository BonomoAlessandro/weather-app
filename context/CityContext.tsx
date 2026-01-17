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

  // Load cities from localStorage on mount
  useEffect(() => {
    const storedCities = loadCities();
    if (storedCities && storedCities.length > 0) {
      setCities(storedCities);
    }
    setIsInitialized(true);
  }, []);

  // Fetch weather data when cities change
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

  // Fetch weather when cities change and initialized
  useEffect(() => {
    if (isInitialized) {
      fetchWeather(cities);
    }
  }, [cities, isInitialized, fetchWeather]);

  // Save cities to localStorage whenever they change (after initialization)
  useEffect(() => {
    if (isInitialized) {
      saveCities(cities);
    }
  }, [cities, isInitialized]);

  const addCity = useCallback((city: CityConfig) => {
    setCities((prev) => {
      // Check for duplicates by coordinates
      const isDuplicate = prev.some(
        (c) =>
          Math.abs(c.latitude - city.latitude) < 0.01 &&
          Math.abs(c.longitude - city.longitude) < 0.01
      );
      if (isDuplicate) {
        return prev;
      }
      return [...prev, city];
    });
  }, []);

  const removeCity = useCallback((cityName: string) => {
    setCities((prev) => prev.filter((c) => c.name !== cityName));
  }, []);

  const resetToDefaults = useCallback(() => {
    setCities(DEFAULT_CITIES);
  }, []);

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
