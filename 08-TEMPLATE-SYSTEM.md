# 08 — TEMPLATE SYSTEM

Implement the reusable invitation template architecture.

Requirements:
- Templates are database-driven.
- Template versions are immutable once used by a submitted invitation.
- Customers can browse and select only templates available to their package.
- One invitation uses one selected template.
- Before final submission, an eligible customer may switch templates.
- After submission, template changes require admin action.
- Support 2D, animated, and 3D template classifications.
- Do not load 3D libraries for non-3D templates.

Implement:
- template repository/query layer
- template listing
- filtering
- eligibility checks
- template selection
- template preview foundation
- template version resolution
- graceful missing/retired-template handling

Create a template renderer contract so templates can be added without rewriting the invitation application.

Each template should declare:
- supported package(s)
- event/category
- visual configuration
- required features
- preview assets
- renderer type

Use dynamic imports for expensive template renderers.

Add representative development templates:
- Elegant
- Floral
- Modern
- Traditional
- Luxury

Do not copy copyrighted template assets from reference websites.

Validation:
TypeScript, lint, tests, build.

Commit:
feat: implement invitation template system

STOP.
