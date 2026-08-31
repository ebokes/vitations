# INVITATION PROJECT — AGENT OPERATING RULES

## 1. GENERAL RULE

You are an implementation agent working on an existing software project.

Do not treat each prompt as an isolated request.

Maintain awareness of:
- architecture
- product rules
- security
- previous implementation
- existing components
- database schema
- current phase

## 2. BEFORE CODING

Always:
1. inspect the repository
2. inspect package.json
3. inspect relevant source files
4. inspect database migrations/schema when relevant
5. inspect environment configuration without exposing secrets
6. inspect Git status
7. understand existing implementation before modifying it

Do not overwrite existing work unnecessarily.

## 3. PHASE BOUNDARIES

Each numbered phase has a defined scope.

Implement only that phase unless a small supporting change is required.

Do not:
- build future phases early
- add unrelated dependencies
- refactor unrelated systems
- redesign completed functionality without justification

## 4. ASK BEFORE MAJOR ARCHITECTURAL CHANGES

If implementation requires a major change to:
- database architecture
- authentication
- payment architecture
- storage architecture
- framework
- package strategy

stop and report the issue rather than making a large assumption.

## 5. CODE QUALITY

Prefer:
- small reusable components
- feature-based organization
- clear naming
- strong TypeScript types
- server/client separation
- explicit error handling

Avoid:
- giant components
- duplicated logic
- magic values
- unnecessary abstractions
- premature generalization

## 6. STATE MANAGEMENT

Use:
- React state
- URL state
- form state
- TanStack Query

Do not install Zustand.

Do not introduce Redux or another state-management library without explicit approval.

## 7. DATABASE

Use Supabase/PostgreSQL.

Database changes must be implemented through migrations.

Never manually modify production schema as a substitute for migrations.

Review RLS whenever new user-owned or public data is introduced.

## 8. SECURITY

Never:
- expose secrets
- trust client roles
- trust client payment callbacks
- bypass RLS
- expose private records publicly
- allow cross-user data access

Validate all important operations server-side.

## 9. PAYMENTS

Payment status must be verified server-side.

Webhook handlers must be idempotent.

Never activate paid features based solely on browser-side success.

## 10. FILES

Treat uploaded files as untrusted input.

Validate:
- MIME type
- file extension where useful
- size
- ownership
- storage path

Large media must be processed efficiently.

Support HEIC/HEIF appropriately.

## 11. UI

Use the established design system.

Do not introduce arbitrary:
- colors
- spacing
- typography
- icons
- component patterns

unless the design system genuinely needs expansion.

## 12. ACCESSIBILITY

Every interactive feature should consider:
- keyboard access
- focus states
- labels
- semantic HTML
- screen readers
- contrast
- reduced motion

## 13. RESPONSIVENESS

Mobile is a first-class target.

Test:
- mobile
- tablet
- desktop

Do not rely only on desktop layouts.

## 14. PERFORMANCE

Avoid:
- unnecessary client components
- unnecessary network calls
- huge initial bundles
- eager video loading
- global 3D libraries
- duplicate fetching

Use dynamic imports and lazy loading where appropriate.

## 15. TESTING

Before declaring a phase complete:
- run TypeScript
- run lint
- run relevant tests
- run build when appropriate

Fix errors instead of suppressing them.

## 16. GIT

Make focused commits.

Commit format:
type: short description

Examples:
feat: implement template selection
fix: correct guest RSVP validation
security: harden invitation access
perf: optimize media loading
test: add payment webhook tests

Do not mix unrelated changes into a phase commit.

## 17. GIT SAFETY

Before committing:
- inspect git status
- inspect diff
- ensure secrets are absent
- ensure generated junk is not committed

## 18. REPORTING

At the end of every phase report:

Implemented
Tests
TypeScript
Lint
Build
Git commit
Known issues

Then STOP.

## 19. NO FALSE COMPLETION

Never claim something is complete if:
- it is mocked when production behavior was required
- tests are failing
- a critical feature is missing
- security checks were skipped
- build is broken

Clearly label incomplete work.

## 20. TOKEN/CONTEXT EFFICIENCY

Be efficient.

Before reading large files:
- identify what is relevant
- inspect targeted sections
- avoid repeatedly reading unchanged files

Do not repeat large blocks of code unnecessarily.

Prefer focused changes.

## 21. DOCUMENTATION

When an architectural decision matters, document it briefly.

Do not create excessive documentation for trivial code.

## 22. STOP CONDITION

After completing the requested phase and its validation:

STOP.

Do not automatically begin the next phase.
