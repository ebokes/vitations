# 25 — FINAL REVIEW & HANDOFF

Perform the final project review.

Review all requirements from:
- Master Project Prompt
- Agent Operating Rules
- Database specification
- Design system
- Public website
- Authentication
- Invitation setup
- Templates
- Rendering
- Guest experience
- RSVP
- Gift Registry
- Payments
- Media
- Livestream
- Customer dashboard
- Admin
- Super Admin
- Custom requests
- Notifications
- Security
- Performance
- Testing
- Deployment

Create a requirements checklist.

For each requirement:
PASS
PARTIAL
FAIL
NOT APPLICABLE

Do not mark PASS merely because a component exists.

Verify actual behavior.

Check particularly:

1. One invitation per customer.
2. No guest accounts.
3. Guest email is not collected.
4. Customer invitation locks after submission.
5. Customer cannot modify locked invitation.
6. Admin can unlock with audit trail.
7. Invitation remains accessible after event date.
8. Countdown reaches zero on event date.
9. Subscribed features remain available after event.
10. Essential has no Gift Registry.
11. Premium has Gift Registry.
12. Ultimate supports guest media.
13. Ultimate supports customer event images/videos.
14. Livestream can be activated for the event.
15. Traditional Wedding, White Wedding, Reception and After Party can be independently selected.
16. Each selected event can have its own address/location.
17. Cash gifts support configured payment/bank details.
18. Template switching is allowed only before final submission.
19. Customer ultimately has one selected template.
20. Custom invitation form collects name, phone and email only.
21. Admin and Super Admin permissions are distinct.
22. TanStack Query is used where appropriate.
23. Zustand is not introduced.
24. No dark mode.
25. 3D assets/libraries are loaded only where needed.
26. iPhone HEIC/HEIF uploads are handled appropriately.
27. Guest-uploaded media requires moderation before public display.
28. Payment webhooks are idempotent.
29. Service-role secrets are never exposed.
30. RLS protects private records.

Perform final:
- TypeScript
- lint
- tests
- production build
- dependency review
- security review
- responsive review

Review git history.

Ensure commits are focused and understandable.

Create final handoff documentation containing:

Architecture summary
Database summary
Environment variables
Deployment steps
Admin instructions
Known limitations
Future enhancements
Testing status

Do not introduce major new features during final review.

If critical failures exist, fix them before declaring completion.

Final commit:

chore: complete production readiness review

Return a final report containing:

Overall status
Requirements status
Security status
Performance status
Testing status
Deployment status
Known issues
Recommended next actions

STOP.
