'use client';

import { useEffect, useCallback } from 'react';
import { CitySearch } from './CitySearch';
import { CityList } from './CityList';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function SettingsModal({ isOpen, onClose }: SettingsModalProps) {
  // Handle escape key
  const handleEscape = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    },
    [onClose]
  );

  useEffect(() => {
    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = '';
    };
  }, [isOpen, handleEscape]);

  if (!isOpen) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-50">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm animate-fadeIn" />

      {/* Modal */}
      <div
        className="absolute inset-0 flex items-center justify-center p-4"
        onClick={onClose}
      >
        <div
          className="
            relative w-full max-w-lg
            bg-white/95 backdrop-blur-xl
            rounded-2xl shadow-2xl
            border border-white/50
            max-h-[85vh] overflow-hidden
            animate-modalIn
          "
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="relative px-6 py-5 border-b border-slate-200">
            <h2 className="text-2xl font-semibold text-slate-800 text-center">
              Manage Cities
            </h2>
            <button
              onClick={onClose}
              className="
                absolute top-4 right-4
                p-2 rounded-lg
                text-slate-400 hover:text-slate-600
                hover:bg-slate-100
                transition-colors duration-200
              "
              aria-label="Close"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={2}
                stroke="currentColor"
                className="w-5 h-5"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M6 18 18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>

          {/* Content */}
          <div className="px-6 py-5 overflow-y-auto max-h-[calc(85vh-64px)]">
            <CitySearch />
            <CityList />
          </div>
        </div>
      </div>
    </div>
  );
}
