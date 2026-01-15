import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { ErrorCard } from '@/components/ErrorCard';

describe('ErrorCard', () => {
  describe('content display', () => {
    it('displays city name', () => {
      render(<ErrorCard cityName="London" error="Connection failed" />);
      expect(screen.getByText('London')).toBeInTheDocument();
    });

    it('displays error message', () => {
      render(<ErrorCard cityName="London" error="API rate limit exceeded" />);
      expect(screen.getByText('API rate limit exceeded')).toBeInTheDocument();
    });

    it('displays static error title', () => {
      render(<ErrorCard cityName="London" error="Some error" />);
      expect(
        screen.getByText('Unable to load weather data')
      ).toBeInTheDocument();
    });

    it('displays retry hint', () => {
      render(<ErrorCard cityName="London" error="Some error" />);
      expect(
        screen.getByText('Refresh the page to try again')
      ).toBeInTheDocument();
    });

    it('displays warning emoji', () => {
      render(<ErrorCard cityName="London" error="Error" />);
      expect(screen.getByText('⚠️')).toBeInTheDocument();
    });
  });

  describe('animation delay', () => {
    it('applies animation delay based on index', () => {
      const { container } = render(
        <ErrorCard cityName="London" error="Error" index={3} />
      );

      const card = container.firstChild as HTMLElement;
      expect(card.style.animationDelay).toBe('300ms'); // 3 * 100ms
    });

    it('defaults to 0ms delay when index not provided', () => {
      const { container } = render(
        <ErrorCard cityName="London" error="Error" />
      );

      const card = container.firstChild as HTMLElement;
      expect(card.style.animationDelay).toBe('0ms');
    });
  });

  describe('edge cases', () => {
    it('handles very long error messages', () => {
      const longError = 'A'.repeat(200);
      render(<ErrorCard cityName="London" error={longError} />);
      expect(screen.getByText(longError)).toBeInTheDocument();
    });

    it('handles special characters in city name', () => {
      render(<ErrorCard cityName="São Paulo" error="Error" />);
      expect(screen.getByText('São Paulo')).toBeInTheDocument();
    });
  });
});
