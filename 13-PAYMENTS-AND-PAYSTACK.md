# 13 — PAYMENTS & PAYSTACK

Implement customer package payments.

Initial packages:
Essential ₦50,000
Premium ₦150,000
Ultimate ₦350,000

Use Paystack for supported payment processing.

Requirements:
- initialize transaction server-side
- verify transaction server-side
- process webhooks securely
- use unique references
- make webhook handling idempotent
- never trust browser payment success alone
- activate package only after verified payment
- preserve order/payment history
- handle failed, cancelled, pending and successful payments
- support international cards where Paystack makes them available/configured
- keep currency/provider configuration centralized

Flow:
Select template
→ select package
→ authenticate
→ enter invitation details
→ review
→ payment
→ verified payment
→ final submission/activation according to business flow

Do not mark an order paid from client-side callback alone.

Store only necessary payment metadata.

Test:
- successful payment
- failed payment
- repeated webhook
- invalid signature
- duplicate reference
- interrupted checkout
- payment verification mismatch

Commit:
feat: integrate customer payments

STOP.
