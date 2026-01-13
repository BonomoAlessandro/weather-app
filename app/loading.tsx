import { LoadingCard } from '@/components';
import { CITIES } from '@/lib/constants';

export default function Loading() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-100 via-gray-50 to-zinc-100">
      {/* Header skeleton */}
      <header className="w-full pt-12 pb-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto text-center">
          <div className="h-12 w-72 bg-slate-200/60 rounded-xl mx-auto mb-3 animate-pulse" />
          <div className="h-4 w-56 bg-slate-200/40 rounded mx-auto animate-pulse" />
          <div className="mt-6 mx-auto w-24 h-[2px] bg-slate-200/60 rounded animate-pulse" />
        </div>
      </header>

      {/* Loading cards grid */}
      <main className="pb-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {CITIES.map((_, index) => (
            <LoadingCard key={index} index={index} />
          ))}
        </div>
      </main>
    </div>
  );
}
