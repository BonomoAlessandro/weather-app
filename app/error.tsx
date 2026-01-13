'use client';

interface ErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function Error({ error, reset }: ErrorProps) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-rose-100 via-red-50 to-orange-50 flex items-center justify-center px-4">
      <div
        className="
          max-w-md w-full
          bg-white/60 backdrop-blur-xl
          rounded-3xl p-8
          border border-white/50
          shadow-xl shadow-rose-200/30
          text-center
        "
        style={{
          animation: 'fadeInUp 0.6s ease-out',
        }}
      >
        {/* Error icon */}
        <div className="text-6xl mb-4">🌩️</div>

        {/* Title */}
        <h1 className="text-2xl font-semibold text-rose-900 mb-2">
          Weather Unavailable
        </h1>

        {/* Error message */}
        <p className="text-rose-700 mb-6">
          We couldn&apos;t load the weather data. This might be a temporary issue.
        </p>

        {/* Error details (dev only) */}
        {process.env.NODE_ENV === 'development' && (
          <div className="bg-rose-950/10 rounded-xl p-4 mb-6 text-left">
            <p className="text-xs text-rose-800 font-mono break-all">
              {error.message}
            </p>
          </div>
        )}

        {/* Retry button */}
        <button
          onClick={reset}
          className="
            px-6 py-3 rounded-xl
            bg-gradient-to-r from-rose-500 to-orange-500
            text-white font-medium
            shadow-lg shadow-rose-500/30
            hover:shadow-xl hover:shadow-rose-500/40
            hover:scale-105
            transition-all duration-200
          "
        >
          Try Again
        </button>
      </div>
    </div>
  );
}
