/*
 * SoulShape: the facts the case study draws.
 *
 * Everything here is transcribed from her own source documents — the
 * comprehensive case study, the decision log, the data architecture, the
 * signal standards, the visibility matrix — and from the built prototype's own
 * data files, which are the most recent word where two sources disagree.
 *
 * The MVP documentation for the Holistic Weight Management Centre is NOT a
 * source. She has said to disregard it. Nothing on the page may be traced to
 * it, and nothing here should start citing it again.
 *
 * Nothing is rounded, reordered or reconstructed. The comment above each block
 * says where it came from, so a figure on the page can always be traced back
 * to a line in a document.
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
 * she publishes, where the same column with those last two zeroed is 9. The last
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
export const lifecycle = ["Enrol", "Care", "Programme ends", "Leave", "Return"];

/* Where the existing products stop: the programme ends and so does the cycle,
   so a returning patient starts again with nothing behind them. Index into
   `lifecycle` above. */
export const lifecycleStops = 2;

/* What has to survive the return, from the continuity layer. */
export const survives = "Programme instances · phase state · signal history · trend indicators";

/*
 * The four strands she read, and the one finding from each that changed the
 * project — from the comprehensive case study §3.1–3.2 and from her own
 * account. The finding, not a summary of the reading.
 */
export const evidence = [
  {
    strand: "Coordination research",
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
    strand: "Uncoordinated care",
    finding:
      "Advice arriving in fragments produces cognitive overload and conflicting recommendations, which the patient is left to reconcile.",
    source: "Clinical literature",
  },
  {
    strand: "A chronic, relapsing condition",
    finding:
      "Care does not end when a programme does. What happens when someone leaves and returns later is the case nothing handles.",
    source: "Obesity as chronic care",
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
 * `by` is who does the work, and by that count three of the seven steps are
 * the patient's — the consent, the photograph, the forwarding. A fourth names
 * them without their doing it: the clinic places the call. Three of seven is
 * the figure the drawing shows, because it darkens a box on `by`.
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
 *
 * Each decision states what it is and stops there. The sources often frame
 * one as chosen over something else, and an earlier draft of this page
 * carried that rejected alternative beside the title — her instruction was to
 * take it out. A decision that has to name its loser is arguing; the why and
 * the consequence below it already carry the reasoning.
 */
export const decisions = [
  {
    decision: "Institution is a user",
    /* Her own account of where this came from, which the decision log's
       wording alone does not carry: the stance was a correction of her bias,
       not a position she started from. */
    why: "My initial approach was tainted by the stance I took as a patient. The decisions were leaning towards the patient's experience without much regard for the clinic, so I had to stop treating the clinic as an enemy that needs subduing.",
    consequence:
      "It is no longer enough to optimise for one user group. The patient cannot simply be prioritised at the expense of institutional adoption.",
  },
  {
    decision: "Patient is the continuity anchor",
    why: "Clinics provide care, but continuity should not die when the clinic relationship changes. The patient experiences the continuity.",
    consequence:
      "A patient joining a new clinic can consent and have it continue from previous signals and programme state. Raw domain data does not follow them.",
  },
  {
    decision: "Guardrails",
    why: "Hard enforcement would make the system too rigid and likely unadoptable. No guardrails would make it another exploitative shell.",
    consequence:
      "Care can start with whatever composition exists, and the system continuously reveals what is missing. Institutions can still decide — the cost of simplified care just becomes visible.",
  },
  {
    decision: "Observables",
    why: "If the system blindly flags 'add psychologist' every time weight loss slows, it loses credibility. Not all plateaus mean missing domains.",
    consequence:
      "SoulShape is not a decision-maker. It separates observables from derived patterns from interpretation, and interpretation is owned by professionals.",
  },
  {
    decision: "Maintenance is a phase",
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
 * The external layer, which was designed and documented but never built, so it
 * is drawn rather than shown. From the comprehensive case study §9.1: a
 * submission "is received as an ExternalInput — not a Signal", and the
 * coordinator decides "whether to ignore it, convert it into a signal, route
 * it into a domain record, or create a task from it."
 */
export const externalInput = [
  { step: "External professional", note: "A trainer or psychologist outside the clinic" },
  { step: "Structured form", note: "Constrained, aligned with the signal schema" },
  { step: "ExternalInput", note: "Never a signal, and never automatically" },
  { step: "Coordinator decides", note: "Ignore, convert, route to a record, or make a task" },
];

/*
 * The five areas the first version carries, as the prototype's own navigation
 * groups them. Tools — settings, account, activity — sit under these and are
 * not working areas of the clinic's day.
 */
export const workingAreas = [
  { area: "Summary", does: "The day at a glance, and what needs attention" },
  { area: "Signals", does: "Every typed observation, open or resolved" },
  { area: "Tasks", does: "What a signal asked somebody to do" },
  { area: "Patients", does: "The caseload, by phase" },
  { area: "Domains", does: "Coverage and consent, one domain at a time" },
];

/*
 * One calculation, followed through. These are the real figures from the
 * check-in recorded against the running prototype — the previous reading, the
 * one entered, and what the system worked out from the two. Nothing here is
 * typed into a dashboard.
 */
export const calculation = {
  previous: { value: "88.4 kg", when: "20 Sept 2026" },
  current: { value: "87.5 kg", when: "today" },
  change: { value: "−0.9 kg", note: "3.0 kg per week, against a threshold of 1.5" },
};
