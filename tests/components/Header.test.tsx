import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { Header } from '@/components/Header';

describe('Header', () => {
  describe('default props', () => {
    it('renders default title', () => {
      render(<Header />);
      expect(screen.getByText('Weather Dashboard')).toBeInTheDocument();
    });

    it('renders default subtitle', () => {
      render(<Header />);
      expect(
        screen.getByText('Current conditions around the world')
      ).toBeInTheDocument();
    });
  });

  describe('custom props', () => {
    it('renders custom title', () => {
      render(<Header title="My Weather App" />);
      expect(screen.getByText('My Weather App')).toBeInTheDocument();
    });

    it('renders custom subtitle', () => {
      render(<Header subtitle="Live updates" />);
      expect(screen.getByText('Live updates')).toBeInTheDocument();
    });

    it('renders both custom title and subtitle', () => {
      render(<Header title="Custom Title" subtitle="Custom Subtitle" />);
      expect(screen.getByText('Custom Title')).toBeInTheDocument();
      expect(screen.getByText('Custom Subtitle')).toBeInTheDocument();
    });
  });

  describe('accessibility', () => {
    it('uses h1 for main title', () => {
      render(<Header title="Test Title" />);
      const heading = screen.getByRole('heading', { level: 1 });
      expect(heading).toHaveTextContent('Test Title');
    });

    it('renders as header element', () => {
      render(<Header />);
      expect(screen.getByRole('banner')).toBeInTheDocument();
    });
  });
});
