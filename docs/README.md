# Project Documentation

## Phase Status

- [x] Phase 01: Master Project Prompt
- [x] Phase 02: Agent Initialization
- [ ] Phase 03: Database and Supabase
- [ ] Phase 04: Design System and UI Foundation
- [ ] Phase 05: Public Website and Marketing
- [ ] Phase 06: Authentication and Account System
- [ ] Phase 07: Customer Invitation Setup
- [ ] Phase 08: Template System
- [ ] Phase 09: Invitation Rendering Engine
- [ ] Phase 10: Guest Experience
- [ ] Phase 11: RSVP
- [ ] Phase 12: Gift Registry
- [ ] Phase 13: Payments and Paystack
- [ ] Phase 14: Media System
- [ ] Phase 15: Livestream
- [ ] Phase 16: Customer Dashboard
- [ ] Phase 17: Admin Dashboard
- [ ] Phase 18: Super Admin
- [ ] Phase 19: Custom Invitation Requests
- [ ] Phase 20: Notifications
- [ ] Phase 21: Security Hardening
- [ ] Phase 22: Performance Optimization
- [ ] Phase 23: Testing and QA
- [ ] Phase 24: Deployment and Production
- [ ] Phase 25: Final Review and Handoff

## Architecture

### Directory Structure

```
vitations/
├── app/                    # Next.js App Router pages
├── components/             # Shared components
│   └── ui/                # Base UI components
├── features/              # Feature-based modules
├── lib/                   # Utility libraries
├── hooks/                 # Custom React hooks
├── types/                 # TypeScript type definitions
├── supabase/              # Supabase config and migrations
│   └── migrations/        # Database migrations
├── tests/                 # Test files
└── docs/                  # Project documentation
```

### Tech Stack

- **Framework**: Next.js 14 with App Router
- **Language**: TypeScript
- **Database**: PostgreSQL via Supabase
- **Auth**: Supabase Auth
- **Storage**: Supabase Storage
- **State Management**: React state, TanStack Query
- **Forms**: React Hook Form
- **Validation**: Zod
- **Styling**: Tailwind CSS
- **Animation**: Motion
- **Icons**: Lucide React
- **Payments**: Paystack

### Key Principles

1. **No Dark Mode**: Light interface only
2. **No Zustand**: Use React state and TanStack Query
3. **Server-First**: Prefer Server Components
4. **Security**: All sensitive operations server-side
5. **Performance**: Lazy loading, optimized images, dynamic imports
6. **Mobile-First**: Responsive design
7. **Accessibility**: WCAG-compliant UI

## Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn
- Supabase account
- Paystack account (for payments)

### Setup

1. Clone the repository
2. Copy `.env.example` to `.env.local` and fill in values
3. Install dependencies: `npm install`
4. Run development server: `npm run dev`
5. Open http://localhost:3000

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint
- `npm run type-check` - Run TypeScript checks

## Package Tiers

### Essential (₦50,000)
- Basic 2D designs
- Basic animations
- Template customization
- Digital invitation link
- Guest access
- RSVP

### Premium (₦150,000)
All Essential features plus:
- Multiple event locations
- Map integration
- Media gallery
- Advanced animations
- Selected 3D elements
- Gift Registry

### Ultimate (₦350,000)
All Premium features plus:
- Advanced 3D
- Guest photo uploads
- Media moderation
- Social sharing
- Livestream integration
- Event-day features

## Security Notes

- Never commit `.env` files
- Never expose service role keys
- All payment verification is server-side
- RLS policies protect all user data
- Webhook handlers are idempotent
