# 24 — DEPLOYMENT & PRODUCTION

Prepare the application for production.

Target architecture:
- Next.js application
- Supabase
- PostgreSQL
- Supabase Storage
- Paystack
- production hosting such as Vercel where appropriate

Configure:
- environment variables
- production Supabase project
- migrations
- storage policies
- authentication URLs
- Paystack production credentials
- webhook endpoint
- domain
- SSL
- error monitoring where configured

Never commit secrets.

Create:
- .env.example
- deployment documentation
- migration procedure
- rollback guidance

Production checklist:
- auth works
- RLS works
- storage works
- payments work
- webhooks work
- public invitations work
- guest flow works
- admin roles work
- Super Admin works
- email/notifications work where configured
- domain works
- metadata works

Do not migrate demo data into production.

Commit:
chore: prepare production deployment

STOP.
