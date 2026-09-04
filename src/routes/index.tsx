import { createFileRoute } from "@tanstack/react-router";

import synnefaMark from "@/assets/synnefa-mark.svg";
import { Enclosure, EnclosureCell, Gutter, Label } from "@/components/primitives";
import { LetterSwapHeading } from "@/components/LetterSwapHeading";
import { ProjectMedia } from "@/components/ProjectMedia";
import { WorkHistoryList } from "@/components/WorkHistoryList";
import { projects } from "@/data/projects";


export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Victorine Amani — Product Designer, Nairobi" },
      {
        name: "description",
        content:
          "Victorine Amani is a product designer in Nairobi working on product systems, mobile interfaces and research for fintech, health and mobility teams.",
      },
      { property: "og:title", content: "Victorine Amani — Product Designer, Nairobi" },
      {
        property: "og:description",
        content:
          "Selected product design work: lending, health, utilities and design systems. Based in Nairobi, Kenya.",
      },
    ],
  }),
  component: Index,
});



const workHistory = [
  {
    company: "Synnefa",
    title: "Sole Product Designer",
    period: "Dec 2023 – Mar 2026",
    bullets: [
      "Sole designer on a cross-functional team building a farm management platform serving 5,000+ farmers across 14 African countries.",
      "Structured the product around the crop lifecycle, rebuilt onboarding from 10% to 70% success, and originated the Market Linkage feature from field research.",
    ],
  },
  {
    company: "SoulShape",
    title: "Product Designer (Independent Project)",
    period: "April 2026",
    bullets: [
      "A problem-led design project examining why coordinated weight-loss care fails structurally.",
      "Built the evidence base from peer-reviewed research and policy, then designed a Signal Layer and Program Model aligned with the Kenya Digital Health Act 2023.",
    ],
  },
  {
    company: "Brrng",
    title: "Backend Developer Intern",
    period: "Mar 2022 – May 2022",
    bullets: [
      "Early exposure to engineering workflows, system architecture, and technical debugging alongside a lead backend developer.",
      "Gave me a working model of how engineers think that still shapes how I collaborate and scope today.",
    ],
  },
];

const capabilities = [
  {
    n: "01",
    label: "Research & Strategy",
    items: [
      "User Experience (UX) Research",
      "Product Strategy",
      "Growth Design",
      "Service Design",
      "Information Architecture (IA)",
    ],
  },
  {
    n: "02",
    label: "Systems & Operations",
    items: ["Systems Design", "Design Systems Engineering", "Design Engineering"],
  },
  {
    n: "03",
    label: "Interface & Experience Design",
    items: ["Interaction Design (IxD)", "User Interface (UI) Design"],
  },
  {
    n: "04",
    label: "Specialized & Emerging Tech",
    items: ["AI & Algorithmic Experience Design", "Data Visualization"],
  },
];

function Index() {
  return (
    <main className="bg-paper text-ink">

      <section>
        <Gutter className="pt-16 pb-14 sm:pt-24 sm:pb-20">
          <Label className="block text-olive">Product Designer — Nairobi</Label>
          <h1 className="mt-7 type-display">
            Designing the boundary between human responsibility and technological assistance
          </h1>
          <div className="mt-9 flex flex-col gap-8 sm:flex-row sm:items-end sm:justify-between sm:gap-12">
            <p className="type-body-lg text-ink/70">
              My work explores when systems should automate complexity and when they should expose it to support human judgment, accountability, and agency.
            </p>
            <ul className="space-y-1.5 type-label font-semibold text-ink/60 sm:shrink-0">
              <li>Practice — 2023 / Present</li>
              <li>Focus — Systems &amp; mobile</li>
              <li>Base — Nairobi, KE</li>
            </ul>
          </div>
        </Gutter>
      </section>

      <section id="work">
        <Gutter className="py-14 sm:py-20">
          <div className="mb-8 flex items-baseline justify-between gap-6 sm:mb-10">
            <LetterSwapHeading
              text="Selected Work"
              data-cursor="view"
              data-cursor-label=""
              className="letter-swap type-display"
            />
            <Label className="text-ink/60 sm:shrink-0">01 — 06</Label>
          </div>

          <div className="grid grid-cols-1 gap-x-2 gap-y-10 sm:grid-cols-3">
            {projects.map((p) => (
              <a
                key={p.slug}
                href={`/work/${p.slug}`}
                aria-label={`${p.title} — ${p.discipline}`}
                className="group block focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-olive"
                data-cursor="view"
              >
                {/* Projects without artwork yet fall back to an empty well. */}
                <ProjectMedia images={p.images ?? []} maskSrc={p.images ? synnefaMark : undefined}>
                  {p.status ? (
                    <Label className="absolute top-3 left-3 bg-paper/80 px-2.5 py-1 text-olive">
                      {p.status}
                    </Label>
                  ) : null}
                </ProjectMedia>
                <div className="mt-4">
                  <h3 className="type-body font-semibold transition-colors group-hover:text-olive">
                    {p.title}
                  </h3>
                  <p className="mt-1 type-caption text-ink/70">{p.discipline}</p>
                </div>
              </a>
            ))}
          </div>
        </Gutter>
      </section>

      <section id="about">
        <Gutter>
          <div className="pt-16 pb-14 sm:pt-24 sm:pb-20">
            <WorkHistoryList roles={workHistory} />
          </div>

          <Enclosure columns={4}>
            {capabilities.map((f) => (
              <EnclosureCell key={f.label} className="py-9 md:py-12">
                <Label dot className="text-ink/60">
                  {f.n}
                </Label>
                <dt className="mt-8 type-title md:min-h-[4.5em]">
                  {f.label}
                </dt>
                <dd className="mt-4 space-y-1.5 type-body text-ink">
                  {f.items.map((item) => (
                    <div key={item}>{item}</div>
                  ))}
                </dd>
              </EnclosureCell>
            ))}
          </Enclosure>

          <div className="pb-16 sm:pb-24" />
        </Gutter>
      </section>

    </main>
  );
}
