import { WeatherTheme } from '@/types/weather';

interface WeatherIconProps {
  theme: WeatherTheme;
  className?: string;
}

export function WeatherIcon({ theme, className = '' }: WeatherIconProps) {
  const baseClass = `${className}`;

  const icons: Record<WeatherTheme, JSX.Element> = {
    sunny: (
      <svg viewBox="0 0 64 64" fill="none" className={baseClass}>
        <circle cx="32" cy="32" r="12" stroke="currentColor" strokeWidth="2.5" fill="currentColor" fillOpacity="0.1" />
        <g stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
          <line x1="32" y1="4" x2="32" y2="12" />
          <line x1="32" y1="52" x2="32" y2="60" />
          <line x1="4" y1="32" x2="12" y2="32" />
          <line x1="52" y1="32" x2="60" y2="32" />
          <line x1="12.2" y1="12.2" x2="17.9" y2="17.9" />
          <line x1="46.1" y1="46.1" x2="51.8" y2="51.8" />
          <line x1="12.2" y1="51.8" x2="17.9" y2="46.1" />
          <line x1="46.1" y1="17.9" x2="51.8" y2="12.2" />
        </g>
      </svg>
    ),
    cloudy: (
      <svg viewBox="0 0 64 64" fill="none" className={baseClass}>
        <path
          d="M48 42H18a10 10 0 0 1-1.5-19.9A14 14 0 0 1 44 24a10 10 0 0 1 4 18z"
          stroke="currentColor"
          strokeWidth="2.5"
          fill="currentColor"
          fillOpacity="0.1"
          strokeLinejoin="round"
        />
      </svg>
    ),
    rainy: (
      <svg viewBox="0 0 64 64" fill="none" className={baseClass}>
        <path
          d="M46 34H20a8 8 0 0 1-1.2-15.9A11.2 11.2 0 0 1 42 20a8 8 0 0 1 4 14z"
          stroke="currentColor"
          strokeWidth="2.5"
          fill="currentColor"
          fillOpacity="0.1"
          strokeLinejoin="round"
        />
        <g stroke="currentColor" strokeWidth="2" strokeLinecap="round">
          <line x1="22" y1="42" x2="20" y2="50" />
          <line x1="32" y1="42" x2="30" y2="54" />
          <line x1="42" y1="42" x2="40" y2="50" />
        </g>
      </svg>
    ),
    stormy: (
      <svg viewBox="0 0 64 64" fill="none" className={baseClass}>
        <path
          d="M46 30H20a8 8 0 0 1-1.2-15.9A11.2 11.2 0 0 1 42 16a8 8 0 0 1 4 14z"
          stroke="currentColor"
          strokeWidth="2.5"
          fill="currentColor"
          fillOpacity="0.1"
          strokeLinejoin="round"
        />
        <path
          d="M35 36l-4 10h8l-6 14 2-10h-8l8-14z"
          stroke="currentColor"
          strokeWidth="2"
          fill="currentColor"
          fillOpacity="0.2"
          strokeLinejoin="round"
        />
      </svg>
    ),
    snowy: (
      <svg viewBox="0 0 64 64" fill="none" className={baseClass}>
        <path
          d="M46 34H20a8 8 0 0 1-1.2-15.9A11.2 11.2 0 0 1 42 20a8 8 0 0 1 4 14z"
          stroke="currentColor"
          strokeWidth="2.5"
          fill="currentColor"
          fillOpacity="0.1"
          strokeLinejoin="round"
        />
        <g fill="currentColor">
          <circle cx="22" cy="46" r="2" />
          <circle cx="32" cy="50" r="2" />
          <circle cx="42" cy="46" r="2" />
          <circle cx="27" cy="54" r="1.5" />
          <circle cx="37" cy="56" r="1.5" />
        </g>
      </svg>
    ),
    misty: (
      <svg viewBox="0 0 64 64" fill="none" className={baseClass}>
        <g stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" opacity="0.8">
          <line x1="10" y1="24" x2="54" y2="24" />
          <line x1="14" y1="32" x2="50" y2="32" />
          <line x1="10" y1="40" x2="54" y2="40" />
          <line x1="18" y1="48" x2="46" y2="48" />
        </g>
      </svg>
    ),
    night: (
      <svg viewBox="0 0 64 64" fill="none" className={baseClass}>
        <path
          d="M42 40a16 16 0 1 1-8-27.7A12 12 0 0 0 42 40z"
          stroke="currentColor"
          strokeWidth="2.5"
          fill="currentColor"
          fillOpacity="0.1"
          strokeLinejoin="round"
        />
        <g fill="currentColor" opacity="0.6">
          <circle cx="46" cy="18" r="1.5" />
          <circle cx="52" cy="26" r="1" />
          <circle cx="50" cy="14" r="1" />
        </g>
      </svg>
    ),
  };

  return icons[theme] || icons.cloudy;
}
