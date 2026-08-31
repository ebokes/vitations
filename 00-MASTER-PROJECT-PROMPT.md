# INVITATION PROJECT — MASTER PROJECT PROMPT

## 1. PROJECT OVERVIEW

Build a premium Nigerian digital invitation platform where customers can browse, preview, purchase, and create digital invitations for weddings and other celebrations.

The platform must support invitation experiences ranging from:
- simple 2D invitations
- animated 2D invitations
- selected 3D elements
- advanced 3D invitations and animations
- interactive guest features

The product should feel like a premium digital invitation studio, not a generic SaaS dashboard.

## 2. CORE PACKAGES

### Essential — ₦50,000
- Basic 2D designs
- Basic animations
- Template selection
- Invitation customization
- Digital invitation link
- Guest access
- RSVP where implemented

Gift Registry is NOT available.

### Premium — ₦150,000
Includes Essential plus:
- Traditional/white wedding/reception/after-party location support
- Directions/map integration
- Media gallery
- Story/journey
- Images
- Collages
- Videos
- Advanced animation
- Selected 3D elements
- Gift Registry
- Cash gift options

### Ultimate — ₦350,000
Includes Premium plus:
- Advanced 3D
- Advanced animations
- Guest photo uploads
- Guest media moderation
- Social sharing of selected guest images
- Livestream link
- Event-day livestream activation
- Customer event photo uploads
- Customer event video uploads
- Additional supported premium interactive features

## 3. CUSTOM INVITATIONS

Provide a Custom Invitation request flow.

The initial public form collects ONLY:
- name
- phone number
- email address

The customer is contacted afterward to gather detailed requirements.

Do not build a complex custom quotation system initially.

## 4. CUSTOMER RULES

- One customer can create only ONE invitation for their event.
- No guest accounts.
- A customer may switch between templates available to their paid tier before final submission.
- The customer ultimately uses only ONE template.
- Once the invitation is submitted, it becomes locked.
- Customers cannot modify a locked invitation themselves.
- Admin can unlock, make corrections, and relock it.
- Unlocking/modification must be audited.
- Customer must review details before submission.
- The confirmation must subtly state that changes after submission require admin assistance.

Suggested confirmation:
"Please take a moment to review your details. Once your invitation is submitted, changes can only be made by our admin team."

## 5. EVENT TYPES AND LOCATIONS

Customers may select any combination of:
- Traditional Wedding
- White Wedding
- Reception
- After Party

Each selected event type may have its own:
- address
- location
- map/directions information

Only selected events appear in the invitation.

## 6. INVITATION EXPIRATION

Do NOT delete or disable the invitation when the event date arrives.

The countdown reaches zero on the event date.

After the event date:
- invitation remains accessible
- customer retains access to subscribed features
- the invitation can still be viewed

## 7. GUEST EXPERIENCE

When a guest opens the invitation link:

1. They first see a preview.
2. Preview should show celebrant/couple image and/or name.
3. Guest enters:
   - name
   - phone number
4. Guest accepts.
5. Guest enters the full invitation.

Do NOT collect guest email.

Guests do not create accounts.

The public invitation must not expose private customer information.

## 8. GIFT REGISTRY

Gift Registry is available only on Premium and Ultimate.

The registry supports:
- designated gift delivery address
- gift items
- gift intentions
- guest identity
- gift tracking
- received gift records

For cash gifts, support:
- configured payment gateway where appropriate
- configured bank/account details as an alternative

The customer/celebrant should be able to track:
- who intends to send each gift
- what gift they intend to send
- what gifts were received

## 9. MEDIA

Premium:
- customer gallery
- story/journey
- images
- collages
- videos

Ultimate:
- all Premium media
- customer event photos
- customer event videos
- guest photo uploads
- guest media moderation
- selected guest images may be shared to social platforms

Handle large iPhone media such as HEIC/HEIF appropriately.

## 10. LIVESTREAM

Ultimate can include a livestream link.

The customer can configure it before the event.

It can be activated specifically on the event day.

Initially, the platform stores/provides the external livestream URL rather than becoming a streaming provider.

## 11. ADMIN AND SUPER ADMIN

Admin:
- manages operational customer/invitation tasks
- can unlock invitations
- can correct submitted information
- manages guest media moderation
- manages custom requests
- manages permitted templates/content

Super Admin:
- manages administrators
- manages high-level configuration
- manages package/feature configuration
- manages templates and versions
- accesses platform-level administration

Do not give Admin Super Admin privileges.

All privileged actions require server-side authorization and audit logging.

## 12. INVITATION BUILDER

There is NO customer drag-and-drop invitation builder.

Customers use a structured form to enter information.

An invitation builder may exist for Admin later for controlled invitation/template creation.

## 13. STATE MANAGEMENT

Use:
- React state for local UI state
- React Hook Form for forms
- Zod for validation
- TanStack Query for appropriate server state

Do NOT use Zustand unless a future requirement clearly proves it necessary.

## 14. DARK MODE

Do NOT implement dark mode.

The platform uses a light interface.

Invitation templates may have their own visual themes, including dark invitation designs, but that is separate from the application UI.

## 15. CORE TECHNOLOGY DIRECTION

Use:
- Next.js
- TypeScript
- Supabase
- PostgreSQL
- Supabase Auth
- Supabase Storage
- TanStack Query
- React Hook Form
- Zod
- Motion for UI animation
- Lucide icons
- Paystack for payment processing
- Three.js only where required by 3D templates

Prefer Server Components where appropriate.

Use Client Components only where interaction requires them.

## 16. PERFORMANCE PRINCIPLES

The project must be optimized from the start.

Avoid:
- unnecessary client components
- unnecessary global state
- loading 3D libraries globally
- eager loading large media
- duplicated data fetching
- unnecessary dependencies

Use:
- dynamic imports
- lazy loading
- optimized images
- responsive media
- server rendering where appropriate
- TanStack Query caching
- isolated 3D renderers

## 17. SECURITY

Never expose:
- Supabase service-role key
- payment secrets
- private customer data
- admin-only information

All sensitive operations require server-side authorization.

RLS must protect customer-owned data.

Guest access must be invitation-scoped.

Payment success must be verified server-side.

Webhook processing must be idempotent.

## 18. DESIGN GOAL

The platform should feel:
- elegant
- premium
- trustworthy
- modern
- celebratory
- simple

The invitation itself should remain the visual focus.

## 19. DEVELOPMENT PRINCIPLES

Follow:
- DRY
- reusable components
- feature-based organization
- clear separation of concerns
- strong typing
- accessible UI
- mobile-first design
- incremental implementation
- testing
- focused Git commits

Do not over-engineer.

Do not build future features before their designated phase.

## 20. IMPLEMENTATION METHOD

The project is divided into sequential phases.

Complete one phase at a time.

For every phase:
1. inspect the existing project
2. implement only the requested phase
3. test it
4. run TypeScript checks
5. run lint
6. run production build where appropriate
7. inspect the Git diff
8. commit the phase
9. report completion
10. STOP

Never silently skip requirements.

Never automatically continue to the next phase.

## 21. SOURCE OF TRUTH

The master prompt and numbered phase prompts form the project specification.

If a later instruction conflicts with an earlier rule, identify the conflict and follow the most recent explicit product decision unless doing so would create a security or architectural problem.

Ask for clarification only when the conflict cannot safely be resolved.

