import { createFileRoute } from "@tanstack/react-router";

import { CaseStudyHero, type MetaRow } from "@/components/CaseStudyHero";
import { MoreWork } from "@/components/MoreWork";
import { shareImage } from "@/lib/share";

export const Route = createFileRoute("/work/soulshape")({
  head: ({ match }) => ({
    meta: [
      { title: "SoulShape · A HealthTech Case Study by Victorine Amani" },
      { name: "description", content: "A care coordination platform for multi-disciplinary weight-loss programs, aligned with the Kenya Digital Health Act 2023." },
      { property: "og:title", content: "SoulShape · A HealthTech Case Study by Victorine Amani" },
      { property: "og:description", content: "Independent product design on care coordination: raw data stays, meaning moves." },
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
      deck="A care coordination platform for multi-disciplinary weight-loss programs, built around the principle that raw data stays, meaning moves, and continuity persists."
    >
      <MoreWork current="soulshape" />
    </CaseStudyHero>
  );
}
