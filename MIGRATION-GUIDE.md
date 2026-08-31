# Database Migration Guide

## ✅ Connection Status: SUCCESS

Your Supabase credentials are working correctly! Now we need to create the database tables.

## Option 1: Apply Migrations via Supabase Dashboard (Recommended)

### Steps:

1. **Go to SQL Editor**
   - Visit: https://supabase.com/dashboard/project/jwlibzsmvxkfeebufdou/sql
   - Or: Dashboard → SQL Editor

2. **Run Each Migration in Order**

   **Migration 1: Core Schema** (001_create_core_schema.sql)
   - Click "New Query"
   - Copy contents from: `supabase/migrations/001_create_core_schema.sql`
   - Paste and click "Run"
   - Wait for "Success" message

   **Migration 2: RLS Policies** (002_enable_rls_policies.sql)
   - Click "New Query"
   - Copy contents from: `supabase/migrations/002_enable_rls_policies.sql`
   - Paste and click "Run"
   - Wait for "Success" message

   **Migration 3: Storage** (003_setup_storage.sql)
   - Click "New Query"
   - Copy contents from: `supabase/migrations/003_setup_storage.sql`
   - Paste and click "Run"
   - Wait for "Success" message

   **Migration 4: Seed Data** (004_seed_data.sql)
   - Click "New Query"
   - Copy contents from: `supabase/migrations/004_seed_data.sql`
   - Paste and click "Run"
   - Wait for "Success" message

3. **Verify Tables Created**
   - Go to: Dashboard → Table Editor
   - You should see 20 tables: profiles, packages, templates, invitations, etc.

## Option 2: Using Supabase CLI (Alternative)

If you have Supabase CLI installed:

```bash
# Install CLI (if not already installed)
npm install -g supabase

# Login
supabase login

# Link project
supabase link --project-ref jwlibzsmvxkfeebufdou

# Apply migrations
supabase db push
```

## After Migrations Are Applied

Run this command to verify everything worked:

```bash
npx tsx scripts/verify-database.ts
```

## What Gets Created

- **20 Tables**: profiles, packages, invitations, guests, rsvps, gifts, payments, media, etc.
- **68 RLS Policies**: Secure access control for all tables
- **24 Indexes**: Optimized query performance
- **3 Storage Buckets**: templates, invitations, guest-uploads
- **8 Helper Functions**: Role checking, slug generation, audit logging
- **Seed Data**: 3 packages with features, 6 demo templates

## Estimated Time

- Each migration takes 5-15 seconds
- Total time: ~2-3 minutes
