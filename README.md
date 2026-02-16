```
██████╗  ██╗      █████╗  ██╗ ██████╗ 
██╔══██╗ ██║     ██╔══██╗ ██║ ██╔══██╗
██████╔╝ ██║     ███████║ ██║ ██║  ██║
██╔═══╝  ██║     ██╔══██║ ██║ ██║  ██║
██║      ███████╗██║  ██║ ██║ ██████╔╝
╚═╝      ╚══════╝╚═╝  ╚═╝ ╚═╝ ╚═════╝ 
```
# PLAID — Product Led AI Development

An agent skill that guides founders from idea to buildable spec through a structured conversation. PLAID combines the thinking of a product strategist, brand strategist, UX researcher, design director, go-to-market specialist, and technical architect into a single conversational workflow.

## How It Works

PLAID walks through three sequential phases. Each phase produces concrete artifacts, and the entire pipeline is resumable — you can stop at any point and pick up where you left off.

### Phase 1: Vision Intake

An interactive conversation that captures your product idea through 8 structured sections:

1. **About You** — Name, expertise, and background story
2. **Your Purpose** — Who you help, the problem you solve, the transformation you deliver, and why you're the right person to build it
3. **Your Product** — Name, one-liner, how it works, key capabilities, platform (web/mobile/desktop/cross-platform), differentiation, and magic moment
4. **Your Audience** — Primary user persona, secondary users, current alternatives, and frustrations with existing solutions
5. **Business Intent** — Revenue model, 90-day goals, 6-month vision, constraints, and go-to-market approach
6. **The Feeling** — Brand personality, visual mood, tone of voice, and anti-patterns (what the product should never feel like)
7. **Tech Stack** — Frontend, backend, database, auth, and payments choices with comparison data and recommendations
8. **Tooling** — Which coding agent will execute the build

For each question, PLAID generates 3 tailored suggestions based on your previous answers. You can pick one, modify it, or write your own. The conversation is designed to feel like working with a smart advisor, not filling out a form.

All answers are saved to a `vision.json` file in the project root. This file follows a strict schema and serves as the single source of truth for everything that follows.

### Phase 2: Document Generation

Reads `vision.json` and produces three documents in `docs/`:

| Document | Purpose | Audience |
|---|---|---|
| `product-vision.md` | Strategic foundation — vision, mission, brand, user research, product strategy, design direction, GTM plan | Founders, designers, stakeholders |
| `prd.md` | Technical specification — architecture, data models, API specs, user stories, requirements, design system, auth/payments setup | Coding agents, developers |
| `product-roadmap.md` | Phased build plan with checkbox-tracked tasks for sequential execution | Coding agents, project managers |

Documents are generated in order because each one builds on the previous. The vision doc informs the PRD, and the PRD informs the roadmap.

### Phase 3: Build Mode

Executes the roadmap phase by phase:

1. Reads `product-roadmap.md` and finds the first phase with incomplete tasks
2. Works through tasks sequentially, marking each complete with a checkbox (`[x]`)
3. After completing a phase, creates a pull request for external review (quality gate)
4. Waits for PR approval before starting the next phase

This ensures you always have a working, demoable product at the end of each phase, and every phase gets human review before moving on.

## Adding PLAID as a Skill

PLAID is an AI agent skill. The quickest way to install it:

```sh
npx skills add BuildGreatProducts/plaid
```

This uses the [skills CLI](https://github.com/vercel-labs/skills) to install the skill into your project automatically.

### Manual Installation

If you prefer to install manually:

1. Open your Claude Code settings (either project-level `.claude/settings.json` or user-level `~/.claude/settings.json`)
2. Add the path to `SKILL.md` under the `skills` array:

```json
{
  "skills": [
    "/absolute/path/to/plaid/SKILL.md"
  ]
}
```

### Using PLAID

Start a new conversation with your AI coding agent and trigger PLAID with any of these prompts:

- "PLAID"
- "Help me build something"
- "Plan a product"
- "Define my vision"
- "Generate a PRD"
- "Spec out my idea"

No dependencies need to be installed. The skill is entirely documentation-driven — `SKILL.md` contains the complete instructions your agent follows.

## What to Expect After Setup

**First session — you'll go through the Vision Intake.** PLAID opens with "What do you want to build?" and adapts based on how concrete your idea is. If you have a clear concept, it jumps into structured questions. If you're still exploring, it helps you narrow down before moving forward. Expect the intake to cover all 8 sections listed above. At the end, you'll have a validated `vision.json` in your project root.

**Second session — Document Generation.** When PLAID detects a `vision.json` but missing docs, it generates all three documents. You'll see `docs/product-vision.md`, `docs/prd.md`, and `docs/product-roadmap.md` appear in your project.

**Subsequent sessions — Build Mode.** Once all documents exist, PLAID enters build mode automatically. It reads the roadmap, finds the next incomplete phase, and starts working through tasks. After each phase, it'll ask if you're ready to push a PR.

**Resuming at any point.** PLAID detects your current state automatically:
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
├── SKILL.md                    # Complete skill implementation (your agent reads this)
├── README.md                   # This file
├── package.json                # npm metadata and validate script
├── LICENSE.txt                 # MIT license
├── scripts/
│   └── validate-vision.js      # Schema validator and migrator
├── assets/
│   └── vision-template.json    # Empty template for new vision files
└── references/                 # Detailed guides SKILL.md delegates to
    ├── INTAKE-GUIDE.md         # Full question bank with suggestion prompts
    ├── VISION-SCHEMA.md        # TypeScript schema, field rules, examples
    ├── VISION-GENERATION.md    # How product-vision.md is generated
    ├── PRD-GENERATION.md       # How prd.md is generated
    ├── ROADMAP-GENERATION.md   # How product-roadmap.md is generated
    └── TECH-STACK-OPTIONS.md   # Comparison data for stack recommendations
```

The `references/` directory contains the detailed guides that `SKILL.md` delegates to during each phase. You don't need to read these to use PLAID, but they're useful if you want to understand or customize how documents are generated.

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
