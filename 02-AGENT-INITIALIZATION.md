# INVITATION PROJECT — AGENT INITIALIZATION

Use this prompt immediately after the Master Project Prompt and Agent Operating Rules.

## OBJECTIVE

Initialize the repository safely for the Invitation Project.

## STEP 1 — INSPECT

Inspect:
- repository structure
- package.json
- existing Next.js configuration
- TypeScript configuration
- lint configuration
- existing UI components
- existing database files
- environment files
- Git status

Do not delete existing work without justification.

## STEP 2 — ESTABLISH ARCHITECTURE

Use a clean feature-oriented structure.

Suggested structure:

app/
components/
components/ui/
features/
lib/
hooks/
types/
supabase/
tests/
docs/

Adjust if the existing project has a better established structure.

## STEP 3 — CORE STACK

Confirm/configure:
- Next.js
- TypeScript
- Supabase
- TanStack Query
- React Hook Form
- Zod
- Motion
- Lucide

Do not install unnecessary dependencies.

Do NOT install:
- Zustand
- Redux
- another query library

## STEP 4 — ENVIRONMENT

Create/update `.env.example`.

Never place real secrets in committed files.

Expected categories include:
- Supabase URL
- Supabase anon/publishable key
- Paystack public key where required
- server-only secrets
- application URL

Use server-only environment variables for secrets.

## STEP 5 — QUALITY

Confirm:
- TypeScript works
- lint works
- tests can run
- build can run

## STEP 6 — GIT

Review Git status.

Create a focused initialization commit only if meaningful initialization changes were made.

Suggested:
chore: initialize invitation project foundation

## STEP 7 — REPORT

Report:
- repository state
- stack
- dependencies added
- architecture
- environment setup
- validation
- commit

STOP.

Do not implement application features in this phase.
