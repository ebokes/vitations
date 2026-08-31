# 17 — ADMIN DASHBOARD

Build the Admin role.

Admin responsibilities:
- view customers
- view invitations
- review submitted invitations
- unlock invitations
- make authorized corrections
- relock invitations
- manage guest media moderation
- review custom invitation requests
- manage operational data
- review payments/orders where permitted
- manage templates according to permissions

Admin unlock workflow:
1. Open invitation
2. Select unlock
3. Enter reason
4. Confirm
5. Invitation becomes editable under admin control
6. Make required correction
7. Relock
8. Write audit log

Admin must not:
- elevate their own role
- access unrelated secrets
- bypass audit logging
- modify payment records arbitrarily

Build strong permission checks server-side.

Commit:
feat: build admin dashboard

STOP.
