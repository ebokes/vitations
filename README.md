# Vitations - Premium Nigerian Digital Invitation Platform

A premium digital invitation platform for Nigerian weddings and celebrations.

## Tech Stack

- Next.js 14
- TypeScript
- Supabase (Auth, Database, Storage)
- TanStack Query
- React Hook Form + Zod
- Tailwind CSS
- Lucide Icons

## Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn
- Supabase project
- Paystack account

### Environment Variables

1. Copy `.env.example` to `.env.local`
2. Fill in your Supabase credentials
3. Fill in your Paystack credentials

### Development

```bash
npm install
npm run dev
```

### Production Build

```bash
npm run build
npm start
```

## Deployment

### Vercel (Recommended)

1. Push to GitHub
2. Import project in Vercel
3. Configure environment variables
4. Deploy

### Environment Variables for Production

| Variable | Description |
|----------|-------------|
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase project URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase anonymous key |
| `SUPABASE_SERVICE_ROLE_KEY` | Supabase service role key (server-side only) |
| `NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY` | Paystack public key |
| `PAYSTACK_SECRET_KEY` | Paystack secret key (server-side only) |
| `PAYSTACK_WEBHOOK_SECRET` | Paystack webhook signing secret |
| `NEXT_PUBLIC_APP_URL` | Production application URL |

### Supabase Setup

1. Create a new Supabase project
2. Run database migrations from `/supabase/migrations`
3. Configure storage buckets (media, thumbnails)
4. Set up RLS policies
5. Configure authentication URLs

### Paystack Setup

1. Create a Paystack account
2. Get API keys from dashboard
3. Configure webhook endpoint: `https://your-domain.com/api/payments/webhook`
4. Set webhook secret in environment variables

## Production Checklist

- [ ] Authentication works (sign-up, sign-in, password reset)
- [ ] RLS policies enforced
- [ ] Storage buckets configured with proper policies
- [ ] Payments initialize and verify correctly
- [ ] Webhooks receive and process events
- [ ] Public invitations render correctly
- [ ] Guest flow works (access, RSVP, view)
- [ ] Admin role access works
- [ ] Super Admin role access works
- [ ] Notifications system functional
- [ ] Custom invitation requests work
- [ ] Media upload and moderation work
- [ ] Livestream configuration works
- [ ] Gift registry works
- [ ] Domain and SSL configured
- [ ] Error monitoring configured

## Project Structure

```
├── app/                    # Next.js App Router pages
│   ├── admin/             # Admin dashboard
│   ├── auth/              # Authentication pages
│   ├── dashboard/         # Customer dashboard
│   ├── super-admin/       # Super admin dashboard
│   └── api/               # API routes
├── components/            # Reusable UI components
├── lib/                   # Business logic and utilities
│   ├── admin/             # Admin features
│   ├── custom-requests/   # Custom invitation requests
│   ├── dashboard/         # Customer dashboard
│   ├── media/             # Media system
│   ├── notifications/     # Notification system
│   ├── payment/           # Payment system
│   ├── super-admin/       # Super admin features
│   └── supabase/          # Supabase client setup
├── supabase/              # Database migrations
├── types/                 # TypeScript types
└── __tests__/             # Test files
```

## Security Notes

- Never commit `.env.local` or any environment files with secrets
- Service role key is server-side only
- All admin routes require authentication and role verification
- Webhook signatures are verified using constant-time comparison
- Security headers configured in `next.config.js`
