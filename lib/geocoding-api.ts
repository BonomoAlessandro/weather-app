import { CityConfig } from '@/types/weather';

const GEOCODING_URL = 'https://geocoding-api.open-meteo.com/v1/search';

export interface GeocodingResult {
  id: number;
  name: string;
  latitude: number;
  longitude: number;
  country: string;
  country_code: string;
  timezone: string;
  admin1?: string;
  admin2?: string;
  population?: number;
}

interface GeocodingResponse {
  results?: GeocodingResult[];
  generationtime_ms: number;
}

export async function searchCities(query: string): Promise<GeocodingResult[]> {
  if (!query || query.trim().length < 2) {
    return [];
  }

  const params = new URLSearchParams({
    name: query.trim(),
    count: '8',
    format: 'json',
  });

  try {
    const response = await fetch(`${GEOCODING_URL}?${params}`);

    if (!response.ok) {
      throw new Error('Geocoding request failed');
    }

    const data: GeocodingResponse = await response.json();
    return data.results || [];
  } catch (error) {
    console.error('City search failed:', error);
    throw error;
  }
}

export function geocodingResultToCity(result: GeocodingResult): CityConfig {
  return {
    name: result.name,
    country: result.country_code,
    latitude: result.latitude,
    longitude: result.longitude,
    timezone: result.timezone,
  };
}

export function formatCityDisplay(result: GeocodingResult): string {
  const parts = [result.name];
  if (result.admin1) {
    parts.push(result.admin1);
  }
  parts.push(result.country_code);
  return parts.join(', ');
}
