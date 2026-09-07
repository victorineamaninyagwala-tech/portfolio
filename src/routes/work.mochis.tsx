import { createFileRoute } from "@tanstack/react-router";

import { CaseStudyHero, type MetaRow } from "@/components/CaseStudyHero";

export const Route = createFileRoute("/work/mochis")({
  head: () => ({
    meta: [
      { title: "Mochi's Brew · A Service Design Case Study by Victorine Amani" },
      { name: "description", content: "A pickup ordering flow for Kenyan coffee shops, bridging the gap between walking in and paying for delivery." },
      { property: "og:title", content: "Mochi's Brew · A Service Design Case Study by Victorine Amani" },
      { property: "og:description", content: "UX case study on a pickup ordering service flow. In progress." },
    ],
  }),
  component: MochisBrew,
});

const meta: MetaRow[] = [
  { label: "Type", value: "UX Case Study · Service Flow" },
  { label: "Status", value: "In progress" },
  { label: "Role", value: "Product Designer" },
  { label: "Platform", value: "Responsive Web · Kenya" },
];

function MochisBrew() {
  return (
    <CaseStudyHero
      title="Mochi's Brew"
      meta={meta}
      deck="Designing a pickup ordering flow for on-the-go customers in Kenyan coffee shops. A service flow that bridges the gap between walking in and paying for delivery."
    />
  );
}
