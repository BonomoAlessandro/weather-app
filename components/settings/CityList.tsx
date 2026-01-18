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
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { useCities } from '@/context/CityContext';
import { SortableCityItem } from './SortableCityItem';

export function CityList() {
  const { cities, removeCity, reorderCities, resetToDefaults } = useCities();

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const cityIds = cities.map(
    (city) => `${city.name}-${city.latitude}-${city.longitude}`
  );

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      const oldIndex = cityIds.indexOf(active.id as string);
      const newIndex = cityIds.indexOf(over.id as string);
      reorderCities(oldIndex, newIndex);
    }
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-sm font-medium text-slate-700">Your cities</h3>
        <span className="text-xs text-slate-400">{cities.length} cities</span>
      </div>

      {cities.length === 0 ? (
        <div className="py-8 text-center">
          <p className="text-slate-500 mb-4">No cities added yet</p>
          <button
            onClick={resetToDefaults}
            className="
              px-4 py-2
              text-sm font-medium
              text-blue-600 hover:text-blue-700
              hover:bg-blue-50
              rounded-lg
              transition-colors duration-200
            "
          >
            Load default cities
          </button>
        </div>
      ) : (
        <>
          <div
            className="
              bg-white/50 rounded-xl
              border border-slate-200
              divide-y divide-slate-100
              max-h-72 overflow-y-auto
            "
          >
            <DndContext
              sensors={sensors}
              collisionDetection={closestCenter}
              onDragEnd={handleDragEnd}
            >
              <SortableContext
                items={cityIds}
                strategy={verticalListSortingStrategy}
              >
                {cities.map((city) => (
                  <SortableCityItem
                    key={`${city.name}-${city.latitude}-${city.longitude}`}
                    city={city}
                    onRemove={removeCity}
                  />
                ))}
              </SortableContext>
            </DndContext>
          </div>

          <div className="mt-4 pt-4 border-t border-slate-200">
            <button
              onClick={resetToDefaults}
              className="
                w-full px-4 py-2.5
                text-sm font-medium
                text-slate-600 hover:text-slate-800
                bg-slate-100 hover:bg-slate-200
                rounded-xl
                transition-colors duration-200
              "
            >
              Reset to default cities
            </button>
          </div>
        </>
      )}
    </div>
  );
}
