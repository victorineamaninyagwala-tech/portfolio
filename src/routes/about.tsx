import { createFileRoute } from "@tanstack/react-router";

import { Gutter, Label } from "@/components/primitives";
import { WorkHistoryList } from "@/components/WorkHistoryList";
import { workHistory } from "@/data/work-history";
import { shareImage } from "@/lib/share";

/*
 * About.
 *
 * It was a section at the foot of the homepage holding one thing, a list of
 * roles, and the footer linked to a /about that did not exist. It is a page
 * now, and the roles have come with it.
 *
 * What it does not yet have is a person in it. That writing is hers, and the
 * page is built so it drops in above the roles without anything else moving:
 * the heading block is its own, and the list is a section under it.
 */

const DESCRIPTION =
  "Victorine Amani Nyagwala, product designer in Nairobi, Kenya. The roles behind the work.";

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
        <div className="pt-16 pb-14 sm:pt-24 sm:pb-20">
          <Label className="block text-olive">About</Label>
          {/* The same step the homepage leads with, and no cap on it. */}
          <h1 className="mt-7 type-display">Victorine Amani</h1>
        </div>
      </Gutter>

      <section>
        <Gutter>
          {/* A rule above, the way every section on a case study opens, so the
              list reads as a part of the page rather than the whole of it. */}
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
