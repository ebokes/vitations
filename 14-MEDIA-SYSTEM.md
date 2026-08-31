# 14 — MEDIA SYSTEM

Implement media upload and display foundations.

Premium:
- gallery
- story images
- collages
- videos

Ultimate:
- all Premium media
- customer event photos
- customer event videos
- guest photo uploads

Guest uploads:
- pending
- approved
- rejected
- removed

Only approved guest media is public.

Requirements:
- Supabase Storage
- secure storage paths
- file type validation
- size validation
- upload progress
- processing state
- failure state
- lazy loading
- optimized image delivery
- video poster/thumbnail handling

Support iPhone media such as HEIC/HEIF without assuming JPEG only.

Where browser support is insufficient, provide a controlled conversion/processing path.

Do not load large media eagerly.

Do not expose storage credentials.

Ultimate guest uploads must be invitation-scoped.

Commit:
feat: implement invitation media system

STOP.
