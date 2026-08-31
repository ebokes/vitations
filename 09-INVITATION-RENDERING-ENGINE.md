# 09 — INVITATION RENDERING ENGINE

Build the reusable engine that renders a submitted invitation from:
Invitation data + Template Version + Feature entitlements.

Separate:
- content/data
- presentation
- template renderer
- feature sections

Support sections such as:
- hero
- celebrant information
- story
- events
- gallery
- gifts
- RSVP
- livestream
- guest media
- footer

Rules:
- Render only enabled/available sections.
- Never expose package-ineligible features.
- Mobile-first.
- Responsive desktop support.
- Lazy-load heavy media.
- Dynamic-load 3D renderers.
- Respect prefers-reduced-motion.
- Provide fallbacks for unsupported devices.
- Do not expose private customer/payment data.

The renderer must work from a stable invitation snapshot/version so future template changes do not alter submitted invitations unexpectedly.

Create clear interfaces for:
TemplateRenderer
InvitationContext
InvitationSection
FeatureEntitlement

Add automated tests for:
- Essential rendering
- Premium rendering
- Ultimate rendering
- unavailable feature suppression
- missing optional content
- responsive behavior assumptions

Commit:
feat: build invitation rendering engine

STOP.
