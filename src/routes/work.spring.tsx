import { createFileRoute } from "@tanstack/react-router";

import { CaseStudyHero, type MetaRow } from "@/components/CaseStudyHero";

export const Route = createFileRoute("/work/spring")({
  head: () => ({
    meta: [
      { title: "Spring On The Go · A UX Audit by Victorine Amani" },
      { name: "description", content: "A UX audit and e-commerce redesign concept for a Kenyan convenience retailer, rebuilt around intent rather than inventory." },
      { property: "og:title", content: "Spring On The Go · A UX Audit by Victorine Amani" },
      { property: "og:description", content: "An independent end-to-end UX audit and homepage redesign concept." },
    ],
  }),
  component: SpringOnTheGo,
});

const meta: MetaRow[] = [
  { label: "Type", value: "Independent case study" },
  { label: "Focus", value: "E-commerce · Audit & Redesign" },
  { label: "Role", value: "UX Research / Product Design" },
  { label: "Market", value: "Nairobi, Kenya" },
];

function SpringOnTheGo() {
  return (
    <CaseStudyHero
      title="Spring On The Go"
      meta={meta}
      deck="A Kenyan convenience retailer with a strong marketing presence and a digital shopping journey that was not keeping up with it. Audited end to end, then rebuilt the homepage around intent rather than inventory."
      note="Not commissioned and not implemented. An independent exercise based on publicly available information and direct evaluation."
    />
  );
}
