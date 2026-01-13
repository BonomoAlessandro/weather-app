import { CityWeatherData, WeatherResult } from '@/types/weather';
import { WeatherCard } from './WeatherCard';
import { ErrorCard } from './ErrorCard';

interface CityGridProps {
  results: WeatherResult[];
}

export function CityGrid({ results }: CityGridProps) {
  return (
    <div
      className="
        grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3
        gap-6 md:gap-8
        w-full max-w-7xl mx-auto
        px-4 sm:px-6 lg:px-8
      "
    >
      {results.map((result, index) => {
        if (result.success) {
          return (
            <WeatherCard
              key={result.data.city}
              weather={result.data}
              index={index}
            />
          );
        }
        return (
          <ErrorCard
            key={result.city}
            cityName={result.city}
            error={result.error}
            index={index}
          />
        );
      })}
    </div>
  );
}
