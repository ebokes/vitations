# 15 — LIVESTREAM

Implement livestream support for Ultimate invitations.

The platform initially stores/provides an external livestream URL rather than becoming a streaming provider.

Features:
- configure livestream URL
- title
- scheduled/active/ended/disabled state
- event-day activation
- guest-facing livestream section

The customer may prepare the link before the event.

The livestream can be activated specifically for the event.

Do not automatically activate it merely because the event date exists.

Only Ultimate invitations can expose the livestream.

Validate URLs server-side.

Do not expose internal configuration.

Create appropriate customer and guest UI states:
- upcoming
- active
- ended
- unavailable

Commit:
feat: implement livestream functionality

STOP.
