# 05 — PUBLIC WEBSITE & MARKETING EXPERIENCE

Build the public-facing website.

Do NOT build:
- complete customer dashboard
- complete invitation builder
- full admin dashboard
- complete payment system

## PRIMARY JOURNEY

Homepage
→ Browse Templates
→ Preview Template
→ Choose Package
→ Create Invitation
→ Payment
→ Customer invitation management

## PUBLIC NAVIGATION

Support:
- Home
- Templates
- Packages
- How It Works
- Custom Invitation
- Sign In
- Create Your Invitation

Use responsive mobile navigation.

## HOMEPAGE

Sections:
1. Header
2. Hero
3. Featured templates
4. Why choose us
5. Package overview
6. How it works
7. Invitation experience showcase
8. Customer reviews
9. Custom invitation CTA
10. FAQ
11. Final CTA
12. Footer

## HERO

Clearly communicate that the service provides digital invitations for celebrations.

Primary CTA:
Explore Invitations

Secondary CTA:
Create Your Invitation

Use invitation previews as the primary visual.

## TEMPLATE BROWSING

Create:
- template listing
- categories
- filtering
- preview links

Initial event categories:
- Traditional Wedding
- White Wedding
- Reception
- After Party
- Birthday
- Anniversary
- Other Celebrations

Potential design filters:
- Classic
- Elegant
- Modern
- Minimal
- Floral
- Luxury
- Traditional

Potential capability filters:
- 2D
- Animated
- 3D

## TEMPLATE PREVIEW

Visitors can preview a template before selecting it.

Support:
- mobile preview
- desktop preview
- animation where available
- 3D where available

CTA:
Use This Template

Do not create customer invitations simply because a visitor opens a preview.

## PACKAGE PRESENTATION

Essential — ₦50,000:
- basic 2D
- basic animation
- template selection
- customization
- invitation link
- guest access
- RSVP where applicable
- NO Gift Registry

Premium — ₦150,000:
- all Essential
- Traditional/White Wedding/Reception/After Party locations
- map/directions
- gallery
- story/journey
- images
- collages
- videos
- advanced animation
- selected 3D
- Gift Registry
- cash gifts

Ultimate — ₦350,000:
- all Premium
- advanced 3D
- advanced animation
- guest photo uploads
- guest media moderation
- selected social sharing
- livestream link
- event-day livestream activation
- customer event photos
- customer event videos
- additional supported interactive features

## PACKAGE COMPARISON

Create responsive comparison UI.

On mobile, use stacked/expandable sections where necessary.

Prices must come from configuration/database, not duplicated hard-coded values.

## TEMPLATE/PACKAGE COMPATIBILITY

If a selected template is unavailable for a package, explain why and offer eligible alternatives.

## HOW IT WORKS

Explain:

1. Choose a template
2. Select package
3. Enter event details
4. Review
5. Confirm and submit
6. Receive invitation link
7. Share with guests

## CUSTOMER LOCK

Public messaging should explain that customers review details before final submission.

After submission, changes require admin assistance.

Do not imply unlimited editing.

## GUEST EXPERIENCE

Explain:
Invitation link
→ preview
→ name + phone
→ accept
→ full invitation
→ RSVP
→ gifts/media/livestream according to package

No guest account.
No guest email.

## EVENT LOCATIONS

Explain that customers can independently select:
- Traditional Wedding
- White Wedding
- Reception
- After Party

and provide separate addresses/locations.

## GIFT REGISTRY

Explain Premium/Ultimate registry:
- designated delivery address
- gift items
- intended sender
- gift tracking
- received gifts
- cash gifts

Cash gifts may use configured payment gateway or bank/account details.

Do not claim a specific provider unless configured.

## MEDIA

Premium:
- gallery
- story
- images
- collages
- videos

Ultimate additionally:
- customer event images
- customer event videos
- guest uploads
- moderation
- selected social sharing

## LIVESTREAM

Ultimate supports a configured external livestream URL.

Explain event-day activation.

Do not claim the platform itself is a streaming provider.

## CUSTOM INVITATION

Public form collects:
- name
- phone
- email

After submission, the team contacts the requester for details.

## CUSTOMER REVIEWS

Include review section.

Use realistic Nigerian names for demo content, but clearly mark demo/seed content internally and never falsely represent fictional testimonials as verified.

Support optional:
- social handle
- event type
- profile image

## SOCIAL MEDIA

Support configurable:
- Instagram
- TikTok
- Facebook
- WhatsApp

Do not invent production handles.

## FAQ

Cover:
- what digital invitations are
- template selection
- package differences
- template switching
- submission lock
- event-date behavior
- RSVP
- Gift Registry
- cash gifts
- guest uploads
- livestream
- custom invitations

## INVITATION DATE BEHAVIOR

Do NOT say invitations expire on the event date.

Correct behavior:
- countdown reaches zero
- invitation remains accessible
- subscribed features remain available

## ONE INVITATION RULE

Do not market unlimited invitation creation.

One customer creates one event invitation.

## SEO

Implement:
- title
- description
- canonical
- Open Graph
- social metadata
- structured metadata where appropriate

Template pages should have useful unique metadata.

## PERFORMANCE

Use:
- Next.js image optimization
- responsive images
- lazy loading
- dynamic imports
- server rendering where appropriate

Do not load all template media at once.

Do not autoplay many large videos.

3D previews should be lightweight and load full 3D only when requested.

## ANALYTICS READINESS

Prepare event names such as:
- template_view
- template_preview
- template_selected
- package_view
- package_selected
- custom_request_started
- custom_request_submitted
- signup_started

Do not add an unnecessary heavy analytics platform at this phase.

## SECURITY

Public pages must never expose:
- private customer data
- payment records
- admin data
- secrets

## ROUTES

Establish appropriate public routes, such as:
/
 /templates
 /templates/[slug]
 /packages
 /how-it-works
 /custom-invitation
 /contact

## VISUAL QA

Check:
- mobile
- tablet
- desktop
- typography
- spacing
- template discoverability
- package clarity
- CTA hierarchy
- image quality
- overall premium feel

## TESTING

Test:
- navigation
- template filtering
- template preview
- package selection
- custom request form
- FAQ
- responsive behavior

Run:
- TypeScript
- lint
- tests
- production build

Commit:

feat: build public marketing website

STOP and report.
