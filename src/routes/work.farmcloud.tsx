import { createFileRoute } from "@tanstack/react-router";

import heroImage from "@/assets/farmcloud-hero.png";
import { CaseStudyHero, type MetaRow } from "@/components/CaseStudyHero";

export const Route = createFileRoute("/work/farmcloud")({
  head: () => ({
    meta: [
      { title: "FarmCloud — A UX Case Study by Victorine Amani" },
      {
        name: "description",
        content:
          "A farm management dashboard built for farmers, with agronomists alongside to provide the context and expertise to turn data into better decisions.",
      },
      { property: "og:title", content: "FarmCloud — A UX Case Study" },
      {
        property: "og:description",
        content:
          "Sole product designer on FarmCloud at Synnefa, serving 5,000+ farmers across 14 countries.",
      },
    ],
  }),
  component: FarmCloud,
});

const meta: MetaRow[] = [
  { label: "Company", value: "Synnefa" },
  { label: "Year", value: "Dec 2023 – Mar 2026" },
  { label: "Role", value: "Sole Product Designer" },
  { label: "Reach", value: "5,000+ farmers · 14 countries" },
];

function FarmCloud() {
  return (
    <CaseStudyHero
      title="FarmCloud"
      meta={meta}
      deck="FarmCloud is a simple farm record keeping platform. It logs all your farm activities, tracks income and expenses, manages your inventory, and connects you to the market."
      image={{
        src: heroImage,
        alt: "FarmCloud dashboard shown on a laptop set in a green field",
        width: 1448,
        height: 1086,
      }}
    />
  );
}
