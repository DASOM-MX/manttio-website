# Stack-wide styling alignment

> **Status:** planning · **Owner:** 2026-09-11 · **Ruler:** `manttio-website`
> **Supersedes nothing.** PR manttio-whitelabels#236 was closed to write this;
> its work is preserved on `design/manttio-design-system` and is re-usable.

## 1. Why

Four surfaces ship under one name, and a prospect meets at least two before
they pay: the marketing site, then the product in a demo. Today they disagree
about type, shape and depth, so the demo reads as a different company's
software than the site that sold it.

## 2. Scope (owner, 2026-09-11)

**In:** all styling and typefaces — type pair and weight ladder, scale, spacing
rhythm, radius, elevation, component idioms, the uppercase ban, copy
conventions.

**Out: branding.** Colour is set per tenant by the branding module
(`--brand-primary-*` / `--brand-accent-*`) and is not touched.

**Typefaces: the rule sets the _default_, the tenant still overrides**
(owner, 2026-09-11). `manttio-website` and `superadmin` take Instrument Sans +
Archivo outright — they are Manttio's own voice, and `superadmin` already fixes
its chrome as constant across tenants (03 §7). On `frontend` and `website` the
faces stay tenant-configurable; what changes is the fallback behind
`var(--brand-font-body, …)` / `var(--brand-font-heading, …)`, which becomes the
same pair. A tenant who has chosen a face keeps it. A tenant who has not now
gets Manttio's.

Never hard-code a hex into a themeable surface, and never force a face over a
tenant variable.

Never flag a themeable surface for "not matching the brand" — that is the
feature working.

## 3. Where the stack actually is

Measured, not estimated.

| | radius: raw vs systemic | elevation tokens | display face | body face |
|---|---|---|---|---|
| `manttio-website` | **10 / 22** | 6 (`e1·e2·e3·ring·cta·cta-lg`) | Instrument Sans | Archivo |
| `superadmin` | 112 / 37 | 1 (`card`) | — (body face at 2xl) | Figtree |
| `frontend` | 65 / **0** | **0** | tenant | tenant *(CDN — bug)* |
| `website` | 36 / **0** | **0** | tenant | tenant |

Three readings:

1. **`superadmin` has a radius system and mostly ignores it** — 112 raw
   `rounded-*` against 37 systemic. The tokens exist; adoption is the gap.
2. **`frontend` and `website` have no radius or elevation system at all.**
   Every surface picks a value. This is the single largest source of drift.
3. **`frontend` fetches its typefaces from `fonts.googleapis.com` at runtime**
   while `ngsw-config.json` caches only same-origin `*.woff2`. The app whose
   headline claim is "funciona sin señal" has no webfont offline. This is a
   bug, not a styling preference, and it should not wait for a design plan.

## 4. Phases

Ordered so each lands independently and nothing blocks on agreement about the
next.

### P0 — the offline font bug *(ship on its own, now)*
Self-host `frontend`'s **existing** faces — `@fontsource-variable/inter` and
`@fontsource/atkinson-hyperlegible`, both published — and delete the CDN
`@import`. **No face changes**: Inter stays the fallback body face, Atkinson
stays the numeric face. This is a delivery fix, not a design change, and it is
independent of every decision below — whatever face is configured, it must not
come from a third-party origin at runtime in an offline-first app.

The preserved branch already implements this the right way round: it keeps
`var(--brand-font-body, …)` tenant-driven and only replaces the fallback. Its
`frontend` half is re-usable as-is.

### P1 — the rules, as a loadable skill *(no code)*
`manttio-design` skill + `manttio-design-review` agent, one copy per package.
Documents the scope above, the radius and elevation systems, the uppercase ban
and the copy conventions. Lands with zero rendered change, so it can merge
while P2+ are still being argued. **Already implemented.**

### P2 — typefaces
**Manttio's own surfaces** (`manttio-website`, `superadmin`): Instrument Sans
display + Archivo body/UI/numerals, outright.

**Tenant surfaces** (`frontend`, `website`): only the *default* moves. This is
not a one-line change — the tenant website's defaults are load-bearing in four
places across two packages, plus an ops step:

| What | Where |
|---|---|
| bundled default faces | `website/src/styles/global.css` (`@fontsource/rubik`, work-sans) |
| Tailwind fallbacks | `website/tailwind.config.mjs` |
| "is this the default?" guard | `website/src/lib/theme.ts:11` — `DEFAULT_FONT_CODES` |
| catalog + recommendation | `backend/.../constants/font-catalog.ts` |
| **font binary** | `branding-fonts` R2 bucket, as `<code>.woff2` |

`lib/theme.ts:40` skips injecting an `@font-face` when the tenant's code equals
the default, because "defaults ship via @fontsource". Change the default
without changing that constant and every tenant on the old default loses its
face.

**`archivo` is already in the catalog** (code `archivo`) — it only needs moving
to `GROUP_DEFAULTS` and marking `tnumVerified: true`, which this work already
established empirically. **`instrument_sans` is not**, and adding it is a
catalog entry *plus* a bucket upload.

#### Font asset spec (owner is supplying the binary)

`brand.service.ts:111` builds the URL as `${FONT_CDN_BASE_URL}/${code}.woff2`,
so the requirement is exact:

| | |
|---|---|
| Format | **`.woff2`** — not `.ttf`, not `.otf`, and not `.tiff` (that is an image format) |
| Build | **Variable**, single file. Not a set of static instances |
| Filename | **`instrument_sans.woff2`** — matches the catalog `code`, byte for byte |
| Location | shared `branding-fonts` R2 bucket, one copy for all tenants |
| Axis | `wght` 400–700 (Instrument Sans ships no more) |
| Licence | OFL, to match the rest of the curated set |

A `.ttf` is fine as the *source* — it converts to woff2 with `woff2_compress`
or `fonttools` — but it must be the **variable** TTF, not a static weight, or
the whole ladder collapses to one face.

⚠️ **The runtime `@font-face` hardcodes `font-weight: 100 900`**
(`website/src/lib/theme.ts:45`), regardless of what the family actually
supports. Instrument Sans stops at 700, so the declaration would overstate it.
Browsers clamp rather than break, but a wordmark asking for 800 on a tenant
site would silently render 700. The mismatch already exists for `rubik`
(300–900 declared as 100–900); Instrument Sans makes it worth fixing — emit the
real axis per catalog entry, or add a `weightRange` field to `FontCatalogSeed`.

Pre-verified: Archivo's `tnum` is real (1111 and 0000 at identical advance —
the property `table.scss` depends on), and Instrument Sans caps at 700, so
anything needing 800+ stays on the body face, which reaches 900.
**Regression-tested: 12/12 superadmin pages, no overflow, no height change.**
**Already implemented.**

### P2b — weight ladder *(owner: "too bold and too cluttered", 2026-09-11)*

This reverses a documented decision, so it should be recorded as one.
`superadmin/src/styles.scss` carries: *"Weight ladder — every rung +200 (owner
2026-08-27, 'font weights are off, use 200 more points'; supersedes the
2026-07-22 400/500 ladder): 600 body · 700 labels/buttons/headings, 800+ for
the wordmark."* The new direction moves it back down.

**Where the stack sits**

| | body baseline | `bold` call sites | `semibold` | heavier |
|---|---|---|---|---|
| `manttio-website` *(ruler)* | **400** | 1 @700 | 14 @600, 13 @500 | — |
| `superadmin` | **600** | **228** | 5 | 5 extrabold, 3 black |
| `frontend` | — | 56 | 45 | 13 extrabold |
| `website` | — | 17 | 26 | — |

`superadmin` runs **+200 above the ruler at every rung**: body 600 vs 400,
headings 700 vs 600. Everything below body weight is doing emphasis work, so
nothing reads as emphasis — which is the "cluttered" part.

**A hypothesis I tested and discarded.** I expected the new typeface to be the
cause — that Archivo renders heavier than Figtree at the same number, so the
+200 ladder tipped over when the face changed. Measured ink coverage on
identical text says no: Archivo is only **+2% to +6%** heavier than Figtree at
400/500/600/700, and Archivo 600 has the same ink as Figtree 600. The face is
not the problem. **The ladder is heavy on its own, and was already heavy before
the swap.**

**The constraint that shapes the fix:** of `superadmin`'s 228 `font-bold`,
**210 are scattered in component templates and only 18 are in the
stylesheets.** There is no small set of component classes to edit. Three ways
to land it:

1. **Remap the utility scale** — one `fontWeight` block in each
   `tailwind.config.js` so `bold: 600`, `semibold: 500`, `medium: 450`,
   `normal: 400`. Every one of the 210 call sites drops a rung with no template
   edits, and it reverses in one line. Cost: the utility names now lie —
   `font-bold` renders 600 — which needs a loud comment or it becomes a trap
   for the next person.
2. **Lower the baseline only** — `body` from 600 to 400, one line. But the 210
   explicit `font-bold` stay at 700, so the gap between body and emphasis
   *widens* to 300. May read better or worse; cheap to try first and look at.
3. **Sweep the call sites** — honest, no lying utilities, and it is 210 edits
   across `superadmin` plus 114 across `frontend` and 43 across `website`.

Recommendation: **(2) first, look at it, then (1) if it is still heavy.** (3)
only if the team wants the utility names to stay truthful, and then as its own
per-package PR with the visual harness in place.

Whichever lands, the ladder should end up at the ruler's: **400 body · 500
labels · 600 headings and buttons · 700 wordmark.** And `styles.scss` should
record the reversal with its date, the way it recorded the increase.

### P2c — tenant text renders as authored *(decided, owner 2026-09-11)*

**Keep the `eyebrow` field; drop the uppercase.** No content-model migration,
no dead form input, and nothing a tenant typed disappears. It also aligns the
tenant site with the rule `superadmin` has carried since 2026-07-07 —
*"labels/headings render in the authored title/sentence case."*

The decision generalises past the eyebrow, because the same transform is
applied to other tenant strings:

| Content | Component | Sites |
|---|---|---|
| `eyebrow` (CMS) | Services · Location · ServiceCatalog · Manufacturers · Clients | **10** — each renders twice |
| `brand.slogan` | Hero · Footer | 2 |
| `m.heading` (CMS hero metrics) | Hero | 1 (inside a `.map`) |

**13 render sites**, all of them tenant-authored. The rule to write down:

> Tenant-authored text renders exactly as the tenant typed it. Never
> `text-transform` it. Hardcoded chrome labels may stay uppercase.

Two things the implementation must get right:

- **`tracking-caps` comes off with `uppercase`.** It is `0.18em`, an
  uppercase-only idiom; left on Title Case it reads as spaced-out and broken.
- **`text-transform: capitalize` is not the answer.** It would render a
  tenant's "servicios de mantenimiento industrial" as "Servicios De
  Mantenimiento Industrial". Render as authored; the shipped defaults
  (`Servicios`, `Catálogo`, `Marcas`, `Ubicación`, `Clientes`) are already
  Title Case.

Staying uppercase: `Footer` "Sitio" and "Contacto directo" — hardcoded chrome,
not competing with a title, not the tenant's words.

### P3 — radius, as a system
Extend the `control` / `chip` / `card` tokens to `frontend` and `website`, then
migrate raw `rounded-*` to them. ~213 call sites across three packages, so this
is the long pole. Mechanical per file, but it wants its own PR per package and
a visual pass each.

### P4 — elevation, as a ladder
Port the `e1·e2·e3·ring` ladder. `frontend` and `website` have no tokens today,
so this is additive before it is a migration. The rule that matters more than
the values: a shadow encodes height off the page; the same shadow everywhere
means nothing.

### P5 — component idioms
Buttons, inputs, cards, tables, empty states — the shapes each package already
has, reconciled. Largest and least urgent; do it last, when P3/P4 have settled
what a surface looks like.

## 5. Decisions still open

- **Does the weight drop apply to tenant surfaces?** `frontend` and `website`
  render a tenant's chosen face, and weight is not part of what a tenant picks
  — the catalog stores a family, not a ladder. So the ladder is Manttio's to
  set on all four. Confirm that reading.
- **Uppercase `h2` section headings** in `frontend` (`my-visits` has four).
  Not eyebrows — they are the heading. In or out of the ban?
- **`manttio-website` commit `b456902`** is already on `main` with the skill,
  the agent and the last eyebrow removed. Revert it to keep everything behind
  the plan, or let it stand as P1 landing early?
- **The skill needs the tenant-text clause** added to its uppercase section,
  alongside the correction below.
- **The committed skill is now wrong** and needs amending either way: its
  typography table still lists `frontend` under Instrument Sans + Archivo. It
  should read `manttio-website` + `superadmin`, with `frontend` and `website`
  named as tenant-configured.
- **Changing the tenant default re-faces every tenant who never customised.**
  Their live public site changes appearance with no action on their part. Is
  that an announced change, a migration that pins existing tenants to
  `work_sans`/`rubik`, or simply accepted?
- **It also contradicts a written rule.** `font-catalog.ts` says *"Commissioner
  is deliberately excluded (the superadmin's own voice)"* — the catalog is not
  supposed to offer Manttio's own chrome face. Making that face the tenant
  *default* inverts the principle: every un-customised tenant would look like
  Manttio by default. That may be exactly what is wanted out of the box, but
  the rule should be restated rather than silently broken. (It has drifted
  once already — `figtree` is in the catalog while superadmin runs Figtree.)
- **`frontend`'s numeric face is *not* tenant-configurable** — `data` leads
  with a hardcoded `"Atkinson Hyperlegible"`, only its fallback is the tenant
  variable. So aligning that one face would not touch tenant configuration.
  Left alone under the current direction; worth a decision if column alignment
  across products ever matters.

## 6. Risks

- **P3 is 213 call sites.** Per-package PRs, not one sweep.
- **Type changes are invisible in unit tests.** The regression harness that
  caught the branding-page shift (Playwright, stubbed backend, seeded auth,
  before/after capture + overflow assertions) was deleted with the artifacts;
  it should be rebuilt and kept as a permanent test before P3 begins.
- **`superadmin` annotates its deviations with owner and date.** That habit is
  the thing to preserve — a documented divergence is a decision, an
  undocumented one is drift.
