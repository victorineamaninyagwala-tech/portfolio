import { createFileRoute } from "@tanstack/react-router";

import { Gutter, Label } from "@/components/primitives";
import { LetterSwapHeading } from "@/components/LetterSwapHeading";
import { MochisMedia } from "@/components/MochisMedia";
import { ProjectMedia } from "@/components/ProjectMedia";
import { WorkHistoryList } from "@/components/WorkHistoryList";
import { projects } from "@/data/projects";
import { shareImage } from "@/lib/share";


/*
 * The one sentence the site makes, with the place in front of it. A meta
 * description has no eyebrow above it, so this is the one place "based in
 * Nairobi" is doing work rather than repeating what the page already said.
 */
const DESCRIPTION =
  "Product designer based in Nairobi, Kenya. My work explores when systems should automate complexity and when they should expose it to support human judgment, accountability, and agency.";

export const Route = createFileRoute("/")({
  head: ({ match }) => ({
    meta: [
      { title: "Victorine Amani · Product Designer, Nairobi" },
      { name: "description", content: DESCRIPTION },
      { property: "og:title", content: "Victorine Amani · Product Designer, Nairobi" },
      { property: "og:description", content: DESCRIPTION },
      ...shareImage(
        match.context.origin,
        "home",
        "Victorine Amani, product designer in Nairobi: when systems should automate complexity and when they should expose it.",
      ),
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

function Index() {
  return (
    <main className="bg-paper text-ink">

      <section>
        <Gutter className="pt-16 pb-14 sm:pt-24 sm:pb-20">
          <Label className="block text-olive">Product Designer · Nairobi</Label>
          {/* One claim, made once. The eyebrow already carries the role and the
              city, so neither is said again below it. Twenty-five words at
              display size wants the whole measure: capped at a reading width
              it runs to six lines, and the claim turns into a wall. */}
          <h1 className="mt-7 type-display">
            My work explores when systems should automate complexity and when they should expose it to support human judgment, accountability, and agency.
          </h1>
          <ul className="mt-9 space-y-1.5 type-label font-semibold text-ink/60">
            <li>Practice · 2023 / Present</li>
            {/* The four disciplines the work actually evidences, and no more:
                a longer list here would claim more than the one claim above. */}
            <li>Focus · Research, systems design, design systems, interface</li>
          </ul>
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
            <Label className="text-ink/60 sm:shrink-0">01 / 06</Label>
          </div>

          <div className="grid grid-cols-1 gap-x-2 gap-y-10 sm:grid-cols-3">
            {projects.map((p) => (
              <a
                key={p.slug}
                href={`/work/${p.slug}`}
                aria-label={`${p.title}, ${p.discipline}`}
                className="group block focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-olive"
                data-cursor="view"
              >
                {/* One still per project for now; only FarmCloud carries a
                    sequence, so only it names a mask to open through, and only
                    Mochi's puts its own homepage together out of its cover. */}
                {p.hover === "assemble" ? (
                  <MochisMedia alt={p.images?.[0]?.alt ?? ""} />
                ) : (
                  <ProjectMedia images={p.images ?? []} maskSrc={p.mask} />
                )}
                <div className="mt-4">
                  {/* Wraps rather than truncating: one title runs to nine words. */}
                  <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
                    <h3 className="type-body font-semibold transition-colors group-hover:text-olive">
                      {p.title}
                    </h3>
                    {p.status ? <Label className="text-olive">{p.status}</Label> : null}
                  </div>
                  <p className="mt-1 type-caption text-ink/70">{p.discipline}</p>
                </div>
              </a>
            ))}
          </div>
        </Gutter>
      </section>

      <section id="about">
        <Gutter>
          <div className="pt-16 pb-16 sm:pt-24 sm:pb-24">
            <WorkHistoryList roles={workHistory} />
          </div>
        </Gutter>
      </section>

    </main>
  );
}
