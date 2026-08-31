# 21 — SECURITY HARDENING

Perform a dedicated security pass.

Review:
- authentication
- authorization
- RLS
- server actions/API routes
- Supabase Storage policies
- payment webhooks
- public invitation access
- guest submissions
- file uploads
- admin actions
- role management
- environment variables
- secrets
- URL validation
- input validation
- rate limiting/abuse protection
- audit logging

Critical rules:
- Never expose Supabase service role key.
- Never trust client roles.
- Never trust client payment success.
- Never allow cross-customer data access.
- Never allow cross-invitation guest writes.
- Never expose private payment/admin data publicly.
- Never expose pending guest media.
- Never allow Admin to become Super Admin.
- Customer cannot modify submitted invitations.

Review dependency vulnerabilities.

Run appropriate security tests.

Commit:
security: harden application access controls

STOP.
