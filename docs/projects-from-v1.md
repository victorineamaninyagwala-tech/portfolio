# Projects from the v1 portfolio

Captured 2026-08-26 from https://victorine-amani-nyagwala-portfolio.lovable.app

Reference for porting work into V2. Six projects, each with its own case study page.
Nothing here has been added to the new site yet — the current `projects` array in
`src/routes/index.tsx` is still Lovable placeholder content (Tendaji, Kito Health,
Maji Utility, Safari Pay, Umoja) and none of it is real.

---

## 1. FarmCloud

- **Slug:** `/work/farmcloud`
- **Card:** CASE STUDY · tags: UX, UI DESIGN, PRODUCT MANAGEMENT
- **Eyebrow:** CASE STUDY · AGRITECH · 2023 – 2026
- **Role:** Sole Product Designer · **Company:** Synnefa
- **Timeline:** Dec 2023 – Mar 2026 · **Reach:** 5,000+ farmers · 14 countries

**Card title (v1, long):** FarmCloud: a Farm Management Dashboard expected to Serve
Smallholder farmers across Africa

**Deck:** A farm management dashboard built for farmers, with agronomists alongside to
provide the context and expertise to turn data into better decisions.

### Narrative

**Framing.** Synnefa's first step was an IoT farm monitoring and irrigation system, but
the data it produced was raw and technical — meaningful only to experts, visual noise to a
farmer. These were farmers whose practices had been shaped across generations; being handed
conclusions without reasoning risked alienating them. They wanted to understand *why*, and
where possible arrive at the answers themselves.

**The starting point.** Usability test of the legacy system, 20 farmers, in person, devices
provided (the legacy system was not responsive on personal phones). Two tasks: onboarding
and logging a daily work report.

- Only **2 of 20** could self-onboard
- The other 18 needed help, and still took **over 30 minutes**
- One farmer called their son for assistance
- Discovered mid-session: **15 of 20 had no email address**, a hard requirement in the legacy flow

**What the research told us.** Farmers already kept records — across memory, notebooks and
disconnected processes. The legacy system reflected the same fragmentation, just digitally.
Three patterns recurred across the hardware team, customer support and farmers: fragmented
record-keeping, near-absent input tracking, no financial visibility.

**The farmer (profile used in the case study):** generational practices · records in
notebooks and memory · low-to-mid digital literacy · personal phone · 15 of 20 without email
· priority is understanding the why.

**The response.** Legacy system scrapped; full redesign anchored on the farmer's mental
model of a season.

- **Onboarding** — three steps: sign-up, contact verification (phone OR email, not both),
  guided farm profile. Result: **10% → 70%** self-onboarding success.
- **The Crop Lifecycle Framework** (system foundation) — the crop as the anchor for tracking
  across a season. *Before planting:* production area, crop, and crop variety (variety
  tracking builds a long-term record of what performs where). *During production:* structured
  daily work reports, inputs, expenses, environmental data — "the missing middle" where most
  decisions and costs lived but nothing was recorded. *After harvest:* yield-to-product
  conversion, invoicing and order fulfilment, quantity reconciliation.
- **Farm Assets & Inventory** — Farm Inventory, Farm Elements and Smart Solar Dryers were
  separate sidebar items mirroring the fragmentation research found; grouped into one Farm
  Assets feature. Logging an item's cost creates the inventory entry and the expense entry in
  one action.
- **Harvest & Market Linkage** — crop status updates automatically at harvest; the harvest
  report captures Farm Element, variety, date, and totals split into high quality, low
  quality and rejected, so quality composition is visible alongside yield. Market Linkage
  threads RFQs → Quotations → Orders, with invoices pre-populated from accepted quotations.

### Numbers

| | |
|---|---|
| 5,000+ | Farmers actively using FarmCloud |
| 14 | Countries across East and Southern Africa |
| 10% → 70% | Self-onboarding success |
| 6 / 7 | Core surfaces originated from research findings |

**Closing line:** "For the first time, the farmer has everything they need to know whether
the season was worth it."

---

## 2. SoulShape

- **Slug:** `/work/soulshape`
- **Card:** CASE STUDY · tags: UX, HEALTHCARE, SYSTEMS DESIGN
- **Eyebrow:** CASE STUDY · HEALTHTECH · APRIL 2026
- **Role:** Product Designer (Independent) · **Domain:** HealthTech · Care Coordination
- **Timeline:** April 2026 · **Compliance:** Kenya Digital Health Act 2023

**Card title (v1, long):** Soulshape: a Hospital Management Software for care coordination
in multi-disciplinary weight-loss programs

**Deck:** A care coordination platform for multi-disciplinary weight-loss programs, built
around the principle that raw data stays, meaning moves, and continuity persists.

### Narrative

**Framing.** Modern healthcare is not failing for lack of expertise — it is failing at
coordination. Patients navigating weight loss, metabolic disorders or chronic illness manage
multiple professionals, reconcile fragmented advice and maintain consistency without systemic
support. The burden of stitching care together falls entirely on the patient. Not a failure
of clinical skill; a failure of system design.

**The founding insight** — from lived experience, not research. Apps track calories, meal
plans prescribe nutrition, consultations manage medication, fitness programs structure
exercise. Each addresses one dimension in isolation. None addresses the cognitive and
logistical burden of integrating all of them while managing the rest of life. The patient
becomes their own care coordinator: booking separate appointments, synthesising conflicting
advice, deciding when one professional's recommendation overrides another's.

**Research base.** Peer-reviewed operations management literature (Leeftink et al., 2018),
Kenya Ministry of Health Primary Health Care Network Guidelines (2021), three clinical
studies on multi-disciplinary coordination in obesity care. Paired with a structured audit of
Clinicea, Zoho for Healthcare and Antara Health, plus an industry interview with a former
Antara Health employee. A 2025 systematic review (European Journal of Cardiovascular
Medicine) identified cognitive overload from uncoordinated advice as a primary driver of
dropout.

**The patient (profile):** 4–7 professionals in parallel · records in memory, notes and apps
· fragmented, conflicting advice · non-linear journey with pauses and returns · coordinator
is themselves by default · priority is to feel understood over time.

**Scope statement.** SoulShape does not solve scheduling, data storage or workflow
automation. It solves interpretation and alignment across disciplines over time.

**Five convergent findings**

1. Coordination failure is structural, not incidental — a planning and systems problem
2. A dedicated coordinator is the structural answer — reached independently by academic
   research, Kenya health policy and clinical obesity literature
3. Patient recirculation is the most underserved problem — all three audited platforms scored
   0 or 1 on longitudinal records and re-entry
4. Patients are treated as passive recipients — planning models exclude patient behaviour as
   noise rather than designing for it as signal
5. Information sharing exists, interpretation does not

**System architecture — three layers.** *Raw data stays:* clinical records stay owned by the
institution that captured them; nothing copied or duplicated for visibility. *Meaning moves:*
short structured signals handed between specialists with enough context to act, without
re-reading the chart. *Continuity persists:* re-enrolment is a first-class state — no archive,
only history that can become present again.

**Design responses.** The institution is the primary user, not the setting — reframing the IA
around the coordinator role. The primary unit is the **program, not the appointment**;
interventions live inside programs, programs inside a patient's long-term journey. Account
creation rebuilt for the patient failed by care systems before: low-friction, honest about
what happens next, mobile-first.

**Scope / next steps.** Phase 1 deliberately excludes cross-country data portability and full
network-effect onboarding. Focus is same-country, multi-clinic continuity — solve coordination
inside one institution, then let them onboard partners.

### Numbers

| | |
|---|---|
| 3 | Convergent sources (academic, policy, clinical) |
| 3 | Platforms audited + practitioner interview |
| 0 – 1 | Recirculation score across all three platforms |
| 1 | Governing principle: raw data stays, meaning moves, continuity persists |

---

## 3. Bazaar

- **Slug:** `/work/bazaar`
- **Card:** CASE STUDY · tags: PRODUCT STRATEGY, MARKETPLACE, BRAND, SYSTEMS DESIGN
- **Eyebrow:** CASE STUDY · SELF-DIRECTED · KENYA · 2026
- **Role:** Product design, end to end · **Type:** Self-directed
- **Focus:** Independent retail · Kenya · **Status:** System settled, build begun

**Title:** Bazaar: a trust and discovery layer for independent shops

**Deck:** Independent shops earn real trust in person, but none of it carries online. Bazaar
gives each shop its own branded, verified storefront on shared infrastructure a stranger can
safely buy through.

> **Note — this is the project closest to the new V2 headline.** Its "one line" already asks:
> *"how much complexity should a platform absorb so the experience feels seamless, while
> preserving human responsibility and control?"* That is nearly verbatim the new site thesis.

### Narrative (12 numbered sections)

**01 · One broken checkout.** Started as a customer, not a thesis. Ordered from a known brand
through a delivery aggregator; the order routed to the wrong branch, the rider only followed
the app, there was no way to reach the shop, and no refund — because the aggregator, not the
customer, had paid the store. Purchase abandoned; never sought that shop out again.

**02 · Tested the hunch before designing.** Mapped every channel against two things a business
wants — own its brand and customer, and share the plumbing. *Social* owns the brand at ~0%
take but is fully manual. *DIY builders* keep ownership and cheap payments but self-solve
demand and delivery. *Aggregators* bring full plumbing and demand but take 15–35% and keep the
customer, price and brand. **The empty quadrant: own the brand and rent the plumbing.**

- CONFIRMED: in a 15-brand field test, about two-thirds had no completable checkout
- CORRECTED: "the business gets blamed when delivery fails" was too simple — blame follows the
  perceived **locus of control**
- The surprise that reset the project: the gap is not payments (M-Pesa is solved). The
  expensive unsolved parts are demand, discovery and delivery
- Stated limit: this is desk research; primary work still owed

**03 · Standing on a graveyard.** Sky.Garden had built almost precisely this — thousands of
merchants, branded webshops, shared M-Pesa, third-party fulfilment, social-link discovery,
buyer protection, 8% commission. Peaked near 30,000 vendors, defunct by 2025. First teardown
assumed an owned delivery fleet killed it; fact-checking reversed that — it died on economics
and capital (a funding round lost in the 2022 venture winter), not design.

**04 · A bridge, not a marketplace and not a store builder.** Two lines: *convert demand, do
not create it* and *own the brand, rent the plumbing*. Customer-facing surface is a directory
of verified storefronts — discovery leads to stores, not a grid of products. Never compete on
price. The merchant is the client; the customer is served instrumentally.

**05 · The sorting rule.** If a complexity is repetitive, technical or trust-bearing, the
platform absorbs it. If it needs human judgment, brand, context or ownership, the human keeps
it. The interesting work is the seams. Applied to the storefront: the **structure and skin
split** — platform owns container, required blocks, shared mechanisms, proportional rules;
merchant owns palette, typeface, imagery, content. *"We will never change your colours. We
decide where and how much of them appear."*

**06 · How the commerce behaves.** Five regions: platform site, unskinned store skeleton,
branded storefront with checkout, customer account, merchant dashboard. Two entry points one
checkout · one payment auto-creating independent orders per merchant · M-Pesa escrow held
until delivery confirmed · delivery integrated not owned (vetted 3PL) · resolution waterfall
that keeps the promise first, escrow refund only as last resort.

**Trust is the whole game.** The platform is a registry that vouches — a buyer can find a shop
independently, so discovery *is* verification. Every shop clears one hard floor: a verified
physical location as accountability anchor, shown at merchant-chosen precision.

**07 · Onboarding.** Operator-assisted and merchant-gated; verification is a hard gate before
setup, because if a store existed before verification even briefly, the trust claim breaks.
Customer side is guest-first, account deferred, never a gate.

**08 · The storefront skeleton.** Same block order always. Merchants can switch off removable
blocks but not move or rename — one mental map across stores: *feel different, do not relearn*.
Latitude shrinks with depth: most expressive at the landing, fully locked at checkout.

**09 · The roof, not the stall.** Brand story is a market: a hundred distinct stalls under one
shared roof. Governing principle is **recede** — mute, not absent; quiet and load-bearing.
Palette: background `#F7F6F2`, ink `#1F1F1C`, brand olive `#BAC095`, deep olive `#3D4127`,
trust green `#556B2F` (the one place the palette raises its voice, only for verification).
Bricolage Grotesque at the door, Inter inside. Mark is two interlocking loops forming a B.

**10 · The market moved while I designed.** KiliMax, KiliStore and Tembo filled the
merchant-operations lane. Sharpened the conclusion: Bazaar's defensible ground is the
two-sided trust and discovery layer. Open reconsideration on the record. Economic test: price
leakage — own the Bazaar-side checkout and the math holds; integrate on the transaction and it
breaks. Vision (not committed scope): AI "find the vibe" discovery.

**11 · The reversals are the process.** Full decision log — **60 logged decisions, 21
reversals**, kept in on purpose because the honest record is the evidence of thinking.

**12 · Where it stands.** Strategy, positioning, system and IA, experience and onboarding, and
visual identity are settled. Storefront skeleton specified. Design system built, marketing
site live in code. Next: the flagship storefront (Mochi's Brew poured into the system) and the
full purchase screens. Owed: primary research and a decision on the customer-facing reframe.

---

## 4. Spring On The Go

- **Slug:** `/work/spring`
- **Card:** CASE STUDY · tags: UX, ECOMMERCE, AUDIT & REDESIGN
- **Eyebrow:** INDEPENDENT CASE STUDY · UX AUDIT · E-COMMERCE
- **Role:** UX Research / Product Design · **Type:** Independent case study
- **Focus:** E-commerce · Audit & Redesign · **Market:** Nairobi, Kenya

**Title:** Spring On The Go: a UX audit and e-commerce redesign concept

**Deck:** A Kenyan convenience retailer with a strong marketing presence and a digital
shopping journey that was not keeping up with it. Audited end to end, then rebuilt the
homepage around intent rather than inventory.

**Disclaimer carried on the page:** not commissioned, not implemented — an independent
exercise based on publicly available information and direct evaluation.

### Narrative

**Central question:** Does the digital shopping experience deliver on the convenience and
trust promised by the brand?

**Five business objectives:** omnichannel convenience · fast reliable fulfilment (90-minute
delivery) · lower the barrier to shopping · trust through quality · a scalable retail channel.

**Method — evaluated as a customer, not a visual critique.**

- *Journey 01, planned purchase:* buy a breakfast package (milk, bread, eggs, butter)
- *Journey 02, exploratory:* "I don't know what to have for dinner"

**Journey 01 findings**

- *Product discovery* — only a temporary "Added" state; nothing persisted on the product
- *Search* — searching bread surfaced eggs, searching eggs returned bread; the relationship
  effectively inverted
- *Navigation* — no breadcrumbs or position indication; global access, weak contextual orientation
- *Cart* — no clear header on the drawer; quantity changes needed an explicit "Update Cart"
- *Checkout* — delivery fee appeared calculated before location validation and did not change after
- *Payment* — "Pay Now" and "Complete Order" with no clear distinction; "Complete Order"
  bypassed payment and placed the order. **Payment is the highest-trust moment; ambiguity here
  creates hesitation exactly when the customer is asked to commit.**

**Homepage findings**

- Five carousel banners: four repeated the same 90-minute message, the fifth promoted a wine
  event that had already happened
- Bestsellers were flavoured milk, whole milk, soda, chocolate, eggs — tells you what others
  buy, not what you should buy

**Other findings.** Uneven category depth (4 to ~20 products). Positioning mismatch: "all
you'll ever need" and farm-to-door freshness against a catalogue that reads as curated
convenience and pantry. Chicken samosas filed under vegetarian. A persistent WhatsApp overlay
obscuring content, with a catalogue containing gas cylinders and water refills rather than the
e-commerce range.

**Trust as the strongest theme** — nine small inconsistencies that individually prove nothing
but together create uncertainty for a first-time customer.

**Five core UX themes:** discovery · decision support · trust · merchandising · brand alignment.

**Redesign direction.** Three principles: make discovery easier, make decisions easier, make it
feel trustworthy. Homepage opens with delivery and location proposition, then category-based
discovery instead of a product carousel. Curated baskets given prominence. Promotional blocks
carry distinct value propositions.

- BEFORE: products → products → products → promotion → products → brand → products
- AFTER: what are you looking for? → browse a category → need help deciding? → curated baskets
  → products and offers → confidence → purchase

**Explicitly not attempted** (needs product/technical/operational work): search indexing,
taxonomy governance, delivery-radius logic, payment-state handling, order-management
integration, inventory sync, WhatsApp/website integration.

**Key insight:** Spring On The Go does not need to behave like a smaller supermarket. Design
around customer intent and occasions rather than reproducing supermarket structure.

**Reflection:** "A commerce interface should not only help customers find products. It should
help them understand what the business can do for them."

---

## 5. Mochi's Brew

- **Slug:** `/work/mochis`
- **Card:** CASE STUDY · tags: UX, SERVICE DESIGN, F&B · **badge: IN PROGRESS**
- **Eyebrow:** CASE STUDY · F&B · PICKUP ORDERING
- **Role:** Product Designer · **Type:** UX Case Study · Service Flow
- **Platform:** Responsive Web · **Market:** Kenya · F&B

**Title:** Mochi's Brew: Pickup Ordering Flow

**Deck:** Designing a pickup ordering flow for on-the-go customers in Kenyan coffee shops. A
service flow that bridges the gap between walking in and paying for delivery.

### Narrative

**The missing middle.** Digital ordering in Kenya is optimised around two behaviours: delivery,
and returning customers on loyalty systems. This project addresses a third: a customer already
on the move who knows what they want, does not need delivery, and wants the order prepared
before they arrive. *"I am already coming there. I just don't want to wait there."*

Demonstrated through a fictional coffee shop, but the challenge applies broadly.

**Problem space — two options, both with friction.** Walk-in (travel, queue, order, wait) and
delivery platforms (fees and waiting, unnecessary if already travelling nearby).

**Research** — competitive analysis of Starbucks, Java House, Pickup Coffee, Dunkin' across
entry points, menu architecture, discovery, customization, checkout, guest experience, order
tracking and operational assumptions. Three findings:

1. Loyalty over one-time customers — what does a good experience look like when the user may
   never return?
2. Delivery solves convenience, not pickup
3. Operational reality is invisible — most systems give an estimate without the factors, so
   delays feel arbitrary

**Operational model defined before the interface.** One location, one shared preparation queue
between walk-in and online, no separate digital-order kitchen, dependent on staff availability
and real-time workload. The system cannot promise instant preparation — it communicates
realistic states and keeps final control with the people running the store.

**The guest customer (profile):** "I need coffee now" · does not want an account · one quick
order · needs speed and confidence · no forced sign-up · frustrated by unclear wait times.
Intent-based rather than demographic personas.

**Order Fulfillment Model — four honest milestones:** Order Received → Order Accepted (shop
confirms it can fulfil, preventing auto-accept beyond capacity) → Preparing (tied to actual
progress, not a countdown) → Ready for Pickup (notification, order number, pickup code).

**Capacity management — three states:** normal, high demand (customers warned prep times may
increase), and capacity threshold (orders not auto-accepted; the shop decides whether to
accept, delay or reject).

**The flow:** Entry → Location → Menu → Product → Review → Payment → Track → Pickup.
Location validation happens before browsing; if outside the radius the system does not block —
it surfaces the situation honestly with three options.

**Edge cases:** high queue volume · manual order acceptance · payment failure (retry without
rebuilding the order) · abandoned guest sessions (temporary state without permanent history).

**Design system:** foundations in progress v1.0 — semantic tokens, brand green / brand brown /
greys / system feedback ramps, Nunito Sans, 12/8/1 column grids, light and dark.

### Numbers

| | |
|---|---|
| 1 | Physical location, one shared queue |
| 4 | Honest fulfilment states |
| 3 | Capacity states, control stays with the store |
| 0 | Forced sign-ups — guest checkout is first-class |

---

## 6. Building a design system an AI agent can operate

- **Slug:** `/work/ai-design-system`
- **Card:** **TEST PROJECT** · tags: DESIGN SYSTEMS, TOKENS, AI, FIGMA · CTA "Read the write-up"
- **Eyebrow:** TEST PROJECT · DESIGN SYSTEMS · AI
- **Role:** Design Systems / Product Design · **Type:** Self-directed test project
- **Stack:** React · Vite 8 · CSS Custom Properties · **Token source:** Untitled UI Pro v7.0

**Deck:** Don't use AI to build a design system. Build a design system an AI agent can use,
then hand it real maintenance tasks and see whether the structure alone is enough for it to
make the right calls.

### Narrative

**Hypothesis.** A design system stops being documentation for developers and becomes
instructions for a machine. If the token architecture is semantically layered, the component
declares which tokens it uses, and the Figma export mirrors the code, an agent should be able
to do maintenance that normally needs a human designer.

Not a demo with two buttons — the real token payload of Untitled UI Pro v7.0 driving an actual
Vite build. Scope deliberately narrow: one real component and a demo app, validated with a
production build. The complexity under test was the token layer (~840 properties), not
component count.

**Token architecture — three layers.**

1. *Primitive* — 375 primitive colours + 32 number primitives, never used directly (`--colors-base-white`)
2. *Semantic* — 303 intent-based aliases, each restated under `:root`, `prefers-color-scheme:
   dark`, and `[data-theme=dark]` (`--colors-background-bg-primary`)
3. *App aliases* — a thin stable layer components actually name (`--color-bg-surface`), so the
   component vocabulary never changes when the system underneath does

Supporting scales: 11 radius, 17 spacing, 12 widths, 3 containers, 33 typography, 20 shadows +
focus rings, 8 grid definitions, 44 text style classes.

**Dark mode as proof.** No component knows it is in dark mode. The agent verified the chain and
earlier caught the inverse: a hardcoded `rgba(0,0,0,0.1)` border and hardcoded `24px` padding
in the Card that would not respond to theming — replaced both and created the missing
`--color-border-subtle` with its own light and dark values.

**Component descriptions.** `Card.jsx` carries an `@ai-component-spec` block declaring
`figmaName` and `tokensUsed`, written for the agent rather than a human. "That is the
difference between a card component and a contract the agent can audit against."

**Four agent workflows validated**

| Task | Finding | Outcome |
|---|---|---|
| Spec audit | Border colour and padding hardcoded | Replaced with tokens; created missing token |
| Figma drift check | Original primitives in sync | Confirmed; flagged reverse drift of code-only tokens |
| Full token generation | ~840 properties across 10 datasets | 10 CSS files + 44 text-style classes |
| Source-of-truth reconciliation | `--radius-md` collision, 12px vs 8px | Defaulted to Untitled UI; remapped aliases |

**The critical insight:** the agent was not following a script. Asked whether code and Figma
were in sync, it decided to grep every token, cross-reference the export, separate missing from
redundant, and apply a declared tie-break rule. Every change verified by a real production build.

**The wall.** Live Figma reads went through the Figma MCP — the local Dev Mode MCP server was
not enabled and the remote server was rate-limited on the Starter plan. Fell back to a manual
`tokens.json` export as the canonical hand-off contract.

### Numbers

| | |
|---|---|
| 842 | Unique CSS custom properties generated |
| 10 | Dataset files |
| 44 | Text styles as utility classes |
| 7 | Figma collections consumed (1,554 valueless colour styles ignored) |
| 4 | Autonomous agent workflows, each confirmed by a passing build |

**What we learned:** quality becomes measurable · the limitation was real and survivable · the
craft is in the vocabulary — "the design system is instructions for a machine, and the quality
of those instructions is the design work."

---

## Site-level content from v1 worth carrying over

**Hero:** eyebrow PRODUCT DESIGNER · NAIROBI, KENYA / headline "Good design is invisible" /
"A Product Designer dedicated to making specialized software feel second nature, reducing
friction in systems where the work is already hard enough." / tags UX RESEARCH, SYSTEMS DESIGN.

**Key achievements block (2023 – 2026)**

| | |
|---|---|
| 10% → 70% | Self-onboarding rate |
| 6 / 7 | Farms: active platform adoption |
| $177K | Additional farmer investment unlocked |
| 34% | Crop failure reduction |
| 5,000+ | Farmers across 14 African countries |
| 1 Feature | Market Linkage — originated from zero |

> Note: `$177K` and `34% crop failure reduction` appear only in this block — neither is
> mentioned in the FarmCloud case study itself.

**How I Work (three points):** Field Research ("I work with users directly — on farms, in
clinics, in the field. Most of what shapes the design happens before any screen is opened.") ·
Systems Thinking ("I design the whole flow, not just the interface.") · Collaborative by
Default ("Decisions get documented so the reasoning travels with the work.").

**About:** "I'm a Product Designer based in Nairobi, Kenya. I care about two things: reducing
friction for people doing the work, and building enough transparency that the people depending
on that work can trust it."

**Skills:** Figma, ProtoPie, Usability Testing, Field Research, Information Architecture,
Systems Design, USSD Design, Google Analytics, Notion, ClickUp, FigJam.

**Work history**

1. **Sole Product Designer** — Synnefa · FarmCloud · AgriTech · Nairobi — DEC 2023 – MAR 2026
2. **Product Designer (Independent Project)** — SoulShape · HealthTech — APRIL 2026
3. **Backend Developer Intern** — Brrng · Kenyan startup — MAR 2022 – MAY 2022
   > Backend is correct. It was briefly changed to Frontend on the V2 site on
   > 2026-09-03 and reverted the same day to match the CV. v1 had it right.

**Contact:** "Open to full-time roles and consulting engagements in Product Design, UX
Research, and Workflow Engineering." · victorinenyagwala@gmail.com · Nairobi, Kenya ·
© 2026 Victorine Nyagwala

**Resume:** `/Victorine_Nyagwala_Resume.pdf`

---

## Open questions for the port

1. **Name.** RESOLVED for contact details — email is victorinenyagwala@gmail.com and phone is
   +254-798-975-590, both now live in the V2 footer. Still open: v1 bylines the site as
   "Victorine Nyagwala" / "Victorine Amani Nyagwala", while V2 uses "Victorine Amani" in the
   header, page title and og tags. Which name is canonical?
2. **Ordering.** v1 leads with FarmCloud (the only paid, shipped product). V2's layout has one
   featured slot plus a list — FarmCloud is the obvious featured candidate.
3. **Count.** V2's list markup is built for a featured item plus four others (`01 — 05`).
   There are six projects. Either the counter changes or one moves.
4. **Assets.** No imagery has been captured — every case study has screenshots and diagrams
   that will need exporting separately.
5. **Depth.** V2 is currently a single page with no `/work/:slug` routes. Six full case studies
   need somewhere to live.

## Resolved from the CV (Victorine_Nyagwala_Resume.pdf, read 2026-09-03)

- **Canonical name:** Victorine Amani Nyagwala. The site uses "Victorine Amani"; the CV and the LinkedIn slug use Nyagwala. Both are the person, so the short form is a choice, not an error.
- **$177K — confirmed.** "Additional Farmer Investment Unlocked", across a GSMA-funded pilot: 5,000+ farmers in 14 African countries, 4,000 active users digitising records.
- **34% — confirmed.** Reduction in crop failure on farms with consistent platform use; 61% adopted new farming techniques via advisory features.
- **Onboarding 10% to 70% — confirmed**, after a 20-farmer usability test in which 18 could not complete the flow.
- **Brrng title — settled as Backend.** The CV says Backend Developer Intern, "alongside a lead backend developer", and on 2026-09-03 Victorine confirmed the site should match the CV. An earlier instruction that day had set it to Frontend; that is reverted. The CV is the source of truth here.
- The CV carries no phone number or address — only the email, "Nairobi, Kenya", LinkedIn and a portfolio link.
