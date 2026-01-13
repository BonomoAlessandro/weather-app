interface HeaderProps {
  title?: string;
  subtitle?: string;
}

export function Header({
  title = 'Weather Dashboard',
  subtitle = 'Current conditions around the world',
}: HeaderProps) {
  return (
    <header className="w-full pt-12 pb-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto text-center">
        {/* Main title with gradient text effect */}
        <h1
          className="
            text-4xl sm:text-5xl lg:text-6xl
            font-extralight tracking-tight
            bg-gradient-to-r from-slate-800 via-slate-600 to-slate-800
            bg-clip-text text-transparent
            mb-3
          "
          style={{
            animation: 'fadeInDown 0.8s ease-out',
          }}
        >
          {title}
        </h1>

        {/* Subtitle */}
        <p
          className="
            text-slate-500 text-sm sm:text-base
            font-medium tracking-wide uppercase
            letter-spacing-widest
          "
          style={{
            animation: 'fadeInUp 0.8s ease-out 0.2s backwards',
          }}
        >
          {subtitle}
        </p>

        {/* Decorative line */}
        <div
          className="
            mt-6 mx-auto w-24 h-[2px]
            bg-gradient-to-r from-transparent via-slate-300 to-transparent
          "
          style={{
            animation: 'scaleIn 0.6s ease-out 0.4s backwards',
          }}
        />
      </div>
    </header>
  );
}
