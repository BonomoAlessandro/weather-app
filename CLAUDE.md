# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev      # Start development server at http://localhost:3000
npm run build    # Build for production
npm run lint     # Run ESLint
```

## Architecture

This is a Next.js 16 weather dashboard using the App Router pattern with server-side data fetching.

### Data Flow

1. **API Layer** (`lib/weather-api.ts`): Fetches weather from Open-Meteo API with 5-minute cache (`revalidate: 300`)
2. **Server Component** (`app/page.tsx`): Calls `fetchWeatherForAllCities()` at request time
3. **Client Components**: WeatherCard renders with `'use client'` for local time updates

### Key Files

- `lib/constants.ts`: City configurations (coordinates, timezones) and WMO weather code mappings
- `lib/weather-utils.ts`: Theme resolution from weather codes, formatting utilities
- `types/weather.ts`: TypeScript interfaces for API responses and app data

### Theming System

Weather conditions map to themes via WMO codes in `constants.ts`. Each theme defines card colors, text colors, and icon styles. The page background uses the "dominant theme" calculated from all cities' weather.

### Adding Cities

Edit `CITIES` array in `lib/constants.ts`:
```typescript
{ name: 'City', country: 'XX', latitude: 0.0, longitude: 0.0, timezone: 'Region/City' }
```
