# 12 — GIFT REGISTRY

Implement Gift Registry for Premium and Ultimate only.

Essential:
- no registry
- no registry UI
- no registry write operations

Premium/Ultimate:
- registry delivery address
- gift items
- gift descriptions
- quantities
- gift claims
- claimed vs received states
- cash gift options

Gift claim should record:
- guest
- intended gift
- quantity
- status
- timestamps

Cash gifts may support:
- Paystack payment flow where configured
- bank/account details where configured

Do not expose payment secrets.

Customer should be able to track:
- who intends to send each gift
- what gift is intended
- what has been received

Guest should not see private customer management information.

Prevent duplicate gift claims where business rules require it.

Commit:
feat: implement gift registry

STOP.
