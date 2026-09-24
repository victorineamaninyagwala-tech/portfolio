import { createFileRoute } from "@tanstack/react-router";

import { Movement, Prose } from "@/components/CaseStudySection";
import { Gutter, Label } from "@/components/primitives";
import { WorkHistoryList } from "@/components/WorkHistoryList";
import { workHistory } from "@/data/work-history";
import { shareImage } from "@/lib/share";

/*
 * About.
 *
 * Her writing, in the grammar the case studies are already read in: a heading
 * in the left column, the writing in the right, a rule between one movement
 * and the next. The page is a person rather than a project, so it carries no
 * facts table and no outcomes — the name, the claim under it, three movements
 * and the roles.
 */

/* Her own opening line. It says what the work is for, which is what a search
   result has room for. */
const DESCRIPTION =
  "I'm a Product Designer interested in how technology can absorb complexity and make room for people to do what actually matters.";

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

function About() {
  return (
    <main className="bg-paper text-ink">
      <Gutter>
        {/* The name in the left five columns and the claim in the right six,
            the same two columns every case study opens on. The claim is set
            to the foot of the row so it finishes on the name's line rather
            than floating above it. */}
        <header className="grid grid-cols-12 gap-y-8 pt-16 pb-14 sm:pt-24 sm:pb-20">
          <div className="col-span-12 md:col-span-5">
            <Label className="block text-olive">About</Label>
            <h1 className="mt-7 type-display">I&apos;m Amani.</h1>
          </div>
          <div className="col-span-12 md:col-span-6 md:col-start-7 md:self-end">
            <p className="type-title text-ink/75">
              I&apos;m a Product Designer interested in how technology can absorb complexity and
              make room for people to do what actually matters.
            </p>
          </div>
        </header>
      </Gutter>

      <Movement title="Who I am">
        <Prose>
          I started my career in tech with a background in software development before finding my
          way into product design.
        </Prose>
        <Prose>
          Over the past few years, I&apos;ve worked on products across different domains, from
          agritech to healthcare. My work has taken me through research, product thinking,
          interaction design and the practical details of getting an idea into something people
          can use.
        </Prose>
        <Prose>
          I enjoy working on problems where there is a lot to understand before there is anything
          to draw. I like talking to people, following information through a system, questioning
          assumptions and figuring out where a product can make a process easier to navigate.
        </Prose>
        <Prose>
          These days, I&apos;m particularly interested in product work that sits somewhere between
          design, technology and the way a business actually operates.
        </Prose>
      </Movement>

      <Movement title="My vision">
        <Prose>I want to build technology that makes complicated things easier to live with.</Prose>
        <Prose>
          There is a lot of complexity in the world that cannot simply be removed. People have
          different needs, organisations have different constraints, and the systems connecting
          them can become complicated very quickly.
        </Prose>
        <Prose>
          I&apos;m interested in what technology can take care of in the background: organising
          information, connecting people and processes, making changes visible and carrying
          context forward.
        </Prose>
        <Prose>
          The goal is to give people better systems to work with, while leaving room for the parts
          that require human judgement, experience and care.
        </Prose>
      </Movement>

      <Movement title="The other Amani">
        <Prose>
          Outside of work, I have a few ways of making sense of the world that have nothing to do
          with product design.
        </Prose>
        <Prose>
          I write poetry. I watch films and get attached to stories and characters. I take care of
          my cat, which is mostly a very elaborate arrangement in which he allows me to live in
          his house.
        </Prose>
        <Prose>
          There are also days when I just want to read, make something, watch something good, or
          sit with an idea for a while without needing to turn it into anything.
        </Prose>
        <Prose>
          Work is a big part of my life, but it isn&apos;t the whole thing.
        </Prose>
      </Movement>

      <section>
        <Gutter>
          {/* A rule above, the way every movement above it opens, so the list
              reads as a part of the page rather than the whole of it. */}
          <div className="border-t border-ink/10 pt-12 pb-16 sm:pt-16 sm:pb-24">
            <Label className="block text-ink/50">Roles</Label>
            <div className="mt-8">
              <WorkHistoryList roles={workHistory} />
            </div>
          </div>
        </Gutter>
      </section>
    </main>
  );
}
