import { createFileRoute } from "@tanstack/react-router";

import heroImage from "@/assets/soulshape-hero.webp";
import { CaseStudyHero, type MetaRow } from "@/components/CaseStudyHero";
import { CaseStudySection, Prose, Subhead } from "@/components/CaseStudySection";
import { MoreWork } from "@/components/MoreWork";
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
      <CaseStudySection title="Rebuilding care around the patient's journey" columns={1}>
        {/* The question on the left, where the eye lands; the argument beside
            it, ending on the question the rest of the page answers. */}
        <div className="grid gap-x-12 gap-y-10 md:grid-cols-2">
          <Subhead>
            How can multi-disciplinary care hold together across time, when the
            professionals rarely meet and the patient carries all the context?
          </Subhead>

          <div className="space-y-6">
            <Prose wide>
              Healthcare is not failing for lack of expertise. It is failing at
              coordination. A patient managing a chronic illness is routinely left to
              manage several professionals at once, reconcile advice that arrives in
              fragments, and keep their own care consistent, with no system behind them
              to do any of it.
            </Prose>
            <Prose wide>
              The work of stitching care together falls entirely on the patient. That is
              not a failure of clinical skill. It is a failure of system design.
            </Prose>
            <Prose wide>
              What does it take to make care continuous, when neither the patient's life
              nor the professionals around them are?
            </Prose>
          </div>
        </div>
      </CaseStudySection>

      <MoreWork current="soulshape" />
    </CaseStudyHero>
  );
}
