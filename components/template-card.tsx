'use client';

import { Check, Eye, Sparkles, Box } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge, PackageBadge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import type { PackageTier, DesignType } from '@/types/database';

interface TemplateCardProps {
  id: string;
  name: string;
  description?: string;
  category?: string;
  designType: DesignType;
  minimumPackage: PackageTier;
  thumbnailUrl?: string;
  previewUrl?: string;
  isSelected?: boolean;
  isDisabled?: boolean;
  onPreview?: (id: string) => void;
  onSelect?: (id: string) => void;
}

const designTypeLabels: Record<DesignType, string> = {
  '2d_basic': '2D Basic',
  '2d_animated': '2D Animated',
  '2d_advanced': '2D Advanced',
  '3d_selected': '3D Elements',
  '3d_advanced': '3D Advanced',
};

export function TemplateCard({
  id,
  name,
  description,
  category,
  designType,
  minimumPackage,
  thumbnailUrl,
  isSelected = false,
  isDisabled = false,
  onPreview,
  onSelect,
}: TemplateCardProps) {
  const hasAnimation = designType.includes('animated') || designType.includes('advanced');
  const has3D = designType.includes('3d');

  return (
    <Card
      className={cn(
        'group relative overflow-hidden transition-all hover:shadow-md',
        isSelected && 'ring-2 ring-primary-600',
        isDisabled && 'opacity-50'
      )}
    >
      {/* Thumbnail */}
      <div className="relative aspect-[4/3] overflow-hidden bg-neutral-100">
        {thumbnailUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={thumbnailUrl}
            alt={name}
            className="h-full w-full object-cover transition-transform group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-primary-100 to-primary-200">
            <Sparkles className="h-12 w-12 text-primary-600" />
          </div>
        )}

        {/* Selected indicator */}
        {isSelected && (
          <div className="absolute right-2 top-2 flex h-8 w-8 items-center justify-center rounded-full bg-primary-600 shadow-lg">
            <Check className="h-5 w-5 text-white" />
          </div>
        )}

        {/* Preview button overlay */}
        {onPreview && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 transition-opacity group-hover:opacity-100">
            <Button
              variant="secondary"
              size="sm"
              onClick={() => onPreview(id)}
              className="gap-1"
            >
              <Eye className="h-4 w-4" />
              Preview
            </Button>
          </div>
        )}

        {/* Design type indicators */}
        <div className="absolute left-2 top-2 flex gap-1">
          {hasAnimation && (
            <Badge variant="secondary" className="gap-1 text-xs">
              <Sparkles className="h-3 w-3" />
              Animated
            </Badge>
          )}
          {has3D && (
            <Badge variant="secondary" className="gap-1 text-xs">
              <Box className="h-3 w-3" />
              3D
            </Badge>
          )}
        </div>
      </div>

      {/* Content */}
      <CardContent className="p-4">
        <div className="mb-2 flex items-start justify-between gap-2">
          <div className="flex-1">
            <h3 className="font-semibold text-neutral-900">{name}</h3>
            {category && (
              <p className="text-xs text-neutral-500">{category}</p>
            )}
          </div>
          <PackageBadge tier={minimumPackage} />
        </div>

        {description && (
          <p className="mb-3 line-clamp-2 text-sm text-neutral-600">
            {description}
          </p>
        )}

        <div className="flex items-center justify-between gap-2 text-xs text-neutral-500">
          <span>{designTypeLabels[designType]}</span>
          {onSelect && (
            <Button
              size="sm"
              variant={isSelected ? 'secondary' : 'outline'}
              onClick={() => onSelect(id)}
              disabled={isDisabled}
              className="ml-auto"
            >
              {isSelected ? 'Selected' : 'Select'}
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
