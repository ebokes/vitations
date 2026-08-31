# 10 — GUEST EXPERIENCE

Implement the public guest invitation flow.

Required flow:

Invitation link
→ invitation preview
→ guest details form
→ Accept
→ full invitation

Preview must show:
- celebrant/couple image where available
- celebrant/couple name
- event identity
- invitation preview

Guest form:
- Name
- Phone number
- Accept

Do NOT collect guest email.

Guests do not create accounts.

After acceptance, show the full invitation and appropriate features.

Security:
- Public access must expose only intended invitation information.
- Do not expose customer account, payment, audit, or private administration data.
- Guest submissions must be server-validated.
- Rate-limit/abuse-protect public actions where appropriate.

Support:
- invalid invitation
- unavailable invitation
- missing invitation
- guest returning to an invitation
- duplicate/updated guest details
- mobile devices

The invitation remains accessible after the event date.

Commit:
feat: implement guest invitation experience

STOP.
