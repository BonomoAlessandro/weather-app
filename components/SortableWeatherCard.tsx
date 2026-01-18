'use client';

import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { WeatherResult } from '@/types/weather';
import { WeatherCard } from './WeatherCard';
import { ErrorCard } from './ErrorCard';

interface SortableWeatherCardProps {
  id: string;
  result: WeatherResult;
  index: number;
}

export function SortableWeatherCard({ id, result, index }: SortableWeatherCardProps) {
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
    cursor: isDragging ? 'grabbing' : undefined,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
    >
      {result.success ? (
        <WeatherCard weather={result.data} index={index} />
      ) : (
        <ErrorCard cityName={result.city} error={result.error} index={index} />
      )}
    </div>
  );
}
