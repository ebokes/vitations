# 20 — NOTIFICATIONS

Implement the notification foundation.

Potential notifications:
- payment successful
- payment failed
- invitation submitted
- invitation ready
- admin unlock/update
- guest RSVP
- gift claim
- gift received
- guest media approved/rejected
- livestream activation

Use email only where the product actually requires it.

Guests do not provide email, so guest email notifications are not part of the initial system.

Customer email notifications may use the authenticated customer's email.

Keep notification templates centralized.

Do not send duplicate notifications from repeated webhooks/events.

Create notification logging where appropriate.

Commit:
feat: implement notification system

STOP.
