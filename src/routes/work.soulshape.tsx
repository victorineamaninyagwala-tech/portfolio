import type { ReactNode } from "react";
import { createFileRoute } from "@tanstack/react-router";

import heroImage from "@/assets/soulshape-hero.webp";
import { CaseStudyHero, type MetaRow } from "@/components/CaseStudyHero";
import { CaseStudySection, Prose } from "@/components/CaseStudySection";
import { MoreWork } from "@/components/MoreWork";
import { Label } from "@/components/primitives";
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
 * The three products, scored across nine dimensions. Only the overall and the
 * two dimensions that decided the scope are shown: the rest of the scorecard
 * is working material, and a reader does not need all nine to see that the
 * column that mattered is empty in every one of them.
 */
const comparison = {
  products: ["Clinicea", "Antara", "Zoho"],
  rows: [
    { dimension: "Overall", scores: ["11/18", "12/18", "6/18"] },
    { dimension: "Longitudinal record", scores: ["0/2", "1/2", "0/2"] },
    { dimension: "Re-entry", scores: ["0/2", "0/2", "0/2"] },
  ],
};

/* The three layers the system was built around, in the order they stack. */
const layers = [
  {
    name: "Data stays",
    notes: [
      "Raw information remains owned by the domain that produces it. It does not need to be shared in its original form across the system.",
    ],
  },
  {
    name: "Meaning moves",
    notes: [
      "Changes are represented as typed signals. A signal records what changed, why it matters and what requires attention.",
      "Signals are append-only. An unresolved signal remains visible and can escalate rather than disappearing.",
    ],
  },
  {
    name: "Continuity persists",
    notes: [
      "Programmes continue across phases. Phases can be repeated or reversed, and returning patients inherit their existing context rather than starting again.",
    ],
  },
];

/*
 * A movement of the account: the heading in the left column, the writing in
 * the right, starting on the line the hero's facts start on.
 *
 * The section kit sets its title above the full width, which suits a section
 * carried by a picture or by two columns of facts. A single column of
 * narrative under a full-width heading is a different thing — it hangs at the
 * left edge, breaks its lines halfway across the page and leaves the other
 * half of the page empty. Here the heading takes that half.
 */
function Movement({ title, children }: { title: string; children: ReactNode }) {
  return (
    <CaseStudySection columns={1}>
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
 * The comparison. Scores are set right: they are read down a column against
 * each other, not across a row.
 */
function Comparison() {
  return (
    <table className="w-full border-collapse text-left">
      <thead>
        <tr>
          <th scope="col" className="pb-3 type-label font-semibold text-ink/60">
            {/* The corner of a comparison table carries nothing a reader needs,
                but a screen reader still has to be told what the column is. */}
            <span className="sr-only">Dimension</span>
          </th>
          {comparison.products.map((product) => (
            <th
              key={product}
              scope="col"
              className="pb-3 text-right type-label font-semibold text-ink/60"
            >
              {product}
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {comparison.rows.map((row, r) => {
          /* Rules are drawn above each row, so the last one draws its own below
             as well — otherwise the table trails off unclosed. */
          const rule = r === comparison.rows.length - 1 ? "border-y" : "border-t";
          return (
            <tr key={row.dimension}>
              <th
                scope="row"
                className={`${rule} border-ink/10 py-4 pr-6 type-body font-semibold text-ink`}
              >
                {row.dimension}
              </th>
              {row.scores.map((score, i) => (
                <td
                  key={comparison.products[i]}
                  className={`${rule} border-ink/10 py-4 text-right type-body text-ink/75`}
                >
                  {score}
                </td>
              ))}
            </tr>
          );
        })}
      </tbody>
    </table>
  );
}

/*
 * The three layers, stacked rather than set side by side: at the width of a
 * reading column, three cells would be too narrow to hold a sentence, and the
 * layers are read in the order they stack anyway.
 */
function Layers() {
  return (
    <div className="rounded-lg border border-ink/10">
      {layers.map((layer) => (
        <div key={layer.name} className="border-t border-ink/10 px-6 py-6 first:border-t-0">
          <Label className="text-olive">{layer.name}</Label>
          <div className="mt-3 space-y-3">
            {layer.notes.map((note) => (
              <p key={note} className="type-body text-ink/75">
                {note}
              </p>
            ))}
          </div>
        </div>
      ))}
    </div>
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
      <Movement title="Starting point">
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

      <Movement title="Research">
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

      <Movement title="Existing products">
        <Prose wide>
          I then looked at products already operating around parts of the problem.
        </Prose>
        <Prose wide>
          I compared Clinicea, Antara and Zoho across nine dimensions, including
          coordination, longitudinal records and re-entry.
        </Prose>

        <Comparison />

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

      <Movement title="A closer look at coordination">
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

      <Movement title="Defining the system">
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

      <Movement title="Architecture">
        <Prose wide>The system developed around three layers.</Prose>

        <Layers />

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

      <Movement title="From research to a real clinic">
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

      <Movement title="First prototype">
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

      <Movement title="Structured check-ins">
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
