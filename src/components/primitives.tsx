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
 * The frame.
 *
 * Every picture, screen and held box on the site sits in one of these, so they
 * are all the same shape and the same ground. It is held at 4:3 and capped to
 * the viewport, so a reader takes a whole frame in without scrolling.
 *
 * Two sizes: `full` spans the content column, `half` sits in a two-up grid and
 * so needs a smaller share of the screen. A frame holding something of another
 * shape entirely — a phone, say — can name its own ratio; everything else about
 * it stays one edit here.
 */
export const FRAME_RATIO = "4 / 3";

const FRAME_MAX_HEIGHT = { full: "88vh", half: "56vh" } as const;

export type FrameSize = keyof typeof FRAME_MAX_HEIGHT;

export function Frame({
  size = "full",
  ratio = FRAME_RATIO,
  fit = "width",
  className,
  style,
  children,
  ref,
  ...rest
}: {
  size?: FrameSize;
  /** The frame's shape. Defaults to the one the whole site uses. */
  ratio?: string;
  /**
   * Which side the frame takes its measure from. A landscape frame fills the
   * column and lets the cap trim its height; a portrait one is the other way
   * round, since filling the column would make a phone taller than the page.
   */
  fit?: "width" | "height";
  className?: string;
  children?: ReactNode;
  /** So a caller can measure or scroll the frame it owns. */
  ref?: React.Ref<HTMLDivElement>;
} & Omit<React.HTMLAttributes<HTMLDivElement>, "children" | "className">) {
  return (
    <div
      ref={ref}
      className={cn(
        "overflow-hidden rounded-lg bg-ground",
        fit === "width" ? "w-full" : "mx-auto max-w-full",
        className,
      )}
      style={
        fit === "width"
          ? { aspectRatio: ratio, maxHeight: FRAME_MAX_HEIGHT[size], ...style }
          : { aspectRatio: ratio, height: FRAME_MAX_HEIGHT[size], ...style }
      }
      {...rest}
    >
      {children}
    </div>
  );
}

/**
 * A picture in a frame. The frame governs the shape, so a picture of another
 * shape is cropped to fill it rather than shrinking inside it.
 */
export function ImageCard({
  src,
  alt,
  width,
  height,
  size = "full",
  className,
}: {
  src: string;
  alt: string;
  width: number;
  height: number;
  size?: FrameSize;
  className?: string;
}) {
  return (
    <Frame size={size} className={className}>
      <img
        src={src}
        alt={alt}
        width={width}
        height={height}
        className="size-full object-cover"
      />
    </Frame>
  );
}
