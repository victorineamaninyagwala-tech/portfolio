import { useState } from "react";

/*
 * Work history as a list of expandable rows.
 *
 * One rule per role, the company and title on the left, the dates and a
 * plus on the right. Opening a row closes whichever was open, so only one
 * body is ever on screen; clicking the open row closes it, which is what the
 * plus/cross affordance promises.
 */

export type Role = {
  company: string;
  title: string;
  period: string;
  bullets: string[];
};

/** A plus that becomes a cross — same two strokes, rotated. */
function Toggle({ open }: { open: boolean }) {
  return (
    <svg
      viewBox="0 0 20 20"
      aria-hidden="true"
      className="size-5 shrink-0 transition-transform duration-300 ease-out"
      style={{ transform: `rotate(${open ? 45 : 0}deg)` }}
    >
      <path
        d="M10 3.25V16.75M3.25 10H16.75"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.25"
        strokeLinecap="round"
      />
    </svg>
  );
}

export function WorkHistoryList({ roles }: { roles: Role[] }) {
  // Every role starts closed, so the section opens as a clean index.
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <div>
      {roles.map((role, i) => {
        const open = i === openIndex;

        return (
          <div key={role.company} className="border-t border-ink/10">
            <button
              type="button"
              onClick={() => setOpenIndex(open ? null : i)}
              aria-expanded={open}
              aria-controls={`role-panel-${i}`}
              className="flex w-full items-start justify-between gap-6 py-7 text-left sm:gap-10 sm:py-8"
            >
              <span className="min-w-0">
                <span className="block type-title">
                  {role.company}
                </span>
                <span className="mt-1.5 block type-body text-ink/60">
                  {role.title}
                </span>
              </span>

              {/* Sits on the first line of the company name rather than
                  centred on the whole block. */}
              <span className="flex shrink-0 items-center gap-5 pt-1 sm:gap-8">
                <span className="type-body whitespace-nowrap text-ink/60">
                  {role.period}
                </span>
                <span className={open ? "text-ink" : "text-ink/70"}>
                  <Toggle open={open} />
                </span>
              </span>
            </button>

            {/* Animating grid-template-rows opens to the natural height
                without measuring it. */}
            <div
              id={`role-panel-${i}`}
              className="grid transition-[grid-template-rows] duration-500 ease-out"
              style={{ gridTemplateRows: open ? "1fr" : "0fr" }}
            >
              <div className="overflow-hidden">
                <div className="pb-10">
                  <ul className="space-y-4">
                    {role.bullets.map((bullet) => (
                      <li key={bullet} className="flex gap-4">
                        {/* Nudged onto the first line's optical centre. */}
                        <span
                          aria-hidden="true"
                          className="mt-[0.62em] size-1.5 shrink-0 rounded-full bg-ink/30"
                        />
                        <span className="max-w-[86ch] type-body-lg text-ink/75">
                          {bullet}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
