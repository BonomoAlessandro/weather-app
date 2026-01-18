'use client';

import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from '@dnd-kit/core';
import {
  SortableContext,
  sortableKeyboardCoordinates,
  rectSortingStrategy,
} from '@dnd-kit/sortable';
import { useCities } from '@/context/CityContext';
import { SortableWeatherCard } from './SortableWeatherCard';

export function CityGrid() {
  const { cities, weatherData, reorderCities } = useCities();

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const cardIds = cities.map(
    (city) => `${city.name}-${city.latitude}-${city.longitude}`
  );

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      const oldIndex = cardIds.indexOf(active.id as string);
      const newIndex = cardIds.indexOf(over.id as string);
      reorderCities(oldIndex, newIndex);
    }
  }

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragEnd={handleDragEnd}
    >
      <SortableContext items={cardIds} strategy={rectSortingStrategy}>
        <div
          className="
            grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3
            gap-6 md:gap-8
            w-full max-w-7xl mx-auto
            px-4 sm:px-6 lg:px-8
          "
        >
          {weatherData.map((result, index) => (
            <SortableWeatherCard
              key={cardIds[index]}
              id={cardIds[index]}
              result={result}
              index={index}
            />
          ))}
        </div>
      </SortableContext>
    </DndContext>
  );
}
