-- Seed packages
insert into packages (tier, name, description, price_ngn, is_active) values
  ('essential', 'Essential', 'Perfect for simple celebrations with all the basics you need', 50000, true),
  ('premium', 'Premium', 'Enhanced features for a memorable digital invitation experience', 150000, true),
  ('ultimate', 'Ultimate', 'The complete package with advanced features and unlimited possibilities', 350000, true);

-- Seed package features for Essential
insert into package_features (package_id, feature_key, feature_name, feature_description)
select
  p.id,
  unnest(array['basic_2d_designs', 'basic_animations', 'template_selection', 'invitation_customization', 'digital_link', 'guest_access', 'rsvp']),
  unnest(array['Basic 2D Designs', 'Basic Animations', 'Template Selection', 'Invitation Customization', 'Digital Invitation Link', 'Guest Access', 'RSVP']),
  unnest(array['Access to beautiful 2D invitation templates', 'Simple animations to bring your invitation to life', 'Choose from our curated template collection', 'Personalize your invitation with your details', 'Shareable link for your digital invitation', 'Guests can view and interact with your invitation', 'Track guest attendance responses'])
from packages p
where p.tier = 'essential';

-- Seed package features for Premium
insert into package_features (package_id, feature_key, feature_name, feature_description)
select
  p.id,
  unnest(array['all_essential', 'multiple_events', 'map_integration', 'media_gallery', 'story_section', 'advanced_animations', '3d_elements', 'gift_registry', 'cash_gifts']),
  unnest(array['All Essential Features', 'Multiple Event Locations', 'Map Integration', 'Media Gallery', 'Story/Journey Section', 'Advanced Animations', 'Selected 3D Elements', 'Gift Registry', 'Cash Gift Options']),
  unnest(array['Everything from the Essential package', 'Support for Traditional, White Wedding, Reception, and After Party', 'Integrated maps and directions for each event', 'Upload photos and videos to share with guests', 'Tell your love story with beautiful layouts', 'Enhanced animations for a premium feel', 'Add depth with selected 3D design elements', 'Let guests choose gifts from your registry', 'Accept cash gifts via payment gateway or bank transfer'])
from packages p
where p.tier = 'premium';

-- Seed package features for Ultimate
insert into package_features (package_id, feature_key, feature_name, feature_description)
select
  p.id,
  unnest(array['all_premium', 'advanced_3d', 'guest_photo_uploads', 'media_moderation', 'social_sharing', 'livestream', 'event_day_activation', 'customer_event_uploads']),
  unnest(array['All Premium Features', 'Advanced 3D Animations', 'Guest Photo Uploads', 'Guest Media Moderation', 'Social Sharing', 'Livestream Integration', 'Event-Day Activation', 'Customer Event Uploads']),
  unnest(array['Everything from the Premium package', 'Stunning 3D animations and effects', 'Allow guests to upload photos during your event', 'Review and approve guest photos before they appear', 'Share selected photos to social media', 'Embed livestream link for remote guests', 'Activate special features on your event day', 'Upload your official event photos and videos'])
from packages p
where p.tier = 'ultimate';

-- Seed demo templates
-- Note: These are placeholder templates for development
insert into templates (name, description, design_type, category, minimum_package, status) values
  ('[DEMO] Classic Elegance', 'A timeless design with elegant typography and subtle animations', '2d_animated', 'Classic', 'essential', 'active'),
  ('[DEMO] Modern Minimalist', 'Clean lines and contemporary aesthetic for modern couples', '2d_animated', 'Modern', 'essential', 'active'),
  ('[DEMO] Traditional Royalty', 'Rich colors and traditional motifs celebrating Nigerian heritage', '2d_advanced', 'Traditional', 'premium', 'active'),
  ('[DEMO] Garden Romance', 'Floral elements with soft animations and natural tones', '2d_animated', 'Romantic', 'essential', 'active'),
  ('[DEMO] Luxury Gold', 'Premium design with gold accents and sophisticated animations', '3d_selected', 'Luxury', 'premium', 'active'),
  ('[DEMO] Celestial Dreams', 'Advanced 3D elements with cosmic theme and flowing animations', '3d_advanced', 'Unique', 'ultimate', 'active');

-- Create initial template versions for each template
insert into template_versions (template_id, version_number, config, is_current)
select
  t.id,
  1,
  jsonb_build_object(
    'version', '1.0.0',
    'description', 'Initial template version',
    'components', jsonb_build_array()
  ),
  true
from templates t;

-- Create a function to auto-create profile on user signup
create or replace function handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, email, role)
  values (new.id, new.email, 'customer');
  return new;
end;
$$ language plpgsql security definer;

-- Trigger to create profile on auth.users insert
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function handle_new_user();

-- Function to generate unique invitation slug
create or replace function generate_invitation_slug(couple_name text)
returns text as $$
declare
  base_slug text;
  final_slug text;
  counter integer := 0;
begin
  -- Create base slug from couple name
  base_slug := lower(regexp_replace(couple_name, '[^a-zA-Z0-9]+', '-', 'g'));
  base_slug := trim(both '-' from base_slug);

  -- Try to find unique slug
  final_slug := base_slug;
  while exists(select 1 from invitations where slug = final_slug) loop
    counter := counter + 1;
    final_slug := base_slug || '-' || counter;
  end loop;

  return final_slug;
end;
$$ language plpgsql;

-- Function to create audit log entry
create or replace function create_audit_log(
  p_actor_id uuid,
  p_action text,
  p_resource_type text,
  p_resource_id uuid,
  p_old_data jsonb default null,
  p_new_data jsonb default null,
  p_metadata jsonb default null
)
returns uuid as $$
declare
  log_id uuid;
begin
  insert into audit_logs (actor_id, action, resource_type, resource_id, old_data, new_data, metadata)
  values (p_actor_id, p_action, p_resource_type, p_resource_id, p_old_data, p_new_data, p_metadata)
  returning id into log_id;

  return log_id;
end;
$$ language plpgsql security definer;

-- Function to enforce one invitation per customer
create or replace function check_one_invitation_per_customer()
returns trigger as $$
begin
  if exists(
    select 1 from invitations
    where customer_id = new.customer_id
    and id != coalesce(new.id, '00000000-0000-0000-0000-000000000000'::uuid)
  ) then
    raise exception 'Customer can only have one invitation';
  end if;
  return new;
end;
$$ language plpgsql;

-- Trigger to enforce one invitation per customer
create trigger enforce_one_invitation_per_customer
  before insert or update on invitations
  for each row execute function check_one_invitation_per_customer();

-- Function to validate package features
create or replace function check_package_features(
  p_invitation_id uuid,
  p_feature_key text
)
returns boolean as $$
declare
  has_feature boolean;
begin
  select exists(
    select 1
    from invitations i
    join packages pkg on i.package_id = pkg.id
    join package_features pf on pkg.id = pf.package_id
    where i.id = p_invitation_id
    and pf.feature_key = p_feature_key
  ) into has_feature;

  return has_feature;
end;
$$ language plpgsql security definer;

-- Function to increment gift item claim count
create or replace function increment_gift_claim_count()
returns trigger as $$
begin
  update gift_registry_items
  set quantity_claimed = quantity_claimed + new.quantity
  where id = new.registry_item_id;
  return new;
end;
$$ language plpgsql;

create trigger on_gift_claim_created
  after insert on gift_claims
  for each row execute function increment_gift_claim_count();

-- Function to decrement gift item claim count on deletion
create or replace function decrement_gift_claim_count()
returns trigger as $$
begin
  update gift_registry_items
  set quantity_claimed = quantity_claimed - old.quantity
  where id = old.registry_item_id;
  return old;
end;
$$ language plpgsql;

create trigger on_gift_claim_deleted
  after delete on gift_claims
  for each row execute function decrement_gift_claim_count();
