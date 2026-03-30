```
██████╗  ██╗      █████╗  ██╗ ██████╗
██╔══██╗ ██║     ██╔══██╗ ██║ ██╔══██╗
██████╔╝ ██║     ███████║ ██║ ██║  ██║
██╔═══╝  ██║     ██╔══██║ ██║ ██║  ██║
██║      ███████╗██║  ██║ ██║ ██████╔╝
╚═╝      ╚══════╝╚═╝  ╚═╝ ╚═╝ ╚═════╝
```
# PLAID — Product Led AI Development

An agent skill suite that guides founders from idea to launched product through structured conversations and AI-powered document generation. PLAID combines the thinking of a product strategist, brand strategist, UX researcher, design director, technical architect, and go-to-market specialist into three focused skills.

## Skills

PLAID is split into three skills, each handling a distinct phase of the product development pipeline:

| Skill | Trigger | What It Does | Output |
|---|---|---|---|
| **plaid-plan** | "PLAID", "plan a product", "define my vision", "generate a PRD" | Vision intake conversation + document generation | `vision.json`, `product-vision.md`, `prd.md`, `product-roadmap.md` |
| **plaid-launch** | "plaid launch", "go-to-market", "launch plan", "GTM strategy" | Go-to-market plan generation | `gtm.md` |
| **plaid-build** | "plaid build", "build the app", "start building" | Executes roadmap phase by phase, reviews code, commits to git | Working code, git commits per phase |

## How It Works

### 1. Plan — `/plaid-plan`

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

### 2. Launch — `/plaid-launch`

Generates your go-to-market playbook. Requires `vision.json` and `docs/product-vision.md` from plaid-plan.

| Document | Purpose | Audience |
|---|---|---|
| `gtm.md` | Go-to-market plan — launch strategy, pre-launch playbook, channel strategy, growth tactics, metrics | Founders, marketing |

### 3. Build — `/plaid-build`

Executes the roadmap phase by phase. Requires `docs/product-roadmap.md` and `docs/prd.md` from plaid-plan.

1. Reads the roadmap and finds the first phase with incomplete tasks
2. Builds each task in order, referencing the PRD for implementation details
3. Marks tasks complete as it goes (`- [x]`)
4. Reviews code after each phase for bugs and inconsistencies
5. Commits to git after each phase
6. Continues until all phases are complete

Each phase produces a working, demoable product.

## Adding PLAID as a Skill

PLAID is an AI agent skill suite. The quickest way to install it:

```sh
npx skills add BuildGreatProducts/plaid
```

This uses the [skills CLI](https://github.com/vercel-labs/skills) to install all three skills into your project automatically.

### Manual Installation

If you prefer to install manually:

1. Open your Claude Code settings (either project-level `.claude/settings.json` or user-level `~/.claude/settings.json`)
2. Add the paths to each skill under the `skills` array:

```json
{
  "skills": [
    "/absolute/path/to/plaid/skills/plaid-plan/SKILL.md",
    "/absolute/path/to/plaid/skills/plaid-launch/SKILL.md",
    "/absolute/path/to/plaid/skills/plaid-build/SKILL.md"
  ]
}
```

### Using PLAID

Start a new conversation with your AI coding agent and trigger any skill:

**Plan:** "PLAID", "Help me build something", "Plan a product", "Define my vision", "Generate a PRD", "Spec out my idea"

**Launch:** "plaid launch", "Go-to-market plan", "Launch strategy", "GTM"

**Build:** "plaid build", "Start building", "Execute the roadmap"

No dependencies need to be installed. The skills are entirely documentation-driven.

## What to Expect After Setup

**First session — Vision Intake (`/plaid-plan`).** PLAID opens with "What do you want to build?" and adapts based on how concrete your idea is. If you have a clear concept, it jumps into structured questions. If you're still exploring, it helps you narrow down before moving forward. At the end, you'll have a validated `vision.json` in your project root.

**Second session — Document Generation (`/plaid-plan`).** When PLAID detects a `vision.json` but missing docs, it generates the three product documents: `product-vision.md`, `prd.md`, and `product-roadmap.md`.

**Go-to-market (`/plaid-launch`).** Generate your launch playbook whenever you're ready. This can happen before or after building.

**Building (`/plaid-build`).** Execute the roadmap. PLAID Build reads the roadmap, builds each phase, reviews the code, and commits. You get a working product at the end of each phase.

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
├── skills/                     # Skill definitions
│   ├── plaid-plan/
│   │   └── SKILL.md            # Vision intake + 3-doc generation
│   ├── plaid-launch/
│   │   └── SKILL.md            # Go-to-market plan generation
│   └── plaid-build/
│       └── SKILL.md            # Roadmap execution + git commits
├── references/                 # Shared detailed guides
│   ├── INTAKE-GUIDE.md         # Full question bank with suggestion prompts
│   ├── VISION-SCHEMA.md        # TypeScript schema, field rules, examples
│   ├── VISION-GENERATION.md    # How product-vision.md is generated
│   ├── PRD-GENERATION.md       # How prd.md is generated
│   ├── ROADMAP-GENERATION.md   # How product-roadmap.md is generated
│   ├── GTM-GENERATION.md       # How gtm.md is generated
│   └── TECH-STACK-OPTIONS.md   # Comparison data for stack recommendations
├── scripts/
│   └── validate-vision.js      # Schema validator and migrator
├── assets/
│   └── vision-template.json    # Empty template for new vision files
├── README.md                   # This file
├── package.json                # npm metadata and validate script
└── LICENSE.txt                 # MIT license
```

The `references/` directory contains detailed guides shared across all skills. You don't need to read these to use PLAID, but they're useful if you want to understand or customize how documents are generated.

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
