'use client';

import * as React from 'react';
import { useState, useCallback } from 'react';
import { X, Maximize, ChevronLeft, ChevronRight, Play, Image as ImageIcon, Video as VideoIcon } from 'lucide-react';
import { MediaFile, GalleryConfig, GalleryLayout, MediaType } from './types';
import { cn } from '@/lib/utils';

interface GalleryProps {
  media: MediaFile[];
  config?: Partial<GalleryConfig>;
  className?: string;
  onMediaClick?: (media: MediaFile, index: number) => void;
}

export function Gallery({
  media,
  config,
  className,
  onMediaClick,
}: GalleryProps) {
  const defaultConfig: GalleryConfig = {
    layout: 'grid',
    columns: 3,
    gap: 12,
    aspectRatio: 'auto',
    showCaptions: true,
    enableLightbox: true,
    autoplay: false,
  };

  const mergedConfig = { ...defaultConfig, ...config };

  if (media.length === 0) {
    return (
      <div className="text-center py-12 text-neutral-500">
        <ImageIcon className="mx-auto h-12 w-12 text-neutral-300" />
        <p className="mt-2">No media available</p>
      </div>
    );
  }

  switch (mergedConfig.layout) {
    case 'masonry':
      return <MasonryGallery media={media} config={mergedConfig} onMediaClick={onMediaClick} className={className} />;
    case 'carousel':
      return <CarouselGallery media={media} config={mergedConfig} onMediaClick={onMediaClick} className={className} />;
    case 'collage':
      return <CollageGallery media={media} config={mergedConfig} onMediaClick={onMediaClick} className={className} />;
    default:
      return <GridGallery media={media} config={mergedConfig} onMediaClick={onMediaClick} className={className} />;
  }
}

/**
 * Grid Gallery Layout
 */
interface GalleryLayoutProps {
  media: MediaFile[];
  config: GalleryConfig;
  onMediaClick?: (media: MediaFile, index: number) => void;
  className?: string;
}

function GridGallery({
  media,
  config,
  onMediaClick,
  className,
}: GalleryLayoutProps) {
  const columns = config.columns || 3;
  const gap = config.gap || 12;
  const aspectRatio = config.aspectRatio || 'auto';

  const gridCols = { 1: 'grid-cols-1', 2: 'grid-cols-2', 3: 'grid-cols-3', 4: 'grid-cols-4' }[columns] || 'grid-cols-3';
  const gapClass = { 4: 'gap-1', 8: 'gap-2', 12: 'gap-3', 16: 'gap-4', 24: 'gap-6' }[gap] || 'gap-3';

  const aspectClass = {
    '1/1': 'aspect-square',
    '4/3': 'aspect-[4/3]',
    '16/9': 'aspect-video',
    '3/4': 'aspect-[3/4]',
    auto: '',
  }[aspectRatio];

  return (
    <div className={cn('grid', gridCols, gapClass, className)}>
      {media.map((item, index) => (
        <MediaCard
          key={item.id}
          media={item}
          index={index}
          aspectRatio={aspectClass}
          showCaption={config.showCaptions ?? true}
          onClick={() => (config.enableLightbox ?? true) && onMediaClick?.(item, index)}
        />
      ))}
    </div>
  );
}

/**
 * Masonry Gallery Layout
 */
function MasonryGallery({
  media,
  config,
  onMediaClick,
  className,
}: GalleryLayoutProps) {
  const columns = config.columns || 3;
  const gap = config.gap || 12;

  // Simple masonry using CSS columns
  const columnCount = { 1: 'columns-1', 2: 'columns-2', 3: 'columns-3', 4: 'columns-4' }[columns] || 'columns-3';
  const gapClass = { 4: 'gap-1', 8: 'gap-2', 12: 'gap-3', 16: 'gap-4', 24: 'gap-6' }[gap] || 'gap-3';

  return (
    <div className={cn(columnCount, gapClass, className)}>
      {media.map((item, index) => (
        <MediaCard
          key={item.id}
          media={item}
          index={index}
          aspectRatio=""
          showCaption={config.showCaptions ?? true}
          onClick={() => (config.enableLightbox ?? true) && onMediaClick?.(item, index)}
          style={{ breakInside: 'avoid', marginBottom: gap }}
        />
      ))}
    </div>
  );
}

/**
 * Carousel Gallery Layout
 */
function CarouselGallery({
  media,
  config,
  onMediaClick,
  className,
}: GalleryLayoutProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const autoplay = config.autoplay || false;

  // Auto-play
  React.useEffect(() => {
    if (!autoplay || media.length <= 1) return;
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % media.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [autoplay, media.length]);

  const goToPrevious = () => setCurrentIndex((prev) => (prev - 1 + media.length) % media.length);
  const goToNext = () => setCurrentIndex((prev) => (prev + 1) % media.length);

  const currentMedia = media[currentIndex];

  return (
    <div className={cn('relative', className)}>
      <div className="relative overflow-hidden rounded-xl">
        <MediaDisplay
          media={currentMedia}
          large
          showCaption={config.showCaptions ?? true}
        />
      </div>

      {media.length > 1 && (
        <>
          <button
            onClick={goToPrevious}
            className="absolute left-4 top-1/2 -translate-y-1/2 rounded-full bg-white/90 p-2 shadow-lg hover:bg-white transition-colors"
            aria-label="Previous"
          >
            <ChevronLeft className="h-5 w-5" />
          </button>
          <button
            onClick={goToNext}
            className="absolute right-4 top-1/2 -translate-y-1/2 rounded-full bg-white/90 p-2 shadow-lg hover:bg-white transition-colors"
            aria-label="Next"
          >
            <ChevronRight className="h-5 w-5" />
          </button>
        </>
      )}

      {/* Thumbnails */}
      {media.length > 1 && (
        <div className="mt-4 flex gap-2 overflow-x-auto pb-2">
          {media.map((item, index) => (
            <button
              key={item.id}
              onClick={() => setCurrentIndex(index)}
              className={cn(
                'flex-shrink-0 h-16 w-16 rounded-lg overflow-hidden border-2 transition-colors',
                index === currentIndex ? 'border-primary-500' : 'border-transparent hover:border-neutral-300'
              )}
              aria-label={`Go to slide ${index + 1}`}
              aria-current={index === currentIndex ? 'true' : 'false'}
            >
              <MediaThumbnail media={item} />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

/**
 * Collage Gallery Layout
 */
function CollageGallery({
  media,
  config,
  onMediaClick,
  className,
}: GalleryLayoutProps) {
  // Predefined collage patterns based on count
  const patterns: Record<number, React.ReactNode[]> = {
    1: ['full'],
    2: ['half', 'half'],
    3: ['full', 'half', 'half'],
    4: ['half', 'half', 'half', 'half'],
    5: ['full', 'half', 'half', 'quarter', 'quarter'],
    6: ['half', 'half', 'half', 'half', 'quarter', 'quarter'],
  };

  // Use a simple responsive grid for collage effect
  return (
    <div className={cn('grid gap-3', className)}>
      {media.map((item, index) => {
        // Determine size based on index and total
        let sizeClass = 'col-span-1 row-span-1';
        const total = media.length;

        if (total === 1) sizeClass = 'col-span-2 row-span-2';
        else if (total === 2) sizeClass = 'col-span-1 row-span-1';
        else if (total === 3) {
          if (index === 0) sizeClass = 'col-span-2 row-span-2';
          else sizeClass = 'col-span-1 row-span-1';
        } else if (total >= 4) {
          if (index < 2) sizeClass = 'col-span-1 row-span-1';
          else sizeClass = 'col-span-1 row-span-1';
        }

        return (
          <MediaCard
            key={item.id}
            media={item}
            index={index}
            aspectRatio=""
showCaption={config.showCaptions ?? true}
          onClick={() => (config.enableLightbox ?? true) && onMediaClick?.(item, index)}
            className={sizeClass}
            style={{ minHeight: '200px' }}
          />
        );
      })}
    </div>
  );
}

/**
 * Media Card Component
 */
interface MediaCardProps {
  media: MediaFile;
  index: number;
  aspectRatio: string;
  showCaption: boolean;
  onClick?: () => void;
  className?: string;
  style?: React.CSSProperties;
  large?: boolean;
}

function MediaCard({
  media,
  aspectRatio,
  showCaption,
  onClick,
  className,
  style,
  large,
}: MediaCardProps) {
  const isVideo = media.type === 'video';

  return (
    <div
      className={cn(
        'relative rounded-xl overflow-hidden bg-neutral-100 cursor-pointer transition-transform hover:scale-[1.02]',
        aspectRatio,
        className
      )}
      style={style}
      onClick={onClick}
      role={onClick ? 'button' : undefined}
      tabIndex={onClick ? 0 : undefined}
      onKeyDown={(e) => onClick && (e.key === 'Enter' || e.key === ' ') && onClick()}
    >
      <MediaDisplay media={media} large={large} />
      {isVideo && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/30">
          <Play className="h-12 w-12 text-white" />
        </div>
      )}
      {showCaption && media.caption && (
        <div className="absolute bottom-0 left-0 right-0 p-3 bg-gradient-to-t from-black/70 to-transparent text-white text-sm">
          {media.caption}
        </div>
      )}
    </div>
  );
}

/**
 * Media Thumbnail for carousel
 */
function MediaThumbnail({ media }: { media: MediaFile }) {
  const isVideo = media.type === 'video';

  return (
    <div className="relative h-full w-full">
      {media.thumbnailUrl ? (
        <img
          src={media.thumbnailUrl}
          alt={media.fileName}
          className="h-full w-full object-cover"
        />
      ) : media.publicUrl ? (
        <img
          src={media.publicUrl}
          alt={media.fileName}
          className="h-full w-full object-cover"
        />
      ) : (
        <div className="h-full w-full flex items-center justify-center bg-neutral-200">
          {isVideo ? <VideoIcon className="h-6 w-6 text-neutral-400" /> : <ImageIcon className="h-6 w-6 text-neutral-400" />}
        </div>
      )}
      {isVideo && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/30">
          <Play className="h-6 w-6 text-white" />
        </div>
      )}
    </div>
  );
}

/**
 * Media Display Component (for lightbox/full view)
 */
interface MediaDisplayProps {
  media: MediaFile;
  large?: boolean;
  showCaption?: boolean;
}

export function MediaDisplay({ media, large = false, showCaption = true }: MediaDisplayProps) {
  const isVideo = media.type === 'video';

  if (isVideo) {
    return (
      <video
        src={media.publicUrl}
        className="h-full w-full object-cover"
        controls
        preload="metadata"
        poster={media.thumbnailUrl}
        playsInline
      />
    );
  }

  return (
    <img
      src={media.publicUrl}
      alt={media.caption || media.fileName}
      className={cn('h-full w-full object-cover', large && 'max-h-[70vh]')}
      loading="lazy"
    />
  );
}

/**
 * Lightbox Modal
 */
interface LightboxProps {
  isOpen: boolean;
  onClose: () => void;
  media: MediaFile[];
  currentIndex: number;
  onNavigate: (index: number) => void;
}

export function Lightbox({ isOpen, onClose, media, currentIndex, onNavigate }: LightboxProps) {
  if (!isOpen || media.length === 0) return null;

  const currentMedia = media[currentIndex];
  const isVideo = currentMedia.type === 'video';

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') onClose();
    if (e.key === 'ArrowLeft') onNavigate((currentIndex - 1 + media.length) % media.length);
    if (e.key === 'ArrowRight') onNavigate((currentIndex + 1) % media.length);
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/95"
      onClick={onClose}
      onKeyDown={handleKeyDown}
      role="dialog"
      aria-modal="true"
      aria-label="Media viewer"
    >
      {/* Close Button */}
      <button
        onClick={(e) => { e.stopPropagation(); onClose(); }}
        className="absolute top-4 right-4 z-10 rounded-full bg-white/10 p-2 text-white hover:bg-white/20 transition-colors"
        aria-label="Close"
      >
        <X className="h-6 w-6" />
      </button>

      {/* Navigation */}
      {media.length > 1 && (
        <>
          <button
            onClick={(e) => { e.stopPropagation(); onNavigate((currentIndex - 1 + media.length) % media.length); }}
            className="absolute left-4 top-1/2 -translate-y-1/2 z-10 rounded-full bg-white/10 p-3 text-white hover:bg-white/20 transition-colors"
            aria-label="Previous"
          >
            <ChevronLeft className="h-8 w-8" />
          </button>
          <button
            onClick={(e) => { e.stopPropagation(); onNavigate((currentIndex + 1) % media.length); }}
            className="absolute right-4 top-1/2 -translate-y-1/2 z-10 rounded-full bg-white/10 p-3 text-white hover:bg-white/20 transition-colors"
            aria-label="Next"
          >
            <ChevronRight className="h-8 w-8" />
          </button>
        </>
      )}

      {/* Media Display */}
      <div className="relative max-w-[90vw] max-h-[85vh]">
        <MediaDisplay media={currentMedia} large showCaption={true} />
      </div>

      {/* Counter */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 text-white/70 text-sm">
        {currentIndex + 1} / {media.length}
      </div>

      {/* Thumbnail Strip */}
      {media.length > 4 && (
        <div className="absolute bottom-16 left-1/2 -translate-x-1/2 flex gap-2 overflow-x-auto pb-2">
          {media.map((item, index) => (
            <button
              key={item.id}
              onClick={(e) => { e.stopPropagation(); onNavigate(index); }}
              className={cn(
                'flex-shrink-0 h-16 w-16 rounded-lg overflow-hidden border-2 transition-colors',
                index === currentIndex ? 'border-white' : 'border-transparent hover:border-white/50'
              )}
            >
              <MediaThumbnail media={item} />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

/**
 * Story Media Component (for story timeline)
 */
interface StoryMediaProps {
  media: MediaFile[];
  className?: string;
}

export function StoryMedia({ media, className }: StoryMediaProps) {
  if (media.length === 0) return null;

  return (
    <div className={cn('space-y-8', className)}>
      {media.map((item, index) => (
        <div key={item.id} className="relative">
          <MediaCard
            media={item}
            index={index}
            aspectRatio="aspect-video"
            showCaption={true}
            className="max-w-3xl mx-auto"
          />
        </div>
      ))}
    </div>
  );
}

/**
 * Single Hero Media Component
 */
interface HeroMediaProps {
  media?: MediaFile;
  fallback?: React.ReactNode;
  className?: string;
}

export function HeroMedia({ media, fallback, className }: HeroMediaProps) {
  if (!media) {
    return (
      <div className={cn('relative aspect-video bg-neutral-100 rounded-xl overflow-hidden flex items-center justify-center', className)}>
        {fallback || (
          <ImageIcon className="h-16 w-16 text-neutral-300" />
        )}
      </div>
    );
  }

  return (
    <div className={cn('relative aspect-video rounded-xl overflow-hidden', className)}>
      <MediaDisplay media={media} large />
      {media.type === 'video' && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/20">
          <Play className="h-16 w-16 text-white" />
        </div>
      )}
    </div>
  );
}