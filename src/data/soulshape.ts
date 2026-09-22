/*
 * SoulShape: the facts the case study draws.
 *
 * Everything here is transcribed from her own source documents — the
 * comprehensive case study, the decision log, the data architecture, the
 * signal standards, the visibility matrix, the MVP documentation — and from
 * the built prototype's own data files, which are the most recent word where
 * two sources disagree. Nothing is rounded, reordered or reconstructed. The
 * comment above each block says where it came from, so a figure on the page
 * can always be traced back to a line in a document.
 *
 * Where the documents revise each other, the later revision wins and the
 * superseded one is noted rather than deleted — the drafts that lost are part
 * of the record.
 */

/*
 * The diagnostic scorecard, from the comprehensive case study §5.3.
 * Nine dimensions, two points each, eighteen available.
 *
 * NOTE, AND IT MATTERS: her portfolio summary of this table gave Clinicea 0
 * on both of the last two dimensions. Her own scorecard gives it 1 on each,
 * and the totals prove the scorecard right — 2+2+2+1+1+1+0+1+1 is the 11/18
 * she publishes, where six twos and three zeros would be 9. The last
 * dimension is also named "Recirculation handling"; "re-entry" is the word she
 * coined for it afterwards, not the word on the scorecard.
 *
 * Her own reading of the two rows, verbatim: "No solution scores more than one
 * on either dimension."
 */
export const scorecard = {
  scale: "2 = addressed · 1 = partial · 0 = not addressed",
  products: ["Clinicea", "Zoho for Healthcare", "Antara Health"],
  /** In her order. `from` is the framework the dimension is drawn from. */
  dimensions: [
    { name: "Appointment characteristics", from: "Leeftink", scores: [2, 1, 2] },
    { name: "Resource characteristics", from: "Leeftink", scores: [2, 1, 1] },
    { name: "Care pathway characteristics", from: "Leeftink", scores: [2, 1, 1] },
    { name: "Objective alignment", from: "Leeftink", scores: [1, 0, 1] },
    { name: "Planning characteristics", from: "Leeftink", scores: [1, 1, 2] },
    { name: "Environmental characteristics", from: "Leeftink", scores: [1, 1, 2] },
    { name: "Patient's active role", from: "Kenya PCN", scores: [0, 1, 2] },
    { name: "Longitudinal record", from: "Clinical", scores: [1, 0, 1] },
    { name: "Recirculation handling", from: "Leeftink", scores: [1, 0, 0] },
  ],
  totals: [11, 6, 12],
  /** The two rows the audit was really about. */
  decisive: ["Longitudinal record", "Recirculation handling"],
};

/*
 * The care lifecycle. The five phases are from the Program Model (After),
 * "Core Phases", and are the phases the prototype ships — src/data/model.ts,
 * PHASE_LABEL. Her structural claim, verbatim: "A program does not end in the
 * traditional sense."
 */
export const phases = [
  { name: "Assessment & Baseline", note: "establishes initial condition" },
  { name: "Active Intervention", note: "multiple domains actively engaged" },
  { name: "Maintenance Stabilization", note: "reduced intervention, increased autonomy" },
  { name: "Transition", note: "preparation for self-managed continuity" },
  { name: "Follow-Up / Re-entry", note: "allows reactivation without resetting" },
];

/*
 * What the same lifecycle looks like in the systems that already exist. Her
 * "Before" model, from the Core Entities & Relationships model: "Before /
 * Program = enrollment cycle". Re-enrolment started a new programme; re-entry
 * now happens inside the existing one.
 */
export const lifecycleBefore = ["Enrol", "Programme", "End"];
export const lifecycleAfter = ["Enrol", "Programme", "Leave", "Return"];

/*
 * The three evidence strands, from the comprehensive case study §3.1–3.2 and
 * §5.2–5.4. One finding each — the finding, not a summary of the reading.
 */
export const evidence = [
  {
    strand: "Clinical research",
    finding:
      "Coordination between disciplines is a planning problem: a change in one part of a patient's care affects decisions made elsewhere.",
    source: "Leeftink et al., 2018",
  },
  {
    strand: "Kenyan PHC guidelines",
    finding:
      "A coordinator role is defined within multi-disciplinary care, but the infrastructure under it is paper records, meetings and provider-to-provider communication.",
    source: "Primary Health Care Network Guidelines",
  },
  {
    strand: "Existing products",
    finding:
      "Recirculation is unhandled. Across three platforms, no solution scores more than one on either longitudinal record or recirculation.",
    source: "Diagnostic scorecard, nine dimensions",
  },
];

/*
 * The coordination workflow at Antara, from the decision log §1 and the
 * comprehensive case study. Her sentence: information "is transferred by
 * calling the patient for consent, the call is transcribed and logged, then
 * another domain is given access to the patient's information", and separately
 * "the patient takes pictures of results and sends them back to the doctor
 * manually".
 *
 * `by` is who does the work. The patient appears four times out of seven,
 * which is the whole point of drawing it.
 */
export const coordinationSteps = [
  { step: "Clinic calls the patient", by: "Clinic", hand: true },
  { step: "Patient gives consent", by: "Patient", hand: true },
  { step: "Call transcribed and logged", by: "Clinic", hand: true },
  { step: "Second domain granted access", by: "Clinic", hand: true },
  { step: "Specialist consultation", by: "Specialist", hand: false, note: "outside the platform" },
  { step: "Patient photographs the results", by: "Patient", hand: true },
  { step: "Patient sends them to the doctor", by: "Patient", hand: true },
];

/*
 * The decision log. Five commitments, each with her reasoning and what it
 * cost — from the decision log §3, §9, §6, §19, §8, and the System Intent.
 * `instead` is the alternative she rejected; several are framed that way in
 * the source, and it is the sharpest way to state a decision.
 */
export const decisions = [
  {
    decision: "Institution is a user",
    instead: "Institution as setting",
    why: "The clinic is not an enemy that needs subduing. It is a user with power, complexity, incentives, and erratic behavior.",
    consequence:
      "It is no longer enough to optimise for one user group. The patient cannot simply be prioritised at the expense of institutional adoption.",
  },
  {
    decision: "Patient is the continuity anchor",
    instead: "Continuity held by the institution",
    why: "Clinics provide care, but continuity should not die when the clinic relationship changes. The patient experiences the continuity.",
    consequence:
      "A patient joining a new clinic can consent and have it continue from previous signals and programme state. Raw domain data does not follow them.",
  },
  {
    decision: "Guardrails, not enforcement",
    instead: "Enforcing a care composition",
    why: "Hard enforcement would make the system too rigid and likely unadoptable. No guardrails would make it another exploitative shell.",
    consequence:
      "Care can start with whatever composition exists, and the system continuously reveals what is missing. Institutions can still decide — the cost of simplified care just becomes visible.",
  },
  {
    decision: "Observables, not judgments",
    instead: "The system decides",
    why: "If the system blindly flags 'add psychologist' every time weight loss slows, it loses credibility. Not all plateaus mean missing domains.",
    consequence:
      "SoulShape is not a decision-maker. It separates observables from derived patterns from interpretation, and interpretation is owned by professionals.",
  },
  {
    decision: "Maintenance is a phase",
    instead: "The programme ends at completion",
    why: "Most weight loss systems focus on the active phase and do not handle the return to actual life. If maintenance is weak, relapse becomes likely.",
    consequence:
      "The system must remain useful when visible activity decreases, which makes the design harder and less dramatic than intervention-heavy systems.",
  },
];

/*
 * The architecture, from the Data Architecture (After revision) §1–3. Her
 * governing principle, which the three layers resolve out of, is "Raw data
 * stays. Meaning moves. Continuity persists." — not "Data stays": ordinary
 * data is precisely what does move. Given top to bottom, as the page reads
 * them, and drawn resting on each other.
 */
export const architecture = [
  {
    layer: "Continuity",
    clause: "Continuity persists",
    holds: ["programme instances", "phase state", "signal history", "trend indicators", "risk flags", "tasks"],
    note: "Persistent, cross-cycle, cross-context",
  },
  {
    layer: "Meaning",
    clause: "Meaning moves",
    holds: ["signals", "what changed", "why it matters", "impact scope", "urgency"],
    note: "The only unit of meaning allowed to travel across domains and institutions",
  },
  {
    layer: "Data",
    clause: "Raw data stays",
    holds: ["Medical", "Nutrition", "Psychology", "Fitness"],
    note: "Non-portable, role-owned. Never leaves its domain boundary",
  },
];

/*
 * The seven signal types, from the Signal Layer standards, in her order — and
 * confirmed against the prototype's SIGNAL_TYPE_LABEL. The rule that governs
 * all of them: "Signals carry meaning, not authority."
 */
export const signalTypes = [
  "Status Update",
  "Trend Note",
  "Constraint Update",
  "Risk Attention",
  "Transition Marker",
  "Coordination Request",
  "Handoff Note",
];

/*
 * The mechanisms built around the layers, one line each from the comprehensive
 * case study §8.1, §8.2 and §9.1.
 */
export const mechanisms = [
  {
    name: "Coordinator dashboard",
    does: "A structured triage and routing interface for coordination, not clinical interpretation.",
  },
  {
    name: "Visibility matrix",
    does: "Not who can see what, but who can see what, in what context, through what mechanism, and under what conditions.",
  },
  {
    name: "External inputs",
    does: "A submission arrives as an ExternalInput, never as a signal. The coordinator decides what becomes of it.",
  },
];

/*
 * The visibility distinction, from the Data Visibility Matrix, "Legal Access
 * Visibility". Two modes, and the failure she avoided — her words: "Most
 * systems blur: 'you can see this' and 'you can request this'."
 */
export const visibility = {
  modes: [
    { mode: "Operational", access: "No raw data access", note: "Default system behaviour" },
    { mode: "Legal request", access: "Raw data released", note: "On demand, high friction, identity verified" },
  ],
  rule: "Domain raw data is never visible to other domains, the coordinator, mentors, or the patient in-app.",
};

/*
 * The Centre's weekly check-in before SoulShape, from her own account of the
 * discovery call, and the flow the prototype replaced it with.
 */
export const checkInBefore = [
  "Weekly check-in",
  "Phone and email",
  "Staff member gathers",
  "Files updated",
  "Colleague told",
];

export const checkInAfter = [
  "Structured check-in",
  "Records",
  "Computed change",
  "Shared signal",
  "Action",
];

/*
 * What the MVP does not carry. From the MVP documentation: "The MVP has no
 * patient side", and every component that existed to feed one "was removed
 * rather than left as decoration, on the principle that software should not
 * carry interfaces to systems that do not exist."
 *
 * Her trade-off, verbatim: "the patient-as-anchor commitment, the concept's
 * deepest idea, is not demonstrated in this MVP. It is deferred, not
 * abandoned."
 */
export const deferred = [
  "Patient application",
  "Recipe library",
  "Educational articles",
  "Content assignment",
  "Engagement analytics",
  "Patient-submitted logs",
];

/*
 * The four commitments her own Keeps/Defers table marks "Deferred" — distinct
 * from the removals above, and from two rows marked "Reduced", which are not
 * deferred and do not belong here.
 */
export const deferredCommitments = [
  { name: "Patient continuity layer", state: "No patient-facing surface exists" },
  { name: "Cross-institution portability", state: "One institution holds its own data" },
  { name: "Consent and visibility model", state: "Reduced to role permissions" },
  { name: "Insurance-ready export", state: "CSV export of records only" },
];
