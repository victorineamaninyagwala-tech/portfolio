import type { ReactNode } from "react";

import { Gutter, ImageCard, Label } from "@/components/primitives";

/*
 * A movement of a case study: its heading on the left, the writing on the right.
 *
 * The text column starts at column 6, the same place the hero puts its facts,
 * so every block down the page hangs off one line. A rule above separates one
 * section from the next.
 */

export function CaseStudySection({
  title,
  align = "left",
  media,
  figure,
  children,
}: {
  title: string;
  /** The page title is set left, so sections follow it unless one is
   *  deliberately hung off the right edge. */
  align?: "left" | "right";
  /** Sits beside the writing, both starting on the line below the heading. */
  media?: ReactNode;
  /** Runs the full content width below both columns, for artwork the reading
   *  column is too narrow to carry. */
  figure?: ReactNode;
  /** Optional: a section can be carried by its figure alone. */
  children?: ReactNode;
}) {
  return (
    <section>
      {/* The rule sits inside the gutter, so it starts and ends on the same
          line as the writing and the figures rather than running to the edge
          of the screen. */}
      <Gutter>
        <div className="border-t border-ink/10 pt-12 pb-16 sm:pt-16 sm:pb-24">
          <div className="grid grid-cols-12">
            <h2
              className={
                align === "right" && media
                  ? "col-span-12 type-headline text-right md:col-span-6 md:col-start-7"
                  : align === "right"
                    ? "col-span-12 type-headline text-right"
                    : "col-span-12 type-headline"
              }
            >
              {title}
            </h2>
          </div>
          {children ? (
            <div className="mt-10 grid grid-cols-12 gap-y-10 sm:mt-14">
              {media ? (
                <>
                  <div className="col-span-12 md:col-span-5">{media}</div>
                  <div className="col-span-12 space-y-6 md:col-span-6 md:col-start-7">
                    {children}
                  </div>
                </>
              ) : (
                <div className="col-span-12 gap-x-16 gap-y-10 md:columns-2 [&>*]:break-inside-avoid [&>*:not(:first-child)]:mt-10">
                  {children}
                </div>
              )}
            </div>
          ) : null}
          {figure ? (
            <div className={children ? "mt-12 sm:mt-16" : "mt-10 sm:mt-14"}>{figure}</div>
          ) : null}
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
  card = false,
}: {
  src: string;
  alt: string;
  caption?: string;
  width: number;
  height: number;
  /** Renders in the same card as the lead image: same width, same height, the
   *  picture cropped to fill it. */
  card?: boolean;
}) {
  return (
    <figure>
      {card ? (
        <ImageCard src={src} alt={alt} width={width} height={height} />
      ) : (
        <img src={src} alt={alt} width={width} height={height} className="block w-full" />
      )}
      {caption ? (
        <figcaption className="mt-3 type-caption text-ink/60">{caption}</figcaption>
      ) : null}
    </figure>
  );
}

/*
 * A labelled block of points rather than a paragraph, so a section can be
 * skimmed. The eyebrow names the question; the list answers it.
 */
export function FactList({ label, items }: { label: string; items: string[] }) {
  return (
    <div>
      <Label className="text-olive">{label}</Label>
      <ul className="mt-4 space-y-2.5">
        {items.map((item) => (
          <li key={item} className="flex gap-3">
            {/* Nudged onto the first line's optical centre. */}
            <span aria-hidden="true" className="mt-[0.6em] size-1 shrink-0 rounded-full bg-ink/30" />
            <span className="max-w-[58ch] type-body text-ink/75">{item}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
