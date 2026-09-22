import type { ReactNode } from "react";

import { Label } from "@/components/primitives";
import { cn } from "@/lib/utils";

/*
 * The diagram kit.
 *
 * A case study argues in pictures as well as prose, and the pictures have to
 * be the site's pictures: ink boxes on the same ground the screens sit on, set
 * in the same type steps, square-cornered because --radius is zero. Nothing
 * here carries a size, a colour or a font of its own.
 *
 * These are laid out in HTML rather than drawn in SVG. A diagram built from
 * boxes and rules reflows on a phone, keeps its text selectable and readable
 * by a screen reader, and inherits the type scale — none of which survives
 * being flattened into a picture. The only SVG is the arrowheads.
 *
 * A diagram is not a frame: Frame holds a picture at the site's 4:3 and crops
 * to fill, which is right for a screen and wrong for a drawing that should be
 * as tall as it needs to be. A Diagram takes the ground and the corner and
 * lets its content set its height.
 */

export function Diagram({
  label,
  className,
  children,
}: {
  /** Names what the drawing is, for a reader skimming the page. */
  label?: string;
  className?: string;
  children: ReactNode;
}) {
  return (
    <figure className={cn("rounded-lg bg-ground px-6 py-10 sm:px-10 sm:py-14", className)}>
      {label ? (
        <figcaption className="mb-10 text-center">
          <Label className="text-ink/50">{label}</Label>
        </figcaption>
      ) : null}
      {children}
    </figure>
  );
}

/*
 * One box. `tone` is the only choice: a plain node, the one the drawing is
 * about, or one that is named but not built.
 */
export function Node({
  title,
  note,
  tone = "plain",
  className,
}: {
  title: string;
  note?: string;
  tone?: "plain" | "subject" | "deferred";
  className?: string;
}) {
  return (
    <div
      className={cn(
        "rounded-lg border px-5 py-4 text-center",
        tone === "subject" && "border-ink bg-ink text-paper",
        tone === "plain" && "border-ink/25 bg-paper text-ink",
        /* Dashed and dimmed: on the page, the part that was designed and not
           built. It has to read as absent without disappearing. */
        tone === "deferred" && "border-ink/25 border-dashed bg-transparent text-ink/45",
        className,
      )}
    >
      <p className={cn("type-label font-semibold", tone === "plain" && "text-ink")}>{title}</p>
      {note ? (
        <p
          className={cn(
            "mt-2 type-caption",
            tone === "subject" ? "text-paper/70" : tone === "deferred" ? "text-ink/40" : "text-ink/60",
          )}
        >
          {note}
        </p>
      ) : null}
    </div>
  );
}

/*
 * The connector. Down the page on a phone whatever the drawing intends, since
 * a row of four boxes becomes a column of four long before the arrow between
 * them has room to point sideways.
 */
export function Arrow({
  direction = "down",
  label,
  className,
}: {
  direction?: "down" | "up" | "right";
  /** A word on the arrow — "consent", "by hand" — set beside the line. */
  label?: string;
  className?: string;
}) {
  const head =
    direction === "right" ? (
      <svg viewBox="0 0 24 8" className="h-2 w-6" aria-hidden="true">
        <path d="M0 4h22M18 1l4 3-4 3" fill="none" stroke="currentColor" strokeWidth="1" />
      </svg>
    ) : (
      <svg viewBox="0 0 8 24" className="h-6 w-2" aria-hidden="true">
        <path
          d={direction === "down" ? "M4 0v22M1 18l3 4 3-4" : "M4 24V2M1 6l3-4 3 4"}
          fill="none"
          stroke="currentColor"
          strokeWidth="1"
        />
      </svg>
    );

  return (
    <div
      className={cn(
        "flex items-center justify-center gap-2 text-ink/40",
        direction === "right" ? "px-1" : "py-1",
        className,
      )}
      aria-hidden="true"
    >
      {head}
      {label ? <span className="type-caption text-ink/50">{label}</span> : null}
    </div>
  );
}

/*
 * A row that becomes a column. Used for the domains around a patient and for
 * any set of peers that are read together rather than in order.
 */
export function Row({
  columns = 4,
  className,
  children,
}: {
  columns?: 2 | 3 | 4 | 5;
  className?: string;
  children: ReactNode;
}) {
  return (
    <div
      className={cn(
        "grid gap-3",
        columns === 2 && "sm:grid-cols-2",
        columns === 3 && "sm:grid-cols-3",
        columns === 4 && "sm:grid-cols-2 lg:grid-cols-4",
        columns === 5 && "sm:grid-cols-2 lg:grid-cols-5",
        className,
      )}
    >
      {children}
    </div>
  );
}

/*
 * A sequence read in order, with an arrow between each pair. Horizontal where
 * there is room, and down the page where there is not.
 */
export function Sequence({
  steps,
  className,
}: {
  steps: Array<{ title: string; note?: string; tone?: "plain" | "subject" | "deferred" }>;
  className?: string;
}) {
  return (
    <div className={cn("flex flex-col items-stretch lg:flex-row lg:items-center", className)}>
      {steps.map((step, i) => (
        <div key={step.title} className="contents">
          <div className="lg:flex-1">
            <Node title={step.title} note={step.note} tone={step.tone} />
          </div>
          {i < steps.length - 1 ? (
            <>
              <Arrow className="lg:hidden" />
              <Arrow direction="right" className="hidden lg:flex" />
            </>
          ) : null}
        </div>
      ))}
    </div>
  );
}

/*
 * A stack read from the bottom up, each layer resting on the one below and
 * pointing at the one above. The layer's own nouns sit under its name, because
 * a layer with nothing in it is a label rather than an argument.
 */
export function Stack({
  layers,
  className,
}: {
  /** Given top-down, as they are read on the page, and drawn that way. */
  layers: Array<{ name: string; contents: string[]; note?: string }>;
  className?: string;
}) {
  return (
    <div className={cn("mx-auto max-w-[62ch]", className)}>
      {layers.map((layer, i) => (
        <div key={layer.name}>
          <div className="rounded-lg border border-ink/25 bg-paper px-6 py-7 text-center">
            <p className="type-title">{layer.name}</p>
            <p className="mt-3 type-caption text-ink/60">{layer.contents.join(" · ")}</p>
            {layer.note ? <p className="mt-2 type-caption text-ink/45">{layer.note}</p> : null}
          </div>
          {/* Pointing up the page: each layer is carried by the one beneath. */}
          {i < layers.length - 1 ? <Arrow direction="up" /> : null}
        </div>
      ))}
    </div>
  );
}

/*
 * A matrix. One column of row headings and any number of value columns, with
 * the columns that carry the argument marked so the eye goes there first.
 */
export function Matrix({
  columns,
  rows,
  highlight = [],
  className,
}: {
  columns: string[];
  rows: Array<{ heading: string; cells: string[] }>;
  /** Row headings to mark — the dimensions that decided something. */
  highlight?: string[];
  className?: string;
}) {
  return (
    <div className={cn("overflow-x-auto", className)}>
      <table className="w-full min-w-[34rem] border-collapse text-left">
        <thead>
          <tr>
            <th scope="col" className="pb-3 pr-6 type-label font-semibold text-ink/50">
              <span className="sr-only">Dimension</span>
            </th>
            {columns.map((column) => (
              <th
                key={column}
                scope="col"
                className="pb-3 pl-4 text-right type-label font-semibold text-ink/50"
              >
                {column}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, r) => {
            const marked = highlight.includes(row.heading);
            const rule = r === rows.length - 1 ? "border-y" : "border-t";
            return (
              <tr key={row.heading}>
                <th
                  scope="row"
                  className={cn(
                    rule,
                    "border-ink/15 py-3.5 pr-6 type-body",
                    /* A marked row is lifted off the ground as well as set in
                       the darker weight: on a tinted panel, weight alone is
                       not enough to carry across nine rows. */
                    marked ? "bg-cream pl-4 font-semibold text-ink" : "text-ink/70",
                  )}
                >
                  {row.heading}
                </th>
                {row.cells.map((cell, i) => (
                  <td
                    key={columns[i]}
                    className={cn(
                      rule,
                      "border-ink/15 py-3.5 pl-4 text-right type-body",
                      marked ? "bg-cream pr-4 font-semibold text-ink" : "text-ink/60",
                    )}
                  >
                    {cell}
                  </td>
                ))}
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
