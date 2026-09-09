import type { ReactNode } from "react";

import { Enclosure, EnclosureCell, Gutter, ImageCard } from "@/components/primitives";

/*
 * The opening block every case study shares: title on the left, the facts and
 * the deck on the right, then the lead image if there is one.
 *
 * One component rather than one per route, so the six pages cannot drift apart
 * as they are filled in.
 */

export type MetaRow = { label: string; value: string };

/** A figure the work is answerable to, and the line that says what it counts. */
export type Outcome = { figure: string; note: string };

export function CaseStudyHero({
  title,
  meta,
  deck,
  note,
  outcomes,
  image,
  media,
  children,
}: {
  title: string;
  meta: MetaRow[];
  deck: string;
  /** Carried on work that was not commissioned. */
  note?: string;
  /** What the work came to, stated up front rather than saved for the end. */
  outcomes?: Outcome[];
  image?: { src: string; alt: string; width: number; height: number };
  /** Leads the page in place of a still, for a case study whose subject moves. */
  media?: ReactNode;
  /** The sections below the lead image. */
  children?: ReactNode;
}) {
  return (
    <main className="bg-paper text-ink">
      <Gutter>
        <header className="grid grid-cols-12 gap-y-12 pt-16 pb-20 sm:pt-24 sm:pb-28">
          <div className="col-span-12 md:col-span-4">
            <h1 className="type-display">{title}</h1>
          </div>

          {/* Starts at col 6, leaving col 5 empty as the gutter to the title. */}
          <div className="col-span-12 md:col-span-4 md:col-start-6">
            <dl className="space-y-5">
              {meta.map((row) => (
                <div key={row.label}>
                  <dt className="type-caption text-ink/60">{row.label}:</dt>
                  <dd className="mt-1.5 type-body text-ink">{row.value}</dd>
                </div>
              ))}
            </dl>

            <p className="mt-16 max-w-[46ch] type-body text-ink/70">{deck}</p>

            {note ? (
              <p className="mt-6 max-w-[46ch] type-caption text-ink/60">{note}</p>
            ) : null}
          </div>
        </header>

        {outcomes ? (
          /* Read before the case study rather than after it, so the numbers
             frame the account instead of arriving as its footnote. */
          <Enclosure columns={4} className="mb-20 sm:mb-28">
            {outcomes.map((outcome) => (
              <EnclosureCell key={outcome.figure} className="py-8 md:py-10">
                <p className="type-headline">{outcome.figure}</p>
                <p className="mt-3 max-w-[24ch] type-caption text-ink/70">{outcome.note}</p>
              </EnclosureCell>
            ))}
          </Enclosure>
        ) : null}

        {media ?? null}

        {image && !media ? (
          <ImageCard
            src={image.src}
            alt={image.alt}
            width={image.width}
            height={image.height}
          />
        ) : null}
      </Gutter>

      {children}
    </main>
  );
}
