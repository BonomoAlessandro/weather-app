import { WeatherTheme } from '@/types/weather';
import { formatHumidity, formatWindSpeed, formatTemperature } from '@/lib/weather-utils';

interface WeatherDetailsProps {
  humidity: number;
  windSpeed: number;
  feelsLike: number;
  theme: WeatherTheme;
}

const detailThemeStyles = {
  sunny: { bg: 'bg-amber-100/50', text: 'text-amber-900', label: 'text-amber-700' },
  cloudy: { bg: 'bg-slate-100/50', text: 'text-slate-800', label: 'text-slate-500' },
  rainy: { bg: 'bg-blue-100/50', text: 'text-blue-900', label: 'text-blue-600' },
  stormy: { bg: 'bg-white/10', text: 'text-white', label: 'text-purple-200' },
  snowy: { bg: 'bg-sky-100/50', text: 'text-sky-900', label: 'text-sky-600' },
  misty: { bg: 'bg-gray-200/50', text: 'text-gray-800', label: 'text-gray-500' },
  night: { bg: 'bg-white/10', text: 'text-white', label: 'text-indigo-200' },
};

export function WeatherDetails({
  humidity,
  windSpeed,
  feelsLike,
  theme,
}: WeatherDetailsProps) {
  const styles = detailThemeStyles[theme];

  const details = [
    { label: 'Humidity', value: formatHumidity(humidity) },
    { label: 'Wind', value: formatWindSpeed(windSpeed) },
    { label: 'Feels like', value: `${formatTemperature(feelsLike)}C` },
  ];

  return (
    <div className={`${styles.bg} rounded-xl p-4`}>
      <div className="grid grid-cols-3 gap-4">
        {details.map((detail, index) => (
          <div
            key={detail.label}
            className={`
              text-center
              ${index < details.length - 1 ? 'border-r border-current/10' : ''}
            `}
          >
            <p className={`text-xs ${styles.label} font-medium mb-1`}>
              {detail.label}
            </p>
            <p className={`text-sm ${styles.text} font-semibold tabular-nums`}>
              {detail.value}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
