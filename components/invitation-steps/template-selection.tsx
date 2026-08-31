'use client';

import * as React from 'react';
import { Sparkles } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useInvitationForm } from '@/components/invitation-form-provider';
import { cn } from '@/lib/utils';

const mockTemplates = [
  { id: '1', name: 'Royal Elegance', category: 'Traditional Wedding', designType: '2d_basic', minimumPackage: 'essential' },
  { id: '2', name: 'Modern Grace', category: 'White Wedding', designType: '2d_animated', minimumPackage: 'premium' },
  { id: '3', name: 'Golden Celebration', category: 'Reception', designType: '3d_selected', minimumPackage: 'premium' },
  { id: '4', name: 'Classic Charm', category: 'Birthday', designType: '2d_basic', minimumPackage: 'essential' },
  { id: '5', name: 'Floral Dreams', category: 'Traditional Wedding', designType: '2d_animated', minimumPackage: 'premium' },
  { id: '6', name: 'Luxury Noir', category: 'White Wedding', designType: '3d_advanced', minimumPackage: 'ultimate' },
];

export function TemplateSelectionStep() {
  const { formData, updateFormData } = useInvitationForm();
  const [selected, setSelected] = React.useState<string>(formData.templateId || '');

  const handleSelect = (id: string) => {
    setSelected(id);
    updateFormData({ templateId: id });
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold text-neutral-900">Choose Your Template</h2>
        <p className="mt-1 text-neutral-600">
          Select a design that matches your celebration style.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {mockTemplates.map((template) => (
          <button
            key={template.id}
            type="button"
            onClick={() => handleSelect(template.id)}
            className={cn(
              'text-left rounded-xl border-2 p-4 transition-all',
              selected === template.id
                ? 'border-primary-600 bg-primary-50'
                : 'border-neutral-200 bg-white hover:border-neutral-300'
            )}
          >
            <div className="aspect-[3/4] rounded-lg bg-gradient-to-br from-primary-100 to-primary-200 flex items-center justify-center">
              <Sparkles className="h-12 w-12 text-primary-600/30" />
            </div>
            <div className="mt-3">
              <h3 className="font-semibold text-neutral-900">{template.name}</h3>
              <p className="text-sm text-neutral-600">{template.category}</p>
              <div className="mt-2 flex items-center gap-2">
                <Badge variant="secondary" className="text-xs">
                  {template.designType.replace('_', ' ')}
                </Badge>
                <Badge variant="outline" className="text-xs capitalize">
                  {template.minimumPackage}+
                </Badge>
              </div>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}
