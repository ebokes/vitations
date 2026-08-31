export type PackageTier = 'essential' | 'premium' | 'ultimate';

export type TemplateRendererType = '2d' | 'animated' | '3d';

export type EventType =
  | 'traditional_wedding'
  | 'white_wedding'
  | 'reception'
  | 'after_party'
  | 'birthday'
  | 'anniversary'
  | 'other';

export type DesignStyle =
  | 'classic'
  | 'elegant'
  | 'modern'
  | 'minimal'
  | 'floral'
  | 'luxury'
  | 'traditional';

export interface TemplateVisualConfig {
  primaryColor: string;
  secondaryColor: string;
  accentColor: string;
  fontFamily: string;
  backgroundType: 'solid' | 'gradient' | 'image';
  backgroundValue: string;
}

export interface TemplatePreviewAssets {
  thumbnail: string;
  mobilePreview: string;
  desktopPreview: string;
}

export interface Template {
  id: string;
  name: string;
  slug: string;
  description: string;
  rendererType: TemplateRendererType;
  designStyle: DesignStyle;
  supportedPackages: PackageTier[];
  supportedEventTypes: EventType[];
  visualConfig: TemplateVisualConfig;
  previewAssets: TemplatePreviewAssets;
  requiredFeatures: string[];
  version: number;
  status: 'active' | 'retired' | 'draft';
  createdAt: string;
  updatedAt: string;
}

export interface TemplateVersion {
  templateId: string;
  version: number;
  snapshot: Template;
  usedByInvitationId?: string;
  createdAt: string;
}

export interface TemplateFilter {
  search?: string;
  eventTypes?: EventType[];
  designStyles?: DesignStyle[];
  rendererTypes?: TemplateRendererType[];
  packageTier?: PackageTier;
}
