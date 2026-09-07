import { createFileRoute } from "@tanstack/react-router";

import heroImage from "@/assets/farmcloud-hero.webp";
import legacyImage from "@/assets/farmcloud-legacy.webp";
import { CaseStudyHero, type MetaRow } from "@/components/CaseStudyHero";
import { CaseStudySection, Prose, SectionImage } from "@/components/CaseStudySection";

export const Route = createFileRoute("/work/farmcloud")({
  head: () => ({
    meta: [
      { title: "FarmCloud · A UX Case Study by Victorine Amani" },
      {
        name: "description",
        content:
          "A farm management dashboard built for farmers, with agronomists alongside to provide the context and expertise to turn data into better decisions.",
      },
      { property: "og:title", content: "FarmCloud · A UX Case Study" },
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
    >
      <CaseStudySection
        title="Why it was rebuilt"
        media={
          <SectionImage
            src={legacyImage}
            alt="The legacy FarmCloud dashboard: a farm overview beside a farm list"
            caption="The legacy system."
            width={615}
            height={246}
          />
        }
      >
        <Prose>
          Onboarding ran through agents. A farmer was signed up in person, by staff, and
          self-onboarding barely happened.
        </Prose>
        <Prose>
          The system did not carry Synnefa&apos;s branding or its tone either, so the product a
          farmer used did not read as the company&apos;s own.
        </Prose>
        <Prose>
          And once a farmer was onboarded, they did not come back. Farmers simply stopped
          using it after sign-up. It was a shell.
        </Prose>
      </CaseStudySection>
    </CaseStudyHero>
  );
}
