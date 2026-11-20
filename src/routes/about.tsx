import type { ReactNode } from "react";
import { createFileRoute } from "@tanstack/react-router";

import { Prose } from "@/components/CaseStudySection";
import { CatMark, Gutter, Label, ProseLink } from "@/components/primitives";
import { WorkHistoryList } from "@/components/WorkHistoryList";
import { workHistory } from "@/data/work-history";
import { shareImage } from "@/lib/share";

/*
 * About.
 *
 * The same two columns a case study is read in (a heading on the left, the
 * writing on the right), set quieter. A case study has to argue, so it draws
 * a rule between one section and the next and puts each heading at the
 * headline step. This page is a person, not an argument: the headings come
 * down to the title step and the sections are separated by air instead.
 *
 * The page carries no facts table and no outcomes. The name, the claim under
 * it, three passages and the roles.
 */

/* Her own opening line, word for word as the page says it. It says what the
   work is for, which is what a search result has room for. */
const DESCRIPTION =
  "A Product Designer interested in how technology can absorb complexity and make room for people to do what actually matters.";

export const Route = createFileRoute("/about")({
  head: ({ match }) => ({
    meta: [
      { title: "About · Victorine Amani" },
      { name: "description", content: DESCRIPTION },
      { property: "og:title", content: "About · Victorine Amani" },
      { property: "og:description", content: DESCRIPTION },
      /* The homepage's card until this page has one of its own: it carries her
         name and the same claim, so a link to it previews as her rather than
         as nothing. */
      ...shareImage(
        match.context.origin,
        "home",
        "Victorine Amani, product designer in Nairobi: designing the boundary between human responsibility and technological assistance.",
      ),
    ],
  }),
  component: About,
});

/*
 * One passage: the heading in the left five columns, the writing in the right
 * six, on the same grid line the hero's claim starts on.
 *
 * No rule above it. With the headings this quiet a hairline would be the
 * loudest thing on the page, and the space between passages is doing that work
 * instead.
 *
 * The writing is set wide, so it fills the column it was given rather than
 * stopping short of it and leaving a band of white down the right-hand side.
 * A six-column slot is already a reading measure; capping it again inside
 * itself only makes a gap.
 */
function Passage({
  title,
  mark,
  children,
}: {
  title: string;
  /** A drawing under the heading, in the column the heading leaves empty. */
  mark?: ReactNode;
  children: ReactNode;
}) {
  return (
    <section className="grid grid-cols-12 gap-y-5">
      {/* A grid item stretches to the row, so the heading sits at the top and
          anything under it can be pushed to the foot. Hung off the heading
          instead, a small drawing floats in a column of air with the whole
          passage running past it. */}
      <div className="col-span-12 flex flex-col md:col-span-5">
        <h2 className="type-title">{title}</h2>
        {mark ? <div className="mt-8 sm:mt-10 md:mt-auto md:mb-1">{mark}</div> : null}
      </div>
      <div className="col-span-12 space-y-6 md:col-span-6 md:col-start-7">{children}</div>
    </section>
  );
}
function About() {
  return (
    <main className="bg-paper text-ink">
      <Gutter>
        {/* The name in the left five columns and the claim in the right six,
            the same two columns every case study opens on. */}
        <header className="grid grid-cols-12 gap-y-8 pt-16 sm:pt-24">
          <div className="col-span-12 md:col-span-5">
            {/* No eyebrow. The nav item that got the reader here already said
                About, and the page says the name straight away. */}
            <h1 className="type-display">I&apos;m Amani.</h1>
          </div>
          <div className="col-span-12 md:col-span-6 md:col-start-7 md:self-end">
            {/* The name above already said I am. This finishes that sentence
                rather than starting a second one the same way. */}
            <p className="type-title text-ink/75">
              A Product Designer interested in how technology can absorb complexity and make room
              for people to do what actually matters.
            </p>
          </div>
        </header>

        {/* The separation between passages, and the same gap again above the
            first one, so the hero is a passage's distance from the writing
            rather than sitting on top of it. */}
        <div className="space-y-32 pt-28 pb-28 sm:space-y-48 sm:pt-40 sm:pb-40">
          <Passage title="Who I am">
            <Prose wide>
              I came to product design by way of a short stint in backend development.
            </Prose>
            <Prose wide>
              Over the past few years, I&apos;ve worked on products across different domains, from
              agritech to healthcare. My work has taken me through research, product thinking,
              interaction design and the practical details of getting an idea into something people
              can use.
            </Prose>
            <Prose wide>
              I enjoy working on problems where there is a lot to understand before there is
              anything to draw. I like talking to people, following information through a system,
              questioning assumptions and figuring out where a product can make a process easier to
              navigate.
            </Prose>
          </Passage>

          <Passage title="My vision">
            <Prose wide>
              I want to build technology that makes complicated things easier to live with.
            </Prose>
            <Prose wide>
              There is a lot of complexity in the world that cannot simply be removed. People have
              different needs, organisations have different constraints, and the systems connecting
              them can become complicated very quickly.
            </Prose>
            <Prose wide>
              I&apos;m interested in what technology can take care of in the background: organising
              information, connecting people and processes, making changes visible and carrying
              context forward.
            </Prose>
            <Prose wide>
              The goal is to give people better systems to work with, while leaving room for the
              parts that require human judgement, experience and care.
            </Prose>
          </Passage>

          <Passage title="The other Amani" mark={<CatMark className="h-16 sm:h-20" />}>
            <Prose wide>
              Outside of work, I have a few ways of making sense of the world that have nothing to
              do with product design.
            </Prose>
            <Prose wide>
              I write <ProseLink href="https://thehole27.wordpress.com/">poetry</ProseLink>. I watch
              films and take care of my cat, Sir Gandalf Mochi Amani I.
            </Prose>
          </Passage>

          {/* The roles keep their label rather than taking a heading: they are
              a record attached to the page, not a fourth thing she says. */}
          <section>
            <Label className="block text-ink/50">Roles</Label>
            <div className="mt-8">
              <WorkHistoryList roles={workHistory} />
            </div>
          </section>
        </div>
      </Gutter>
    </main>
  );
}
