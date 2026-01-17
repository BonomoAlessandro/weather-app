import { CityConfig } from '@/types/weather';

const STORAGE_KEY = 'weather-dashboard-cities';
const STORAGE_VERSION = 1;

interface StoredData {
  version: number;
  cities: CityConfig[];
}

export function loadCities(): CityConfig[] | null {
  if (typeof window === 'undefined') {
    return null;
  }

  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) {
      return null;
    }

    const data: StoredData = JSON.parse(stored);

    if (data.version !== STORAGE_VERSION || !Array.isArray(data.cities)) {
      return null;
    }

    return data.cities;
  } catch {
    return null;
  }
}

export function saveCities(cities: CityConfig[]): void {
  if (typeof window === 'undefined') {
    return;
  }

  try {
    const data: StoredData = {
      version: STORAGE_VERSION,
      cities,
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch {
    console.warn('Failed to save cities to localStorage');
  }
}

export function clearCities(): void {
  if (typeof window === 'undefined') {
    return;
  }

  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch {
    console.warn('Failed to clear cities from localStorage');
  }
}
