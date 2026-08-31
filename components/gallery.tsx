'use client';

import * as React from 'react';
import { X, ChevronLeft, ChevronRight, Maximize2 } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface GalleryItem {
  id: string;
  url: string;
  type: 'image' | 'video';
  alt?: string;
}

export interface GalleryProps {
  items: GalleryItem[];
  className?: string;
  columns?: 2 | 3 | 4;
  onItemSelect?: (item: GalleryItem) => void;
}

export function Gallery({
  items,
  className,
  columns = 3,
  onItemSelect,
}: GalleryProps) {
  const [selectedIndex, setSelectedIndex] = React.useState<number | null>(null);

  const handleKeyDown = (e: React.KeyboardEvent, index: number) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      if (onItemSelect) {
        onItemSelect(items[index]);
      } else {
        setSelectedIndex(index);
      }
    }
  };

  return (
    <div className={cn('w-full', className)}>
      <div
        className={cn(
          'grid gap-2',
          columns === 2 && 'grid-cols-2',
          columns === 3 && 'grid-cols-2 sm:grid-cols-3',
          columns === 4 && 'grid-cols-2 sm:grid-cols-3 md:grid-cols-4'
        )}
      >
        {items.map((item, index) => (
          <button
            key={item.id}
            type="button"
            onClick={() => {
              if (onItemSelect) {
                onItemSelect(item);
              } else {
                setSelectedIndex(index);
              }
            }}
            onKeyDown={(e) => handleKeyDown(e, index)}
            className="group relative aspect-square overflow-hidden rounded-lg border border-neutral-200 bg-neutral-100 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2"
          >
            {item.type === 'image' ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={item.url}
                alt={item.alt || ''}
                className="h-full w-full object-cover transition-transform group-hover:scale-105"
              />
            ) : (
              <div className="flex h-full w-full items-center justify-center bg-neutral-200">
                <span className="text-sm text-neutral-500">Video</span>
              </div>
            )}

            {/* Overlay */}
            <div className="absolute inset-0 flex items-center justify-center bg-black/0 transition-colors group-hover:bg-black/20">
              <Maximize2 className="h-6 w-6 text-white opacity-0 transition-opacity group-hover:opacity-100" />
            </div>
          </button>
        ))}
      </div>

      {/* Lightbox */}
      {selectedIndex !== null && (
        <GalleryLightbox
          items={items}
          initialIndex={selectedIndex}
          onClose={() => setSelectedIndex(null)}
        />
      )}
    </div>
  );
}

interface GalleryLightboxProps {
  items: GalleryItem[];
  initialIndex: number;
  onClose: () => void;
}

function GalleryLightbox({ items, initialIndex, onClose }: GalleryLightboxProps) {
  const [currentIndex, setCurrentIndex] = React.useState(initialIndex);
  const currentItem = items[currentIndex];

  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      } else if (e.key === 'ArrowLeft') {
        setCurrentIndex((prev) => (prev > 0 ? prev - 1 : items.length - 1));
      } else if (e.key === 'ArrowRight') {
        setCurrentIndex((prev) => (prev < items.length - 1 ? prev + 1 : 0));
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [items.length, onClose]);

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Gallery lightbox"
      className="fixed inset-0 z-[1500] flex items-center justify-center bg-black/90"
      onClick={(e) => {
        if (e.target === e.currentTarget) {
          onClose();
        }
      }}
    >
      {/* Close button */}
      <button
        type="button"
        onClick={onClose}
        className="absolute right-4 top-4 rounded-full bg-white/10 p-2 text-white hover:bg-white/20 focus:outline-none focus:ring-2 focus:ring-white"
      >
        <X className="h-6 w-6" />
        <span className="sr-only">Close</span>
      </button>

      {/* Navigation */}
      <button
        type="button"
        onClick={() =>
          setCurrentIndex((prev) => (prev > 0 ? prev - 1 : items.length - 1))
        }
        className="absolute left-4 rounded-full bg-white/10 p-2 text-white hover:bg-white/20 focus:outline-none focus:ring-2 focus:ring-white"
      >
        <ChevronLeft className="h-6 w-6" />
        <span className="sr-only">Previous</span>
      </button>
      <button
        type="button"
        onClick={() =>
          setCurrentIndex((prev) => (prev < items.length - 1 ? prev + 1 : 0))
        }
        className="absolute right-4 rounded-full bg-white/10 p-2 text-white hover:bg-white/20 focus:outline-none focus:ring-2 focus:ring-white"
      >
        <ChevronRight className="h-6 w-6" />
        <span className="sr-only">Next</span>
      </button>

      {/* Image */}
      <div className="max-h-[80vh] max-w-[90vw]">
        {currentItem.type === 'image' ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={currentItem.url}
            alt={currentItem.alt || ''}
            className="max-h-[80vh] max-w-[90vw] object-contain"
          />
        ) : (
          <div className="flex h-64 w-96 items-center justify-center bg-neutral-800 rounded-lg">
            <span className="text-white">Video preview not available</span>
          </div>
        )}
      </div>

      {/* Counter */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 rounded-full bg-white/10 px-3 py-1 text-sm text-white">
        {currentIndex + 1} / {items.length}
      </div>
    </div>
  );
}
