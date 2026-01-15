import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { WeatherDetails } from '@/components/WeatherDetails';
import type { WeatherTheme } from '@/types/weather';

describe('WeatherDetails', () => {
  const defaultProps = {
    humidity: 65,
    windSpeed: 12,
    feelsLike: 18,
    theme: 'sunny' as WeatherTheme,
  };

  describe('data display', () => {
    it('displays humidity with percentage', () => {
      render(<WeatherDetails {...defaultProps} humidity={75} />);
      expect(screen.getByText('75%')).toBeInTheDocument();
      expect(screen.getByText('Humidity')).toBeInTheDocument();
    });

    it('displays wind speed with unit', () => {
      render(<WeatherDetails {...defaultProps} windSpeed={25} />);
      expect(screen.getByText('25 km/h')).toBeInTheDocument();
      expect(screen.getByText('Wind')).toBeInTheDocument();
    });

    it('displays feels like temperature with unit', () => {
      render(<WeatherDetails {...defaultProps} feelsLike={22} />);
      expect(screen.getByText('22°C')).toBeInTheDocument();
      expect(screen.getByText('Feels like')).toBeInTheDocument();
    });
  });

  describe('edge cases', () => {
    it('handles zero values correctly', () => {
      render(
        <WeatherDetails
          humidity={0}
          windSpeed={0}
          feelsLike={0}
          theme="cloudy"
        />
      );
      expect(screen.getByText('0%')).toBeInTheDocument();
      expect(screen.getByText('0 km/h')).toBeInTheDocument();
      expect(screen.getByText('0°C')).toBeInTheDocument();
    });

    it('handles negative feels like temperature', () => {
      render(<WeatherDetails {...defaultProps} feelsLike={-10} />);
      expect(screen.getByText('-10°C')).toBeInTheDocument();
    });

    it('handles decimal wind speed', () => {
      render(<WeatherDetails {...defaultProps} windSpeed={12.5} />);
      expect(screen.getByText('12.5 km/h')).toBeInTheDocument();
    });

    it('handles high humidity (100%)', () => {
      render(<WeatherDetails {...defaultProps} humidity={100} />);
      expect(screen.getByText('100%')).toBeInTheDocument();
    });
  });

  describe('theme styling', () => {
    const themes: WeatherTheme[] = [
      'sunny',
      'cloudy',
      'rainy',
      'stormy',
      'snowy',
      'misty',
      'night',
    ];

    it.each(themes)('renders without error for %s theme', (theme) => {
      const { container } = render(
        <WeatherDetails {...defaultProps} theme={theme} />
      );
      expect(container.firstChild).toBeInTheDocument();
    });

    it('applies different background for sunny theme', () => {
      const { container } = render(
        <WeatherDetails {...defaultProps} theme="sunny" />
      );
      const wrapper = container.firstChild as HTMLElement;
      expect(wrapper.className).toContain('bg-amber');
    });

    it('applies different background for stormy theme', () => {
      const { container } = render(
        <WeatherDetails {...defaultProps} theme="stormy" />
      );
      const wrapper = container.firstChild as HTMLElement;
      expect(wrapper.className).toContain('bg-white/10');
    });
  });

  describe('structure', () => {
    it('renders three detail sections', () => {
      render(<WeatherDetails {...defaultProps} />);
      expect(screen.getByText('Humidity')).toBeInTheDocument();
      expect(screen.getByText('Wind')).toBeInTheDocument();
      expect(screen.getByText('Feels like')).toBeInTheDocument();
    });
  });
});
