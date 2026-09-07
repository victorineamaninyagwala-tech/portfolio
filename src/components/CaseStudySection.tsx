import type { ReactNode } from "react";

import { Gutter } from "@/components/primitives";

/*
 * A movement of a case study: its heading on the left, the writing on the right.
 *
 * The text column starts at column 6, the same place the hero puts its facts,
 * so every block down the page hangs off one line. A rule above separates one
 * section from the next.
 */

export function CaseStudySection({
  title,
  media,
  children,
}: {
  title: string;
  /** Sits beside the writing, both starting on the line below the heading. */
  media?: ReactNode;
  children: ReactNode;
}) {
  return (
    <section>
      <Gutter className="border-t border-ink/10 pt-12 pb-16 sm:pt-16 sm:pb-24">
        <div className="grid grid-cols-12">
          <h2 className="col-span-12 type-headline text-right md:col-span-6 md:col-start-7">
            {title}
          </h2>
        </div>
        <div className="mt-10 grid grid-cols-12 gap-y-10 sm:mt-14">
          {media ? <div className="col-span-12 md:col-span-5">{media}</div> : null}
          <div className="col-span-12 space-y-6 md:col-span-6 md:col-start-7">{children}</div>
        </div>
      </Gutter>
    </section>
  );
}

/*
 * A paragraph of case study prose.
 *
 * The measure is capped at 62ch so the line length stays readable on a wide
 * screen, and ml-auto pins the capped block to the right of its column — the
 * cap would otherwise eat into the right edge and the text would no longer
 * line up with the image above it.
 */
export function Prose({ children }: { children: ReactNode }) {
  return <p className="ml-auto max-w-[62ch] type-body-lg text-ink/75">{children}</p>;
}

/*
 * An image inside a section. Passed as `media` it sits at the foot of the
 * heading column, which keeps it out of the reading measure while still
 * belonging to the section.
 */
export function SectionImage({
  src,
  alt,
  caption,
  width,
  height,
}: {
  src: string;
  alt: string;
  caption?: string;
  width: number;
  height: number;
}) {
  return (
    <figure>
      <img src={src} alt={alt} width={width} height={height} className="block w-full" />
      {caption ? (
        <figcaption className="mt-3 type-caption text-ink/60">{caption}</figcaption>
      ) : null}
    </figure>
  );
}
