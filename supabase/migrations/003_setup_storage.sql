-- Create storage buckets
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values
  ('templates', 'templates', true, 10485760, array['image/jpeg', 'image/png', 'image/webp', 'image/avif', 'video/mp4', 'video/webm']),
  ('invitations', 'invitations', false, 52428800, array['image/jpeg', 'image/png', 'image/webp', 'image/avif', 'image/heic', 'image/heif', 'video/mp4', 'video/webm', 'video/quicktime']),
  ('guest-uploads', 'guest-uploads', false, 26214400, array['image/jpeg', 'image/png', 'image/webp', 'image/heic', 'image/heif']);

-- Storage policies for templates bucket (public read)
create policy "Public can view template assets"
  on storage.objects for select
  using (bucket_id = 'templates');

create policy "Admins can upload template assets"
  on storage.objects for insert
  with check (
    bucket_id = 'templates'
    and is_admin(auth.uid())
  );

create policy "Admins can update template assets"
  on storage.objects for update
  using (
    bucket_id = 'templates'
    and is_admin(auth.uid())
  );

create policy "Admins can delete template assets"
  on storage.objects for delete
  using (
    bucket_id = 'templates'
    and is_admin(auth.uid())
  );

-- Storage policies for invitations bucket (customer owned)
create policy "Customers can view their invitation assets"
  on storage.objects for select
  using (
    bucket_id = 'invitations'
    and (storage.foldername(name))[1] = auth.uid()::text
  );

create policy "Customers can upload their invitation assets"
  on storage.objects for insert
  with check (
    bucket_id = 'invitations'
    and (storage.foldername(name))[1] = auth.uid()::text
  );

create policy "Customers can update their invitation assets"
  on storage.objects for update
  using (
    bucket_id = 'invitations'
    and (storage.foldername(name))[1] = auth.uid()::text
  );

create policy "Customers can delete their invitation assets"
  on storage.objects for delete
  using (
    bucket_id = 'invitations'
    and (storage.foldername(name))[1] = auth.uid()::text
  );

create policy "Admins can manage all invitation assets"
  on storage.objects for all
  using (
    bucket_id = 'invitations'
    and is_admin(auth.uid())
  );

-- Storage policies for guest-uploads bucket
create policy "Guests can upload media"
  on storage.objects for insert
  with check (bucket_id = 'guest-uploads');

create policy "Customers can view guest uploads for their invitation"
  on storage.objects for select
  using (
    bucket_id = 'guest-uploads'
    and exists(
      select 1 from invitations
      where id::text = (storage.foldername(name))[1]
      and customer_id = auth.uid()
    )
  );

create policy "Admins can manage guest uploads"
  on storage.objects for all
  using (
    bucket_id = 'guest-uploads'
    and is_admin(auth.uid())
  );

create policy "Public can view approved guest uploads"
  on storage.objects for select
  using (
    bucket_id = 'guest-uploads'
    and exists(
      select 1 from media
      where storage_path = name
      and moderation_status = 'approved'
      and is_visible = true
    )
  );
