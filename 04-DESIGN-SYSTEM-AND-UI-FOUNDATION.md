# 04 — DESIGN SYSTEM & UI FOUNDATION

Establish the reusable visual system for the Invitation Project.

## DESIGN OBJECTIVE

The product is a premium Nigerian digital invitation service.

Visual qualities:
- elegant
- celebratory
- trustworthy
- modern
- refined
- simple

Avoid making it look like a generic SaaS dashboard.

## RESPONSIVE DESIGN

Support:
- mobile
- tablet
- desktop
- large desktop

Guest invitation experience is especially mobile-focused.

## PLATFORM UI VS INVITATION UI

The platform has its own design system.

Individual invitation templates may have completely different:
- colors
- fonts
- backgrounds
- animations
- decorative elements

Do not allow invitation themes to leak into dashboard/public UI.

## DARK MODE

Do NOT implement dark mode.

Invitation designs may still contain dark visual themes.

## DESIGN TOKENS

Centralize:
- colors
- typography
- spacing
- radius
- shadows
- transitions
- breakpoints

Use semantic tokens.

## TYPOGRAPHY

Define:
- display
- H1
- H2
- H3
- H4
- body
- small
- caption
- label

Use readable platform fonts and avoid loading excessive font families.

## COMPONENTS

Create reusable primitives for:
- Button
- Input
- Textarea
- Select
- Checkbox
- Radio
- Dialog
- Card
- Badge
- Toast
- Skeleton
- Empty state
- Error state
- Loading state
- File upload

Use established UI conventions.

## FORM SYSTEM

Use:
- React Hook Form
- Zod

Validation must be understandable and accessible.

## TEMPLATE CARD

Reusable template card should support:
- preview
- name
- category
- package eligibility
- animation indicator
- 3D indicator
- preview action
- selection state

## PACKAGE BADGES

Support:
- Essential
- Premium
- Ultimate

## MEDIA COMPONENTS

Foundations for:
- image
- video
- gallery
- upload
- upload progress
- processing state

Prepare for large iPhone HEIC/HEIF media.

Do not implement complete media processing yet.

## INVITATION PREVIEW FOUNDATION

Create reusable foundations for the future guest preview:
- celebrant image
- celebrant/couple name
- event identity

## CUSTOMER CONFIRMATION

Prepare the confirmation UI for final invitation submission:

"Please take a moment to review your details. Once your invitation is submitted, changes can only be made by our admin team."

Actions:
- Review Invitation
- Back to Edit
- Submit Invitation

## LOCKED INVITATION

Prepare visual states for:
- submitted
- locked
- admin-modified
- completed/event date reached

Do not make the locked state look like an error.

## ANIMATION

Use Motion for UI animation.

Respect `prefers-reduced-motion`.

## 3D

3D renderers must be isolated and dynamically loaded.

Do not globally load Three.js.

## ICONS

Use Lucide consistently.

## ACCESSIBILITY

Support:
- keyboard navigation
- focus states
- semantic HTML
- accessible labels
- screen readers
- contrast
- reduced motion

## ARCHITECTURE

Separate:
components/ui
from
feature/product components.

Use Server Components by default where appropriate.

Use Client Components only where interaction requires them.

Use TanStack Query for appropriate server state.

Do not use Zustand.

## PERFORMANCE

Avoid:
- unnecessary client components
- huge bundles
- eager media loading
- global 3D libraries

Use:
- dynamic imports
- lazy loading
- optimized images
- code splitting

## CUSTOMER REVIEWS

Create a reusable review component supporting:
- name
- review
- event type
- optional image
- optional social handle

Demo reviews using Nigerian names must be clearly treated as demo/seed content, not falsely presented as verified testimonials.

## SOCIAL MEDIA

Support configurable:
- Instagram
- TikTok
- Facebook
- WhatsApp

Do not invent production handles.

## VALIDATION

Inspect visually on mobile, tablet and desktop.

Run:
- TypeScript
- lint
- tests
- build

Commit:

feat: establish design system and ui foundation

STOP.
