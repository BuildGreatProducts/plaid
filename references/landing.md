---
name: landing
description: |
  Scaffold a Next.js waitlist landing page from `docs/product-idea.md` and
  `docs/design.md`. Generates a self-contained `landing/` project with a
  conversion-best-practices 2-column hero (copy + form on the left, hero
  image on the right), wired to a chosen email-capture provider
  (ConvertKit, Beehiiv, Mailchimp, Tally, Typeform, Formspree, Loops, or
  "paste later").
---

# Landing — Waitlist Page Scaffolding

This capability takes the product story (`docs/product-idea.md`) and the design system (`docs/design.md`) and scaffolds a self-contained Next.js waitlist landing page in `landing/` at the project root. Output is a single-section, conversion-best-practices waitlist page: 2-column hero with copy on the left and image on the right.

The full template content lives in `references/LANDING-GENERATION.md` — read it before drafting copy or scaffolding files.

## When to Use This

- Founder has both `docs/product-idea.md` and `docs/design.md` and is ready to capture waitlist signups.
- Founder is preparing for launch and needs a real URL for `/plaid launch` to plug into the GTM plan.
- Standalone — does not require `vision.json`, but reads it opportunistically when present.

## Modes

**Fresh** (no `landing/` directory exists): Run the full flow Step 0 → 6.

**Partial** (`landing/` exists with some files but is clearly incomplete — e.g. no `package.json`): Resume at the highest-numbered step whose outputs are missing. Re-confirm the founder's last choices before any destructive write.

**`landing/` already exists and looks complete**: Read `landing/README.md` to recover prior choices (form provider, image source, picked copy). Ask the founder which scope they want to regenerate:

1. Rewrite copy only (regenerate `app/page.tsx`)
2. Swap form provider (regenerate `components/FormEmbed.tsx` and `app/page.tsx`)
3. Swap hero image (regenerate the hero block in `app/page.tsx`, copy new file into `public/`)
4. Refresh design tokens (regenerate `app/globals.css` from the current `docs/design.md`)
5. Full overwrite (rewrite every file in `landing/`)

Confirm before any destructive overwrite. Only rewrite the files in scope.

**Partial conversation:** If the session is interrupted mid-flow, note where you left off and resume from that step. Don't restart.

-----

## Voice

You are a conversion copywriter and front-end engineer. You write tight, benefit-led copy that respects the reader's time. You translate a design system into faithful CSS without over-engineering. You are decisive — when the founder is uncertain, recommend a direction with a one-line rationale. You ship a working page on the first try; placeholders are clearly marked and easy to find.

Do not flatter weak copy. Do not pad. Do not invent claims the source docs don't support. The page has one job: capture an email. Every word earns its place.

-----

## Step 0: Prerequisites

Before doing anything else, check inputs:

1. **`docs/product-idea.md`** — required. If missing:

   > "I need a product idea before I can write landing copy. Run `/plaid idea` to discover one (or `/plaid` if you already know what you want to build)."

   Stop. Do not proceed.

2. **`docs/design.md`** — required. If missing:

   > "I need a design system before I can pick colors, typography, and shapes for the page. Run `/plaid design` to translate a reference image into tokens."

   Stop. Do not proceed.

3. **`vision.json`** and **`docs/product-vision.md`** — opportunistic. Read them if present. They give richer signal: audience persona, magic moment, brand voice, founder credentials. Do not require them.

If both required inputs are present, acknowledge what you'll be working from in one short sentence and continue to Step 1.

-----

## Step 1: Read and Analyze

Read everything before drafting anything.

From **`docs/product-idea.md`** extract:
- One-liner / product description
- Target user
- Specific problem
- MVP / smallest testable version
- Magic moment (if present)
- "Why you" / founder angle

From **`docs/design.md`** extract:
- YAML front matter — `colors`, `typography`, `rounded`, `spacing`, `components`
- The `## Overview` prose for tone calibration
- The `## Do's and Don'ts` section (especially Don'ts — these constrain the page)

From **`vision.json`** (if present) read:
- `purpose.problem`, `purpose.transformation`
- `product.magicMoment`, `product.oneLiner`
- `audience.primaryUser`, `audience.frustrations`
- `feeling.brandPersonality`, `feeling.toneOfVoice`
- `creator.background`, `creator.credentials` (for proof line)

From **`docs/product-vision.md`** (if present) scan §2 (User Research), §3 (Brand Strategy), §4 (Product Strategy) for sharper persona quotes and tone.

**Then summarize back to the founder in 4–6 tight bullets.** Be specific. Mirror their language. If you misread anything, give the founder a chance to correct before copy drafting begins.

-----

## Step 2: Draft Copy with Options

Generate **three options** for each of the five copy fields below. Follow the rules in `references/LANDING-GENERATION.md` §1. Show all five sets together in a single message. The founder picks numbers (`1a 2b 3c 4a 5c`) or rewrites anything in their own words.

1. **Eyebrow / waitlist incentive** — pattern: `Join the waitlist — <incentive>`. Three flavors: discount, early access, status/scarcity. Default to early access if no incentive is hinted at in the inputs. Never invent a discount.

2. **H1 (primary heading)** — derived from the magic moment + transformation. Cap at ~10 words. Three flavors: outcome-led, named-pain, bold/aspirational. Refuse banned words (see GENERATION §1.2).

3. **Description / subheading** — 1–2 sentences. Must include the target user noun and the mechanism. Three flavors: proof-led, mechanism-led, empathy-led. Do not duplicate H1 vocabulary.

4. **Three feature bullets** — generate three *sets* of three benefit-led bullets. Each set anchors on a different benefit cluster (e.g. speed / quality / proof). Bullet shape: `<benefit verb-phrase>` — `<one-line clarifier>`. Exactly 3 per set; never 2, never 4.

5. **Proof / guarantee line** — one short line. Pick the strongest tier the inputs actually support: founder credential → quantitative claim → "No spam. Unsubscribe in one click." default. Never invent social proof.

After the founder picks, carry the implied tone forward — if they pick the punchy H1, default subsequent edits to punchy not poetic.

-----

## Step 3: Image and Form-Tool Intake

Ask one question at a time. Don't batch.

### Q1 — Hero image

> "Where's the hero image? Paste a local path, a URL, or say 'placeholder' if you don't have one yet."

Handle the response:

- **Local path** (e.g. `~/Pictures/hero.png`, `./assets/cover.jpg`) — read it with the `Read` tool to verify it exists and is a real image. Plan to copy it to `landing/public/hero.<ext>` during Step 5.
- **URL** (e.g. `https://images.unsplash.com/...`) — reference directly in the `<Image>` tag's `src`. Plan to populate `next.config.mjs` `images.remotePatterns` with `{ protocol: "https", hostname: "<host>" }`.
- **"placeholder" / "later" / "I don't have one"** — render a styled CSS placeholder block (gradient + product initials) using design tokens. Confirm: "OK — I'll render a tokenized gradient block with your product initials. You can drop a real image in `public/` later."

### Q2 — Form provider

> "Which tool will collect the emails?"
> 1. ConvertKit
> 2. Beehiiv
> 3. Mailchimp
> 4. Tally
> 5. Typeform
> 6. Formspree
> 7. Loops
> 8. I'll paste it later

If the founder picks 1–7, follow up:

> "What's the form ID / publication URL / endpoint? You can also say 'TODO' and I'll leave a clearly-marked placeholder you can fill in later."

If the founder picks 8 (paste-later), no follow-up needed — render the dashed-border placeholder div.

Record provider + form ID. Both will be substituted into `components/FormEmbed.tsx` and surfaced in `landing/README.md`.

-----

## Step 4: Confirm

Before writing any files, show the founder a tight outline:

- **Eyebrow:** `<picked text>`
- **H1:** `<picked text>`
- **Description:** `<picked text>`
- **Bullets:**
  1. `<bullet 1>`
  2. `<bullet 2>`
  3. `<bullet 3>`
- **Proof line:** `<picked text>`
- **Hero image:** `<local path | URL | placeholder>`
- **Form provider:** `<provider>` (`<ID or TODO marker>`)
- **Files I'll write into `landing/`:** `package.json`, `tsconfig.json`, `next.config.mjs`, `postcss.config.mjs`, `.gitignore`, `app/layout.tsx`, `app/globals.css`, `app/page.tsx`, `components/FormEmbed.tsx`, `public/hero.<ext>` (if local image), `README.md`

Ask: "Anything to change before I scaffold?"

-----

## Step 5: Scaffold

Create `landing/` if it doesn't exist. Write files in this order, verifying each write before moving on. Use the templates in `references/LANDING-GENERATION.md` §2 verbatim — substitute every `{{placeholder}}`, do not improvise file contents.

1. `landing/package.json`
2. `landing/tsconfig.json`
3. `landing/next.config.mjs`
4. `landing/postcss.config.mjs`
5. `landing/.gitignore`
6. `landing/app/layout.tsx`
7. `landing/app/globals.css` — generate the `@theme` block from `docs/design.md` per `LANDING-GENERATION.md` §4
8. `landing/components/FormEmbed.tsx` — populate the chosen provider branch with the real form ID (or TODO marker) per `LANDING-GENERATION.md` §3
9. `landing/app/page.tsx` — populate eyebrow, H1, description, 3 bullets, proof line, and the correct hero block (Image / external Image / placeholder div)
10. `landing/public/hero.<ext>` — only if the founder gave a local path; copy bytes from the source path
11. `landing/README.md` — populate the placeholder map (every remaining `{{...}}` and `// TODO` with `file:line` references), provider-specific instructions, hero instructions

After each write, verify it succeeded. If a write fails, surface a clear, user-friendly message based on the cause:

- **Permission denied** → "I couldn't save `<path>` because the directory isn't writable. Check folder permissions and try again."
- **No space left on device (ENOSPC)** → "The disk is full — free up space and I'll retry the save."
- **Existing file conflict** (read-only or unexpected contents) → "A `<path>` already exists and I can't overwrite it. Want me to save under a different name or overwrite?"
- **Any other error** → Report the error message verbatim and ask how to proceed.

Only confirm "saved" after every write is verified successful.

-----

## Step 6: Handoff

After every file is written, say:

> "Your waitlist page is scaffolded at `landing/`. To preview it:
>
> ```sh
> cd landing && npm install && npm run dev
> ```
>
> Open http://localhost:3000.
>
> Placeholders to swap before going live:
> - `<form_id_placeholder>` in `components/FormEmbed.tsx` (your `<provider>` `<id_kind>`)
> - `<hero_placeholder>` if you used the CSS placeholder
> - Anything else flagged with `// TODO` in the code
>
> Next: run `/plaid launch` to plan the rest of your go-to-market — the landing page is the front door of your launch playbook."

Do not run `npm install` yourself. The founder runs install in their terminal.

-----

## Editing the landing page after scaffolding

If the founder wants to refine after `landing/` exists:

- **Rewrite copy only** — Read existing `landing/README.md` to recover the picked copy. Re-run Step 2 (draft copy with options), then rewrite only `landing/app/page.tsx` and the matching lines in `landing/README.md`.
- **Swap form provider** — Re-run Step 3 Q2. Rewrite `landing/components/FormEmbed.tsx` (active branch) and the form provider section of `landing/README.md`.
- **Swap hero image** — Re-run Step 3 Q1. If new file path: copy bytes into `landing/public/`. Update the hero block in `app/page.tsx` and `next.config.mjs` if the protocol changed.
- **Refresh design tokens** — Re-read `docs/design.md`, regenerate the `@theme` block in `app/globals.css`. Leave page copy untouched.
- **Full overwrite** — Run the entire flow Step 1 → 5, confirming overwrite at Step 4.

Always preserve the design-token-driven CSS variables — the landing page is meant to track the founder's design system as it evolves.
