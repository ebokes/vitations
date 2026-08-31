import { Template, TemplateFilter, PackageTier } from './types';

const TEMPLATES: Template[] = [
  {
    id: 'tpl-elegant-001',
    name: 'Elegant Gold',
    slug: 'elegant-gold',
    description: 'A sophisticated design with gold accents and warm tones, perfect for upscale celebrations.',
    rendererType: '2d',
    designStyle: 'elegant',
    supportedPackages: ['essential', 'premium', 'ultimate'],
    supportedEventTypes: ['traditional_wedding', 'white_wedding', 'reception'],
    visualConfig: {
      primaryColor: '#b88360',
      secondaryColor: '#f5f0ea',
      accentColor: '#a96a44',
      fontFamily: 'Georgia, serif',
      backgroundType: 'gradient',
      backgroundValue: 'linear-gradient(135deg, #f5f0ea 0%, #dfc9b5 100%)',
    },
    previewAssets: {
      thumbnail: '/templates/elegant-gold/thumbnail.jpg',
      mobilePreview: '/templates/elegant-gold/mobile.jpg',
      desktopPreview: '/templates/elegant-gold/desktop.jpg',
    },
    requiredFeatures: [],
    version: 1,
    status: 'active',
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z',
  },
  {
    id: 'tpl-floral-002',
    name: 'Garden Romance',
    slug: 'garden-romance',
    description: 'Beautiful floral patterns with soft pastels, ideal for garden and outdoor celebrations.',
    rendererType: 'animated',
    designStyle: 'floral',
    supportedPackages: ['premium', 'ultimate'],
    supportedEventTypes: ['traditional_wedding', 'white_wedding', 'reception', 'after_party'],
    visualConfig: {
      primaryColor: '#f4804d',
      secondaryColor: '#fef5f0',
      accentColor: '#fbcdb5',
      fontFamily: 'Palatino, serif',
      backgroundType: 'gradient',
      backgroundValue: 'linear-gradient(180deg, #fef5f0 0%, #fde8db 100%)',
    },
    previewAssets: {
      thumbnail: '/templates/garden-romance/thumbnail.jpg',
      mobilePreview: '/templates/garden-romance/mobile.jpg',
      desktopPreview: '/templates/garden-romance/desktop.jpg',
    },
    requiredFeatures: ['animated_elements'],
    version: 1,
    status: 'active',
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z',
  },
  {
    id: 'tpl-modern-003',
    name: 'Modern Minimal',
    slug: 'modern-minimal',
    description: 'Clean, contemporary design with bold typography and minimal embellishments.',
    rendererType: '2d',
    designStyle: 'modern',
    supportedPackages: ['essential', 'premium', 'ultimate'],
    supportedEventTypes: ['white_wedding', 'birthday', 'anniversary', 'other'],
    visualConfig: {
      primaryColor: '#56443c',
      secondaryColor: '#faf8f5',
      accentColor: '#ae8f77',
      fontFamily: 'Helvetica Neue, sans-serif',
      backgroundType: 'solid',
      backgroundValue: '#faf8f5',
    },
    previewAssets: {
      thumbnail: '/templates/modern-minimal/thumbnail.jpg',
      mobilePreview: '/templates/modern-minimal/mobile.jpg',
      desktopPreview: '/templates/modern-minimal/desktop.jpg',
    },
    requiredFeatures: [],
    version: 1,
    status: 'active',
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z',
  },
  {
    id: 'tpl-traditional-004',
    name: 'Heritage Pride',
    slug: 'heritage-pride',
    description: 'Rich traditional Nigerian patterns and colors celebrating cultural heritage.',
    rendererType: 'animated',
    designStyle: 'traditional',
    supportedPackages: ['premium', 'ultimate'],
    supportedEventTypes: ['traditional_wedding', 'reception'],
    visualConfig: {
      primaryColor: '#955438',
      secondaryColor: '#efe5db',
      accentColor: '#7c4230',
      fontFamily: 'Georgia, serif',
      backgroundType: 'gradient',
      backgroundValue: 'linear-gradient(135deg, #efe5db 0%, #dfc9b5 100%)',
    },
    previewAssets: {
      thumbnail: '/templates/heritage-pride/thumbnail.jpg',
      mobilePreview: '/templates/heritage-pride/mobile.jpg',
      desktopPreview: '/templates/heritage-pride/desktop.jpg',
    },
    requiredFeatures: ['animated_elements', 'cultural_patterns'],
    version: 1,
    status: 'active',
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z',
  },
  {
    id: 'tpl-luxury-005',
    name: 'Royal Prestige',
    slug: 'royal-prestige',
    description: 'Opulent 3D design with dynamic animations and luxurious finishing touches.',
    rendererType: '3d',
    designStyle: 'luxury',
    supportedPackages: ['ultimate'],
    supportedEventTypes: ['traditional_wedding', 'white_wedding', 'reception'],
    visualConfig: {
      primaryColor: '#67372c',
      secondaryColor: '#f8f4f0',
      accentColor: '#cca688',
      fontFamily: 'Times New Roman, serif',
      backgroundType: 'gradient',
      backgroundValue: 'linear-gradient(180deg, #f8f4f0 0%, #efe5db 100%)',
    },
    previewAssets: {
      thumbnail: '/templates/royal-prestige/thumbnail.jpg',
      mobilePreview: '/templates/royal-prestige/mobile.jpg',
      desktopPreview: '/templates/royal-prestige/desktop.jpg',
    },
    requiredFeatures: ['3d_elements', 'interactive_animations', 'particle_effects'],
    version: 1,
    status: 'active',
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z',
  },
];

// In-memory template versions store
const templateVersions: Map<string, Template[]> = new Map();

/**
 * Get all active templates
 */
export function getAllTemplates(): Template[] {
  return TEMPLATES.filter((t) => t.status === 'active');
}

/**
 * Get template by ID
 */
export function getTemplateById(id: string): Template | undefined {
  return TEMPLATES.find((t) => t.id === id);
}

/**
 * Get template by slug
 */
export function getTemplateBySlug(slug: string): Template | undefined {
  return TEMPLATES.find((t) => t.slug === slug);
}

/**
 * Filter templates based on criteria
 */
export function filterTemplates(filter: TemplateFilter): Template[] {
  let templates = getAllTemplates();

  if (filter.search) {
    const search = filter.search.toLowerCase();
    templates = templates.filter(
      (t) =>
        t.name.toLowerCase().includes(search) ||
        t.description.toLowerCase().includes(search)
    );
  }

  if (filter.eventTypes && filter.eventTypes.length > 0) {
    templates = templates.filter((t) =>
      filter.eventTypes!.some((et) => t.supportedEventTypes.includes(et))
    );
  }

  if (filter.designStyles && filter.designStyles.length > 0) {
    templates = templates.filter((t) =>
      filter.designStyles!.includes(t.designStyle)
    );
  }

  if (filter.rendererTypes && filter.rendererTypes.length > 0) {
    templates = templates.filter((t) =>
      filter.rendererTypes!.includes(t.rendererType)
    );
  }

  if (filter.packageTier) {
    templates = templates.filter((t) =>
      t.supportedPackages.includes(filter.packageTier!)
    );
  }

  return templates;
}

/**
 * Check if a template is eligible for a given package tier
 */
export function isTemplateEligible(
  templateId: string,
  packageTier: PackageTier
): boolean {
  const template = getTemplateById(templateId);
  if (!template) return false;
  return template.supportedPackages.includes(packageTier);
}

/**
 * Get templates eligible for a package tier
 */
export function getEligibleTemplates(packageTier: PackageTier): Template[] {
  return getAllTemplates().filter((t) =>
    t.supportedPackages.includes(packageTier)
  );
}

/**
 * Save a template version (when used by a submitted invitation)
 */
export function saveTemplateVersion(
  templateId: string,
  invitationId: string
): void {
  const template = getTemplateById(templateId);
  if (!template) return;

  const versions = templateVersions.get(templateId) || [];
  const versionSnapshot = { ...template, version: template.version };
  versions.push(versionSnapshot);
  templateVersions.set(templateId, versions);
}

/**
 * Resolve template version for an invitation
 */
export function resolveTemplateVersion(
  templateId: string,
  version: number
): Template | undefined {
  const versions = templateVersions.get(templateId);
  if (!versions) return getTemplateById(templateId);
  return versions.find((v) => v.version === version) || getTemplateById(templateId);
}

/**
 * Get renderer type for dynamic import
 */
export function getRendererType(
  templateId: string
): '2d' | 'animated' | '3d' | undefined {
  const template = getTemplateById(templateId);
  return template?.rendererType;
}
