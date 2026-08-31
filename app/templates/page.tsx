'use client';

import * as React from 'react';
import Link from 'next/link';
import { Search, Filter, X } from 'lucide-react';
import { Header } from '@/components/header';
import { Footer } from '@/components/footer';
import { TemplateCard } from '@/components/template-card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

const categories = [
  { id: 'all', name: 'All Templates' },
  { id: 'traditional_wedding', name: 'Traditional Wedding' },
  { id: 'white_wedding', name: 'White Wedding' },
  { id: 'reception', name: 'Reception' },
  { id: 'after_party', name: 'After Party' },
  { id: 'birthday', name: 'Birthday' },
  { id: 'anniversary', name: 'Anniversary' },
  { id: 'other', name: 'Other Celebrations' },
];

const designStyles = [
  { id: 'classic', name: 'Classic' },
  { id: 'elegant', name: 'Elegant' },
  { id: 'modern', name: 'Modern' },
  { id: 'minimal', name: 'Minimal' },
  { id: 'floral', name: 'Floral' },
  { id: 'luxury', name: 'Luxury' },
  { id: 'traditional', name: 'Traditional' },
];

const capabilities = [
  { id: '2d', name: '2D' },
  { id: 'animated', name: 'Animated' },
  { id: '3d', name: '3D' },
];

const mockTemplates = [
  { id: '1', name: 'Royal Elegance', category: 'Traditional Wedding', designType: '2d_basic', minimumPackage: 'essential' },
  { id: '2', name: 'Modern Grace', category: 'White Wedding', designType: '2d_animated', minimumPackage: 'premium' },
  { id: '3', name: 'Golden Celebration', category: 'Reception', designType: '3d_selected', minimumPackage: 'premium' },
  { id: '4', name: 'Classic Charm', category: 'Birthday', designType: '2d_basic', minimumPackage: 'essential' },
  { id: '5', name: 'Floral Dreams', category: 'Traditional Wedding', designType: '2d_animated', minimumPackage: 'premium' },
  { id: '6', name: 'Luxury Noir', category: 'White Wedding', designType: '3d_advanced', minimumPackage: 'ultimate' },
  { id: '7', name: 'Traditional Pride', category: 'Traditional Wedding', designType: '2d_basic', minimumPackage: 'essential' },
  { id: '8', name: 'Minimalist Chic', category: 'Birthday', designType: '2d_basic', minimumPackage: 'essential' },
];

export default function TemplatesPage() {
  const [selectedCategory, setSelectedCategory] = React.useState('all');
  const [selectedStyle, setSelectedStyle] = React.useState<string | null>(null);
  const [selectedCapability, setSelectedCapability] = React.useState<string | null>(null);
  const [searchQuery, setSearchQuery] = React.useState('');
  const [showFilters, setShowFilters] = React.useState(false);

  const filteredTemplates = mockTemplates.filter((template) => {
    if (selectedCategory !== 'all' && template.category.toLowerCase().replace(' ', '_') !== selectedCategory) {
      return false;
    }
    if (searchQuery && !template.name.toLowerCase().includes(searchQuery.toLowerCase())) {
      return false;
    }
    return true;
  });

  const activeFilters = [selectedStyle, selectedCapability].filter(Boolean);

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
                {activeFilters.length > 0 && (
                  <Badge variant="secondary" className="ml-1">
                    {activeFilters.length}
                  </Badge>
                )}
              </Button>
            </div>

            {/* Active filters */}
            {activeFilters.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {selectedStyle && (
                  <Badge variant="secondary" className="gap-1">
                    {designStyles.find((s) => s.id === selectedStyle)?.name}
                    <button onClick={() => setSelectedStyle(null)}>
                      <X className="h-3 w-3" />
                    </button>
                  </Badge>
                )}
                {selectedCapability && (
                  <Badge variant="secondary" className="gap-1">
                    {capabilities.find((c) => c.id === selectedCapability)?.name}
                    <button onClick={() => setSelectedCapability(null)}>
                      <X className="h-3 w-3" />
                    </button>
                  </Badge>
                )}
              </div>
            )}

            {/* Filter panels */}
            {showFilters && (
              <div className="grid gap-6 rounded-lg border border-neutral-200 bg-white p-4 sm:grid-cols-3">
                <div>
                  <h3 className="mb-3 text-sm font-medium text-neutral-900">Design Style</h3>
                  <div className="flex flex-wrap gap-2">
                    {designStyles.map((style) => (
                      <button
                        key={style.id}
                        onClick={() => setSelectedStyle(selectedStyle === style.id ? null : style.id)}
                        className={cn(
                          'rounded-full px-3 py-1 text-sm transition-colors',
                          selectedStyle === style.id
                            ? 'bg-primary-600 text-white'
                            : 'bg-neutral-100 text-neutral-700 hover:bg-neutral-200'
                        )}
                      >
                        {style.name}
                      </button>
                    ))}
                  </div>
                </div>
                <div>
                  <h3 className="mb-3 text-sm font-medium text-neutral-900">Capability</h3>
                  <div className="flex flex-wrap gap-2">
                    {capabilities.map((cap) => (
                      <button
                        key={cap.id}
                        onClick={() => setSelectedCapability(selectedCapability === cap.id ? null : cap.id)}
                        className={cn(
                          'rounded-full px-3 py-1 text-sm transition-colors',
                          selectedCapability === cap.id
                            ? 'bg-primary-600 text-white'
                            : 'bg-neutral-100 text-neutral-700 hover:bg-neutral-200'
                        )}
                      >
                        {cap.name}
                      </button>
                    ))}
                  </div>
                </div>
                <div className="flex items-end">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                      setSelectedStyle(null);
                      setSelectedCapability(null);
                    }}
                  >
                    Clear All
                  </Button>
                </div>
              </div>
            )}
          </div>

          {/* Category tabs */}
          <div className="mb-8 overflow-x-auto border-b border-neutral-200">
            <div className="flex gap-1">
              {categories.map((category) => (
                <button
                  key={category.id}
                  onClick={() => setSelectedCategory(category.id)}
                  className={cn(
                    'whitespace-nowrap border-b-2 px-4 py-3 text-sm font-medium transition-colors',
                    selectedCategory === category.id
                      ? 'border-primary-600 text-primary-600'
                      : 'border-transparent text-neutral-600 hover:border-neutral-300 hover:text-neutral-900'
                  )}
                >
                  {category.name}
                </button>
              ))}
            </div>
          </div>

          {/* Templates grid */}
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {filteredTemplates.map((template) => (
              <TemplateCard
                key={template.id}
                id={template.id}
                name={template.name}
                category={template.category}
                designType={template.designType as any}
                minimumPackage={template.minimumPackage as any}
                onPreview={(id) => {
                  window.location.href = `/templates/${id}`;
                }}
              />
            ))}
          </div>

          {filteredTemplates.length === 0 && (
            <div className="py-12 text-center">
              <p className="text-neutral-600">No templates found matching your criteria.</p>
              <Button
                variant="ghost"
                onClick={() => {
                  setSelectedCategory('all');
                  setSelectedStyle(null);
                  setSelectedCapability(null);
                  setSearchQuery('');
                }}
                className="mt-4"
              >
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
