# 06 — AUTHENTICATION & ACCOUNT SYSTEM

Implement customer authentication using Supabase Auth.

Goals:
- Customer sign up/sign in/sign out.
- Email and password authentication.
- Password reset.
- Protected customer routes.
- Profile creation after registration.
- Customer role enforcement.
- No guest accounts.
- Admin and Super Admin authentication must use the same secure identity foundation.
- Never expose service-role credentials to the browser.

Rules:
- A customer may own only one invitation.
- Do not create an invitation merely because a customer registered.
- Require authentication before invitation creation/purchase completion where appropriate.
- Preserve form state where practical when authentication interrupts the flow.
- Guest invitation access does not require an account.
- Guest details are name and phone only.

Implement:
- auth routes/pages
- auth callbacks
- protected route handling
- session handling
- profile synchronization
- logout
- password reset
- auth error states
- loading states

Security:
- Validate authorization server-side.
- Do not trust client role values.
- Prevent authenticated users from accessing another customer's private records.
- Review RLS policies.

Validation:
- TypeScript
- lint
- tests
- production build

Commit:
feat: implement authentication and account system

STOP after this phase and report results.
