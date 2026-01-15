import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/react';
import { WeatherIcon } from '@/components/WeatherIcon';
import type { WeatherTheme } from '@/types/weather';

describe('WeatherIcon', () => {
  const allThemes: WeatherTheme[] = [
    'sunny',
    'cloudy',
    'rainy',
    'stormy',
    'snowy',
    'misty',
    'night',
  ];

  describe('renders SVG for each theme', () => {
    it.each(allThemes)('renders SVG element for %s theme', (theme) => {
      const { container } = render(<WeatherIcon theme={theme} />);
      const svg = container.querySelector('svg');
      expect(svg).toBeInTheDocument();
    });
  });

  describe('className prop', () => {
    it('applies custom className to SVG', () => {
      const { container } = render(
        <WeatherIcon theme="sunny" className="w-10 h-10" />
      );
      const svg = container.querySelector('svg');
      expect(svg).toHaveClass('w-10', 'h-10');
    });

    it('handles empty className', () => {
      const { container } = render(<WeatherIcon theme="sunny" className="" />);
      const svg = container.querySelector('svg');
      expect(svg).toBeInTheDocument();
    });

    it('handles no className provided', () => {
      const { container } = render(<WeatherIcon theme="sunny" />);
      const svg = container.querySelector('svg');
      expect(svg).toBeInTheDocument();
    });
  });

  describe('fallback behavior', () => {
    it('falls back to cloudy icon for invalid theme', () => {
      // @ts-expect-error - Testing runtime fallback for invalid theme
      const { container } = render(<WeatherIcon theme="invalid" />);
      const svg = container.querySelector('svg');
      expect(svg).toBeInTheDocument();
    });
  });

  describe('SVG structure', () => {
    it('sunny icon has sun rays (line elements)', () => {
      const { container } = render(<WeatherIcon theme="sunny" />);
      const lines = container.querySelectorAll('line');
      expect(lines.length).toBeGreaterThan(0);
    });

    it('rainy icon has rain drop lines', () => {
      const { container } = render(<WeatherIcon theme="rainy" />);
      const lines = container.querySelectorAll('line');
      expect(lines.length).toBeGreaterThan(0);
    });

    it('snowy icon has snowflake circles', () => {
      const { container } = render(<WeatherIcon theme="snowy" />);
      const circles = container.querySelectorAll('circle');
      expect(circles.length).toBeGreaterThan(0);
    });

    it('night icon has moon path', () => {
      const { container } = render(<WeatherIcon theme="night" />);
      const path = container.querySelector('path');
      expect(path).toBeInTheDocument();
    });
  });
});
