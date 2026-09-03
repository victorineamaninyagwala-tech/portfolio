import { createFileRoute } from "@tanstack/react-router";

import { CaseStudyHero, type MetaRow } from "@/components/CaseStudyHero";

export const Route = createFileRoute("/work/bazaar")({
  head: () => ({
    meta: [
      { title: "Bazaar — A Product Strategy Case Study by Victorine Amani" },
      { name: "description", content: "A trust and discovery layer for independent shops in Kenya: each shop gets its own branded, verified storefront on shared infrastructure." },
      { property: "og:title", content: "Bazaar — A Product Strategy Case Study by Victorine Amani" },
      { property: "og:description", content: "Self-directed product design, end to end — strategy, system, IA and onboarding." },
    ],
  }),
  component: Bazaar,
});

const meta: MetaRow[] = [
  { label: "Type", value: "Self-directed" },
  { label: "Year", value: "2026" },
  { label: "Role", value: "Product design, end to end" },
  { label: "Focus", value: "Independent retail · Kenya" },
];

function Bazaar() {
  return (
    <CaseStudyHero
      title="Bazaar"
      meta={meta}
      deck="Independent shops earn real trust in person, but none of it carries online. Bazaar gives each shop its own branded, verified storefront on shared infrastructure a stranger can safely buy through."
    />
  );
}
