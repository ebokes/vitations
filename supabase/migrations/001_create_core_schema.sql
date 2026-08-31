-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- Create enum types
create type user_role as enum ('customer', 'admin', 'super_admin');
create type invitation_status as enum ('draft', 'submitted', 'locked', 'unlocked_by_admin', 'completed');
create type event_type as enum ('traditional_wedding', 'white_wedding', 'reception', 'after_party');
create type package_tier as enum ('essential', 'premium', 'ultimate');
create type payment_status as enum ('pending', 'completed', 'failed', 'refunded');
create type rsvp_status as enum ('attending', 'not_attending', 'maybe');
create type media_type as enum ('image', 'video', 'document');
create type media_processing_status as enum ('pending', 'processing', 'completed', 'failed');
create type media_moderation_status as enum ('pending', 'approved', 'rejected');
create type gift_claim_status as enum ('intended', 'purchased', 'delivered');
create type custom_request_status as enum ('new', 'contacted', 'quoted', 'accepted', 'in_progress', 'completed', 'cancelled');
create type livestream_status as enum ('inactive', 'scheduled', 'active', 'ended');
create type template_status as enum ('draft', 'active', 'retired');
create type design_type as enum ('2d_basic', '2d_animated', '2d_advanced', '3d_selected', '3d_advanced');

-- Create tables
-- Profiles table (extends Supabase auth.users)
create table profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  role user_role not null default 'customer',
  email text not null,
  phone text,
  full_name text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Packages table
create table packages (
  id uuid primary key default uuid_generate_v4(),
  tier package_tier not null unique,
  name text not null,
  description text,
  price_ngn integer not null,
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Package features table
create table package_features (
  id uuid primary key default uuid_generate_v4(),
  package_id uuid not null references packages(id) on delete cascade,
  feature_key text not null,
  feature_name text not null,
  feature_description text,
  created_at timestamptz not null default now()
);

-- Templates table
create table templates (
  id uuid primary key default uuid_generate_v4(),
  name text not null,
  description text,
  design_type design_type not null,
  category text,
  minimum_package package_tier not null,
  preview_url text,
  thumbnail_url text,
  status template_status not null default 'draft',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Template versions table (for versioning)
create table template_versions (
  id uuid primary key default uuid_generate_v4(),
  template_id uuid not null references templates(id) on delete cascade,
  version_number integer not null,
  config jsonb not null,
  is_current boolean not null default false,
  created_at timestamptz not null default now(),
  unique(template_id, version_number)
);

-- Invitations table
create table invitations (
  id uuid primary key default uuid_generate_v4(),
  customer_id uuid not null references profiles(id) on delete cascade,
  package_id uuid not null references packages(id),
  template_id uuid references templates(id),
  template_version_id uuid references template_versions(id),
  status invitation_status not null default 'draft',
  slug text unique,
  couple_name_primary text,
  couple_name_secondary text,
  event_date date,
  custom_data jsonb,
  submitted_at timestamptz,
  locked_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  -- Enforce one invitation per customer
  unique(customer_id)
);

-- Invitation versions table (for audit trail)
create table invitation_versions (
  id uuid primary key default uuid_generate_v4(),
  invitation_id uuid not null references invitations(id) on delete cascade,
  version_number integer not null,
  data jsonb not null,
  created_by uuid references profiles(id),
  created_at timestamptz not null default now(),
  unique(invitation_id, version_number)
);

-- Events table (event locations)
create table events (
  id uuid primary key default uuid_generate_v4(),
  invitation_id uuid not null references invitations(id) on delete cascade,
  event_type event_type not null,
  title text not null,
  address text not null,
  latitude numeric(10, 7),
  longitude numeric(10, 7),
  map_url text,
  directions_info text,
  event_datetime timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Guests table
create table guests (
  id uuid primary key default uuid_generate_v4(),
  invitation_id uuid not null references invitations(id) on delete cascade,
  name text not null,
  phone text not null,
  accessed_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- RSVPs table
create table rsvps (
  id uuid primary key default uuid_generate_v4(),
  invitation_id uuid not null references invitations(id) on delete cascade,
  guest_id uuid not null references guests(id) on delete cascade,
  status rsvp_status not null,
  guest_count integer default 1,
  message text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique(invitation_id, guest_id)
);

-- Gift registry configuration
create table gift_registries (
  id uuid primary key default uuid_generate_v4(),
  invitation_id uuid not null references invitations(id) on delete cascade unique,
  delivery_address text,
  bank_name text,
  account_name text,
  account_number text,
  payment_gateway_config jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Gift registry items
create table gift_registry_items (
  id uuid primary key default uuid_generate_v4(),
  registry_id uuid not null references gift_registries(id) on delete cascade,
  item_name text not null,
  item_description text,
  item_url text,
  quantity_desired integer default 1,
  quantity_claimed integer default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Gift claims
create table gift_claims (
  id uuid primary key default uuid_generate_v4(),
  registry_item_id uuid not null references gift_registry_items(id) on delete cascade,
  guest_id uuid not null references guests(id) on delete cascade,
  quantity integer not null default 1,
  status gift_claim_status not null default 'intended',
  notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Orders table
create table orders (
  id uuid primary key default uuid_generate_v4(),
  customer_id uuid not null references profiles(id) on delete cascade,
  package_id uuid not null references packages(id),
  amount_ngn integer not null,
  currency text not null default 'NGN',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Payments table
create table payments (
  id uuid primary key default uuid_generate_v4(),
  order_id uuid not null references orders(id) on delete cascade,
  provider text not null,
  provider_reference text not null unique,
  amount_ngn integer not null,
  status payment_status not null default 'pending',
  metadata jsonb,
  verified_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Media table
create table media (
  id uuid primary key default uuid_generate_v4(),
  invitation_id uuid not null references invitations(id) on delete cascade,
  uploader_id uuid references profiles(id),
  guest_id uuid references guests(id),
  media_type media_type not null,
  storage_path text not null,
  original_filename text,
  file_size_bytes bigint,
  mime_type text,
  processing_status media_processing_status not null default 'pending',
  moderation_status media_moderation_status not null default 'pending',
  is_visible boolean not null default false,
  width integer,
  height integer,
  duration_seconds integer,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  check ((uploader_id is not null) or (guest_id is not null))
);

-- Livestreams table
create table livestreams (
  id uuid primary key default uuid_generate_v4(),
  invitation_id uuid not null references invitations(id) on delete cascade unique,
  external_url text not null,
  title text,
  status livestream_status not null default 'inactive',
  scheduled_start timestamptz,
  activated_at timestamptz,
  ended_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Custom invitation requests
create table custom_invitation_requests (
  id uuid primary key default uuid_generate_v4(),
  name text not null,
  phone text not null,
  email text not null,
  status custom_request_status not null default 'new',
  internal_notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Notifications table
create table notifications (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid not null references profiles(id) on delete cascade,
  type text not null,
  title text not null,
  message text not null,
  is_read boolean not null default false,
  metadata jsonb,
  created_at timestamptz not null default now()
);

-- Audit logs table
create table audit_logs (
  id uuid primary key default uuid_generate_v4(),
  actor_id uuid references profiles(id),
  action text not null,
  resource_type text not null,
  resource_id uuid,
  old_data jsonb,
  new_data jsonb,
  metadata jsonb,
  ip_address inet,
  user_agent text,
  created_at timestamptz not null default now()
);

-- Create indexes for common queries
create index idx_profiles_role on profiles(role);
create index idx_profiles_email on profiles(email);
create index idx_invitations_customer_id on invitations(customer_id);
create index idx_invitations_slug on invitations(slug);
create index idx_invitations_status on invitations(status);
create index idx_events_invitation_id on events(invitation_id);
create index idx_guests_invitation_id on guests(invitation_id);
create index idx_rsvps_invitation_id on rsvps(invitation_id);
create index idx_rsvps_guest_id on rsvps(guest_id);
create index idx_gift_registry_items_registry_id on gift_registry_items(registry_id);
create index idx_gift_claims_registry_item_id on gift_claims(registry_item_id);
create index idx_gift_claims_guest_id on gift_claims(guest_id);
create index idx_orders_customer_id on orders(customer_id);
create index idx_payments_order_id on payments(order_id);
create index idx_payments_provider_reference on payments(provider_reference);
create index idx_media_invitation_id on media(invitation_id);
create index idx_media_uploader_id on media(uploader_id);
create index idx_media_guest_id on media(guest_id);
create index idx_media_moderation_status on media(moderation_status);
create index idx_notifications_user_id on notifications(user_id);
create index idx_notifications_is_read on notifications(is_read);
create index idx_audit_logs_actor_id on audit_logs(actor_id);
create index idx_audit_logs_resource_type on audit_logs(resource_type);
create index idx_audit_logs_created_at on audit_logs(created_at);

-- Create updated_at trigger function
create or replace function update_updated_at_column()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

-- Apply updated_at triggers
create trigger update_profiles_updated_at before update on profiles
  for each row execute function update_updated_at_column();
create trigger update_packages_updated_at before update on packages
  for each row execute function update_updated_at_column();
create trigger update_templates_updated_at before update on templates
  for each row execute function update_updated_at_column();
create trigger update_invitations_updated_at before update on invitations
  for each row execute function update_updated_at_column();
create trigger update_events_updated_at before update on events
  for each row execute function update_updated_at_column();
create trigger update_guests_updated_at before update on guests
  for each row execute function update_updated_at_column();
create trigger update_rsvps_updated_at before update on rsvps
  for each row execute function update_updated_at_column();
create trigger update_gift_registries_updated_at before update on gift_registries
  for each row execute function update_updated_at_column();
create trigger update_gift_registry_items_updated_at before update on gift_registry_items
  for each row execute function update_updated_at_column();
create trigger update_gift_claims_updated_at before update on gift_claims
  for each row execute function update_updated_at_column();
create trigger update_orders_updated_at before update on orders
  for each row execute function update_updated_at_column();
create trigger update_payments_updated_at before update on payments
  for each row execute function update_updated_at_column();
create trigger update_media_updated_at before update on media
  for each row execute function update_updated_at_column();
create trigger update_livestreams_updated_at before update on livestreams
  for each row execute function update_updated_at_column();
create trigger update_custom_invitation_requests_updated_at before update on custom_invitation_requests
  for each row execute function update_updated_at_column();
