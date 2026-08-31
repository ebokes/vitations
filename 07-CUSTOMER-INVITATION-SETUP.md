# 07 — CUSTOMER INVITATION SETUP

Implement the customer flow for creating one invitation.

Flow:
1. Customer selects eligible template.
2. Customer selects package.
3. Customer enters celebrant/event information.
4. Customer selects applicable event types.
5. Customer enters event details.
6. Customer configures package-specific features.
7. Customer reviews everything.
8. Customer confirms details are correct.
9. Customer submits.
10. Invitation becomes locked.

Event types:
- Traditional Wedding
- White Wedding
- Reception
- After Party

Only selected event types should appear in the final invitation.

Rules:
- One customer can create only one invitation.
- Customer can switch among eligible templates before submission.
- Customer can ultimately use only one template.
- After submission, customer cannot edit.
- Admin can unlock through a controlled audited process.
- The invitation remains accessible after the event date.
- The countdown reaches zero on the event date; the invitation is not deleted.
- Subscribed features remain available after the event.

Before submission use a subtle confirmation:
“Please take a moment to review your details. Once your invitation is submitted, changes can only be made by our admin team.”

Provide:
- Review
- Back to edit
- Confirm and submit

Use React Hook Form + Zod.
Use TanStack Query for server state where appropriate.
Do not use Zustand.

Validate package entitlements server-side.

Validation:
TypeScript, lint, tests, build.

Commit:
feat: implement customer invitation setup

STOP.
