# 22 — PERFORMANCE OPTIMIZATION

Perform an application-wide performance review.

Focus on:
- initial page load
- mobile performance
- image optimization
- video loading
- 3D loading
- JavaScript bundle size
- server/client component boundaries
- database queries
- TanStack Query caching
- N+1 queries
- unnecessary rerenders
- public invitation rendering

Rules:
- 3D libraries load only when required.
- Heavy videos are lazy-loaded.
- Images are optimized and responsive.
- Do not fetch unused data.
- Avoid unnecessary client components.
- Do not introduce global state unnecessarily.
- Keep invitation pages fast on mobile.

Measure before and after where possible.

Do not make speculative optimizations that reduce maintainability without measurable benefit.

Commit:
perf: optimize application performance

STOP.
