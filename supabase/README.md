# Database Migrations

This directory contains SQL migrations for the Vitations platform database.

## Migrations

1. **001_create_core_schema.sql** - Creates all core tables, enums, indexes, and triggers
2. **002_enable_rls_policies.sql** - Enables Row Level Security and defines access policies
3. **003_setup_storage.sql** - Creates storage buckets and storage policies
4. **004_seed_data.sql** - Seeds initial data (packages, features, demo templates, helper functions)

## Running Migrations

### Using Supabase CLI

```bash
# Link to your Supabase project
supabase link --project-ref your-project-ref

# Apply all migrations
supabase db push

# Or apply migrations individually
supabase db execute --file supabase/migrations/001_create_core_schema.sql
supabase db execute --file supabase/migrations/002_enable_rls_policies.sql
supabase db execute --file supabase/migrations/003_setup_storage.sql
supabase db execute --file supabase/migrations/004_seed_data.sql
```

### Using Supabase Dashboard

1. Go to your Supabase project dashboard
2. Navigate to SQL Editor
3. Copy and paste each migration file in order
4. Execute each one

## Schema Overview

### Core Tables

- **profiles** - User profiles extending auth.users
- **packages** - Package tiers (Essential, Premium, Ultimate)
- **package_features** - Features available in each package
- **templates** - Invitation templates
- **template_versions** - Template version history
- **invitations** - Customer invitations (one per customer)
- **invitation_versions** - Invitation change history
- **events** - Event locations for each invitation
- **guests** - Guest records (no accounts)
- **rsvps** - Guest RSVP responses
- **gift_registries** - Gift registry configuration
- **gift_registry_items** - Items in gift registries
- **gift_claims** - Guest gift claims
- **orders** - Customer orders
- **payments** - Payment records
- **media** - Customer and guest media uploads
- **livestreams** - Livestream configuration (Ultimate only)
- **custom_invitation_requests** - Custom invitation requests
- **notifications** - User notifications
- **audit_logs** - Audit trail for administrative actions

### Key Constraints

1. **One Invitation Per Customer** - Enforced via unique constraint and trigger
2. **Package Feature Validation** - Helper functions to check feature access
3. **RLS Policies** - All tables protected with appropriate access controls
4. **Cascade Deletes** - Related records properly cascade on parent deletion
5. **Auto-updated Timestamps** - `updated_at` automatically maintained via triggers

### Helper Functions

- `get_user_role(user_id)` - Returns user's role
- `is_admin(user_id)` - Checks if user is admin or super_admin
- `is_super_admin(user_id)` - Checks if user is super_admin
- `generate_invitation_slug(couple_name)` - Generates unique invitation slug
- `create_audit_log(...)` - Creates audit log entry
- `check_package_features(invitation_id, feature_key)` - Validates package features

### Storage Buckets

- **templates** - Public bucket for template assets (10MB limit)
- **invitations** - Private bucket for customer invitation media (50MB limit)
- **guest-uploads** - Private bucket for guest photo uploads (25MB limit)

### Security

All tables have RLS enabled with appropriate policies:
- Customers can only access their own data
- Admins can manage operational data
- Super admins have full access
- Public access is intentionally scoped for guest experience
- Payment and order data is read-only for customers

## Development Notes

- Demo templates are prefixed with `[DEMO]` to distinguish them from production templates
- All timestamps are UTC
- UUIDs are used for primary keys
- Foreign keys maintain referential integrity
- Indexes are added for common query patterns

## Regenerating TypeScript Types

After schema changes, regenerate TypeScript types:

```bash
npx supabase gen types typescript --project-id your-project-id > types/database.ts
```

Or use the Supabase CLI:

```bash
supabase gen types typescript --local > types/database.ts
```
