'use client';

import * as React from 'react';
import {
  InvitationRendererProps,
  InvitationContext,
  DEFAULT_SECTION_ORDER,
} from './types';
import { getRenderableSections } from './section-registry';

/**
 * Main invitation rendering engine.
 * Renders sections based on invitation data, template, and feature entitlements.
 */
export function InvitationRenderer({
  context,
  sections,
  className,
}: InvitationRendererProps) {
  const { entitlements } = context;

  const renderableSections = React.useMemo(() => {
    return getRenderableSections(entitlements, sections || DEFAULT_SECTION_ORDER);
  }, [entitlements, sections]);

  return (
    <div
      className={`invitation-renderer min-h-screen ${className || ''}`}
      style={{
        fontFamily: context.template.visualConfig.fontFamily,
      }}
    >
      {renderableSections.map((section) => {
        const SectionComponent = section.component;
        return (
          <SectionComponent
            key={section.type}
            context={context}
          />
        );
      })}
    </div>
  );
}

/**
 * Preview renderer for template preview mode.
 * Uses mock data for demonstration.
 */
export function InvitationPreviewRenderer({
  context,
  className,
}: Omit<InvitationRendererProps, 'sections'> & { className?: string }) {
  return (
    <InvitationRenderer
      context={context}
      sections={['hero', 'celebrant', 'events', 'footer']}
      className={className}
    />
  );
}
