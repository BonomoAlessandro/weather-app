# Weather Dashboard

A modern weather dashboard displaying real-time weather conditions for cities around the world.

![Next.js](https://img.shields.io/badge/Next.js-16-black)
![React](https://img.shields.io/badge/React-19-blue)
![TypeScript](https://img.shields.io/badge/TypeScript-5-blue)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-4-38bdf8)

## Features

- Real-time weather data for 5 cities: Zürich, London, New York, Tokyo, Cape Town
- Dynamic theming based on weather conditions (sunny, cloudy, rainy, stormy, snowy, misty, night)
- Local time display for each city
- Responsive grid layout (1/2/3 columns)
- Server-side rendering with 5-minute cache

## Tech Stack

- **Framework**: Next.js 16 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS v4
- **API**: [Open-Meteo](https://open-meteo.com/) (free, no API key required)

## Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn

### Installation

```bash
# Install dependencies
npm install

# Start development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Project Structure

```
weather-app/
├── app/
│   ├── layout.tsx      # Root layout
│   ├── page.tsx        # Main dashboard
│   ├── loading.tsx     # Loading state
│   ├── error.tsx       # Error boundary
│   └── globals.css     # Global styles
├── components/
│   ├── WeatherCard.tsx     # City weather card
│   ├── WeatherDetails.tsx  # Weather metrics
│   ├── WeatherIcon.tsx     # SVG weather icons
│   ├── CityGrid.tsx        # Responsive grid
│   ├── Header.tsx          # App header
│   ├── LoadingCard.tsx     # Skeleton loader
│   └── ErrorCard.tsx       # Error display
├── lib/
│   ├── constants.ts    # Cities, themes, WMO codes
│   ├── weather-api.ts  # API fetching
│   └── weather-utils.ts # Utilities
└── types/
    └── weather.ts      # TypeScript interfaces
```

## Configuration

### Cities

Edit `lib/constants.ts` to modify the city list:

```typescript
export const CITIES: CityConfig[] = [
  { name: 'Zürich', country: 'CH', latitude: 47.3769, longitude: 8.5417, timezone: 'Europe/Zurich' },
  // Add more cities...
];
```

### Cache Duration

Weather data is cached for 5 minutes. Modify in `lib/constants.ts`:

```typescript
export const CACHE_DURATION = 300; // seconds
```

## Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server |
| `npm run build` | Build for production |
| `npm run start` | Start production server |
| `npm run lint` | Run ESLint |

## API

This project uses the [Open-Meteo API](https://open-meteo.com/), which is:
- Free and open source
- No API key required
- No rate limits for reasonable usage

## License

MIT
