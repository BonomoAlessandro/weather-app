import { WeatherTheme } from '@/types/weather';

interface HeaderProps {
  title?: string;
  subtitle?: string;
  theme?: WeatherTheme;
}

export function Header({
  title = 'Weather Dashboard',
  subtitle = 'Current conditions around the world',
  theme = 'sunny',
}: HeaderProps) {
  const isDark = theme === 'stormy' || theme === 'night';

  return (
    <header className="w-full pt-12 pb-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto text-center">
        {/* Main title with gradient text effect */}
        <h1
          className={`
            text-4xl sm:text-5xl lg:text-6xl
            font-extralight tracking-tight
            bg-gradient-to-r bg-clip-text text-transparent
            mb-3
            ${isDark
              ? 'from-white via-slate-200 to-white'
              : 'from-slate-800 via-slate-600 to-slate-800'
            }
          `}
          style={{
            animationName: 'fadeInDown',
            animationDuration: '0.8s',
            animationTimingFunction: 'ease-out',
          }}
        >
          {title}
        </h1>

        {/* Subtitle */}
        <p
          className={`
            text-sm sm:text-base
            font-medium tracking-wide uppercase
            letter-spacing-widest
            ${isDark ? 'text-slate-300' : 'text-slate-500'}
          `}
          style={{
            animationName: 'fadeInUp',
            animationDuration: '0.8s',
            animationTimingFunction: 'ease-out',
            animationDelay: '0.2s',
            animationFillMode: 'backwards',
          }}
        >
          {subtitle}
        </p>

        {/* Decorative line */}
        <div
          className={`
            mt-6 mx-auto w-24 h-[2px]
            bg-gradient-to-r from-transparent to-transparent
            ${isDark ? 'via-slate-500' : 'via-slate-300'}
          `}
          style={{
            animationName: 'scaleIn',
            animationDuration: '0.6s',
            animationTimingFunction: 'ease-out',
            animationDelay: '0.4s',
            animationFillMode: 'backwards',
          }}
        />
      </div>
    </header>
  );
}
