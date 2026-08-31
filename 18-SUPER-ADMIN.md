# 18 — SUPER ADMIN

Build Super Admin capabilities after Admin is working.

Super Admin can:
- manage admin users
- assign/revoke admin role
- manage package configuration
- manage feature entitlements
- manage templates
- publish/retire template versions
- view platform-level operational information
- access administrative audit logs
- manage configuration that regular Admins cannot change

Security:
- Super Admin operations require server-side authorization.
- Admin cannot grant Super Admin privileges.
- Role changes must be audited.
- Do not expose service-role credentials.

Keep Super Admin functionality separate from normal operational Admin screens.

Commit:
feat: implement super admin controls

STOP.
