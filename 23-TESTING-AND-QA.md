# 23 — TESTING & QA

Create the complete testing pass.

Test layers:

1. Unit
2. Component
3. Integration
4. Database/RLS
5. API/server operations
6. Payment/webhook
7. Critical end-to-end flows

Critical user flows:

Customer:
register
→ choose template
→ choose package
→ enter details
→ review
→ pay
→ submit
→ invitation locked

Guest:
open invitation
→ preview
→ name + phone
→ accept
→ view invitation
→ RSVP

Premium:
location
gallery
story
gift registry
cash gift

Ultimate:
3D
customer media
guest uploads
moderation
social sharing
livestream

Admin:
unlock
→ correction
→ relock
→ audit

Security:
cross-user access
cross-invitation access
role escalation
payment webhook replay
unauthorized mutation

Run:
TypeScript
lint
tests
production build

Fix failures rather than suppressing them.

Commit:
test: complete application QA suite

STOP.
