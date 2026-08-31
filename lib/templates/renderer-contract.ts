import { Template, PackageTier } from './types';

export interface TemplateRendererProps {
  template: Template;
  data: {
    celebrantName: string;
    coCelebrantName?: string;
    eventTitle: string;
    events: Array<{
      type: string;
      date: string;
      time?: string;
      venue?: string;
      address?: string;
      description?: string;
    }>;
    features: {
      songLink?: string;
      giftRegistryEnabled?: boolean;
      livestreamUrl?: string;
    };
  };
  mode: 'preview' | 'full';
}

export interface TemplateRenderer {
  component: React.ComponentType<TemplateRendererProps>;
  requiredFeatures: string[];
}

/**
 * Contract for template renderers.
 * Each renderer must:
 * 1. Accept TemplateRendererProps
 * 2. Render the invitation based on template visual config
 * 3. Support both preview and full modes
 */
export type TemplateRendererContract = React.ComponentType<TemplateRendererProps>;
