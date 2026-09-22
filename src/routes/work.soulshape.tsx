import type { ReactNode } from "react";
import { createFileRoute } from "@tanstack/react-router";

import checkInShot from "@/assets/soulshape-check-in.webp";
import heroImage from "@/assets/soulshape-hero.webp";
import recordShot from "@/assets/soulshape-record.webp";
import signalsShot from "@/assets/soulshape-signals.webp";
import summaryShot from "@/assets/soulshape-summary.webp";
import { CaseStudyHero, type MetaRow } from "@/components/CaseStudyHero";
import { CaseStudySection, Prose } from "@/components/CaseStudySection";
import { Arrow, Diagram, Matrix, Node, Row, Sequence, Stack } from "@/components/Diagram";
import { MoreWork } from "@/components/MoreWork";
import { Label, ScreenCard } from "@/components/primitives";
import {
  architecture,
  checkInAfter,
  checkInBefore,
  coordinationSteps,
  decisions,
  evidence,
  lifecycleAfter,
  lifecycleBefore,
  mechanisms,
  scorecard,
  signalTypes,
  visibility,
} from "@/data/soulshape";
import { shareImage } from "@/lib/share";

export const Route = createFileRoute("/work/soulshape")({
  head: ({ match }) => ({
    meta: [
      { title: "SoulShape · A HealthTech Case Study by Victorine Amani" },
      { name: "description", content: "A care coordination platform for multi-disciplinary programs treating chronic illness, aligned with the Kenya Digital Health Act 2023." },
      { property: "og:title", content: "SoulShape · A HealthTech Case Study by Victorine Amani" },
      { property: "og:description", content: "A care coordination platform for multi-disciplinary programs treating chronic illness." },
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

/*
 * A movement of the account: the heading in the left column, the writing in
 * the right, starting on the line the hero's facts start on, and a drawing or
 * a screen run full width underneath.
 *
 * The section kit sets its title above the full width, which suits a section
 * carried by a picture or by two columns of facts. A single column of
 * narrative under a full-width heading is a different thing — it hangs at the
 * left edge, breaks its lines halfway across the page and leaves the other
 * half of the page empty. Here the heading takes that half.
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
 * The same picture before there is a system in it: four professionals, each
 * handing the patient something, and the patient holding all of it together.
 * The arrows all point the same way on purpose.
 */
function Fragmented() {
  const hands = [
    { from: "Doctor", gives: "Medication" },
    { from: "Nutritionist", gives: "Meal plan" },
    { from: "Trainer", gives: "Activity" },
    { from: "Psychologist", gives: "Behaviour" },
  ];
  return (
    <Diagram label="Before: four professionals, one patient holding it together">
      <Row columns={4}>
        {hands.map((hand) => (
          <div key={hand.from}>
            <Node title={hand.from} note={hand.gives} />
            <Arrow />
          </div>
        ))}
      </Row>
      <div className="mx-auto mt-2 max-w-[46ch]">
        <Node title="Patient" tone="subject" note="Carries the information, reconciles the advice, keeps track of what changed" />
      </div>
    </Diagram>
  );
}

/* The three strands of evidence, and the one finding each produced. */
function Evidence() {
  return (
    <Diagram label="What the reading produced">
      <Row columns={3}>
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
 * The lifecycle, twice: the one the existing products implement, and the one a
 * chronic condition actually has. The question underneath is the one the rest
 * of the case study answers.
 */
function Lifecycle() {
  return (
    <Diagram label="The shape of a care cycle">
      <div className="space-y-12">
        <div>
          <Label className="text-ink/50">In the systems that exist</Label>
          <Sequence className="mt-4" steps={lifecycleBefore.map((name) => ({ title: name }))} />
        </div>
        <div>
          <Label className="text-olive">What a chronic condition does</Label>
          <Sequence
            className="mt-4"
            steps={lifecycleAfter.map((name, i) => ({
              title: name,
              tone: i === lifecycleAfter.length - 1 ? "subject" : "plain",
            }))}
          />
        </div>
        <p className="type-title text-center text-ink">What survives the return?</p>
      </div>
    </Diagram>
  );
}

/*
 * The audit, whole. Nine dimensions rather than the three that make the point,
 * because the point is only worth anything if the other six are there to be
 * checked — and the two rows that decided the scope are marked, not extracted.
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
 * hand is one a person performs, and four of the seven are performed by the
 * patient — which is the finding, not the interface.
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
 * The decision log: the decision, the reasoning, and what it cost. The
 * decision is stated and left to stand — the why and the consequence beside
 * it do the arguing.
 */
function DecisionLog() {
  return (
    <Diagram label="Five decisions, and what each one cost">
      <div className="mx-auto max-w-[86ch] space-y-3">
        {decisions.map((entry) => (
          <div key={entry.decision} className="rounded-lg border border-ink/25 bg-paper px-6 py-6">
            <p className="type-title text-ink">{entry.decision}</p>
            <div className="mt-5 grid gap-x-10 gap-y-4 md:grid-cols-2">
              <div>
                <Label className="text-olive">Why</Label>
                <p className="mt-2 type-body text-ink/75">{entry.why}</p>
              </div>
              <div>
                <Label className="text-ink/40">Consequence</Label>
                <p className="mt-2 type-body text-ink/75">{entry.consequence}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </Diagram>
  );
}

/*
 * The architecture: three layers, each resting on the one below, with the
 * nouns that belong to it under its name. The mechanisms built around it sit
 * underneath, and the signal types are listed because "typed signals" means
 * nothing until the types are named.
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

/* The Centre's weekly check-in, before and after. */
function CheckInFlow() {
  return (
    <Diagram label="The weekly check-in, before and after">
      <div className="space-y-12">
        <div>
          <Label className="text-ink/50">At the Centre</Label>
          <Sequence className="mt-4" steps={checkInBefore.map((name) => ({ title: name }))} />
        </div>
        <div>
          <Label className="text-olive">In the prototype</Label>
          <Sequence
            className="mt-4"
            steps={checkInAfter.map((name, i) => ({ title: name, tone: i === 0 ? "subject" : "plain" }))}
          />
        </div>
      </div>
    </Diagram>
  );
}

function SoulShape() {
  return (
    <CaseStudyHero
      title="SoulShape"
      meta={meta}
      deck="A care coordination platform for multi-disciplinary programs treating chronic illness."
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

      <Movement title="A closer look at coordination" figure={<Coordination />}>
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

      <Movement title="Defining the system" figure={<DecisionLog />}>
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
            <Visibility />
            <ScreenCard
              src={signalsShot}
              alt="The signals list in the prototype. Each row is typed, carries a domain and a severity, and is held at active, escalated, dormant or resolved."
              width={1932}
              height={1449}
            />
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

      <Movement title="From research to a real clinic" figure={<CheckInFlow />}>
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
          <ScreenCard
            src={summaryShot}
            alt="The clinic summary: active patients, critical alerts, patients due a check-in, signals plotted by domain, and the caseload split by phase from assessment through to follow-up and re-entry."
            width={1932}
            height={1449}
          />
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
          /* What is entered, and what it becomes: the reading on the left, the
             record it lands in on the right. */
          <div className="grid gap-8 lg:grid-cols-2">
            <ScreenCard
              size="half"
              src={checkInShot}
              alt="The check-in dialog, with the previous reading printed under each field and a note that the system evaluates the reading after it is saved, not while it is typed."
              width={1288}
              height={966}
            />
            <ScreenCard
              size="half"
              src={recordShot}
              alt="A patient record: weight, blood pressure and BMI each shown against the previous reading, beside the four care domains and the consent held for each."
              width={1288}
              height={966}
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
