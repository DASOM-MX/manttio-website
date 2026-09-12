---
name: manttio-design
description: The shared design rules for every Manttio surface — manttio-website, superadmin, the field app (frontend) and the tenant website. Use when writing or reviewing UI in any of them: page headers, typography, radius, elevation, spacing, Spanish copy, or anything that would make one product look like a different company from the others. Also use when a reviewer asks "does this match the rest of the stack?".
---

# Manttio design rules

Four surfaces ship under one name and a prospect sees at least two of them
before they pay: the marketing site, then the product in a demo. When they
disagree about shape, weight or voice, the demo reads as a different company's
software. This skill is what keeps them agreeing.

**`manttio-website` is the ruler.** Where this document and a package's own
convention conflict, the website wins and the package changes — *except* for
the two things below, which are product features, not drift.

## The two things the ruler does NOT govern

Getting this wrong breaks the product, so it comes first.

1. **Per-tenant brand colour.** `superadmin`, `frontend` and the tenant
   `website` build `primary`/`accent` from `--brand-primary-*` / `--brand-accent-*`,
   which the branding module sets at boot. Every tenant's app is *their* colour.
   `manttio-website`'s navy (`#153469`) governs the marketing site **only**.
   Never hard-code a hex into a themeable surface.
2. **Per-tenant typography on the tenant website.** That package reads
   `var(--brand-font-heading, Rubik)` and `var(--brand-font-body, "Work Sans")`.
   Tenants choose their faces. Do not replace those variables with Manttio's.

Everything else below is shared.

## Typography

| Role | Face | Where |
|---|---|---|
| Display — `h1`, section `h2` | **Instrument Sans** (variable 400–700) | website, superadmin, frontend |
| Body, UI, numerals | **Archivo** (variable 100–900) | website, superadmin, frontend |
| Tenant site | tenant's own variables | tenant website only |

**Self-host. No CDN, ever.** `superadmin` already states the reason and it
applies stack-wide: offline, CSP, and no FOUT. In Angular use
`@fontsource-variable/*`; in Astro use the built-in font pipeline with
`fontProviders.google()`, which downloads and subsets at build time. A
`@import url('https://fonts.googleapis.com/...')` in a stylesheet is a bug, not
a shortcut — in the field app it is a *functional* bug, because the product's
headline claim is that it works with no signal.

Set `font-synthesis-weight: none` on headings. Every weight you ask for must be
a real face on the variable axis; a browser faking one is a defect.

## Shape

Radius is a system keyed to what the element *is*, never a single token applied
everywhere (that is anti-slop `V4`):

| Token | Value | Applies to |
|---|---|---|
| `control` | `0.5rem` | buttons, inputs, nav rows, tabs |
| `chip` | `0.75rem` | icon chips, popovers |
| `card` | `1rem`–`22px` | cards, panels, dialogs, table shells |
| full | `999px` | status/role pills, chrome icon-circles **only** |

Buttons are rounded rectangles, not pills — owner, 2026-07-22: *"blob-like
buttons do not look clean."* The carve-out is real and narrow: an icon-only
ghost that is chrome rather than an action stays a circle.

## Elevation

Shadows encode height off the page, they are not decoration (anti-slop `V6`).
One ladder, used by meaning: `e1` in-flow card · `e2` hover/raised · `e3`
floating over content · `ring` hairline separation. The same shadow on every
surface means nothing.

## Page headers — the uppercase ban

**Never put a small uppercase letterspaced label above a heading.** No
kickers, no eyebrows, no `text-xs font-semibold uppercase tracking-wide` line
announcing the section the heading is already naming. It is noise, it competes
with the title for the first fixation, and it is the single most reliable tell
of a template.

```html
<!-- NO -->
<p class="text-xs font-semibold uppercase tracking-wide text-primary-700">Nuevo</p>
<h1>Crear cliente</h1>

<!-- YES -->
<h1>Crear cliente</h1>
```

`superadmin` has banned this since 2026-07-07 — *"Labels/headings render in the
authored title/sentence case."* The rule is now stack-wide.

**Still allowed**, because they are not competing with a title: table `<th>`
headers, footer column headings, and micro-labels inside a data surface
(a stat tile's caption). Uppercase for emphasis or warning is allowed when
asked for explicitly.

## Descriptions belong in a tooltip, not under the title

In dense product UI a one-line description under every `h1` costs a row of
vertical space on every page for text most users read once. Put it behind an
"i" info circle beside the title, revealed on hover and on focus.

Requirements: the trigger is a real `<button>` so it is keyboard-reachable, it
carries an `aria-label`, and the tooltip is not the only place the information
exists if that information is load-bearing. If a description is essential to
using the page, it is not a description — it is content, and it belongs in the
page.

Marketing surfaces are the exception: there, space is not scarce and the
subhead is doing conversion work.

## Copy

Spanish (es-MX), and **accents are not optional** — `Próximamente`, `módulos`,
`cotización`, `múltiples`, `áreas`, `técnicos`, `Contáctanos`. A missing tilde
on a sales page reads as carelessness about the product.

No invented numbers. A figure with no source is anti-slop `C6`; either cite it
or cut it. This includes a caption implying a comparison the UI never renders.

Prefer the concrete verb and the noun that exists in the product. "Envía la
cotización y el cliente la aprueba en línea" beats "Optimiza tu flujo
comercial."

## Anti-slop

The `design-anti-slop` and `avoid-ai-design` skills carry the full catalogs.
Run them on any new marketing surface. The layers, deepest first: conceptual
(`C1`–`C7`) beats structural (`S1`–`S9`) beats visual (`V1`–`V9`). Fixing a
colour while the claim is hollow is wasted work.

Check each pattern's "when it's not slop" gate before counting a hit. A real
product screenshot, a specific claim, a radius system used by role, and a
shadow ladder that encodes depth are all the *not-slop* variants.

## What to do when this document is wrong

It describes decisions, and decisions change. If a package has a good reason to
diverge, say so out loud in the code — `superadmin`'s stylesheet is the model,
where every deviation carries its owner and its date. An undocumented
divergence is drift; a documented one is a decision.
