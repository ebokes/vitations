'use client';

import * as React from 'react';
import Link from 'next/link';
import { Search, Filter, X, Box, Sparkles } from 'lucide-react';
import { Header } from '@/components/header';
import { Footer } from '@/components/footer';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import {
  filterTemplates,
  Template,
  PackageTier,
  EventType,
  DesignStyle,
  TemplateRendererType,
} from '@/lib/templates';
import { cn } from '@/lib/utils';

const eventTypes: { id: EventType; name: string }[] = [
  { id: 'traditional_wedding', name: 'Traditional Wedding' },
  { id: 'white_wedding', name: 'White Wedding' },
  { id: 'reception', name: 'Reception' },
  { id: 'after_party', name: 'After Party' },
  { id: 'birthday', name: 'Birthday' },
  { id: 'anniversary', name: 'Anniversary' },
];

const designStyles: { id: DesignStyle; name: string }[] = [
  { id: 'classic', name: 'Classic' },
  { id: 'elegant', name: 'Elegant' },
  { id: 'modern', name: 'Modern' },
  { id: 'floral', name: 'Floral' },
  { id: 'luxury', name: 'Luxury' },
  { id: 'traditional', name: 'Traditional' },
];

const rendererTypes: { id: TemplateRendererType; name: string }[] = [
  { id: '2d', name: '2D' },
  { id: 'animated', name: 'Animated' },
  { id: '3d', name: '3D' },
];

function TemplateCard({ template }: { template: Template }) {
  const hasAnimation = template.rendererType === 'animated';
  const has3D = template.rendererType === '3d';

  return (
    <Link href={`/templates/${template.slug}`}>
      <Card className="group overflow-hidden transition-all hover:shadow-lg">
        <div
          className="aspect-[3/4] flex items-center justify-center"
          style={{
            background: template.visualConfig.backgroundType === 'gradient'
              ? template.visualConfig.backgroundValue
              : template.visualConfig.backgroundValue,
          }}
        >
          <div className="text-center">
            <Sparkles
              className="mx-auto h-12 w-12"
              style={{ color: `${template.visualConfig.primaryColor}40` }}
            />
            <p
              className="mt-2 text-sm font-medium"
              style={{ color: template.visualConfig.primaryColor }}
            >
              {template.name}
            </p>
          </div>
        </div>
        <CardContent className="p-4">
          <div className="flex items-start justify-between">
            <div>
              <h3 className="font-semibold text-neutral-900 group-hover:text-primary-600">
                {template.name}
              </h3>
              <p className="text-sm text-neutral-600">{template.description}</p>
            </div>
            <div className="flex gap-1">
              {hasAnimation && (
                <Badge variant="secondary" className="text-xs">
                  <Sparkles className="mr-1 h-3 w-3" />
                  Animated
                </Badge>
              )}
              {has3D && (
                <Badge variant="secondary" className="text-xs">
                  <Box className="mr-1 h-3 w-3" />
                  3D
                </Badge>
              )}
            </div>
          </div>
          <div className="mt-3 flex flex-wrap gap-1">
            {template.supportedEventTypes.slice(0, 3).map((et) => (
              <Badge key={et} variant="outline" className="text-xs capitalize">
                {et.replace(/_/g, ' ')}
              </Badge>
            ))}
            {template.supportedEventTypes.length > 3 && (
              <Badge variant="outline" className="text-xs">
                +{template.supportedEventTypes.length - 3} more
              </Badge>
            )}
          </div>
          <div className="mt-3 flex items-center gap-2">
            <span className="text-xs text-neutral-500">Min package:</span>
            <Badge variant="secondary" className="text-xs capitalize">
              {template.supportedPackages[0]}
            </Badge>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}

export default function TemplatesPage() {
  const [searchQuery, setSearchQuery] = React.useState('');
  const [selectedEventTypes, setSelectedEventTypes] = React.useState<EventType[]>([]);
  const [selectedStyles, setSelectedStyles] = React.useState<DesignStyle[]>([]);
  const [selectedRenderers, setSelectedRenderers] = React.useState<TemplateRendererType[]>([]);
  const [selectedPackage, setSelectedPackage] = React.useState<PackageTier | null>(null);
  const [showFilters, setShowFilters] = React.useState(false);

  const templates = React.useMemo(() => {
    return filterTemplates({
      search: searchQuery || undefined,
      eventTypes: selectedEventTypes.length > 0 ? selectedEventTypes : undefined,
      designStyles: selectedStyles.length > 0 ? selectedStyles : undefined,
      rendererTypes: selectedRenderers.length > 0 ? selectedRenderers : undefined,
      packageTier: selectedPackage || undefined,
    });
  }, [searchQuery, selectedEventTypes, selectedStyles, selectedRenderers, selectedPackage]);

  const toggleFilter = <T extends string>(
    current: T[],
    setFilter: React.Dispatch<React.SetStateAction<T[]>>,
    value: T
  ) => {
    setFilter(
      current.includes(value) ? current.filter((v) => v !== value) : [...current, value]
    );
  };

  const activeFilterCount =
    selectedEventTypes.length + selectedStyles.length + selectedRenderers.length + (selectedPackage ? 1 : 0);

  const clearFilters = () => {
    setSelectedEventTypes([]);
    setSelectedStyles([]);
    setSelectedRenderers([]);
    setSelectedPackage(null);
    setSearchQuery('');
  };

  return (
    <>
      <Header />
      <main className="min-h-screen bg-neutral-50">
        {/* Header */}
        <div className="border-b border-neutral-200 bg-white">
          <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
            <h1 className="text-3xl font-bold text-neutral-900">Browse Templates</h1>
            <p className="mt-2 text-neutral-600">
              Find the perfect design for your celebration
            </p>
          </div>
        </div>

        <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
          {/* Search and Filters */}
          <div className="mb-8 space-y-4">
            <div className="flex gap-4">
              <div className="flex-1">
                <Input
                  placeholder="Search templates..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full"
                />
              </div>
              <Button
                variant="outline"
                onClick={() => setShowFilters(!showFilters)}
                className="gap-2"
              >
                <Filter className="h-4 w-4" />
                Filters
                {activeFilterCount > 0 && (
                  <Badge variant="secondary" className="ml-1">
                    {activeFilterCount}
                  </Badge>
                )}
              </Button>
            </div>

            {/* Active filters */}
            {activeFilterCount > 0 && (
              <div className="flex flex-wrap items-center gap-2">
                {selectedEventTypes.map((et) => (
                  <Badge key={et} variant="secondary" className="gap-1 capitalize">
                    {et.replace(/_/g, ' ')}
                    <button onClick={() => toggleFilter(selectedEventTypes, setSelectedEventTypes, et)}>
                      <X className="h-3 w-3" />
                    </button>
                  </Badge>
                ))}
                {selectedStyles.map((s) => (
                  <Badge key={s} variant="secondary" className="gap-1 capitalize">
                    {s}
                    <button onClick={() => toggleFilter(selectedStyles, setSelectedStyles, s)}>
                      <X className="h-3 w-3" />
                    </button>
                  </Badge>
                ))}
                {selectedRenderers.map((r) => (
                  <Badge key={r} variant="secondary" className="gap-1 uppercase">
                    {r}
                    <button onClick={() => toggleFilter(selectedRenderers, setSelectedRenderers, r)}>
                      <X className="h-3 w-3" />
                    </button>
                  </Badge>
                ))}
                {selectedPackage && (
                  <Badge variant="secondary" className="gap-1 capitalize">
                    {selectedPackage}
                    <button onClick={() => setSelectedPackage(null)}>
                      <X className="h-3 w-3" />
                    </button>
                  </Badge>
                )}
                <Button variant="ghost" size="sm" onClick={clearFilters}>
                  Clear All
                </Button>
              </div>
            )}

            {/* Filter panels */}
            {showFilters && (
              <div className="grid gap-6 rounded-lg border border-neutral-200 bg-white p-4 sm:grid-cols-2 lg:grid-cols-4">
                <div>
                  <h3 className="mb-3 text-sm font-medium text-neutral-900">Event Type</h3>
                  <div className="flex flex-wrap gap-2">
                    {eventTypes.map((et) => (
                      <button
                        key={et.id}
                        onClick={() => toggleFilter(selectedEventTypes, setSelectedEventTypes, et.id)}
                        className={cn(
                          'rounded-full px-3 py-1 text-sm transition-colors',
                          selectedEventTypes.includes(et.id)
                            ? 'bg-primary-600 text-white'
                            : 'bg-neutral-100 text-neutral-700 hover:bg-neutral-200'
                        )}
                      >
                        {et.name}
                      </button>
                    ))}
                  </div>
                </div>
                <div>
                  <h3 className="mb-3 text-sm font-medium text-neutral-900">Design Style</h3>
                  <div className="flex flex-wrap gap-2">
                    {designStyles.map((s) => (
                      <button
                        key={s.id}
                        onClick={() => toggleFilter(selectedStyles, setSelectedStyles, s.id)}
                        className={cn(
                          'rounded-full px-3 py-1 text-sm transition-colors',
                          selectedStyles.includes(s.id)
                            ? 'bg-primary-600 text-white'
                            : 'bg-neutral-100 text-neutral-700 hover:bg-neutral-200'
                        )}
                      >
                        {s.name}
                      </button>
                    ))}
                  </div>
                </div>
                <div>
                  <h3 className="mb-3 text-sm font-medium text-neutral-900">Template Type</h3>
                  <div className="flex flex-wrap gap-2">
                    {rendererTypes.map((r) => (
                      <button
                        key={r.id}
                        onClick={() => toggleFilter(selectedRenderers, setSelectedRenderers, r.id)}
                        className={cn(
                          'rounded-full px-3 py-1 text-sm transition-colors',
                          selectedRenderers.includes(r.id)
                            ? 'bg-primary-600 text-white'
                            : 'bg-neutral-100 text-neutral-700 hover:bg-neutral-200'
                        )}
                      >
                        {r.name}
                      </button>
                    ))}
                  </div>
                </div>
                <div>
                  <h3 className="mb-3 text-sm font-medium text-neutral-900">Package</h3>
                  <div className="flex flex-wrap gap-2">
                    {(['essential', 'premium', 'ultimate'] as PackageTier[]).map((p) => (
                      <button
                        key={p}
                        onClick={() => setSelectedPackage(selectedPackage === p ? null : p)}
                        className={cn(
                          'rounded-full px-3 py-1 text-sm capitalize transition-colors',
                          selectedPackage === p
                            ? 'bg-primary-600 text-white'
                            : 'bg-neutral-100 text-neutral-700 hover:bg-neutral-200'
                        )}
                      >
                        {p}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Templates grid */}
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {templates.map((template) => (
              <TemplateCard key={template.id} template={template} />
            ))}
          </div>

          {templates.length === 0 && (
            <div className="py-12 text-center">
              <p className="text-neutral-600">No templates found matching your criteria.</p>
              <Button variant="ghost" onClick={clearFilters} className="mt-4">
                Clear Filters
              </Button>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </>
  );
}
