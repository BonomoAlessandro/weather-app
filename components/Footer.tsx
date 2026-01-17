import { WeatherTheme } from '@/types/weather';

interface FooterProps {
  theme?: WeatherTheme;
}

export function Footer({ theme = 'sunny' }: FooterProps) {
  const isDark = theme === 'stormy' || theme === 'night';

  return (
    <footer className="pb-8 text-center">
      <p
        className={`
          text-xs font-medium tracking-wide uppercase
          ${isDark ? 'text-white/50' : 'text-slate-500'}
        `}
      >
        Data from Open-Meteo
      </p>
    </footer>
  );
}
