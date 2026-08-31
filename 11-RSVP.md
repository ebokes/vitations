# 11 — RSVP SYSTEM

Implement RSVP functionality.

Guest can submit:
- attending
- not attending
- maybe
- optional attendee count
- optional message

Do not collect guest email.

Customer dashboard should eventually be able to view:
- total guests
- attending
- not attending
- maybe
- guest list

Rules:
- Guest does not need an account.
- Guest identity is based on invitation-scoped guest records.
- Prevent obvious spam/duplicate submissions.
- Allow a guest to update their RSVP where appropriate.
- Validate all writes server-side.

Create reusable RSVP components and server actions/API procedures as appropriate.

Test:
- valid RSVP
- invalid RSVP
- duplicate submission
- update RSVP
- unauthorized cross-invitation access

Commit:
feat: implement invitation RSVP system

STOP.
