import { describe, it, expect } from 'vitest';
import { CITIES, WEATHER_THEMES, WMO_CODES, CACHE_DURATION } from '@/lib/constants';

describe('CITIES configuration', () => {
  it('has at least one city configured', () => {
    expect(CITIES.length).toBeGreaterThan(0);
  });

  it('all cities have required properties', () => {
    CITIES.forEach((city) => {
      expect(city.name).toBeTruthy();
      expect(city.country).toHaveLength(2); // ISO 2-letter code
      expect(typeof city.latitude).toBe('number');
      expect(typeof city.longitude).toBe('number');
      expect(city.timezone).toBeTruthy();
    });
  });

  it('all cities have valid latitude range (-90 to 90)', () => {
    CITIES.forEach((city) => {
      expect(city.latitude).toBeGreaterThanOrEqual(-90);
      expect(city.latitude).toBeLessThanOrEqual(90);
    });
  });

  it('all cities have valid longitude range (-180 to 180)', () => {
    CITIES.forEach((city) => {
      expect(city.longitude).toBeGreaterThanOrEqual(-180);
      expect(city.longitude).toBeLessThanOrEqual(180);
    });
  });

  it('all cities have unique names', () => {
    const names = CITIES.map((c) => c.name);
    const uniqueNames = new Set(names);
    expect(uniqueNames.size).toBe(names.length);
  });

  it('all cities have valid IANA timezone format', () => {
    CITIES.forEach((city) => {
      // IANA timezones contain a /
      expect(city.timezone).toContain('/');
    });
  });
});

describe('WEATHER_THEMES configuration', () => {
  const requiredThemes = [
    'sunny',
    'cloudy',
    'rainy',
    'stormy',
    'snowy',
    'misty',
    'night',
  ];

  it('has all required themes', () => {
    requiredThemes.forEach((theme) => {
      expect(WEATHER_THEMES).toHaveProperty(theme);
    });
  });

  it('all themes have required style properties', () => {
    Object.entries(WEATHER_THEMES).forEach(([themeName, config]) => {
      expect(config, `Theme ${themeName} missing gradient`).toHaveProperty(
        'gradient'
      );
      expect(config, `Theme ${themeName} missing cardBg`).toHaveProperty(
        'cardBg'
      );
      expect(config, `Theme ${themeName} missing textPrimary`).toHaveProperty(
        'textPrimary'
      );
      expect(config, `Theme ${themeName} missing textSecondary`).toHaveProperty(
        'textSecondary'
      );
    });
  });

  it('all theme properties are non-empty strings', () => {
    Object.entries(WEATHER_THEMES).forEach(([themeName, config]) => {
      expect(
        typeof config.gradient === 'string' && config.gradient.length > 0,
        `Theme ${themeName} has empty gradient`
      ).toBe(true);
      expect(
        typeof config.cardBg === 'string' && config.cardBg.length > 0,
        `Theme ${themeName} has empty cardBg`
      ).toBe(true);
      expect(
        typeof config.textPrimary === 'string' && config.textPrimary.length > 0,
        `Theme ${themeName} has empty textPrimary`
      ).toBe(true);
      expect(
        typeof config.textSecondary === 'string' &&
          config.textSecondary.length > 0,
        `Theme ${themeName} has empty textSecondary`
      ).toBe(true);
    });
  });
});

describe('WMO_CODES configuration', () => {
  // Standard WMO codes used by Open-Meteo API
  const expectedCodes = [
    0, 1, 2, 3, 45, 48, 51, 53, 55, 56, 57, 61, 63, 65, 66, 67, 71, 73, 75, 77,
    80, 81, 82, 85, 86, 95, 96, 99,
  ];

  it('has all standard WMO codes defined', () => {
    expectedCodes.forEach((code) => {
      expect(WMO_CODES, `Missing WMO code ${code}`).toHaveProperty(
        code.toString()
      );
    });
  });

  it('all codes have description and theme', () => {
    Object.entries(WMO_CODES).forEach(([code, info]) => {
      expect(
        info.description,
        `WMO code ${code} missing description`
      ).toBeTruthy();
      expect(info.theme, `WMO code ${code} missing theme`).toBeTruthy();
    });
  });

  it('all codes map to valid themes', () => {
    const validThemes = Object.keys(WEATHER_THEMES);

    Object.entries(WMO_CODES).forEach(([code, info]) => {
      expect(
        validThemes,
        `WMO code ${code} has invalid theme: ${info.theme}`
      ).toContain(info.theme);
    });
  });

  describe('weather code groupings', () => {
    it('clear conditions (0-1) map to sunny', () => {
      expect(WMO_CODES[0].theme).toBe('sunny');
      expect(WMO_CODES[1].theme).toBe('sunny');
    });

    it('cloudy conditions (2-3) map to cloudy', () => {
      expect(WMO_CODES[2].theme).toBe('cloudy');
      expect(WMO_CODES[3].theme).toBe('cloudy');
    });

    it('fog conditions (45, 48) map to misty', () => {
      expect(WMO_CODES[45].theme).toBe('misty');
      expect(WMO_CODES[48].theme).toBe('misty');
    });

    it('thunderstorm conditions (95, 96, 99) map to stormy', () => {
      expect(WMO_CODES[95].theme).toBe('stormy');
      expect(WMO_CODES[96].theme).toBe('stormy');
      expect(WMO_CODES[99].theme).toBe('stormy');
    });
  });
});

describe('CACHE_DURATION', () => {
  it('is set to 5 minutes (300 seconds)', () => {
    expect(CACHE_DURATION).toBe(300);
  });

  it('is a positive number', () => {
    expect(CACHE_DURATION).toBeGreaterThan(0);
  });
});
