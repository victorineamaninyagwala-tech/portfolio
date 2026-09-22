import type { ReactNode } from "react";
import { createFileRoute } from "@tanstack/react-router";

import heroImage from "@/assets/soulshape-hero.webp";
import signalsShot from "@/assets/soulshape-signals.webp";
import summaryShot from "@/assets/soulshape-summary.webp";
import domainsShot from "@/assets/ss-domains.webp";
import flow1 from "@/assets/ss-flow-1-record.webp";
import flow2 from "@/assets/ss-flow-2-form.webp";
import flow3 from "@/assets/ss-flow-3-entered.webp";
import flow4 from "@/assets/ss-flow-4-computed.webp";
import flow5 from "@/assets/ss-flow-5-routed.webp";
import phaseShot from "@/assets/ss-phase-maintenance.webp";
import programmesShot from "@/assets/ss-programmes.webp";
import historyShot from "@/assets/ss-record-history.webp";
import signalDetailShot from "@/assets/ss-signal-detail.webp";
import escalatedShot from "@/assets/ss-signals-escalated.webp";
import tasksShot from "@/assets/ss-tasks.webp";
import { CaseStudyHero, type MetaRow } from "@/components/CaseStudyHero";
import { CaseStudySection, Prose } from "@/components/CaseStudySection";
import { Arrow, Diagram, Matrix, Node, Row, Sequence, Stack } from "@/components/Diagram";
import { MoreWork } from "@/components/MoreWork";
import { Walkthrough, type WalkthroughStep } from "@/components/Walkthrough";
import { Label, ScreenCard } from "@/components/primitives";
import {
  architecture,
  calculation,
  coordinationSteps,
  decisions,
  evidence,
  externalInput,
  lifecycle,
  lifecycleStops,
  mechanisms,
  scorecard,
  signalTypes,
  survives,
  visibility,
  workingAreas,
} from "@/data/soulshape";
import { shareImage } from "@/lib/share";

export const Route = createFileRoute("/work/soulshape")({
  head: ({ match }) => ({
    meta: [
      { title: "SoulShape · A HealthTech Case Study by Victorine Amani" },
      { name: "description", content: "A care coordination platform for multi-disciplinary programmes treating chronic illness, aligned with the Kenya Digital Health Act 2023." },
      { property: "og:title", content: "SoulShape · A HealthTech Case Study by Victorine Amani" },
      { property: "og:description", content: "A care coordination platform for multi-disciplinary programmes treating chronic illness." },
      ...shareImage(match.context.origin, "soulshape", "The SoulShape case study: a runner mid-stride beside the title."),
    ],
  }),
  component: SoulShape,
});

const meta: MetaRow[] = [
  { label: "Domain", value: "HealthTech · Care Coordination" },
  { label: "Year", value: "April 2026" },
  { label: "Role", value: "Product Designer (Independent)" },
  { label: "Compliance", value: "Kenya Digital Health Act 2023" },
];

/* Every screen is shot at the same size, so none of them has to say so. */
const SCREEN = { width: 1932, height: 1449 };

/*
 * A movement of the account: the heading in the left column, the writing in
 * the right, starting on the line the hero's facts start on, and the drawings
 * or the screens run full width underneath.
 *
 * The page turns from drawings into screens as it goes. Up to the research it
 * argues in diagrams, because there is no product yet to point at; from the
 * decisions onward it argues in the interface, and a drawing appears only
 * where the system underneath has to be explained before a screen of it could
 * mean anything.
 */
function Movement({
  title,
  figure,
  children,
}: {
  title: string;
  figure?: ReactNode;
  children: ReactNode;
}) {
  return (
    <CaseStudySection columns={1} figure={figure}>
      <div className="grid grid-cols-12 gap-y-8">
        <h2 className="col-span-12 type-headline md:col-span-5">{title}</h2>
        {/* Columns 5 and 6 are the gutter between them, the same gutter the kit
            leaves when a section is led by a picture. */}
        <div className="col-span-12 space-y-6 md:col-span-6 md:col-start-7">{children}</div>
      </div>
    </CaseStudySection>
  );
}

/*
 * A decision and the screen that carries it. The decision is stated once on
 * the left and the interface answers on the right — no diagram, because the
 * screen is the evidence that the decision was taken rather than described.
 */
function Decided({
  decision,
  why,
  src,
  alt,
}: {
  decision: string;
  why: string;
  src: string;
  alt: string;
}) {
  return (
    <div className="grid items-start gap-x-12 gap-y-6 lg:grid-cols-12">
      <div className="lg:col-span-4">
        <p className="type-title text-ink">{decision}</p>
        <p className="mt-3 type-body text-ink/70">{why}</p>
      </div>
      <div className="lg:col-span-8">
        <ScreenCard src={src} alt={alt} width={SCREEN.width} height={SCREEN.height} />
      </div>
    </div>
  );
}

/*
 * The care journey before there is a system in it: four professionals and
 * tools, each handing the patient something, and the patient carrying all of
 * it between them. Every arrow points the same way on purpose.
 */
function Fragmented() {
  const hands = [
    { from: "Doctor", gives: "Medication" },
    { from: "Nutritionist", gives: "Meal plan" },
    { from: "Exercise", gives: "Activity" },
    { from: "Tracking", gives: "Logs and readings" },
  ];
  return (
    <Diagram label="The care journey, fragmented">
      <Row columns={4}>
        {hands.map((hand) => (
          <div key={hand.from}>
            <Node title={hand.from} note={hand.gives} />
            <Arrow />
          </div>
        ))}
      </Row>
      <div className="mx-auto mt-2 max-w-[52ch]">
        <Node
          title="Patient"
          tone="subject"
          note="Carries the information between them, reconciles the advice, and keeps track of what changed"
        />
      </div>
    </Diagram>
  );
}

/* The four strands of reading, and the one finding each produced. */
function Evidence() {
  return (
    <Diagram label="What the reading produced">
      <Row columns={4}>
        {evidence.map((strand) => (
          <div key={strand.strand} className="rounded-lg border border-ink/25 bg-paper px-6 py-6">
            <Label className="text-olive">{strand.strand}</Label>
            <p className="mt-3 type-body text-ink/75">{strand.finding}</p>
            <p className="mt-4 type-caption text-ink/45">{strand.source}</p>
          </div>
        ))}
      </Row>
    </Diagram>
  );
}

/*
 * The cycle a chronic condition actually runs, and the point the existing
 * products stop at. What has to survive the return is named underneath,
 * because that is the whole of the finding.
 */
function Lifecycle() {
  return (
    <Diagram label="Re-entry">
      <Sequence
        steps={lifecycle.map((name, i) => ({
          title: name,
          note: i === lifecycleStops ? "where the existing products stop" : undefined,
          tone: i === lifecycle.length - 1 ? "subject" : "plain",
        }))}
      />
      <div className="mx-auto mt-12 max-w-[62ch] text-center">
        <Label className="text-olive">What has to survive it</Label>
        <p className="mt-3 type-body text-ink/70">{survives}</p>
      </div>
    </Diagram>
  );
}

/*
 * The audit, whole. Nine dimensions rather than the two that make the point,
 * because the point is only worth anything if the other seven are there to be
 * checked — and the two that decided the scope are marked, not extracted.
 */
function Scorecard() {
  return (
    <Diagram label={`Nine dimensions, two points each · ${scorecard.scale}`}>
      <Matrix
        columns={scorecard.products}
        highlight={scorecard.decisive}
        rows={[
          ...scorecard.dimensions.map((d) => ({
            heading: d.name,
            cells: d.scores.map(String),
          })),
          { heading: "Total", cells: scorecard.totals.map((t) => `${t}/18`) },
        ]}
      />
    </Diagram>
  );
}

/*
 * The coordination workflow as it was described to her. Every step marked by
 * hand is one a person performs, and three of the seven are performed by the
 * patient — which is the finding, not the interface. The patient is named in a
 * fourth, the call that opens it, but the clinic is the one placing it.
 */
function Coordination() {
  return (
    <Diagram label="Moving one patient's information between two domains">
      <div className="mx-auto max-w-[62ch]">
        {coordinationSteps.map((step, i) => (
          <div key={step.step}>
            <div
              className={
                step.by === "Patient"
                  ? "rounded-lg border border-ink bg-ink px-5 py-4"
                  : "rounded-lg border border-ink/25 bg-paper px-5 py-4"
              }
            >
              <div className="flex items-baseline justify-between gap-4">
                <p
                  className={
                    step.by === "Patient"
                      ? "type-body font-semibold text-paper"
                      : "type-body font-semibold text-ink"
                  }
                >
                  {step.step}
                </p>
                <span
                  className={
                    step.by === "Patient"
                      ? "type-label font-semibold whitespace-nowrap text-paper/70"
                      : "type-label font-semibold whitespace-nowrap text-ink/45"
                  }
                >
                  {step.by}
                </span>
              </div>
              {step.note ? (
                <p
                  className={
                    step.by === "Patient" ? "mt-1 type-caption text-paper/60" : "mt-1 type-caption text-ink/50"
                  }
                >
                  {step.note}
                </p>
              ) : null}
            </div>
            {i < coordinationSteps.length - 1 ? <Arrow label={step.hand ? "by hand" : undefined} /> : null}
          </div>
        ))}
      </div>
    </Diagram>
  );
}

/*
 * The same finding in one line: the route between two domains runs through a
 * person, and there is no other route.
 */
function Carrier() {
  return (
    <Diagram label="The route between two domains">
      <Sequence
        steps={[
          { title: "Nutrition", note: "Holds the record" },
          { title: "Patient", note: "Consents, photographs, forwards", tone: "subject" },
          { title: "Medical", note: "Receives it, eventually" },
        ]}
      />
    </Diagram>
  );
}

/*
 * The architecture: three layers, each resting on the one below, with the
 * nouns that belong to it under its name. The signal types are listed because
 * "typed signals" means nothing until the types are named, and the mechanisms
 * built around the layers sit beneath them.
 */
function Architecture() {
  return (
    <Diagram label="Raw data stays. Meaning moves. Continuity persists.">
      <Stack
        layers={architecture.map((layer) => ({
          name: layer.layer,
          contents: layer.holds,
          note: layer.note,
        }))}
      />

      <div className="mx-auto mt-14 max-w-[86ch]">
        <Label className="text-ink/50">Built around it</Label>
        <Row className="mt-4" columns={3}>
          {mechanisms.map((mechanism) => (
            <div key={mechanism.name} className="rounded-lg border border-ink/25 bg-paper px-6 py-5">
              <p className="type-body font-semibold text-ink">{mechanism.name}</p>
              <p className="mt-2 type-caption text-ink/60">{mechanism.does}</p>
            </div>
          ))}
        </Row>

        <div className="mt-10">
          <Label className="text-ink/50">The signal types</Label>
          <ul className="mt-4 flex flex-wrap gap-2">
            {signalTypes.map((type) => (
              <li
                key={type}
                className="rounded-lg border border-ink/25 bg-paper px-3 py-1.5 type-caption text-ink/75"
              >
                {type}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </Diagram>
  );
}

/* Where each layer of that drawing surfaces in the built system. */
function LayerScreens() {
  const shown = [
    {
      layer: "Data",
      src: historyShot,
      alt: "A patient record, where each domain's own material is held against the patient it belongs to.",
    },
    {
      layer: "Meaning",
      src: signalsShot,
      alt: "The signals list: typed observations, each carrying a domain and a severity.",
    },
    {
      layer: "Continuity",
      src: phaseShot,
      alt: "The maintenance phase, holding the part of the caseload that is in it.",
    },
    {
      layer: "Coordination",
      src: summaryShot,
      alt: "The coordinator's summary of the day.",
    },
  ];
  return (
    <div className="grid gap-8 md:grid-cols-2">
      {shown.map((item) => (
        <div key={item.layer}>
          <Label className="text-ink/50">{item.layer}</Label>
          <div className="mt-3">
            <ScreenCard
              size="half"
              src={item.src}
              alt={item.alt}
              width={SCREEN.width}
              height={SCREEN.height}
            />
          </div>
        </div>
      ))}
    </div>
  );
}

/*
 * The visibility distinction, which is the subtle one: being able to see that
 * something exists is not permission to read it. Two modes and one rule is the
 * whole mechanism, and it is shorter than any explanation of it would be.
 */
function Visibility() {
  return (
    <Diagram label="Visibility is not accessibility">
      <div className="mx-auto max-w-[62ch]">
        <Matrix
          columns={["Raw data"]}
          rows={visibility.modes.map((mode) => ({
            heading: mode.mode,
            cells: [mode.access],
          }))}
        />
        <p className="mt-8 type-body text-ink/70">{visibility.rule}</p>
      </div>
    </Diagram>
  );
}

/*
 * The external layer, drawn rather than shown: it was specified and never
 * built, and a screen of it would be a screen of something that does not
 * exist. Dashed until the last step, which is the one that does.
 */
function ExternalInput() {
  return (
    <Diagram label="External input · specified, not built">
      <Sequence
        steps={externalInput.map((step, i) => ({
          title: step.step,
          note: step.note,
          tone: i === externalInput.length - 1 ? "subject" : "deferred",
        }))}
      />
    </Diagram>
  );
}

/* The five areas the first version carries. */
function Scope() {
  return (
    <Diagram label="The scope of the first version">
      <Row columns={5}>
        {workingAreas.map((area) => (
          <Node key={area.area} title={area.area} note={area.does} />
        ))}
      </Row>
    </Diagram>
  );
}

/* One calculation, followed out of the records it came from. */
function Calculation() {
  return (
    <Diagram label="Where the number on the record comes from">
      <Sequence
        steps={[
          { title: calculation.previous.value, note: `Previous reading · ${calculation.previous.when}` },
          { title: calculation.current.value, note: `Entered at the check-in · ${calculation.current.when}` },
          { title: calculation.change.value, note: calculation.change.note, tone: "subject" },
        ]}
      />
    </Diagram>
  );
}

/*
 * The check-in, played rather than pasted. A flow reported as stills is a
 * claim; a flow you can watch is the thing itself — and this one earns the
 * playback, because the fourth screen is not a screen the coordinator asked
 * for. Saving computes the change, tests it against a threshold, and hands
 * back what it found without saying what it means.
 *
 * Shot against the running prototype: the readings are entered, the save is
 * real, and the figures on the last two screens are what the system worked
 * out from the ones on the first.
 */
const checkIn: WalkthroughStep[] = [
  {
    label: "The record as it stands",
    src: flow1,
    alt: "Amina Hassan's record: weight 88.4 kg, blood pressure 120/79, BMI 33.3, each against its previous reading.",
    ...SCREEN,
    hotspot: { x: 95.2, y: 10.7 },
  },
  {
    label: "The form, with the previous reading under every field",
    src: flow2,
    alt: "The check-in dialog. Under each field is the last value and the date it was taken, and a line saying the system evaluates the reading after it is saved, not while it is typed.",
    ...SCREEN,
    hotspot: { x: 50, y: 34 },
  },
  {
    label: "The reading entered",
    src: flow3,
    alt: "The dialog with 87.5 kg, 118 systolic and 76 diastolic entered against the previous 88.4 kg and 120/79.",
    ...SCREEN,
    hotspot: { x: 64.2, y: 79 },
  },
  {
    label: "Saved, and what the system made of it",
    src: flow4,
    alt: "The reading is saved and the change computed: down 0.9 kg since 20 September. Beneath it the system reports rapid weight loss at 3.0 kg per week against a threshold of 1.5, and says what this means is for the domain to decide.",
    ...SCREEN,
    hotspot: { x: 65.1, y: 55.2 },
  },
  {
    label: "Routed to a role, for a domain to interpret",
    src: flow5,
    alt: "A Risk Attention signal being created from the detected change, carrying the evidence, routed to roles rather than to named individuals, with an urgency that sets how long it stays open.",
    ...SCREEN,
  },
];

function SoulShape() {
  return (
    <CaseStudyHero
      title="SoulShape"
      meta={meta}
      deck="A care coordination platform for multi-disciplinary programmes treating chronic illness."
      image={{
        src: heroImage,
        alt: "The SoulShape account-creation screen on a monitor at a clinic's front desk",
        width: 1448,
        height: 1086,
      }}
    >
      <Movement title="Starting point" figure={<Fragmented />}>
        <Prose wide>
          I started working on SoulShape after several years of trying to manage my own
          weight.
        </Prose>
        <Prose wide>
          The process involved several people and tools: doctors, nutritionists, exercise,
          meal planning and tracking. Each addressed part of the problem, but none had
          much visibility into what the others were doing.
        </Prose>
        <Prose wide>
          This meant that the person receiving care had to carry information between them,
          reconcile different recommendations and keep track of what had changed.
        </Prose>
        <Prose wide>
          I wanted to understand whether this was an individual problem or a coordination
          problem.
        </Prose>
      </Movement>

      <Movement
        title="Research"
        figure={
          <div className="space-y-8">
            <Evidence />
            <Lifecycle />
          </div>
        }
      >
        <Prose wide>
          I looked at research on multidisciplinary care, chronic weight management and
          healthcare coordination, as well as Kenya's Primary Health Care Network
          Guidelines.
        </Prose>
        <Prose wide>Several patterns came up repeatedly.</Prose>
        <Prose wide>
          Leeftink et al. (2018) described coordination between disciplines as a planning
          problem, where a change in one part of a patient's care can affect decisions
          made elsewhere.
        </Prose>
        <Prose wide>
          The PHC Network Guidelines define a coordinator role within multidisciplinary
          care, but the processes described rely on paper records, meetings and
          communication between providers.
        </Prose>
        <Prose wide>
          Other research pointed to the effects of uncoordinated advice, including
          cognitive overload and conflicting recommendations. The chronic nature of
          obesity also raised a different issue: what happens when someone leaves a
          programme and returns later?
        </Prose>
        <Prose wide>I began referring to this as re-entry.</Prose>
      </Movement>

      <Movement title="Existing products" figure={<Scorecard />}>
        <Prose wide>
          I then looked at products already operating around parts of the problem.
        </Prose>
        <Prose wide>
          I compared Clinicea, Antara and Zoho across nine dimensions, including
          coordination, longitudinal records and re-entry.
        </Prose>
        <Prose wide>
          The platforms approached different parts of care, but none carried the patient's
          context through a complete cycle of leaving and returning.
        </Prose>
        <Prose wide>This helped narrow the problem.</Prose>
        <Prose wide>
          SoulShape would need to support the coordination between domains rather than
          replace the tools used within each domain.
        </Prose>
      </Movement>

      <Movement
        title="A closer look at coordination"
        figure={
          <div className="space-y-8">
            <Coordination />
            <Carrier />
          </div>
        }
      >
        <Prose wide>
          I spoke with a former Antara employee to understand how coordination worked in
          practice.
        </Prose>
        <Prose wide>
          Some information was transferred by calling the patient for consent and
          transcribing the conversation. Specialist results could be photographed and sent
          back by the patient.
        </Prose>
        <Prose wide>
          The process connected the different parts of care, but much of the work still
          happened manually.
        </Prose>
        <Prose wide>This changed the scope of SoulShape.</Prose>
        <Prose wide>
          The patient was currently doing part of the work that the system would need to
          support.
        </Prose>
      </Movement>

      <Movement
        title="Defining the system"
        figure={
          /* Each decision answered by the screen that carries it rather than by
             a diagram explaining it. From here on the case study is made of the
             product. */
          <div className="space-y-16">
            <Decided
              decision={decisions[0].decision}
              why={decisions[0].why}
              src={summaryShot}
              alt="The coordinator's summary: active patients across four programmes, critical alerts, patients due a check-in, and the caseload by phase."
            />
            <Decided
              decision={decisions[1].decision}
              why={decisions[1].why}
              src={historyShot}
              alt="A patient record carrying its accumulated history: the phase timeline across two phase instances, the coordination stream, and the check-ins behind it."
            />
            <Decided
              decision={decisions[2].decision}
              why={decisions[2].why}
              src={domainsShot}
              alt="The psychology domain: who is covered by it, the consent held for each of them, the signals active in it and the tasks open against it."
            />
            <Decided
              decision={decisions[3].decision}
              why={decisions[3].why}
              src={signalDetailShot}
              alt="A trend note in full: the summary reference, who it came from and who it is for, its confidence and expiry, and the escalation path it has not yet been through."
            />
            <Decided
              decision={decisions[4].decision}
              why={decisions[4].why}
              src={phaseShot}
              alt="The maintenance stabilization phase, holding its own caseload alongside assessment, active intervention, transition and follow-up."
            />
          </div>
        }
      >
        <Prose wide>
          Before moving into the interface, I documented several decisions about what
          SoulShape would and would not do.
        </Prose>
        <Prose wide>
          The clinic would be treated as a user because it has its own workflows,
          constraints and incentives.
        </Prose>
        <Prose wide>The patient would remain the continuity anchor.</Prose>
        <Prose wide>
          The system would surface gaps rather than decide what a patient's care should
          consist of. Professionals would interpret the information rather than having the
          system make those decisions.
        </Prose>
        <Prose wide>
          I also treated maintenance as part of the care journey. A programme could be
          successful while someone was enrolled and still fail to support them when they
          returned later.
        </Prose>
        <Prose wide>
          This also meant avoiding features designed primarily to keep someone inside a
          programme.
        </Prose>
      </Movement>

      <Movement
        title="Architecture"
        figure={
          <div className="space-y-8">
            <Architecture />
            <LayerScreens />
            <Visibility />
            <ExternalInput />
          </div>
        }
      >
        <Prose wide>The system developed around three layers.</Prose>
        <Prose wide>I then built the supporting structures around these layers.</Prose>
        <Prose wide>
          The coordinator dashboard is designed for triage rather than interpretation.
        </Prose>
        <Prose wide>
          The visibility matrix distinguishes between information being visible and
          permission to request the underlying information.
        </Prose>
        <Prose wide>
          External inputs can enter the system, but are translated into the system's own
          structure before becoming part of the workflow.
        </Prose>
      </Movement>

      <Movement
        title="From research to a real clinic"
        figure={
          <ScreenCard
            src={programmesShot}
            alt="Registering a patient in the prototype: the programme is chosen from the Centre's own products, the 3-Month Holistic Transformation and the 6-Month Sustainable Wellness Journey."
            width={SCREEN.width}
            height={SCREEN.height}
          />
        }
      >
        <Prose wide>The initial work was based entirely on desk research.</Prose>
        <Prose wide>
          The Holistic Weight Management Centre became the next research step because its
          existing model already brought the relevant disciplines together.
        </Prose>
        <Prose wide>
          I contacted the Centre, reviewed their rate card and built a working
          demonstration based on their existing programme structure.
        </Prose>
        <Prose wide>This also reduced the scope of the first version.</Prose>
      </Movement>

      <Movement
        title="First prototype"
        figure={
          <div className="space-y-8">
            <Scope />
            <div className="grid gap-8 md:grid-cols-2">
              <ScreenCard
                size="half"
                src={escalatedShot}
                alt="The signals list filtered to what has escalated."
                width={SCREEN.width}
                height={SCREEN.height}
              />
              <ScreenCard
                size="half"
                src={tasksShot}
                alt="The tasks a signal asked somebody to do."
                width={SCREEN.width}
                height={SCREEN.height}
              />
            </div>
          </div>
        }
      >
        <Prose wide>The first version was clinic-facing.</Prose>
        <Prose wide>
          I removed the patient-facing components rather than keeping them as incomplete
          parts of the prototype. The first question was whether the coordination layer
          could support an existing clinic workflow.
        </Prose>
        <Prose wide>
          I used the Centre's own terminology, including the 3-Month Holistic
          Transformation, 6-Month Sustainable Wellness Journey and Mindful Eating
          sessions.
        </Prose>
        <Prose wide>
          Their weekly check-ins were being handled through phone and email, with records
          distributed across files and coordination dependent on individual staff members.
        </Prose>
        <Prose wide>The first feature therefore focused on that process.</Prose>
      </Movement>

      <Movement
        title="Structured check-ins"
        figure={
          /* The longest figure on the page, because this is where the research
             and the architecture turn into something a person does. The form at
             full size, the flow played, the one calculation followed out of the
             records it came from, and then where what it produced turns up. */
          <div className="space-y-8">
            <ScreenCard
              src={flow2}
              alt="The check-in in full: a field for each measure, with the previous reading and the date it was taken printed beneath it, and a note that the system evaluates the reading after it is saved."
              width={SCREEN.width}
              height={SCREEN.height}
            />
            <Walkthrough steps={checkIn} />
            <Calculation />
            <ScreenCard
              src={signalsShot}
              alt="The signals list, where what the check-in produced joins every other typed observation, held at active, escalated, dormant or resolved."
              width={SCREEN.width}
              height={SCREEN.height}
            />
          </div>
        }
      >
        <Prose wide>
          The check-in brings together information already recorded, calculates what has
          changed and makes the result available to the relevant members of the team.
        </Prose>
        <Prose wide>The prototype currently contains five working areas.</Prose>
        <Prose wide>
          The displayed numbers are calculated from records rather than manually entered
          dashboard values.
        </Prose>
        <Prose wide>Controls without a working behaviour were removed.</Prose>
        <Prose wide>
          I also removed the Security tab. The prototype could demonstrate the information
          flow, but it could not demonstrate production security, so showing security
          controls would have represented functionality that did not exist.
        </Prose>
      </Movement>

      <MoreWork current="soulshape" />
    </CaseStudyHero>
  );
}
