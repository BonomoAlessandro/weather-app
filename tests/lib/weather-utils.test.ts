import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import {
  getWeatherTheme,
  formatLocalTime,
  getDominantTheme,
  formatTemperature,
  formatWindSpeed,
  formatHumidity,
  getThemeConfig,
} from '@/lib/weather-utils';
import { createMockWeatherData } from '../mocks/weather-data';

describe('getWeatherTheme', () => {
  describe('sunny conditions', () => {
    it('returns sunny for clear sky (code 0)', () => {
      expect(getWeatherTheme(0)).toBe('sunny');
    });

    it('returns sunny for mainly clear (code 1)', () => {
      expect(getWeatherTheme(1)).toBe('sunny');
    });
  });

  describe('cloudy conditions', () => {
    it('returns cloudy for partly cloudy (code 2)', () => {
      expect(getWeatherTheme(2)).toBe('cloudy');
    });

    it('returns cloudy for overcast (code 3)', () => {
      expect(getWeatherTheme(3)).toBe('cloudy');
    });
  });

  describe('misty conditions', () => {
    it('returns misty for fog (code 45)', () => {
      expect(getWeatherTheme(45)).toBe('misty');
    });

    it('returns misty for rime fog (code 48)', () => {
      expect(getWeatherTheme(48)).toBe('misty');
    });
  });

  describe('rainy conditions', () => {
    it.each([51, 53, 55, 56, 57, 61, 63, 65, 66, 67, 80, 81])(
      'returns rainy for code %d',
      (code) => {
        expect(getWeatherTheme(code)).toBe('rainy');
      }
    );
  });

  describe('snowy conditions', () => {
    it.each([71, 73, 75, 77, 85, 86])('returns snowy for code %d', (code) => {
      expect(getWeatherTheme(code)).toBe('snowy');
    });
  });

  describe('stormy conditions', () => {
    it.each([82, 95, 96, 99])('returns stormy for code %d', (code) => {
      expect(getWeatherTheme(code)).toBe('stormy');
    });
  });

  describe('unknown weather codes', () => {
    it('returns cloudy as fallback for unknown code', () => {
      expect(getWeatherTheme(999)).toBe('cloudy');
    });

    it('returns cloudy for negative codes', () => {
      expect(getWeatherTheme(-1)).toBe('cloudy');
    });

    it('returns cloudy for undefined WMO codes in gaps', () => {
      // Codes 4-44 are not defined in WMO standard
      expect(getWeatherTheme(10)).toBe('cloudy');
      expect(getWeatherTheme(44)).toBe('cloudy');
    });
  });
});

describe('formatLocalTime', () => {
  beforeEach(() => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date('2024-01-15T14:30:00Z'));
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('formats UTC timezone correctly', () => {
    const result = formatLocalTime('UTC');
    expect(result).toMatch(/2:30\s?PM/i);
  });

  it('formats America/New_York timezone correctly', () => {
    const result = formatLocalTime('America/New_York');
    // 14:30 UTC = 9:30 AM EST (UTC-5)
    expect(result).toMatch(/9:30\s?AM/i);
  });

  it('formats Asia/Tokyo timezone correctly', () => {
    const result = formatLocalTime('Asia/Tokyo');
    // 14:30 UTC = 23:30 JST (UTC+9)
    expect(result).toMatch(/11:30\s?PM/i);
  });

  it('formats Europe/London timezone correctly', () => {
    const result = formatLocalTime('Europe/London');
    // In January (no DST), London is UTC+0
    expect(result).toMatch(/2:30\s?PM/i);
  });

  describe('error handling', () => {
    it('returns empty string for invalid timezone', () => {
      expect(formatLocalTime('Invalid/Timezone')).toBe('');
    });

    it('returns empty string for empty timezone', () => {
      expect(formatLocalTime('')).toBe('');
    });
  });
});

describe('getDominantTheme', () => {
  it('returns sunny when no data provided', () => {
    expect(getDominantTheme([])).toBe('sunny');
  });

  it('returns the theme of a single city', () => {
    const data = [createMockWeatherData({ weatherCode: 61 })]; // rainy
    expect(getDominantTheme(data)).toBe('rainy');
  });

  it('returns most common theme among cities', () => {
    const data = [
      createMockWeatherData({ weatherCode: 0 }), // sunny
      createMockWeatherData({ weatherCode: 61 }), // rainy
      createMockWeatherData({ weatherCode: 63 }), // rainy
      createMockWeatherData({ weatherCode: 65 }), // rainy
    ];
    expect(getDominantTheme(data)).toBe('rainy');
  });

  it('counts different codes with same theme correctly', () => {
    // Multiple snow codes should all count as snowy
    const data = [
      createMockWeatherData({ weatherCode: 71 }), // snowy (slight snow)
      createMockWeatherData({ weatherCode: 73 }), // snowy (moderate snow)
      createMockWeatherData({ weatherCode: 0 }), // sunny
    ];
    expect(getDominantTheme(data)).toBe('snowy');
  });

  it('handles all cities with same theme', () => {
    const data = [
      createMockWeatherData({ weatherCode: 0 }), // sunny
      createMockWeatherData({ weatherCode: 1 }), // sunny
      createMockWeatherData({ weatherCode: 0 }), // sunny
    ];
    expect(getDominantTheme(data)).toBe('sunny');
  });
});

describe('formatTemperature', () => {
  it('formats positive temperature', () => {
    expect(formatTemperature(25)).toBe('25°');
  });

  it('formats zero temperature', () => {
    expect(formatTemperature(0)).toBe('0°');
  });

  it('formats negative temperature', () => {
    expect(formatTemperature(-5)).toBe('-5°');
  });

  it('formats decimal temperature', () => {
    expect(formatTemperature(20.5)).toBe('20.5°');
  });
});

describe('formatWindSpeed', () => {
  it('formats integer wind speed', () => {
    expect(formatWindSpeed(15)).toBe('15 km/h');
  });

  it('formats decimal wind speed', () => {
    expect(formatWindSpeed(12.5)).toBe('12.5 km/h');
  });

  it('formats zero wind speed', () => {
    expect(formatWindSpeed(0)).toBe('0 km/h');
  });
});

describe('formatHumidity', () => {
  it('formats humidity with percentage', () => {
    expect(formatHumidity(65)).toBe('65%');
  });

  it('formats 100% humidity', () => {
    expect(formatHumidity(100)).toBe('100%');
  });

  it('formats 0% humidity', () => {
    expect(formatHumidity(0)).toBe('0%');
  });
});

describe('getThemeConfig', () => {
  it.each(['sunny', 'cloudy', 'rainy', 'stormy', 'snowy', 'misty', 'night'] as const)(
    'returns valid config for %s theme',
    (theme) => {
      const config = getThemeConfig(theme);
      expect(config).toHaveProperty('gradient');
      expect(config).toHaveProperty('cardBg');
      expect(config).toHaveProperty('textPrimary');
      expect(config).toHaveProperty('textSecondary');
    }
  );

  it('returns config with non-empty values', () => {
    const config = getThemeConfig('sunny');
    expect(config.gradient).toBeTruthy();
    expect(config.cardBg).toBeTruthy();
    expect(config.textPrimary).toBeTruthy();
    expect(config.textSecondary).toBeTruthy();
  });
});
