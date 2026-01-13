interface LoadingCardProps {
  index?: number;
}

export function LoadingCard({ index = 0 }: LoadingCardProps) {
  return (
    <div
      className="
        relative overflow-hidden rounded-3xl
        bg-gradient-to-br from-slate-200 via-gray-100 to-zinc-200
        p-[2px] shadow-xl
      "
      style={{
        animationDelay: `${index * 100}ms`,
        animation: 'fadeInUp 0.6s ease-out backwards',
      }}
    >
      {/* Shimmer effect overlay */}
      <div
        className="
          absolute inset-0 -translate-x-full
          bg-gradient-to-r from-transparent via-white/40 to-transparent
          animate-shimmer
        "
        style={{
          animation: 'shimmer 2s infinite',
        }}
      />

      <div
        className="
          relative bg-white/50 backdrop-blur-xl
          rounded-[22px] p-6 border border-white/60
        "
      >
        {/* Header skeleton */}
        <div className="flex items-start justify-between mb-4">
          <div className="space-y-2">
            <div className="h-7 w-28 bg-slate-300/60 rounded-lg animate-pulse" />
            <div className="h-4 w-12 bg-slate-300/40 rounded animate-pulse" />
          </div>
          <div className="h-12 w-12 bg-slate-300/50 rounded-full animate-pulse" />
        </div>

        {/* Temperature skeleton */}
        <div className="mb-4 space-y-2">
          <div className="h-16 w-32 bg-slate-300/60 rounded-xl animate-pulse" />
          <div className="h-4 w-24 bg-slate-300/40 rounded animate-pulse" />
        </div>

        {/* Details skeleton */}
        <div className="grid grid-cols-3 gap-2 pt-4 mt-2 border-t border-slate-300/30">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="bg-slate-300/30 rounded-xl p-3 flex flex-col items-center gap-2"
            >
              <div className="h-4 w-4 bg-slate-300/50 rounded animate-pulse" />
              <div className="h-3 w-12 bg-slate-300/40 rounded animate-pulse" />
              <div className="h-4 w-10 bg-slate-300/50 rounded animate-pulse" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
