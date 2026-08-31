-- Enable Row Level Security on all tables
alter table profiles enable row level security;
alter table packages enable row level security;
alter table package_features enable row level security;
alter table templates enable row level security;
alter table template_versions enable row level security;
alter table invitations enable row level security;
alter table invitation_versions enable row level security;
alter table events enable row level security;
alter table guests enable row level security;
alter table rsvps enable row level security;
alter table gift_registries enable row level security;
alter table gift_registry_items enable row level security;
alter table gift_claims enable row level security;
alter table orders enable row level security;
alter table payments enable row level security;
alter table media enable row level security;
alter table livestreams enable row level security;
alter table custom_invitation_requests enable row level security;
alter table notifications enable row level security;
alter table audit_logs enable row level security;

-- Helper function to check user role
create or replace function get_user_role(user_id uuid)
returns user_role as $$
  select role from profiles where id = user_id;
$$ language sql security definer;

-- Helper function to check if user is admin or super_admin
create or replace function is_admin(user_id uuid)
returns boolean as $$
  select exists(
    select 1 from profiles
    where id = user_id
    and role in ('admin', 'super_admin')
  );
$$ language sql security definer;

-- Helper function to check if user is super_admin
create or replace function is_super_admin(user_id uuid)
returns boolean as $$
  select exists(
    select 1 from profiles
    where id = user_id
    and role = 'super_admin'
  );
$$ language sql security definer;

-- Profiles policies
create policy "Users can view their own profile"
  on profiles for select
  using (auth.uid() = id);

create policy "Users can update their own profile"
  on profiles for update
  using (auth.uid() = id);

create policy "Admins can view all profiles"
  on profiles for select
  using (is_admin(auth.uid()));

create policy "Super admins can update any profile"
  on profiles for update
  using (is_super_admin(auth.uid()));

create policy "Super admins can delete profiles"
  on profiles for delete
  using (is_super_admin(auth.uid()));

-- Packages policies (public read, admin write)
create policy "Anyone can view active packages"
  on packages for select
  using (is_active = true);

create policy "Admins can view all packages"
  on packages for select
  using (is_admin(auth.uid()));

create policy "Super admins can manage packages"
  on packages for all
  using (is_super_admin(auth.uid()));

-- Package features policies
create policy "Anyone can view package features"
  on package_features for select
  using (true);

create policy "Super admins can manage package features"
  on package_features for all
  using (is_super_admin(auth.uid()));

-- Templates policies
create policy "Anyone can view active templates"
  on templates for select
  using (status = 'active');

create policy "Admins can view all templates"
  on templates for select
  using (is_admin(auth.uid()));

create policy "Admins can manage templates"
  on templates for all
  using (is_admin(auth.uid()));

-- Template versions policies
create policy "Anyone can view current template versions"
  on template_versions for select
  using (is_current = true);

create policy "Admins can view all template versions"
  on template_versions for select
  using (is_admin(auth.uid()));

create policy "Admins can manage template versions"
  on template_versions for all
  using (is_admin(auth.uid()));

-- Invitations policies
create policy "Customers can view their own invitation"
  on invitations for select
  using (customer_id = auth.uid());

create policy "Customers can create their own invitation"
  on invitations for insert
  with check (customer_id = auth.uid());

create policy "Customers can update their draft invitation"
  on invitations for update
  using (customer_id = auth.uid() and status = 'draft');

create policy "Admins can view all invitations"
  on invitations for select
  using (is_admin(auth.uid()));

create policy "Admins can update any invitation"
  on invitations for update
  using (is_admin(auth.uid()));

-- Public access to invitation by slug (limited fields exposed via views/functions)
create policy "Public can view invitations by slug"
  on invitations for select
  using (slug is not null and status in ('submitted', 'locked', 'completed'));

-- Invitation versions policies
create policy "Customers can view their invitation versions"
  on invitation_versions for select
  using (
    exists(
      select 1 from invitations
      where id = invitation_versions.invitation_id
      and customer_id = auth.uid()
    )
  );

create policy "Admins can view all invitation versions"
  on invitation_versions for select
  using (is_admin(auth.uid()));

create policy "System can create invitation versions"
  on invitation_versions for insert
  with check (true);

-- Events policies
create policy "Customers can manage their invitation events"
  on events for all
  using (
    exists(
      select 1 from invitations
      where id = events.invitation_id
      and customer_id = auth.uid()
    )
  );

create policy "Public can view events for public invitations"
  on events for select
  using (
    exists(
      select 1 from invitations
      where id = events.invitation_id
      and slug is not null
      and status in ('submitted', 'locked', 'completed')
    )
  );

create policy "Admins can manage all events"
  on events for all
  using (is_admin(auth.uid()));

-- Guests policies
create policy "Customers can view their invitation guests"
  on guests for select
  using (
    exists(
      select 1 from invitations
      where id = guests.invitation_id
      and customer_id = auth.uid()
    )
  );

create policy "Public can create guest records"
  on guests for insert
  with check (true);

create policy "Admins can manage all guests"
  on guests for all
  using (is_admin(auth.uid()));

-- RSVPs policies
create policy "Customers can view their invitation RSVPs"
  on rsvps for select
  using (
    exists(
      select 1 from invitations
      where id = rsvps.invitation_id
      and customer_id = auth.uid()
    )
  );

create policy "Public can create RSVPs"
  on rsvps for insert
  with check (true);

create policy "Public can update their own RSVP"
  on rsvps for update
  using (
    exists(
      select 1 from guests
      where id = rsvps.guest_id
    )
  );

create policy "Admins can manage all RSVPs"
  on rsvps for all
  using (is_admin(auth.uid()));

-- Gift registries policies
create policy "Customers can manage their gift registry"
  on gift_registries for all
  using (
    exists(
      select 1 from invitations
      where id = gift_registries.invitation_id
      and customer_id = auth.uid()
    )
  );

create policy "Public can view gift registries"
  on gift_registries for select
  using (
    exists(
      select 1 from invitations
      where id = gift_registries.invitation_id
      and slug is not null
      and status in ('submitted', 'locked', 'completed')
    )
  );

create policy "Admins can manage all gift registries"
  on gift_registries for all
  using (is_admin(auth.uid()));

-- Gift registry items policies
create policy "Customers can manage their gift items"
  on gift_registry_items for all
  using (
    exists(
      select 1 from gift_registries gr
      join invitations i on gr.invitation_id = i.id
      where gr.id = gift_registry_items.registry_id
      and i.customer_id = auth.uid()
    )
  );

create policy "Public can view gift items"
  on gift_registry_items for select
  using (
    exists(
      select 1 from gift_registries gr
      join invitations i on gr.invitation_id = i.id
      where gr.id = gift_registry_items.registry_id
      and i.slug is not null
      and i.status in ('submitted', 'locked', 'completed')
    )
  );

create policy "Admins can manage all gift items"
  on gift_registry_items for all
  using (is_admin(auth.uid()));

-- Gift claims policies
create policy "Customers can view claims for their gifts"
  on gift_claims for select
  using (
    exists(
      select 1 from gift_registry_items gri
      join gift_registries gr on gri.registry_id = gr.id
      join invitations i on gr.invitation_id = i.id
      where gri.id = gift_claims.registry_item_id
      and i.customer_id = auth.uid()
    )
  );

create policy "Public can create gift claims"
  on gift_claims for insert
  with check (true);

create policy "Public can view all gift claims"
  on gift_claims for select
  using (true);

create policy "Admins can manage all gift claims"
  on gift_claims for all
  using (is_admin(auth.uid()));

-- Orders policies
create policy "Customers can view their own orders"
  on orders for select
  using (customer_id = auth.uid());

create policy "System can create orders"
  on orders for insert
  with check (customer_id = auth.uid());

create policy "Admins can view all orders"
  on orders for select
  using (is_admin(auth.uid()));

-- Payments policies
create policy "Customers can view their own payments"
  on payments for select
  using (
    exists(
      select 1 from orders
      where id = payments.order_id
      and customer_id = auth.uid()
    )
  );

create policy "System can create payments"
  on payments for insert
  with check (true);

create policy "Admins can view all payments"
  on payments for select
  using (is_admin(auth.uid()));

create policy "Admins can update payments"
  on payments for update
  using (is_admin(auth.uid()));

-- Media policies
create policy "Customers can manage their invitation media"
  on media for all
  using (
    exists(
      select 1 from invitations
      where id = media.invitation_id
      and customer_id = auth.uid()
    )
  );

create policy "Public can create guest media"
  on media for insert
  with check (guest_id is not null);

create policy "Public can view approved media"
  on media for select
  using (
    moderation_status = 'approved'
    and is_visible = true
    and exists(
      select 1 from invitations
      where id = media.invitation_id
      and slug is not null
      and status in ('submitted', 'locked', 'completed')
    )
  );

create policy "Admins can manage all media"
  on media for all
  using (is_admin(auth.uid()));

-- Livestreams policies
create policy "Customers can manage their livestream"
  on livestreams for all
  using (
    exists(
      select 1 from invitations
      where id = livestreams.invitation_id
      and customer_id = auth.uid()
    )
  );

create policy "Public can view active livestreams"
  on livestreams for select
  using (
    status = 'active'
    and exists(
      select 1 from invitations
      where id = livestreams.invitation_id
      and slug is not null
      and status in ('submitted', 'locked', 'completed')
    )
  );

create policy "Admins can manage all livestreams"
  on livestreams for all
  using (is_admin(auth.uid()));

-- Custom invitation requests policies
create policy "Anyone can create custom requests"
  on custom_invitation_requests for insert
  with check (true);

create policy "Admins can view all custom requests"
  on custom_invitation_requests for select
  using (is_admin(auth.uid()));

create policy "Admins can update custom requests"
  on custom_invitation_requests for update
  using (is_admin(auth.uid()));

-- Notifications policies
create policy "Users can view their own notifications"
  on notifications for select
  using (user_id = auth.uid());

create policy "Users can update their own notifications"
  on notifications for update
  using (user_id = auth.uid());

create policy "System can create notifications"
  on notifications for insert
  with check (true);

create policy "Admins can manage all notifications"
  on notifications for all
  using (is_admin(auth.uid()));

-- Audit logs policies (read-only for admins)
create policy "Admins can view audit logs"
  on audit_logs for select
  using (is_admin(auth.uid()));

create policy "System can create audit logs"
  on audit_logs for insert
  with check (true);
