# PLAID — Product Led AI Development

A Claude skill that guides founders from idea to buildable spec through a structured conversation.

PLAID walks through three phases:

1. **Vision Intake** — An interactive conversation that captures your product idea, audience, business model, tech stack, and brand direction into a structured `vision.json` file.
2. **Document Generation** — Reads `vision.json` and produces three documents in `docs/`:
   - `product-vision.md` — Strategy, brand, audience, and go-to-market plan
   - `prd.md` — Technical spec a coding agent can build from
   - `product-roadmap.md` — Phased build plan with task checkboxes
3. **Build Mode** — Executes the roadmap phase by phase, marking tasks complete and opening PRs for review at each quality gate.

## Usage

Add PLAID as a skill in Claude Code, then start a conversation with any of these prompts:

- "PLAID"
- "Help me build something"
- "Plan a product"
- "Define my vision"

PLAID will pick up where it left off — partial intakes, missing docs, or mid-build are all resumable.

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

The validator uses only built-in Node.js modules and has zero external dependencies.

## License

MIT — see [LICENSE.txt](LICENSE.txt).
