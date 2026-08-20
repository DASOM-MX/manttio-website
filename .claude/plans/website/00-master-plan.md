# 00 — Manttio marketing site — master plan

> **Status:** planned (CP-0) · **Owner:** planning session 2026-08-18 · **Last updated:** 2026-08-18
> **Repo:** `DASOM-MX/manttio-website` (this repo) — Astro 7 + Tailwind 4, static.
> **Not to be confused with** `manttio-whitelabeled/website/` — that is the *tenant* site
> (Peña Nevada today), rendered from `/brand` + published CMS. This one sells **Manttio
> itself** and is the only site where the word "manttio" belongs in rendered output.

Context read before writing this: `manttio-whitelabeled/.claude/plans/superadmin/00-master-plan.md`
(module suite + cross-module decisions), `01-conventions.md` (binding rule sets),
`17-executive-refresh.md` (the "soft-executive" language + Figtree), `15-website.md`
(tenant-site scope, for contrast).

---

## 1. Locked decisions (owner, 2026-08-18)

| # | Decision | Consequence |
|---|---|---|
| 1 | **Sells the Manttio SaaS**; primary conversion is a **demo request**; the **module suite is the centerpiece** | IA is organized around modules, not around generic SaaS benefit-speak |
| 2 | **Spanish (MX) only** | No i18n routing, no locale-keyed content, `lang="es-MX"`. Revisit only if a non-MX pitch appears |
| 3 | **Copy hardcoded in `.astro`** for now | No content collections in v1. §9 records the migration trigger so this stays a choice, not a trap |
| 4 | **Bold showpiece motion** — scroll-driven storytelling | Buys a motion budget (§4) that the a11y/perf budget (§8) then bounds |

Inherited (not re-litigated here): **no emojis ever**, **outlined icons only** (lucide),
**WCAG AA contrast**, **transform-only animation**, **reduced-motion honored** — the
Accessibility (CRITICAL) and Animation (MEDIUM) rule sets from
`superadmin/01-conventions.md` bind this site too.

---

## 2. Stack + platform

Already in place (cleanup pass, 2026-08-18): Astro 7.2.3, Tailwind **4.3.3** via
`@tailwindcss/vite` (no config file — `@theme` in `src/styles/global.css`), fonts through
Astro's pipeline (self-hosted, subset, preloaded), `@astrojs/sitemap`, sharp.

Decisions for this plan:

- **Motion: `motion` (motion.dev) v13** — `animate` / `scroll` / `inView` / `stagger`.
  Hybrid engine (WAAPI where possible), tree-shakeable, ~18 KB for the full import and
  far less when only `inView` + `animate` land in a chunk.
- **Pinning: native CSS `position: sticky`**, never JS scroll-hijacking. Every "pinned"
  scene in §6 is a tall section with a sticky child; scroll progress drives the visuals.
  **GSAP ScrollTrigger considered and rejected**: its headline feature is pinning, sticky
  covers it, and ~70 KB is a third of the whole JS budget. Escape hatch: if one specific
  scene genuinely needs ScrollTrigger's pin-spacing math, import GSAP **in that island
  only** and record the exception here.
- **No Lenis / no smooth-scroll library.** Momentum hijacking fights trackpads, breaks
  keyboard paging, and is the most common "expensive site feels broken" failure. Native
  scroll + `scroll-behavior: smooth` on anchors.
- **Page transitions: Astro `<ClientRouter />`** with named `view-transition-name` pairs
  on the wordmark and the section headings.
- **Icons: `astro-icon` + `@iconify-json/lucide`** — compiled to inline SVG at build,
  zero runtime, and the same lucide set superadmin uses.
- **Hosting: Cloudflare** (parity with every other package). Static output; the demo
  endpoint (§7) is the one dynamic route — see that section for the adapter call.
- **Analytics:** Cloudflare Web Analytics (no cookie banner, no third-party JS).

**Every interactive piece is an Astro island** (`client:visible`, or `client:idle` for the
nav). No framework runtime — vanilla TS in `<script>` blocks and small `.ts` modules under
`src/scripts/`. If a section ever justifies a component framework, that is a plan
amendment, not a drive-by `npm i`.

---

## 3. Design language — "executive with edge"

Superadmin's **soft-executive** language (plan 17) is the anchor so a prospect who books a
demo sees the same product they saw on the site. Marketing gets one register more contrast
and drama than the app — the app optimizes for eight-hour use, the site for eight seconds.

**Carried over from 17:** `rounded-2xl` cards, neutral soft shadows over heavy ones,
hairline borders, generous page-level whitespace around honest/compact data, **Figtree**
for display, pill CTAs, calm weight ladder (400/500, 600+ reserved for wordmarks and
hero numerals).

**Added for marketing (revised 2026-08-19, owner):**
- **Elevation, not outlines.** Depth comes from **layered soft shadows on white cards**,
  not hairline borders. A line appears only where two surfaces genuinely meet, and then as
  a 1px *shadow ring* at ~4–6 % alpha — never a `border` — so edges read as light falling
  off a surface rather than as drawn boxes. Radii go up (`20–24px`) and shadows go wide and
  low-opacity (two layers: a tight 1–2px contact shadow plus a broad 30–60px ambient one).
- **Light ground, one saturated element.** Sections sit on a soft cool neutral; the brand
  color is the only saturated thing on screen. Dark ground is **reserved for the closing
  CTA + footer** — it lands harder for being the page's one dark moment.
- **Ambient brand rotation** (§3.2) instead of decorative texture: the soft radial glow
  behind the hero and every brand-tinted surface changes hue on a slow cycle. The blueprint
  grid and the dark-console framing are dropped — they read technical, not executive.

### 3.1 Brand rotation set (owner, 2026-08-19 — supersedes the 08-18 set)

Four hues, rotating. Each generates a **full oklch scale** at build time (the generator
lives in the CP-1 commit; step 500 is the owner's exact hex, the ladder is built around it).

| Hue | Step 500 | On white | Text step |
|---|---|---|---|
| Índigo *(default)* | `#6574c9` | 4.29:1 | `600` |
| Terracota | `#c96b65` | 3.64:1 | `600` |
| Verde | `#69bf6d` | **2.26:1** | `700` |
| Violeta | `#9b4ede` | 4.63:1 | `500` |

**Contrast rule (binding, and it has teeth here).** Three of the four fail AA for body text
at full strength — the green badly. The rotating hue therefore **never paints text at step
500**. Every text-bearing brand surface reads `--color-brand-ink`, which each palette maps
to its own contrast-verified step (the table's last column). Full-strength hue is for
glows, fills, accent bars, and the nav mark only. Verified per hue by the generator, not
assumed.

Neutrals are deliberately **hue-agnostic** — a faint cool grey — because the accent hue
moves and a neutral biased toward any one of the four would clash with the other three.
Surfaces: `#FFFFFF` cards on a `#F4F5F8` ground, one dark band (`#0D1017`) at the close.

### 3.2 The rotation — ambient whitelabel proof

**Every 10 seconds the site's primary color becomes a different one of the four**, with a
**1200 ms cross-fade**. Nav, CTAs, links, active rail items, glows, faux-UI chrome — all of
it moves together, because all of it reads the same CSS variables the real product reads.

This is the site's single best argument, made without a sentence of copy: a prospect
watches the whole page re-skin itself four times before they reach the pricing question.
It is also literally true — this is the mechanism (`--brand-primary-*` variables, runtime
repoint) that skins a tenant's app, PDFs, emails, and site.

Rules:
- Transition **color and background only**, 1200 ms, ease-out. No layout, no flashing.
- **Pauses when §6.6 enters view** — the ambient loop hands control to the picker there,
  so the two mechanisms never fight. Resumes on exit.
- **`prefers-reduced-motion`: holds the default blue.** No cycling.
- Pauses when the tab is hidden (`visibilitychange`) — no background repaints.
- The current hue is announced nowhere and labeled nowhere. If a viewer has to be told,
  the effect failed.

### 3.2 Typography (revised 2026-08-19 — `typeset` skill)

**One family: Figtree**, at 400/500/600/700. The previous Figtree + DM Sans pairing was two
humanist geometric sans-serifs — similar but not identical, which the `typeset` skill lists
as a NEVER, and which buys no contrast for a second font download. Hierarchy comes from
size, weight, and color instead. Figtree is also superadmin's face (plan 17), so the site
and the product read as one system.

Scale: **modular, ratio 1.25 from a 1rem base**, semantic token names, `rem` throughout so
browser zoom behaves. Fluid `clamp()` only on the marketing headings (`--text-h1`,
`--text-h2`, `--text-display`); body stays fixed. Measures are set in `ch`
(`measure` 65ch, `measure-lead` 52ch, `measure-head` 19ch). Line-height 1.6 body, 1.02–1.25
display. `tabular-nums` on every figure that sits in a column.

## 4. Motion system

**Principles (binding).** Transform + opacity only — never animate layout properties.
Enter 400–600 ms, **exit ≤ 200 ms** (exit faster than enter). Everything interruptible.
`prefers-reduced-motion: reduce` collapses every scroll-driven scene to its **final state**
— content is never gated behind a motion the user opted out of. Nothing important is
revealed only by animation: the page must read correctly with JS disabled (Astro renders
it all server-side; motion only adds the choreography).

**Primitives** (`src/scripts/motion.ts`, authored at CP-1, reused everywhere):

| Primitive | Behavior |
|---|---|
| `reveal(el, opts)` | `inView` → fade + 24px rise, `once: true`, honors reduced-motion |
| `revealStagger(list)` | Same with 60 ms stagger; caps at ~8 items so long lists don't crawl |
| `scrollProgress(section, cb)` | `scroll()` over a sticky scene, normalized 0→1 |
| `counter(el, to)` | Metric count-up, `tabular-nums`, reduced-motion → prints final |
| `magnetic(el)` | Pointer-following CTA nudge, ≤6px, `pointer: fine` only |
| `brandCycle()` | Rotates the brand scale every 10 s, 1200 ms cross-fade (§3.2); pauses on §6.6 in-view, on hidden tab, and under reduced-motion |

**Choreography budget:** at most **one** hero-scale set-piece and **two** sticky scroll
scenes (§6.5 module showcase, §6.6 whitelabel recolor). More than that and the site reads
as a demo reel instead of a product pitch.

---

## 5. Information architecture

**v1 routes**
- `/` — the pitch, one long page (§6)
- `/demo` — request form (§7), also the target of every CTA
- `/aviso-de-privacidad` — required for MX lead capture
- `404`

**Deferred to v2 (recorded, not built):** `/modulos/[slug]` per-module deep dives (the
showcase in §6.5 is the entry point that would link into them), `/precios`, `/blog`.
When deep dives land, §9's content-collection trigger fires.

---

## 6. Home page, section by section

### 6.1 Nav
Glass bar, transparent over the hero → `ink-950/80` + `backdrop-blur` + hairline once
scrolled past 80px. Wordmark left; anchors (Módulos · Cómo funciona · Preguntas) center;
**"Solicitar demo"** pill right. Mobile: full-screen sheet, staggered item entrance.
`client:idle`.

### 6.2 Hero
- Eyebrow: `Plataforma de servicio en campo`
- H1: **"Toda tu operación de servicio, en un solo lugar."** with the last phrase in a
  word rotator cycling `cotizaciones · visitas · reportes · almacén · facturación`
  (the site's one nod to the tenant hero's rotator; 2.4 s dwell, blur-swap, pauses on
  hover and under reduced-motion).
- Sub: one sentence naming the buyer — órdenes, técnicos en campo, clientes.
- CTAs: **Solicitar demo** (primary) · **Ver módulos** (ghost, anchors to 6.5).
- Set-piece: a **faux-UI composite** (§6.5 mechanics) assembling on load — cards drifting
  into place with a 90 ms stagger, then a slow parallax tie to scroll.
- Metric strip: clientes atendidos · reportes capturados · técnicos en campo, count-up on
  view. **Numbers must be real** (§9) or the strip ships as three qualitative claims.

### 6.3 Problem framing
Three cards on light ground: *"El reporte vive en WhatsApp"*, *"Nadie sabe qué material
salió del almacén"*, *"La cotización se aprobó por teléfono"*. Reveal on stagger. This is
where the field-service reader recognizes their own week.

### 6.4 Trust strip
Sector chips + client logos where permission exists. Marquee at 40 s, `mask-image` fade at
both edges, pauses on hover, **static under reduced-motion**.

### 6.5 Module showcase — the centerpiece

The one scene worth the motion budget. A tall section with a **sticky two-column stage**:
module list rail on the left (desktop), a device/browser frame on the right. Scroll
progress activates each module in turn — the rail item lights up (`signal` accent bar,
label to 500 weight) and the frame **crossfades + 16px slide** to that module's surface.
Mobile: the rail becomes a snap-scrolling horizontal carousel, frame stacked above.

**Surfaces are HTML/CSS faux-UI, not screenshots** — real superadmin captures need a
seeded demo tenant, go stale on every UI change, and can't animate per element. Faux-UI
cards are built from the same tokens (`rounded-2xl`, hairline, Figtree), so individual
rows/pills/bars animate in and stay crisp at any DPR. Real screenshots are a possible
CP-5 swap for authenticity, decided then.

Modules, in pitch order (Spanish UI names, claims verified against the module plans):

| # | Módulo | Claim | Plan |
|---|---|---|---|
| 1 | **Reportes y plantillas** | Diseña tus propios formatos de reporte; **firma obligatoria** para cerrar y enviar (validada en el servidor); las respuestas quedan congeladas en el reporte | 06 §5 |
| 2 | **App de campo** | PWA que funciona **sin señal** — el técnico captura y sincroniza al volver | frontend |
| 3 | **Clientes y CRM** | Ficha 360, timeline de actividad **append-only**, seguimientos, origen y lista negra | 07 · 08 |
| 4 | **Equipos** | Historial de servicio **por unidad** — "este compresor lleva tres reparaciones" | 11 |
| 5 | **Cotizaciones** | El cliente aprueba o rechaza desde una **liga con token**; precios congelados al crear | 20 |
| 6 | **Órdenes de servicio** | Nacen de una cotización aprobada; explotan en visitas y reportes pendientes | 19 |
| 7 | **Calendario** | Visitas asignadas, reasignación auditada, empuje y superposición con Google Calendar | 12 |
| 8 | **Almacén** | Stock por técnico, reabastecimientos con evidencia, material descontado por reporte; movimientos **append-only** | 10 |
| 9 | **Contratos y pólizas** | El documento firmado, tipado y fechado, colgado del cliente y de la orden | 13 |
| 10 | **Facturación** | Cobro **por reportes**, control de saldos | 09 |
| 11 | **Tu marca** | Marca, sitio web y CMS propios — la app, los PDFs y los correos salen con tu identidad | 03 · 04 · 15 |

**Honesty gate (§11):** 09/10/12/13/18/19/20 are not-started or in-progress on the master
board. Anything not shippable at launch renders with a **"Próximamente"** chip rather than
present tense. The owner picks the line.

### 6.6 Whitelabel scene — where the rotation hands over
Second sticky scene, and the payoff for the ambient rotation (§3.2): arriving here **stops
the cycle and gives the visitor the control**. A picker — the four brand hues plus a free
hex input — recolors the section live: nav, CTA, faux-UI frame, and a mock PDF header with
a mock email signature, so the claim covers every surface the product actually brands.
Copy: **"Tus clientes ven tu marca. Nunca la nuestra."** Transitions on color/background
only. Reduced-motion keeps the interaction and drops the transition. On exit, the ambient
loop resumes from whatever hue the visitor left behind.

### 6.7 Modularidad
"Activa solo lo que necesitas." Grounded in a real product property, not a pricing
fiction: reporting is independently sellable (06 standalone-suite rule) and tenant config
gates every module (14). Cards toggle on/off to show the nav shrinking.

### 6.8 Cómo funciona
Four steps — Configuramos tu marca → Cargamos tus clientes y catálogo → Tus técnicos
capturan en campo → Tú cobras y das seguimiento. Horizontal connector line that draws in
on scroll (`stroke-dashoffset`, the one sanctioned non-transform animation, ≤600 ms).

### 6.9 Preguntas frecuentes
Native `<details>`/`<summary>` — accessible and keyboard-correct for free; height
transition via `interpolate-size: allow-keywords` with a `grid-template-rows` fallback.
Seeds: ¿funciona sin internet? · ¿pueden migrar mis datos? · ¿es mi marca o la de ustedes? ·
¿facturan CFDI? (**answer honestly: no — CFDI stamping is deferred indefinitely**, master
plan §4) · ¿cuánto tarda la implementación?

### 6.10 CTA final + footer
Dark ground, single headline, demo form entry, WhatsApp + tel + mailto direct channels.
Footer: wordmark, module links, privacy, DASOM attribution, año.

---

## 7. Demo request flow

Fields: nombre · empresa · correo · WhatsApp · tamaño de equipo (rango) · módulos de
interés (multi, prefilled when arriving from a module CTA) · mensaje. Honeypot + timing
check instead of a CAPTCHA. **UTM capture** on first touch persisted to
`sessionStorage` and submitted with the lead — the same attribution pattern the
whitelabeled repo already planned in `.claude/plans/utm-params/`.

Delivery — **recommendation: `@astrojs/cloudflare` adapter, every page `prerender = true`,
one server endpoint** posting to **Resend** (already the transport in the whitelabeled
backend) with the lead mailed to sales. No database in v1; if lead volume justifies it,
the v2 path is posting into the whitelabeled backend as a `source=website` customer —
exactly the growth path `15-website.md` §5 records for tenant sites.

Inline validation on blur, `role="alert"` errors, success state that replaces the form
without a page jump.

---

## 8. Budgets (enforced at CP-5, not aspirational)

| Metric | Budget |
|---|---|
| Lighthouse (mobile) | ≥ 95 performance, **100 accessibility**, ≥ 95 SEO/best-practices |
| LCP | < 2.0 s on Fast 3G / 4× CPU throttle |
| CLS | < 0.05 — every media box reserves aspect ratio |
| Total JS (gzip, home) | **< 60 KB** — motion + islands together |
| Fonts | 2 families, latin subset, woff2, `swap`, display face preloaded |

Also: full keyboard pass, visible focus rings on every interactive element, `aria-label` on
icon-only controls, semantic landmarks, real `<h1>`–`<h3>` order, OG/Twitter cards with a
generated OG image, `sitemap` + `robots.txt`, JSON-LD `Organization` + `SoftwareApplication`.

---

## 9. Assets + content owed (blockers, not code)

- [ ] **Manttio logo + wordmark** (SVG, light/dark) and **favicon set** — none exist here;
      today's favicons are Astro's. Placeholder until then: Figtree wordmark, type only.
- [ ] **Palette sign-off** (§3.1).
- [ ] **Real metrics** for the hero strip, or approval to ship qualitative claims (§6.2).
- [ ] **Client logos + permission** for the trust strip, or the sector-chip fallback (§6.4).
- [ ] **Shipped-vs-próximamente line** across the eleven modules (§6.5 honesty gate).
- [ ] **Sales destination** for demo leads (inbox + WhatsApp number) and the **privacy
      notice** text (MX LFPDPPP).
- [ ] Domain + Cloudflare project; `site` in `astro.config.mjs` is still `example.com`.

**Content-collection trigger (§1 decision 3):** the moment a second page repeats a content
shape — module deep dives, blog, case studies — copy moves to `src/content/` with a Zod
schema. Hardcoded `.astro` is right for one page; it is wrong for a set.

---

## 10. Checkpoints

### CP-1 — Foundation
- [ ] `@theme` tokens: oklch palette scales, fluid type scale, shadow + radius tokens
- [ ] `Layout.astro` extended: SEO/OG/JSON-LD props, `<ClientRouter />`, skip-link
- [ ] `src/scripts/motion.ts` primitives (§4) + the global reduced-motion guard
- [ ] Nav + footer + section shell primitives (`Section`, `Eyebrow`, `Button`)
- [ ] `astro-icon` + lucide wired
- [ ] `npm run build` clean

### CP-2 — Hero + module showcase (the two pieces that carry the site)
- [ ] Hero: rotator, CTAs, metric count-up, faux-UI assembly set-piece
- [ ] Sticky module scene: rail, frame, crossfade, 11 faux-UI surfaces
- [ ] Mobile: carousel fallback, verified on a real handset
- [ ] Reduced-motion pass on both

### CP-3 — Remaining sections
- [ ] Problem framing · trust strip · whitelabel recolor scene · modularidad · cómo
      funciona · FAQ · CTA + footer
- [ ] Every reveal through the CP-1 primitives — no ad-hoc animation code

### CP-4 — Demo flow
- [ ] `/demo` form, validation, honeypot, UTM capture, success state
- [ ] CF adapter + endpoint + Resend, leads landing in the sales inbox
- [ ] `/aviso-de-privacidad`

### CP-5 — Polish + budgets
- [ ] §8 budgets met and recorded; real-device check (mid-range Android, Safari iOS)
- [ ] Keyboard + screen-reader pass; contrast audit on the dark grounds
- [ ] OG image; copy proofread es-MX; screenshots-vs-faux-UI call (§6.5)

### CP-6 — Ship
- [ ] Domain, `site` set, CF deploy, Web Analytics, sitemap/robots verified live

---

## 11. Open decisions / asks

- ~~`#0649686` is seven hex digits~~ — **moot 2026-08-19:** the whole set was replaced with
  `#6574c9` / `#c96b65` / `#69bf6d` / `#9b4ede`.
- **Rotation dwell** (§3.2) — 10 s is the owner's call and it is what ships; worth a second look at CP-5 against real scroll telemetry (a fast scroller may never see hue two).
- **Módulos: shipped vs próximamente** (§6.5) — the one place this site could overstate the
  product. Needs the owner's line before CP-2 copy is written.
- **Hero metrics** (§6.2) — real numbers or qualitative claims.
- **Demo delivery** (§7) — Resend endpoint (lean) vs whitelabeled backend as `source=website`
  lead. Backend coupling is the only reason to prefer the latter now.
- **Screenshots at CP-5** (§6.5) — swap faux-UI for real captures, or keep faux-UI as the
  permanent approach. Needs a seeded demo tenant either way.
- Deferred, recorded: `/modulos/[slug]` deep dives, `/precios`, case studies, EN locale.
