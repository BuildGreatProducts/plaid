# Plan — Vision Intake + Document Generation

## Modes

PLAID Plan has two modes. Pick the right one based on context:

**Starting fresh** (no `vision.json` exists):
Run the vision intake conversation. See "Vision Intake" below.

**Vision exists but docs are incomplete** (`vision.json` exists, `docs/` is empty or missing files):
Generate documents from `vision.json`. See "Document Generation" below.

**Partial intake:** If `vision.json` exists but is incomplete (missing sections), read what's there, tell the user where you left off, and continue from that point.

**Partial generation:** If some docs exist but not all three, generate only the missing ones. Read existing docs as context.

If the user just says "PLAID" or "help me plan something" or "I want to build something", use the mode-selection logic above to decide what to do — don't assume a fresh intake. Only start the vision intake if `vision.json` does not exist.

-----

## Vision Intake

### Opening Question

Start every new PLAID session with:

> **"What do you want to build?"**

This question is deliberately open-ended. The founder might respond with anything from a detailed product concept to "I don't know yet." Handle the full spectrum:

**If the founder gives a specific idea** (e.g. "a marketplace for freelance designers" or "an app that helps people track their medications"):

- Acknowledge the idea with genuine enthusiasm — tell them what's interesting about it
- Extract what you can: implied audience, problem space, product type
- Carry these forward as context — you've already got partial answers to several intake questions. Don't re-ask things they've already told you.
- Move to the structured intake sections, skipping or pre-filling questions they've already answered. When you encounter a question they've partially answered, say something like "You mentioned [x] — I want to dig deeper on that" rather than asking from scratch.

**If the founder is vague or exploratory** (e.g. "I want to build something in the health space" or "I have some ideas but nothing concrete"):

- Don't push them to commit to an idea immediately
- Ask: "Tell me more about that — what's drawing you to [their area]?"
- Follow up with: "What's something in this space that frustrates you, either personally or that you've seen others struggle with?"
- Use their responses to help them crystallize a direction. Offer 3 possible product angles based on what they've shared.
- Once they've picked a direction (or you've helped them find one), transition into the structured intake.

**If the founder truly has no idea** (e.g. "I don't know, I just want to build something"):

- Ask about their skills, interests, and what problems they notice in their daily life
- Ask what kind of work energizes them
- Offer 3 product concepts based on their answers — each addressing a real problem in a space connected to their background
- Let them pick one or riff on the ideas to form their own
- Then transition into the structured intake

### Transition to Structured Intake

Once you have at minimum a rough product concept (what it is + who it's for), transition into the structured intake sections. Say something like:

> "Great — I've got a good sense of the direction. Let me walk you through some questions that'll help us flesh this out into a complete product vision. For each one, I'll suggest some options based on what you've told me so far."

### Structured Intake

Guide the founder through 8 sections IN ORDER. For each AI-assisted question:

1. Ask the question with a sentence of context about why it matters
1. Offer 3 suggestions based on everything they've said so far
1. Let them pick one, modify one, or write their own
1. Carry the answer forward as context for subsequent suggestions

See [INTAKE-GUIDE.md](./INTAKE-GUIDE.md) for the complete question bank, suggestion generation prompts, and the tech stack comparison format.

**Intake Sections (summary):**

1. **About You** — Name, expertise, background
1. **Your Purpose** — Who you help, the problem, desired transformation, why you
1. **Your Product** — Name, one-liner, how it works, capabilities, platform, differentiation, magic moment
1. **Your Audience** — Primary user, secondary users, alternatives, frustrations
1. **Business Intent** — Revenue model, 90-day goal, 6-month vision, constraints, GTM
1. **The Feeling** — Brand personality, visual mood, tone of voice, anti-patterns
1. **Tech Stack** — Frontend, backend, database, auth, payments (platform is already captured in Section 3)
1. **Tooling** — Which coding agent they'll build with

### Intake Behavior Rules

- The opening "What do you want to build?" replaces a cold start. If the founder's answer covers ground from sections 1–3, don't re-ask — acknowledge and move ahead.
- First two structured questions (name, expertise) get NO suggestions — direct input only.
- Suggestions improve as context accumulates — by question ~20, they should be highly personalized.
- Tech stack questions use a structured comparison format — see INTAKE-GUIDE.md § Tech Stack.
- Lean toward recommending **Convex** (backend/db) and **Polar** (payments for web) or **RevenueCat** (payments for mobile) unless the product clearly needs something else.
- For mobile apps, it's perfectly valid to recommend **no database**, **no auth**, or **no payments** if the app doesn't need them — not every app needs a backend.
- When the intake is complete, save all answers as `vision.json` in the project root. See [VISION-SCHEMA.md](./VISION-SCHEMA.md) for the schema.
- After saving, validate the file by running `node scripts/validate-vision.js`. If validation fails, fix the errors in `vision.json` and re-run the validator until it passes. Surface any warnings to the user but don't block on them.
- After validation passes, say:

> "Your vision is captured and validated. Ready to generate your product documents? This will create product-vision.md, prd.md, and product-roadmap.md in the docs/ directory."

-----

## Document Generation

Before generating any documents, validate `vision.json` by running `node scripts/validate-vision.js --migrate`. The `--migrate` flag automatically upgrades older schema versions to the current version before validating. If validation fails after migration, report the errors to the user and fix them before proceeding. Do not begin document generation with an invalid vision file.

Read `vision.json` and generate three documents in order. Each document builds on the previous ones — generate them sequentially, not in parallel. Write each file completely before starting the next.

### Document 1: product-vision.md

Write to `docs/product-vision.md`.

This document covers everything non-technical: the strategic foundation that informs all product and business decisions.

See [VISION-GENERATION.md](./VISION-GENERATION.md) for the full generation prompt with detailed section requirements.

**Sections:**

1. **Vision & Mission** — Vision statement, mission statement, founder's why, core values
1. **User Research** — Primary persona, secondary personas, jobs to be done, pain points, current alternatives, key assumptions to validate, user journey map
1. **Product Strategy** — Product principles, market differentiation, magic moment design, MVP definition (in scope + explicitly out of scope), feature priority (MoSCoW), core user flows, success metrics, risks
1. **Brand Strategy** — Positioning statement, brand personality, voice & tone guide with DO/DON'T examples, messaging framework, elevator pitches (5s/30s/2min), competitive differentiation narrative, brand anti-patterns
1. **Design Direction** — Design philosophy, visual mood, color palette (hex values), typography (specific typeface recommendations), spacing & layout system, component philosophy, iconography, accessibility commitments, motion & interaction principles, design tokens

**Key rules:**

- Values must be specific and actionable, not generic ("innovation")
- User research should be realistic — identify blind spots, don't parrot founder optimism
- MVP must be buildable in 4–8 weeks. Be opinionated about what to cut
- Magic moment must be achievable in the MVP — if not, MVP scope is wrong
- Brand voice guidelines need concrete examples, not just adjectives
- Design specs must be precise — not "clean" but "minimum 24px between sections"
- Design tokens should include CSS variable names and Tailwind config values

### Document 2: prd.md

Write to `docs/prd.md`.

Read `docs/product-vision.md` first — this document references its contents.

This document is the technical blueprint. It will be consumed by a coding agent to build the app. Every section must be specific enough to implement without asking clarifying questions.

See [PRD-GENERATION.md](./PRD-GENERATION.md) for the full generation prompt with detailed section requirements.

**Sections:**

1. **Overview** — Product name, one-liner, objective, differentiation, magic moment, success criteria
1. **Technical Architecture** — Architecture overview (mermaid diagram), stack table, integration guide, repo structure, infrastructure, security, cost estimate
1. **Data Model** — Entity definitions, relationships, key fields — implementation-ready
1. **API Specification** — Endpoints with method, path, request/response shapes, auth requirements
1. **User Stories** — "As a [persona], I want [action] so that [outcome]" with acceptance criteria
1. **Functional Requirements** — Feature specs with IDs (FR-001), priority (P0/P1/P2), acceptance criteria
1. **Non-Functional Requirements** — Performance, security, accessibility, scalability with measurable thresholds
1. **UI/UX Requirements** — Screen-by-screen descriptions, states (empty/loading/error/populated), interactions
1. **Design System** — Color palette, typography, spacing tokens as CSS variables + Tailwind config values
1. **Auth Implementation** — Specific to the chosen auth provider
1. **Payment Integration** — Specific to the chosen payment provider
1. **Edge Cases & Error Handling** — Failure modes and expected behavior per feature
1. **Dependencies & Integrations** — Third-party services, APIs, packages
1. **Out of Scope** — What this PRD does NOT cover
1. **Open Questions** — Unresolved decisions for the founder

**Key rules:**

- The user already chose their stack — NEVER second-guess it or suggest alternatives. Provide implementation guidance for their specific choices.
- Name specific packages but do not pin version numbers — the coding agent will install the latest compatible versions at build time
- Write so a coding agent can read any section and start implementing immediately
- Be specific but not rigid — leave room for implementation judgment on minor UX choices

### Document 3: product-roadmap.md

Write to `docs/product-roadmap.md`.

Read both `docs/product-vision.md` and `docs/prd.md` first.

This is the build plan. It breaks the PRD into phases, each producing a working increment. Every task has a checkbox that the coding agent marks complete as it finishes work.

See [ROADMAP-GENERATION.md](./ROADMAP-GENERATION.md) for the full generation prompt.

**Sections:**

1. **Build Philosophy** — Principles for the build
1. **Phases** — As many as the project needs, each with a clear goal and demoable outcome. Simple projects may have 2–3 phases, complex ones 5–8. Every roadmap includes at minimum: a foundation phase, core MVP phase(s), and a polish/launch phase.
1. **Agent Session Guide** — How to structure coding sessions for this project

**Task format — every task MUST use this exact structure:**

```markdown
- [ ] **TASK-001** — Description of what to do
  Files: `file1.ts`, `file2.ts`
  Notes: Specific implementation details, config values, gotchas.
```

When the coding agent completes a task, it MUST change `- [ ]` to `- [x]` in this file. The roadmap is a living document that tracks progress.

**Key rules:**

- Each phase produces a working, demoable product. No phase leaves the app broken.
- Tasks are ordered for sequential execution — no jumping around required
- Each phase begins with a summary prompt the user can give their coding agent
- The magic moment must be achievable as early as possible — by the end of the core MVP phase(s)
- Task IDs are sequential across all phases: TASK-001 through TASK-NNN
- Include specific file paths, package names, and configuration values

### After Generation

When all three documents are written, tell the user:

> "Done. I've created three documents in docs/:
>
> - **product-vision.md** — Your strategy, brand, audience, and design direction
> - **prd.md** — Technical spec your coding agent can build from
> - **product-roadmap.md** — Phased build plan with checkboxes to track progress
>
> Next steps:
> - Run `/plaid` to generate your go-to-market plan
> - Run `/plaid` to start building from the roadmap"

-----

## Refreshing Documents

If the user says "regenerate" or "update" a specific document:

- Re-read `vision.json` (it may have been edited manually)
- Regenerate only the requested document
- If regenerating `product-vision.md`, ask if they also want `prd.md` and `product-roadmap.md` updated (since they depend on it)

## Editing the Vision

If the user wants to change a previous intake answer:

- Update `vision.json` with the change
- Flag which documents are affected and offer to regenerate them
