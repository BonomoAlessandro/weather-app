import { fetchWeatherForAllCities } from '@/lib/weather-api';
import { getDominantTheme } from '@/lib/weather-utils';
import { CityGrid, Header } from '@/components';
import { CityWeatherData } from '@/types/weather';

// Revalidate every 5 minutes
export const revalidate = 300;

const backgroundGradients = {
  sunny: 'from-amber-200 via-orange-100 to-yellow-50',
  cloudy: 'from-slate-300 via-gray-200 to-zinc-100',
  rainy: 'from-blue-300 via-cyan-200 to-sky-100',
  stormy: 'from-slate-700 via-purple-800 to-slate-900',
  snowy: 'from-sky-100 via-blue-50 to-white',
  misty: 'from-gray-300 via-slate-200 to-zinc-100',
  night: 'from-indigo-900 via-slate-800 to-violet-900',
};

export default async function Home() {
  const results = await fetchWeatherForAllCities();

  // Get successful weather data for theme calculation
  const weatherData = results
    .filter((r): r is { success: true; data: CityWeatherData } => r.success)
    .map((r) => r.data);

  // Determine dominant theme for page background
  const dominantTheme = getDominantTheme(weatherData);
  const bgGradient = backgroundGradients[dominantTheme];

  return (
    <div
      className={`
        min-h-screen
        bg-gradient-to-br ${bgGradient}
        weather-gradient
      `}
    >
      <Header />
      <main className="pb-12">
        <CityGrid results={results} />
      </main>

      {/* Footer */}
      <footer className="pb-8 text-center">
        <p
          className={`
            text-xs font-medium tracking-wide uppercase
            ${dominantTheme === 'stormy' || dominantTheme === 'night'
              ? 'text-white/50'
              : 'text-slate-500'
            }
          `}
        >
          Data from Open-Meteo • Refreshes every 5 minutes
        </p>
      </footer>
    </div>
  );
}
