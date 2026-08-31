import dynamic from 'next/dynamic';
import { TemplateRendererContract } from './renderer-contract';

/**
 * Dynamic template renderer loader.
 * Uses Next.js dynamic imports to load renderers on demand.
 * 3D templates are only loaded when needed.
 */
export async function loadTemplateRenderer(
  rendererType: '2d' | 'animated' | '3d'
): Promise<TemplateRendererContract> {
  switch (rendererType) {
    case '3d':
      // Lazy load 3D renderer only when needed
      const { Template3DRenderer } = await import('./renderers/three-d');
      return Template3DRenderer;
    case 'animated':
      const { AnimatedTemplateRenderer } = await import('./renderers/animated');
      return AnimatedTemplateRenderer;
    case '2d':
    default:
      const { BaseTemplateRenderer } = await import('./renderers/base');
      return BaseTemplateRenderer;
  }
}

/**
 * Preload a renderer type (for performance)
 */
export function preloadRenderer(rendererType: '2d' | 'animated' | '3d'): void {
  switch (rendererType) {
    case '3d':
      import('./renderers/three-d');
      break;
    case 'animated':
      import('./renderers/animated');
      break;
    case '2d':
    default:
      import('./renderers/base');
      break;
  }
}
