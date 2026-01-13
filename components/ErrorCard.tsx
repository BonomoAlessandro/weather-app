interface ErrorCardProps {
  cityName: string;
  error: string;
  index?: number;
}

export function ErrorCard({ cityName, error, index = 0 }: ErrorCardProps) {
  return (
    <div
      className="
        relative overflow-hidden rounded-3xl
        bg-gradient-to-br from-rose-200 via-red-100 to-orange-100
        p-[2px] shadow-xl shadow-rose-200/30
      "
      style={{
        animationDelay: `${index * 100}ms`,
        animation: 'fadeInUp 0.6s ease-out backwards',
      }}
    >
      <div
        className="
          relative bg-white/40 backdrop-blur-xl
          rounded-[22px] p-6 border border-white/50
          min-h-[280px] flex flex-col
        "
      >
        {/* Header */}
        <div className="flex items-start justify-between mb-4">
          <div>
            <h2 className="text-2xl font-semibold tracking-tight text-rose-950">
              {cityName}
            </h2>
            <p className="text-sm text-rose-700 font-medium tracking-wide uppercase">
              Error
            </p>
          </div>
          <div className="text-4xl">⚠️</div>
        </div>

        {/* Error message */}
        <div className="flex-1 flex flex-col justify-center items-center text-center">
          <div className="bg-rose-950/10 rounded-xl p-4 w-full">
            <p className="text-rose-800 text-sm font-medium">
              Unable to load weather data
            </p>
            <p className="text-rose-600 text-xs mt-1 opacity-80">
              {error}
            </p>
          </div>
        </div>

        {/* Retry hint */}
        <p className="text-xs text-rose-700 text-center mt-4 opacity-70">
          Refresh the page to try again
        </p>
      </div>
    </div>
  );
}
