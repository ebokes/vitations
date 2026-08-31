# INVITATION PROJECT — DATABASE & SUPABASE FOUNDATION

Implement the database foundation for the Invitation Project.

Use Supabase/PostgreSQL.

## 1. DATABASE PRINCIPLES

- Use migrations.
- Use UUIDs where appropriate.
- Add timestamps.
- Add foreign keys.
- Add indexes for common queries.
- Use constraints where appropriate.
- Avoid duplicated data.
- Protect private data with RLS.
- Keep public invitation access intentionally scoped.

## 2. CORE ENTITIES

Design the schema around:

profiles
invitations
invitation_versions
templates
template_versions
packages
package_features
invitation_features
events
event_locations
guests
rsvps
gift_registry_items
gift_claims
payments
orders
media
media_processing
livestreams
custom_invitation_requests
notifications
audit_logs

Use appropriate supporting tables where necessary.

## 3. CUSTOMER

A profile may represent:
- customer
- admin
- super_admin

Roles must not be trusted from the client.

## 4. ONE INVITATION RULE

A customer may have only one invitation.

Enforce this at the database level, not only in frontend code.

## 5. INVITATION STATE

Support states such as:
- draft
- submitted
- locked
- unlocked_by_admin
- completed

The exact state model may be refined, but it must support:
- customer editing before submission
- customer lock after submission
- admin unlock
- admin relock
- audit trail

## 6. EVENT LOCATIONS

An invitation can have multiple event locations.

Each event location should identify:
- event type
- title
- address
- latitude/longitude where available
- map/directions information

Allowed initial event types:
- traditional_wedding
- white_wedding
- reception
- after_party

Only selected event types should be associated with the invitation.

## 7. PACKAGE ENTITLEMENTS

Represent package features centrally.

Packages:
essential
premium
ultimate

Do not scatter package checks throughout the application.

Feature entitlements should be data-driven where practical.

Essential must not receive Gift Registry.

## 8. TEMPLATES

Templates should support:
- package eligibility
- category
- design type
- animation type
- 3D capability
- versioning
- active/retired status

Submitted invitations should reference a stable template version.

## 9. GUESTS

Guest fields:
- invitation_id
- name
- phone
- timestamps

Do NOT create guest accounts.

Do NOT store guest email.

## 10. RSVP

RSVP must belong to:
- invitation
- guest

Support suitable RSVP states.

## 11. GIFTS

Gift Registry is Premium/Ultimate only.

Store:
- registry address/configuration
- gift items
- guest claims
- received status
- timestamps

Cash gift configuration should support:
- payment gateway configuration
- bank/account details configuration

Do not store sensitive payment secrets in normal database fields.

## 12. PAYMENTS

Store payment/order records required to reconcile:
- customer
- package
- amount
- currency
- provider
- reference
- status
- timestamps

Payment records must not be editable by customers.

## 13. MEDIA

Media records must support:
- invitation
- uploader
- media type
- storage path
- processing state
- moderation state
- visibility
- timestamps

Guest uploads must support moderation.

## 14. LIVESTREAM

Store:
- invitation
- external URL
- title
- status
- activation information
- timestamps

Ultimate only.

## 15. CUSTOM REQUESTS

Store:
- name
- phone
- email
- status
- internal notes
- timestamps

## 16. AUDIT LOG

Audit important actions:
- invitation unlock
- invitation modification
- invitation relock
- role changes
- package changes
- template publishing/retirement
- moderation actions
- sensitive administrative operations

## 17. RLS

Implement RLS for:
- customer records
- invitations
- guests
- RSVP
- gifts
- payments
- media
- livestream
- custom requests
- admin data

Public invitation access must reveal only fields intended for guests.

## 18. STORAGE

Create secure storage structure for:
- template assets
- customer media
- guest media
- invitation assets

Use appropriate storage policies.

## 19. MIGRATIONS

Create clean, ordered migrations.

Do not rely on manually created dashboard tables.

## 20. SEED DATA

Provide safe development seed data for:
- packages
- features
- categories
- sample templates

Clearly mark demo content.

Do not create fake real customer records that could be mistaken for production data.

## 21. VALIDATION

Run migrations in a clean environment where possible.

Check:
- constraints
- indexes
- RLS
- foreign keys
- seed process

Run TypeScript/lint/build if application changes were made.

## 22. GIT

Commit:

feat: establish database and supabase foundation

STOP and report:
- schema
- migrations
- RLS
- storage
- seed data
- validation
- commit
