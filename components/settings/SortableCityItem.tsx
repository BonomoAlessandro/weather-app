'use client';

import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { CityConfig } from '@/types/weather';

interface SortableCityItemProps {
  city: CityConfig;
  onRemove: (cityName: string) => void;
}

export function SortableCityItem({ city, onRemove }: SortableCityItemProps) {
  const id = `${city.name}-${city.latitude}-${city.longitude}`;

  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`
        flex items-center justify-between
        px-4 py-3
        group
        hover:bg-white/80
        transition-colors duration-150
        ${isDragging ? 'bg-white shadow-lg rounded-lg z-10' : ''}
      `}
    >
      <div className="flex items-center gap-3">
        <button
          {...attributes}
          {...listeners}
          className="
            p-1 -ml-1
            text-slate-400 hover:text-slate-600
            cursor-grab active:cursor-grabbing
            touch-none
          "
          aria-label={`Drag to reorder ${city.name}`}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={2}
            stroke="currentColor"
            className="w-4 h-4"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5"
            />
          </svg>
        </button>
        <span className="font-medium text-slate-800">{city.name}</span>
        <span className="text-sm text-slate-400">{city.country}</span>
      </div>
      <button
        onClick={() => onRemove(city.name)}
        className="
          p-1.5 rounded-lg
          text-slate-400 hover:text-red-500
          hover:bg-red-50
          opacity-0 group-hover:opacity-100
          transition-all duration-200
        "
        aria-label={`Remove ${city.name}`}
        title={`Remove ${city.name}`}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={2}
          stroke="currentColor"
          className="w-4 h-4"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M6 18 18 6M6 6l12 12"
          />
        </svg>
      </button>
    </div>
  );
}
