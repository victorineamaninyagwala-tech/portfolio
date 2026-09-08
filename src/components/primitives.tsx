import type { ReactNode } from "react";

import { cn } from "@/lib/utils";

/*
 * The small pieces the pages are assembled from.
 *
 * Anything that appears in more than one place lives here, so a change to the
 * page margin, a link, a chip or a bordered panel is one edit rather than a
 * search across routes.
 *
 * Type comes from the type-* scale and colour from the ink/paper/olive tokens,
 * both in styles.css. Corners come from --radius via rounded-lg — set that one
 * value and every box on the site rounds together.
 */

/**
 * The page margin. Every section, the header and the footer sit inside one of
 * these, which is what keeps the left edge of a case study aligned with the
 * left edge of the homepage grid.
 */
export function Gutter({ className, children }: { className?: string; children: ReactNode }) {
  return <div className={cn("px-4 sm:px-8 lg:px-10", className)}>{children}</div>;
}

/**
 * The uppercase micro-label: eyebrows, column headings, counters, the
 * copyright line. Pass a colour in className; the dot is the olive marker used
 * beside headings.
 */
export function Label({
  dot,
  className,
  children,
}: {
  dot?: boolean;
  className?: string;
  children: ReactNode;
}) {
  return (
    <span className={cn("type-label font-semibold", dot && "flex items-center gap-2", className)}>
      {dot ? <span aria-hidden="true" className="size-1.5 rounded-full bg-olive" /> : null}
      {children}
    </span>
  );
}

/**
 * A text link with the sliding arrow. Colour is inherited, so the same link
 * reads correctly in the nav, a footer column or body copy.
 */
export function TextLink({
  href,
  className,
  children,
  ...rest
}: { href: string; className?: string; children: ReactNode } & Omit<
  React.AnchorHTMLAttributes<HTMLAnchorElement>,
  "href" | "className" | "children"
>) {
  return (
    <a href={href} className={cn("hover-arrow", className)} {...rest}>
      {children}
    </a>
  );
}

/** A bordered chip — availability, status, anything short and enumerable. */
export function Pill({ className, children }: { className?: string; children: ReactNode }) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-lg border border-ink/25 px-2.5 py-1.5 type-caption font-semibold leading-none text-ink/70",
        className,
      )}
    >
      {children}
    </span>
  );
}

/**
 * The bordered panel of equal columns used by the capability groups and the
 * footer. Cells draw their own dividers, so the count can change without
 * touching the borders.
 */
export function Enclosure({
  columns,
  className,
  children,
}: {
  columns: 3 | 4;
  className?: string;
  children: ReactNode;
}) {
  return (
    <div
      className={cn(
        "grid grid-cols-1 rounded-lg border border-ink/10",
        columns === 3 ? "md:grid-cols-3" : "md:grid-cols-4",
        className,
      )}
    >
      {children}
    </div>
  );
}

/**
 * One cell of an Enclosure. Stacked on small screens with a rule above each,
 * side by side above md with a rule to the left — the first cell suppresses
 * both, so no index needs to be passed in.
 */
export function EnclosureCell({ className, children }: { className?: string; children: ReactNode }) {
  return (
    <div
      className={cn(
        "border-t border-ink/10 px-6 first:border-t-0 md:border-t-0 md:border-l md:border-ink/10 md:px-8 md:first:border-l-0",
        className,
      )}
    >
      {children}
    </div>
  );
}

/**
 * The full-bleed picture card.
 *
 * Every one is the same box: the full width of the column, held at 4:3, and
 * capped to the viewport so a reader takes the whole card in without
 * scrolling. The picture fills it corner to corner, which means a picture of a
 * different shape is cropped to the card rather than shrinking inside it.
 *
 * The ratio and the cap live here, so a case study's lead image and its figures
 * are literally the same size.
 */
export const CARD_RATIO = "4 / 3";
export const CARD_MAX_HEIGHT = "88vh";

export function ImageCard({
  src,
  alt,
  width,
  height,
  className,
}: {
  src: string;
  alt: string;
  width: number;
  height: number;
  className?: string;
}) {
  return (
    <div
      className={cn("w-full overflow-hidden", className)}
      style={{ aspectRatio: CARD_RATIO, maxHeight: CARD_MAX_HEIGHT }}
    >
      <img
        src={src}
        alt={alt}
        width={width}
        height={height}
        className="size-full object-cover"
      />
    </div>
  );
}
