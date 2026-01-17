# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev      # Start development server at http://localhost:3000
npm run build    # Build for production
npm run lint     # Run ESLint
npm test         # Run Vitest tests
```

## Architecture

This is a Next.js 16 weather dashboard using the App Router pattern with client-side city management.

### Data Flow

1. **API Layer** (`lib/weather-api.ts`): Fetches weather from Open-Meteo API
2. **City Context** (`context/CityContext.tsx`): Manages user's city list with localStorage persistence
3. **Client Components**: `WeatherDashboard` orchestrates the UI, `WeatherCard` displays individual cities

### Key Files

- `lib/constants.ts`: Default city configurations and WMO weather code mappings
- `lib/weather-utils.ts`: Theme resolution from weather codes, formatting utilities
- `lib/storage.ts`: localStorage utilities for city persistence
- `lib/geocoding-api.ts`: Open-Meteo Geocoding API for city search
- `context/CityContext.tsx`: React Context for city state management
- `types/weather.ts`: TypeScript interfaces for API responses and app data

### Theming System

Weather conditions map to themes via WMO codes in `constants.ts`. Each theme defines card colors, text colors, and icon styles. The page background uses the "dominant theme" calculated from all cities' weather. Both `Header` and `Footer` accept a `theme` prop to adapt colors for dark themes (stormy, night).

### City Management

Users can add/remove cities via the settings modal (gear icon, top-right). Cities are saved to localStorage. The app uses Open-Meteo Geocoding API for city search, which supports multiple languages (e.g., "Munich" or "München").

## Coding Conventions

### Consistency Principles

1. **Solve similar problems the same way**: When fixing an issue, search the codebase for similar occurrences and fix them all consistently. Example: If fixing animation property conflicts in one component, check all components for the same issue.

2. **Symmetric component architecture**: When creating a component for one purpose, consider if a counterpart should exist. Example: If there's a `Header` component, there should be a `Footer` component with similar patterns (both accept `theme` prop).

3. **Use individual CSS animation properties**: Never use the `animation` shorthand with `animationDelay` - it causes conflicts. Always use individual properties:
   ```typescript
   // CORRECT
   style={{
     animationName: 'fadeInUp',
     animationDuration: '0.5s',
     animationTimingFunction: 'ease-out',
     animationFillMode: 'backwards',
     animationDelay: `${index * 80}ms`,
   }}

   // WRONG - causes React warning
   style={{
     animation: 'fadeInUp 0.5s ease-out backwards',
     animationDelay: `${index * 80}ms`,
   }}
   ```

4. **Theme-aware components**: Components that render text on the page background should accept a `theme` prop and adapt colors for dark themes (stormy, night).
