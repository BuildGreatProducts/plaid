```
██████╗  ██╗      █████╗  ██╗ ██████╗
██╔══██╗ ██║     ██╔══██╗ ██║ ██╔══██╗
██████╔╝ ██║     ███████║ ██║ ██║  ██║
██╔═══╝  ██║     ██╔══██║ ██║ ██║  ██║
██║      ███████╗██║  ██║ ██║ ██████╔╝
╚═╝      ╚══════╝╚═╝  ╚═╝ ╚═╝ ╚═════╝
```
# PLAID — Product Led AI Development

An agent skill that guides founders from idea to launched product through structured conversations and AI-powered document generation. PLAID combines the thinking of a product strategist, brand strategist, UX researcher, design director, technical architect, conversion copywriter, and go-to-market specialist into a single skill with seven capabilities.

## Capabilities

PLAID is a single skill with seven capabilities, each handling a distinct phase of the product development pipeline:

| Capability | Trigger | What It Does | Output |
|---|---|---|---|
| **Idea** | "plaid idea", "help me find an idea", "what should I build" | Guided discovery of a product idea from business processes or personal expertise | `docs/product-idea.md` |
| **Validate** | "plaid validate", "validate my idea", "pressure-test", "is this idea good" | Brutally pressure-tests the chosen idea — fatal flaws, problem reality, competition, first 10 customers, 2-week MVP test, strong/weak/pivot verdict. Asks targeted follow-up questions to confirm direction, then sharpens `docs/product-idea.md`. | `docs/validation-report.md`, sharpened `docs/product-idea.md` |
| **Plan** | "PLAID", "plan a product", "define my vision", "generate a PRD" | Vision intake conversation + document generation | `vision.json`, `product-vision.md`, `prd.md`, `product-roadmap.md` |
| **Design** | "plaid design", "design from image", "create design.md", "image to design system" | Translates image references (screenshots, mockups, Figma URLs) into a [Google design.md](https://github.com/google-labs-code/design.md) token spec + prose rationale | `docs/design.md` |
| **Waitlist** | "plaid waitlist", "scaffold a waitlist page", "landing page", "build a waitlist" | Scaffolds a Next.js waitlist page from `docs/product-idea.md` + `docs/design.md` — 2-column hero with copy + form on the left and image on the right, wired to a chosen email-capture provider | `waitlist/` Next.js project |
| **Launch** | "plaid launch", "go-to-market", "launch plan", "GTM strategy" | Go-to-market plan generation | `gtm.md` |
| **Build** | "plaid build", "build the app", "start building" | Executes roadmap phase by phase, reviews code, commits to git | Working code, git commits per phase |

## How It Works

### 1. Idea

Start here if you don't yet have a concrete product concept. PLAID Idea walks you through a stepped conversation that mines a great idea from what you already know or already do.

1. **Source selection** — Business, personal expertise, or both
2. **Context capture** — 8 targeted questions (or 10 combined, trimmed) surfacing workflows, unmet demand, unfair advantages, and obsessions
3. **Pattern synthesis** — 3–5 ranked candidate directions drawn directly from your answers
4. **Scorecard** — Each candidate scored on unfair advantage, pain level, audience reachability, MVP feasibility, and differentiation
5. **Pick one** — Opinionated recommendation you can accept, swap, or blend
6. **Sharpen** — Target user, specific problem, smallest testable version, why you, and top risky assumptions
7. **Output** — `docs/product-idea.md`

`docs/product-idea.md` feeds directly into Validate (recommended next step) and Plan — most of the Plan intake's first three sections are already answered.

### 2. Validate

Pressure-test the chosen idea before investing in Plan, Build, or Launch. Validate adapts the [Startup Pressure Test](https://github.com/BuildGreatProducts/product-masters_validate) framework into PLAID's flow.

1. **Read or gather** — If `docs/product-idea.md` exists, Validate reads it and confirms the direction. If not, it asks for the idea, target customer, and what you want them to do or pay for.
2. **Find the core assumption** — One sentence: the single thing that must be true for the business to work.
3. **Surface fatal flaws** — Up to 3, ranked by severity, each with a fast behavioral test.
4. **Test problem reality** — Vitamin or painkiller verdict, in the user's own language.
5. **Map real competition** — Including current behavior (always a competitor) and the real enemy you have to displace.
6. **Plan the first 10 customers** — Manual outreach, no ads, no automation. Where they are, how to reach them, what success looks like.
7. **Define a 2-week MVP test** — The smallest thing that tests the core assumption with real users.
8. **Score and verdict** — A 6-axis scorecard (pain intensity, buyer clarity, urgency, differentiation, speed to validate, founder advantage) and a direct strong / weak / pivot verdict.
9. **Direction check** — Before touching `docs/product-idea.md`, Validate surfaces the directional calls the findings imply (tighter target user, reframed problem statement, different MVP shape, pivot vs. stay) and asks you to choose. Only the choices you confirm get applied.
10. **Sharpen the idea** — Validate applies the agreed edits to `docs/product-idea.md` (target user, problem statement, MVP shape, risky assumptions) and tells you what changed. The `Candidates considered` section is preserved.
11. **Output** — `docs/validation-report.md` (the full diagnosis, preserved for the record) and updated `docs/product-idea.md`.

The validation scorecard sits **alongside** the Idea capability's candidate scorecard. Idea ranks 3–5 candidate directions; Validate stress-tests the chosen one. Both are kept.

### 3. Plan

Start here. PLAID Plan guides you through a structured vision intake conversation, then generates three product documents.

**Vision Intake** — An interactive conversation that captures your product idea through 8 sections:

1. **About You** — Name, expertise, and background story
2. **Your Purpose** — Who you help, the problem you solve, the transformation you deliver, and why you're the right person to build it
3. **Your Product** — Name, one-liner, how it works, key capabilities, platform (web/mobile/desktop/cross-platform), differentiation, and magic moment
4. **Your Audience** — Primary user persona, secondary users, current alternatives, and frustrations with existing solutions
5. **Business Intent** — Revenue model, 90-day goals, 6-month vision, constraints, and go-to-market approach
6. **The Feeling** — Brand personality, visual mood, tone of voice, and anti-patterns (what the product should never feel like)
7. **Tech Stack** — Frontend, backend, database, auth, and payments choices with comparison data and recommendations
8. **Tooling** — Which coding agent will execute the build

For each question, PLAID generates 3 tailored suggestions based on your previous answers. You can pick one, modify it, or write your own. All answers are saved to `vision.json` in the project root.

**Document Generation** — Reads `vision.json` and produces three documents in `docs/`:

| Document | Purpose | Audience |
|---|---|---|
| `product-vision.md` | Strategic foundation — vision, mission, brand, user research, product strategy, design direction | Founders, designers, stakeholders |
| `prd.md` | Technical specification — architecture, data models, API specs, user stories, requirements, design system, auth/payments setup | Coding agents, developers |
| `product-roadmap.md` | Phased build plan with checkbox-tracked tasks for sequential execution | Coding agents, project managers |

### 4. Design

Translates an image — or a set of image references — into a structured `docs/design.md` file following [Google's open design.md format](https://github.com/google-labs-code/design.md). Standalone — does not require any other PLAID document, but pairs naturally with `product-vision.md` and `prd.md`.

1. **Image intake** — Share screenshots, mockups, Figma URLs (read via the Figma MCP), or live website references. Multiple images are supported; identify the primary anchor.
2. **Image analysis** — PLAID describes what's actually in the imagery: colors with approximate hex values, typography character, spacing density, shape language, elevation philosophy, components visible, and overall mood.
3. **Context questions** — A short interactive pass: emotional tone, audience and context of use, color role assignments, type scale, density, shape language, elevation, component priorities, and anti-patterns. Each question gets 3 tailored suggestions.
4. **Token derivation** — Synthesizes a YAML block with `colors`, `typography`, `rounded`, `spacing`, and `components` per the design.md spec. Variants like hover and pressed are separate component entries.
5. **Prose drafting** — Writes the eight canonical sections in order: Overview, Colors, Typography, Layout, Elevation & Depth, Shapes, Components, Do's and Don'ts. Prose explains the *why* behind the tokens.
6. **Output** — `docs/design.md` — front matter for coding agents, prose for design rationale.

| Document | Purpose | Audience |
|---|---|---|
| `docs/design.md` | Design system spec — YAML tokens (colors, typography, spacing, rounded, components) with prose rationale for each section | Coding agents, designers |

### 5. Waitlist

Scaffolds a self-contained Next.js waitlist page in `waitlist/` from `docs/product-idea.md` and `docs/design.md`. Output is a single-section, conversion-best-practices waitlist page: 2-column hero with copy on the left and image on the right.

1. **Prerequisites check** — Requires both `docs/product-idea.md` and `docs/design.md`. Reads `vision.json` / `docs/product-vision.md` opportunistically for richer copy signal (audience persona, magic moment, brand voice, founder credentials).
2. **Read and analyze** — Extracts target user, problem, magic moment, why-you from the idea/vision; YAML tokens + tone signals from `design.md`. Summarizes back in 4–6 bullets so the founder can correct any misread before copy is drafted.
3. **Draft copy with options** — Generates 3 options each for: eyebrow / waitlist incentive ("Join the waitlist — early access"), H1 (≤10 words, magic-moment-led), description (1–2 sentences with target user noun + mechanism), three benefit-led feature bullets (always exactly 3 sets of 3), and a proof / guarantee line (founder credential → quantitative claim → "No spam" default — never invents social proof).
4. **Image and form-tool intake** — Asks for a hero image (local path, URL, or "placeholder") and a form provider: ConvertKit, Beehiiv, Mailchimp, Tally, Typeform, Formspree, Loops, or "I'll paste it later". Wires the chosen provider's standard embed snippet with a TODO marker for the form ID.
5. **Confirm and scaffold** — Writes a self-contained Next.js 15 + TypeScript + Tailwind v4 project under `waitlist/`, with the design system's tokens emitted into `app/globals.css` via Tailwind's `@theme` directive. The page is one server component; `components/FormEmbed.tsx` switches over the provider.
6. **Handoff** — Tells the founder how to preview (`cd waitlist && npm install && npm run dev`), lists every remaining placeholder with `file:line` references, and suggests `/plaid launch` next.

| Document | Purpose | Audience |
|---|---|---|
| `waitlist/` | Self-contained Next.js waitlist page wired to a chosen email-capture provider, styled from `docs/design.md` tokens | Visitors, founders |

### 6. Launch

Generates your go-to-market playbook. Requires `vision.json` and `docs/product-vision.md` from the Plan capability.

| Document | Purpose | Audience |
|---|---|---|
| `gtm.md` | Go-to-market plan — launch strategy, pre-launch playbook, channel strategy, growth tactics, metrics | Founders, marketing |

### 7. Build

Executes the roadmap phase by phase. Requires `docs/product-roadmap.md` and `docs/prd.md` from the Plan capability.

1. Reads the roadmap and finds the first phase with incomplete tasks
2. Builds each task in order, referencing the PRD for implementation details
3. Marks tasks complete as it goes (`- [x]`)
4. Reviews code after each phase for bugs and inconsistencies
5. Commits to git after each phase
6. Continues until all phases are complete

Each phase produces a working, demoable product.

## Adding PLAID as a Skill

PLAID is an AI agent skill. The quickest way to install it:

```sh
npx skills add BuildGreatProducts/plaid
```

This uses the [skills CLI](https://github.com/vercel-labs/skills) to install PLAID into your project automatically.

### Manual Installation

If you prefer to install manually:

1. Open your Claude Code settings (either project-level `.claude/settings.json` or user-level `~/.claude/settings.json`)
2. Add the path to the skill under the `skills` array:

```json
{
  "skills": [
    "/absolute/path/to/plaid/SKILL.md"
  ]
}
```

### Using PLAID

Start a new conversation with your AI coding agent and trigger PLAID:

**Idea:** "plaid idea", "Help me find an idea", "What should I build", "Product idea from my business"

**Validate:** "plaid validate", "Validate my idea", "Pressure-test", "Is this idea good", "Find fatal flaws"

**Plan:** "PLAID", "Help me build something", "Plan a product", "Define my vision", "Generate a PRD", "Spec out my idea"

**Design:** "plaid design", "Design from image", "Create design.md", "Image to design system", "Extract design tokens"

**Waitlist:** "plaid waitlist", "Scaffold a waitlist page", "Landing page", "Build a waitlist", "Make a landing page"

**Launch:** "plaid launch", "Go-to-market plan", "Launch strategy", "GTM"

**Build:** "plaid build", "Start building", "Execute the roadmap"

PLAID automatically routes to the right capability based on your request. No dependencies need to be installed — the skill is entirely documentation-driven.

## What to Expect After Setup

**Optional first session — Idea Discovery.** If you don't yet have a concrete product concept, start with `plaid idea`. PLAID walks you through a stepped conversation that mines an idea from your business or expertise, ranks candidates on a scorecard, and writes `docs/product-idea.md`. This becomes input to Validate and Plan.

**Optional second session — Validation.** Once you have an idea, run `plaid validate` to pressure-test it. PLAID surfaces fatal flaws, tests whether the problem is real, maps competition (including current behavior), plans a 2-week MVP test, and returns a strong/weak/pivot verdict. Before updating `docs/product-idea.md`, it asks you targeted follow-up questions to confirm the direction the findings point at — narrower target user, reframed problem, different MVP shape, or a pivot — and only applies the choices you confirm. It writes `docs/validation-report.md` and sharpens `docs/product-idea.md` based on what you decided.

**First (or third) session — Vision Intake.** PLAID opens with "What do you want to build?" and adapts based on how concrete your idea is. If you have a clear concept (or a `docs/product-idea.md`), it jumps into structured questions. If you're still exploring, it helps you narrow down before moving forward. At the end, you'll have a validated `vision.json` in your project root.

**Second session — Document Generation.** When PLAID detects a `vision.json` but missing docs, it generates the three product documents: `product-vision.md`, `prd.md`, and `product-roadmap.md`.

**Go-to-market.** Generate your launch playbook whenever you're ready. This can happen before or after building.

**Building.** Execute the roadmap. PLAID Build reads the roadmap, builds each phase, reviews the code, and commits. You get a working product at the end of each phase.

**Resuming at any point.** Each skill detects your current state automatically:
- Partial intake? Continues from the next unanswered question
- Missing docs? Generates only what's missing
- Mid-build? Shows progress and picks up from the first unchecked task

## Editing Your Vision

You can update your answers after the intake is complete:

- **Change a single answer** — Tell PLAID what you want to change. It updates `vision.json` and flags which documents need regeneration.
- **Regenerate docs** — Ask PLAID to regenerate specific documents. It re-reads `vision.json` and rebuilds from the source of truth.

## Project Structure

```
plaid/
├── SKILL.md                    # Router — routes to capability files
├── references/                 # Capability files + detailed guides
│   ├── idea.md                 # Idea discovery — produces docs/product-idea.md
│   ├── validate.md             # Idea pressure-test — produces docs/validation-report.md
│   ├── plan.md                 # Vision intake + 3-doc generation
│   ├── design.md               # Image-to-design.md translation
│   ├── waitlist.md             # Next.js waitlist page scaffolding
│   ├── launch.md               # Go-to-market plan generation
│   ├── build.md                # Roadmap execution + git commits
│   ├── INTAKE-GUIDE.md         # Full question bank with suggestion prompts
│   ├── VISION-SCHEMA.md        # TypeScript schema, field rules, examples
│   ├── VISION-GENERATION.md    # How product-vision.md is generated
│   ├── PRD-GENERATION.md       # How prd.md is generated
│   ├── ROADMAP-GENERATION.md   # How product-roadmap.md is generated
│   ├── GTM-GENERATION.md       # How gtm.md is generated
│   ├── WAITLIST-GENERATION.md  # Next.js scaffold templates + copy/embed/token rules
│   └── TECH-STACK-OPTIONS.md   # Comparison data for stack recommendations
├── scripts/
│   └── validate-vision.js      # Schema validator and migrator
├── assets/
│   └── vision-template.json    # Empty template for new vision files
├── README.md                   # This file
├── package.json                # npm metadata and validate script
└── LICENSE.txt                 # MIT license
```

The `references/` directory contains capability files and detailed guides. You don't need to read these to use PLAID, but they're useful if you want to understand or customize how documents are generated.

## Validator

The included validator checks that `vision.json` conforms to the expected schema:

```sh
# Validate (read-only)
node scripts/validate-vision.js

# Validate a specific file
node scripts/validate-vision.js path/to/vision.json

# Validate and migrate older schema versions
node scripts/validate-vision.js --migrate
```

Or via npm:

```sh
npm run validate
```

Output is JSON:

```json
{
  "valid": true,
  "errors": [],
  "warnings": ["audience.secondaryUsers is empty"],
  "migrated": false,
  "migrationsApplied": []
}
```

The validator uses only built-in Node.js modules and has zero external dependencies. Node.js 14 or later is required.

## Tech Stack Defaults

PLAID recommends specific stacks based on your platform and needs, but respects whatever you choose. The defaults lean toward:

- **Web**: Next.js + Convex + Clerk + Polar
- **Mobile**: Expo (React Native) + Convex + Convex Auth + RevenueCat
- **Desktop**: Electron + Convex + Clerk

Full comparison data for all supported options (including Remix, SvelteKit, Flutter, Supabase, Stripe, and more) is available in `references/TECH-STACK-OPTIONS.md`.

## License

MIT — see [LICENSE.txt](LICENSE.txt).
