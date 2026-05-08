# WAITLIST-GENERATION.md — Next.js Waitlist Page Templates

This file is the sidecar generation guide for the Waitlist capability (`references/waitlist.md`). It contains:

1. Copy generation rules (eyebrow, H1, description, bullets, proof line)
2. The Next.js scaffold templates — every file the capability writes into `waitlist/`
3. Form-embed switch-case definitions for each supported provider
4. Design-token mapping rules — how `docs/design.md` YAML becomes Tailwind v4 `@theme` entries
5. Anti-patterns to refuse

The Waitlist capability reads this guide before drafting copy or scaffolding files. Treat the templates here as canonical — emit them verbatim with placeholders substituted, do not improvise file contents.

---

## 1. Copy Generation Rules

The capability generates **3 options** for each of five copy fields during Step 2. Use these rules when drafting.

### 1.1 Eyebrow / waitlist incentive

**Pattern:** `Join the waitlist — <incentive>`

Three flavors to offer:
- **(a) Discount** — "get 50% off at launch", "founder pricing for the first 100 sign-ups". Only use specific numbers if `docs/product-idea.md` or `vision.json` confirms a real plan; otherwise fuzz to "founder pricing" or "early-bird pricing".
- **(b) Early access** — "be first in line", "early access before public launch", "shape the product before launch".
- **(c) Status / scarcity** — "limited to the first 100 founders", "private beta — invite-only".

If neither idea.md nor vision.json hints at an incentive, default to (b) early access. **Never invent a discount the founder hasn't approved.**

### 1.2 H1 (primary heading)

Source: the **magic moment** (from `vision.json:product.magicMoment` or the corresponding section of `docs/product-idea.md`) and the **transformation** (`vision.json:purpose.desiredTransformation` or "Why now / Why this" in idea.md).

Cap at ~10 words. Three flavors:
- **(a) Outcome-led** — "Ship a product before your idea goes stale."
- **(b) Named-pain** — "Stop juggling 14 tabs to launch a side project."
- **(c) Bold / aspirational** — "The fastest way to go from idea to launched."

Banned words and phrases (refuse to emit):
- "AI-powered", "revolutionary", "leverage", "synergy", "platform", "solution"
- "The world's first…", "Welcome to…", "Introducing…"
- "Reimagine", "transform your business", "unlock your potential"

### 1.3 Description / subheading

1–2 sentences expanding the H1. Must include both:
- The **target user noun** (e.g. "for solo founders", "for engineering managers")
- The **mechanism** — the *how*, in plain English

Three flavors varying angle:
- **Proof-led** — leans on credibility ("Built by N founders who shipped X.")
- **Mechanism-led** — leans on the how ("By scaffolding a Next.js page wired to your design system in 60 seconds.")
- **Empathy-led** — leans on the pain ("Because spending three weekends on a waitlist page is how good ideas die.")

Do not duplicate H1 vocabulary. Complement the headline; don't restate it.

### 1.4 Three feature bullets — benefit-led

Generate three **sets** of three bullets (the founder picks a set). Each set anchors on a different benefit cluster — e.g. *speed* / *quality* / *proof*, or *ease* / *flexibility* / *credibility*.

Bullet shape: `<benefit verb-phrase>` — `<one-line clarifier>`. Examples:
- "Ship in days, not months — scaffolded Next.js with your design system pre-wired."
- "Stay on-brand from day one — colors, type, and shapes pulled from your design.md."

Rules:
- Exactly **3** bullets. Never 2, never 4.
- Each bullet leads with a benefit verb-phrase (≤ 6 words), then the clarifier.
- Forbidden: pure feature lists ("Tailwind support", "TypeScript", "Dark mode"), vague verbs ("supports", "powered by"), noun-only lists.

### 1.5 Proof / guarantee line

Pick the strongest mode the inputs actually support — **never invent social proof.**

Tier order:
1. **Founder credential** — if `vision.json:creator.background` or "Why you" in idea.md gives a credible credential, use: "Built by [credential]." (e.g. "Built by an ex-Stripe engineer.")
2. **Quantitative claim** — only if a real number exists or the founder marks `{{waitlist_count}}` to fill in later. Format: "Already used by N+ founders."
3. **Default — low-risk promise** — "No spam. Unsubscribe in one click." Use this when neither tier above applies. This is always safe.

Three flavors to surface mirror these tiers (founder picks). If only the default applies, still offer three variations of it ("No spam, ever.", "We hate spam too.", "Unsubscribe anytime, one click.").

---

## 2. Next.js Scaffold Templates

Write these files in this order. Each template uses `{{placeholder}}` markers — substitute every one before writing. Verify each write before moving on.

### 2.1 `waitlist/package.json`

```json
{
  "name": "{{slug}}-waitlist",
  "version": "0.1.0",
  "private": true,
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start"
  },
  "dependencies": {
    "next": "^15.1.0",
    "react": "^19.0.0",
    "react-dom": "^19.0.0"
  },
  "devDependencies": {
    "@tailwindcss/postcss": "^4.0.0",
    "tailwindcss": "^4.0.0",
    "typescript": "^5.4.0",
    "@types/node": "^20.0.0",
    "@types/react": "^19.0.0",
    "@types/react-dom": "^19.0.0"
  }
}
```

`{{slug}}` is the kebab-cased product name (e.g. `acme-tracker`).

### 2.2 `waitlist/tsconfig.json`

```json
{
  "compilerOptions": {
    "target": "ES2022",
    "lib": ["dom", "dom.iterable", "esnext"],
    "allowJs": true,
    "skipLibCheck": true,
    "strict": true,
    "noEmit": true,
    "esModuleInterop": true,
    "module": "esnext",
    "moduleResolution": "bundler",
    "resolveJsonModule": true,
    "isolatedModules": true,
    "jsx": "preserve",
    "incremental": true,
    "plugins": [{ "name": "next" }],
    "paths": { "@/*": ["./*"] }
  },
  "include": ["next-env.d.ts", "**/*.ts", "**/*.tsx", ".next/types/**/*.ts"],
  "exclude": ["node_modules"]
}
```

### 2.3 `waitlist/next.config.mjs`

```js
/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {{remote_patterns}}
    ]
  }
};

export default nextConfig;
```

`{{remote_patterns}}` is empty (delete the `remotePatterns` array entirely if no external image) when the hero is local or a placeholder. When the hero is an external URL, populate one entry: `{ protocol: "https", hostname: "<host-from-url>" }`.

### 2.4 `waitlist/postcss.config.mjs`

```js
export default {
  plugins: {
    "@tailwindcss/postcss": {}
  }
};
```

### 2.5 `waitlist/.gitignore`

```text
node_modules/
.next/
out/
.env*
.DS_Store
*.tsbuildinfo
next-env.d.ts
```

### 2.6 `waitlist/app/layout.tsx`

```tsx
import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "{{product_name}} — {{one_liner}}",
  description: "{{description}}"
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
```

`{{description}}` here is the chosen Step 2 description (used as the meta description too).

### 2.7 `waitlist/app/globals.css`

```css
@import "tailwindcss";

@theme {
{{theme_block}}
}

:root {
  color-scheme: light;
}

body {
  font-family: var(--font-body, system-ui, -apple-system, sans-serif);
  background: var(--color-surface, #ffffff);
  color: var(--color-on-surface, #111111);
}

.hero-placeholder {
  aspect-ratio: 4 / 3;
  width: 100%;
  border-radius: var(--radius-lg, 16px);
  background: linear-gradient(135deg, var(--color-primary, #111111), var(--color-accent, #555555));
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--color-on-primary, #ffffff);
  font-family: var(--font-display, system-ui, sans-serif);
  font-size: 4rem;
  font-weight: 700;
  letter-spacing: -0.02em;
}
```

`{{theme_block}}` is generated from `docs/design.md` per §4 below.

### 2.8 `waitlist/components/FormEmbed.tsx`

See §3 for the full file content.

### 2.9 `waitlist/app/page.tsx`

```tsx
import Image from "next/image";
import { FormEmbed } from "@/components/FormEmbed";

export default function Page() {
  return (
    <main className="min-h-screen bg-[var(--color-surface)] text-[var(--color-on-surface)]">
      <section className="mx-auto grid max-w-6xl gap-10 px-6 py-16 lg:grid-cols-2 lg:py-24">
        <div className="flex flex-col justify-center gap-6">
          <p className="text-sm font-medium uppercase tracking-wide text-[var(--color-accent)]">
            {{eyebrow}}
          </p>
          <h1 className="text-4xl font-bold leading-tight tracking-tight md:text-5xl">
            {{headline}}
          </h1>
          <p className="text-lg leading-relaxed text-[var(--color-on-surface-muted,#4b5563)]">
            {{description}}
          </p>
          <ul className="flex flex-col gap-3">
            <li className="flex gap-3">
              <span aria-hidden className="mt-2 inline-block h-2 w-2 shrink-0 rounded-full bg-[var(--color-accent)]" />
              <span><strong>{{bullet_1_lead}}</strong> — {{bullet_1_clarifier}}</span>
            </li>
            <li className="flex gap-3">
              <span aria-hidden className="mt-2 inline-block h-2 w-2 shrink-0 rounded-full bg-[var(--color-accent)]" />
              <span><strong>{{bullet_2_lead}}</strong> — {{bullet_2_clarifier}}</span>
            </li>
            <li className="flex gap-3">
              <span aria-hidden className="mt-2 inline-block h-2 w-2 shrink-0 rounded-full bg-[var(--color-accent)]" />
              <span><strong>{{bullet_3_lead}}</strong> — {{bullet_3_clarifier}}</span>
            </li>
          </ul>
          <div className="pt-2">
            <FormEmbed />
          </div>
          <p className="text-sm text-[var(--color-on-surface-muted,#6b7280)]">
            {{proof_line}}
          </p>
        </div>

        <div className="flex items-center justify-center">
          {{hero_block}}
        </div>
      </section>
    </main>
  );
}
```

`{{hero_block}}` is one of:

- **Local image** (founder pasted a path; copied into `waitlist/public/hero.<ext>`):
  ```tsx
  <Image
    src="/hero.{{ext}}"
    alt=""
    width={1200}
    height={900}
    priority
    className="rounded-[var(--radius-lg,16px)] w-full h-auto"
  />
  ```

- **External URL** (with `next.config.mjs` `remotePatterns` populated):
  ```tsx
  <Image
    src="{{url}}"
    alt=""
    width={1200}
    height={900}
    priority
    className="rounded-[var(--radius-lg,16px)] w-full h-auto"
  />
  ```

- **Placeholder** (no image yet):
  ```tsx
  <div className="hero-placeholder">{{initials}}</div>
  ```
  `{{initials}}` is up to 2 characters from the product name.

### 2.10 `waitlist/public/hero.<ext>`

Only present when the founder gave a local file path. Copy bytes from the source path. Preserve extension (`png`, `jpg`, `jpeg`, `webp`, `svg`).

### 2.11 `waitlist/README.md`

```markdown
# {{product_name}} — Waitlist

Generated by `/plaid waitlist` from `docs/product-idea.md` and `docs/design.md`.

## Run locally

\`\`\`sh
npm install
npm run dev
\`\`\`

Open http://localhost:3000.

## Placeholders to swap before going live

{{placeholder_map}}

## Form provider

**{{provider}}** — swap the form ID at `components/FormEmbed.tsx` (the `FORM_ID` constant near the top of the file).
{{provider_id_instructions}}

## Hero image

{{hero_instructions}}

## Design tokens

Tokens are sourced from `../docs/design.md` and emitted into `app/globals.css` (`@theme` block).
Re-run `/plaid waitlist` (regenerate mode) to refresh after editing `design.md`.

## Verification checklist

- [ ] Page loads at `localhost:3000` with no console errors
- [ ] Hero image renders (or placeholder is visible)
- [ ] Form submits to {{provider}} — test once with your own email
- [ ] Mobile breakpoint (< 768px) stacks columns vertically
- [ ] Accessibility: H1 present once, alt text on image, form has a label
```

`{{placeholder_map}}` is a bulleted list of every remaining `{{...}}` and `// TODO` with `file:line` references. Example:

```text
- `app/page.tsx` line 14 — eyebrow text
- `components/FormEmbed.tsx` line 8 — `FORM_ID` constant (your Tally form ID)
- `public/hero.png` — replace with your own image
```

`{{provider_id_instructions}}` is provider-specific (see §3).

`{{hero_instructions}}` is one of:
- *Local file:* "Image at `public/hero.{{ext}}`. Drop a new file at `public/` to replace."
- *URL:* "Image is loaded from `{{url}}`. Update `app/page.tsx` and `next.config.mjs` `remotePatterns` to swap."
- *Placeholder:* "No image yet — currently rendering a CSS placeholder block. Drop a file at `public/hero.<ext>` and update `app/page.tsx` to use `<Image>`."

---

## 3. Form-Embed Switch-Case (`components/FormEmbed.tsx`)

The full file. Substitute the `provider` and `formId` literals based on the founder's Step 3 answers. Only the chosen branch needs to be wired live; other branches stay in the file as commented references for the founder to flip later.

```tsx
"use client";

type Provider =
  | "convertkit"
  | "beehiiv"
  | "mailchimp"
  | "tally"
  | "typeform"
  | "formspree"
  | "loops"
  | "paste-later";

const PROVIDER: Provider = "{{provider}}";
const FORM_ID = "{{form_id_placeholder}}"; // TODO: replace with your real {{provider_id_kind}}

export function FormEmbed() {
  switch (PROVIDER) {
    case "convertkit":
      return (
        <form
          action={`https://app.convertkit.com/forms/${FORM_ID}/subscriptions`}
          method="post"
          className="flex flex-col gap-3 sm:flex-row"
        >
          <label className="sr-only" htmlFor="email">Email</label>
          <input
            id="email"
            type="email"
            name="email_address"
            required
            placeholder="you@example.com"
            className="flex-1 rounded-[var(--radius-md,8px)] border border-[var(--color-border,#e5e7eb)] bg-white px-4 py-3 text-base"
          />
          <button
            type="submit"
            className="rounded-[var(--radius-md,8px)] bg-[var(--color-primary)] px-5 py-3 text-base font-semibold text-[var(--color-on-primary)] transition hover:opacity-90"
          >
            Join the waitlist
          </button>
        </form>
      );

    case "beehiiv":
      return (
        <iframe
          src={`https://embeds.beehiiv.com/${FORM_ID}`}
          width="100%"
          height="80"
          frameBorder={0}
          scrolling="no"
          className="rounded-[var(--radius-md,8px)]"
          title="Subscribe"
        />
      );

    case "mailchimp":
      // TODO: Mailchimp uses a {dc}-{u}-{id} triple. Replace the action URL below.
      return (
        <form
          action="https://YOUR_DC.list-manage.com/subscribe/post?u=YOUR_U_ID&id=YOUR_LIST_ID"
          method="post"
          target="_blank"
          className="flex flex-col gap-3 sm:flex-row"
        >
          <label className="sr-only" htmlFor="email">Email</label>
          <input
            id="email"
            type="email"
            name="EMAIL"
            required
            placeholder="you@example.com"
            className="flex-1 rounded-[var(--radius-md,8px)] border border-[var(--color-border,#e5e7eb)] bg-white px-4 py-3 text-base"
          />
          <button
            type="submit"
            className="rounded-[var(--radius-md,8px)] bg-[var(--color-primary)] px-5 py-3 text-base font-semibold text-[var(--color-on-primary)] transition hover:opacity-90"
          >
            Join the waitlist
          </button>
        </form>
      );

    case "tally":
      return (
        <>
          <iframe
            data-tally-src={`https://tally.so/embed/${FORM_ID}?alignLeft=1&hideTitle=1&transparentBackground=1`}
            loading="lazy"
            width="100%"
            height="180"
            frameBorder={0}
            title="Subscribe"
            className="rounded-[var(--radius-md,8px)]"
          />
          <script async src="https://tally.so/widgets/embed.js" />
        </>
      );

    case "typeform":
      return (
        <>
          <div data-tf-live={FORM_ID} className="min-h-[180px]" />
          <script async src="//embed.typeform.com/next/embed.js" />
        </>
      );

    case "formspree":
      return (
        <form
          action={`https://formspree.io/f/${FORM_ID}`}
          method="POST"
          className="flex flex-col gap-3 sm:flex-row"
        >
          <label className="sr-only" htmlFor="email">Email</label>
          <input
            id="email"
            type="email"
            name="email"
            required
            placeholder="you@example.com"
            className="flex-1 rounded-[var(--radius-md,8px)] border border-[var(--color-border,#e5e7eb)] bg-white px-4 py-3 text-base"
          />
          <button
            type="submit"
            className="rounded-[var(--radius-md,8px)] bg-[var(--color-primary)] px-5 py-3 text-base font-semibold text-[var(--color-on-primary)] transition hover:opacity-90"
          >
            Join the waitlist
          </button>
        </form>
      );

    case "loops":
      return (
        <form
          action={`https://app.loops.so/api/newsletter-form/${FORM_ID}`}
          method="POST"
          className="flex flex-col gap-3 sm:flex-row"
        >
          <label className="sr-only" htmlFor="email">Email</label>
          <input
            id="email"
            type="email"
            name="email"
            required
            placeholder="you@example.com"
            className="flex-1 rounded-[var(--radius-md,8px)] border border-[var(--color-border,#e5e7eb)] bg-white px-4 py-3 text-base"
          />
          <button
            type="submit"
            className="rounded-[var(--radius-md,8px)] bg-[var(--color-primary)] px-5 py-3 text-base font-semibold text-[var(--color-on-primary)] transition hover:opacity-90"
          >
            Join the waitlist
          </button>
        </form>
      );

    case "paste-later":
    default:
      return (
        <div
          role="status"
          className="flex min-h-[80px] items-center justify-center rounded-[var(--radius-md,8px)] border-2 border-dashed border-[var(--color-border,#e5e7eb)] bg-white px-4 py-3 text-sm text-[var(--color-on-surface-muted,#6b7280)]"
        >
          {/* TODO: paste your form embed snippet here (replace this entire <div>) */}
          Paste your waitlist form embed here.
        </div>
      );
  }
}
```

### Per-provider config table

| Provider     | `{{form_id_placeholder}}` value                           | `{{provider_id_kind}}`            | Extra notes                                                                |
|--------------|------------------------------------------------------------|------------------------------------|----------------------------------------------------------------------------|
| convertkit   | founder's ConvertKit form ID, or `YOUR_CONVERTKIT_FORM_ID` | "ConvertKit form ID"              | Server `<form>`, no JS dep                                                |
| beehiiv      | publication embed UUID, or `YOUR_BEEHIIV_EMBED_UUID`       | "Beehiiv embed UUID"              | Iframe; height may need tuning per publication                            |
| mailchimp    | not used directly — see TODO comment in code               | "Mailchimp dc + u + list-id"      | Two markers in the action URL (`YOUR_DC`, `YOUR_U_ID`, `YOUR_LIST_ID`)    |
| tally        | Tally form ID, or `YOUR_TALLY_FORM_ID`                     | "Tally form ID"                   | Iframe + Tally embed script                                               |
| typeform     | Typeform form ID, or `YOUR_TYPEFORM_FORM_ID`               | "Typeform form ID"                | `data-tf-live` div + Typeform embed script                                |
| formspree    | Formspree project ID, or `YOUR_FORMSPREE_PROJECT_ID`       | "Formspree project ID"            | Server `<form>`, no JS dep                                                |
| loops        | Loops form ID, or `YOUR_LOOPS_FORM_ID`                     | "Loops form ID"                   | Server `<form>` posting to Loops API                                      |
| paste-later  | n/a — show placeholder div                                  | n/a                               | No external dependency; visible at runtime as a dashed-border slot         |

### `{{provider_id_instructions}}` for `waitlist/README.md`

| Provider     | Instructions to print in `waitlist/README.md`                                                                  |
|--------------|----------------------------------------------------------------------------------------------------------------|
| convertkit   | "Get your form ID from ConvertKit → Forms → your form → Embed → look for `/forms/<ID>/subscriptions`."         |
| beehiiv      | "Get your embed UUID from Beehiiv → Settings → Embed → copy the UUID after `embeds.beehiiv.com/`."             |
| mailchimp    | "Open Mailchimp → Audience → Signup forms → Embedded forms. Copy the action URL and replace the three TODOs."  |
| tally        | "Get your form ID from Tally → your form → Share → Embed → copy the ID after `tally.so/embed/`."               |
| typeform     | "Get your form ID from Typeform → your form → Share → Embed → copy the ID."                                   |
| formspree    | "Get your project ID from Formspree → Forms → your form → copy the ID after `formspree.io/f/`."                |
| loops        | "Get your form ID from Loops → Forms → your form → copy the ID after `/newsletter-form/`."                     |
| paste-later  | "Replace the dashed-border placeholder div in `components/FormEmbed.tsx` with your provider's embed snippet."  |

---

## 4. Design-Token Mapping (`@theme` block generation)

Read the YAML front matter of `docs/design.md`. For each token present, emit one line into the `@theme` block of `waitlist/app/globals.css`. **Only emit tokens that exist in the YAML — do not invent.**

### 4.1 Mapping table

| design.md path                           | Emitted in `@theme`                                      | Result                                                |
|------------------------------------------|----------------------------------------------------------|-------------------------------------------------------|
| `colors.<token>: "#hex"`                 | `--color-<token>: #hex;`                                 | Tailwind utility `bg-<token>`, var `var(--color-<token>)` |
| `typography.<scale>.fontFamily: "X"`     | aggregate into `--font-<role>: X, system-ui, sans-serif;` | utility `font-<role>` (`display`, `body`, `mono`)     |
| `typography.<scale>.fontSize` etc.       | not emitted in `@theme` — applied at usage sites in page.tsx via Tailwind utility classes | size/weight set inline in page.tsx                    |
| `rounded.<scale>: <dim>`                 | `--radius-<scale>: <dim>;`                               | utility `rounded-<scale>`                             |
| `spacing.<scale>: <dim>`                 | `--spacing-<scale>: <dim>;`                              | utility `p-<scale>`, `gap-<scale>`, etc.              |
| `components.<name>.*`                    | not directly mapped — consulted by the AI when styling FormEmbed's submit button inline | submit button inherits `var(--color-primary)` etc.    |

### 4.2 Font role aggregation

Many `design.md` files have multiple typography scales (h1, h2, body, caption, mono). Aggregate the `fontFamily` values into role-level variables:

- `--font-display` — fontFamily of the largest display scale (`display` or `h1`).
- `--font-body` — fontFamily of `body` (or fall back to display if no body present).
- `--font-mono` — fontFamily of `mono` (or omit if no mono scale).

If all scales share one fontFamily, emit only `--font-display` and `--font-body` (both pointing at the same family).

### 4.3 Example

Given this `docs/design.md` front matter:

```yaml
colors:
  primary: "#FF5722"
  on-primary: "#FFFFFF"
  surface: "#FAFAFA"
  on-surface: "#111111"
  on-surface-muted: "#6B7280"
  accent: "#0EA5E9"
  border: "#E5E7EB"
typography:
  h1:
    fontFamily: "Inter"
    fontSize: 48px
    fontWeight: 700
  body:
    fontFamily: "Inter"
    fontSize: 16px
    fontWeight: 400
rounded:
  sm: 4px
  md: 8px
  lg: 16px
spacing:
  sm: 8px
  md: 16px
  lg: 24px
```

Emit this `@theme` block:

```css
@theme {
  --color-primary: #FF5722;
  --color-on-primary: #FFFFFF;
  --color-surface: #FAFAFA;
  --color-on-surface: #111111;
  --color-on-surface-muted: #6B7280;
  --color-accent: #0EA5E9;
  --color-border: #E5E7EB;

  --font-display: "Inter", system-ui, sans-serif;
  --font-body: "Inter", system-ui, sans-serif;

  --radius-sm: 4px;
  --radius-md: 8px;
  --radius-lg: 16px;

  --spacing-sm: 8px;
  --spacing-md: 16px;
  --spacing-lg: 24px;
}
```

### 4.4 Missing-token fallback

If a token category is absent from `design.md`, **omit it silently** from the `@theme` block. The page templates use `var(--color-..., <fallback>)` syntax so they keep rendering. The hero placeholder block in `globals.css` already includes safe fallbacks.

If `colors.primary` or `colors.surface` is missing entirely, warn the founder before scaffolding — these are the minimum bar for a usable page.

---

## 5. Anti-patterns (refuse to emit)

The capability must refuse to generate any of these, even if the founder asks:

1. **More than one CTA** on the page. The waitlist form is the only CTA.
2. **Stacked redundant copy** — eyebrow + H1 + subhead all repeating the same idea.
3. **Generic stock phrases** — "transform your business", "unlock your potential", "the future of X".
4. **Industry jargon** the target user wouldn't say out loud.
5. **Bullet counts other than exactly 3.**
6. **Em-dashes or rhetorical flourishes** the rest of the founder's docs don't use. Match the voice of `product-idea.md`.
7. **Claims** — counts, testimonials, percentages — that aren't grounded in the input docs. If the founder hasn't earned the claim, the proof line defaults to "No spam. Unsubscribe in one click."
8. **Multiple form embeds** or "also follow us on Twitter / Discord / etc." — the page's job is one conversion.
9. **Banned H1 words:** "AI-powered", "revolutionary", "leverage", "synergy", "platform", "solution", "reimagine", "the world's first".
10. **Inventing design tokens** not present in `docs/design.md`. Fall back to var() defaults instead.
