import { useEffect, useRef, useState } from "react";
import { createIsomorphicFn } from "@tanstack/react-start";
import { getCookie } from "@tanstack/react-start/server";

import watering from "@/assets/deck-1-watering.webp";
import runner from "@/assets/deck-2-runner.webp";
import cafe from "@/assets/deck-3-cafe.webp";
import dashboard from "@/assets/deck-4-dashboard.webp";
import mochisHome from "@/assets/deck-5-mochis-home.webp";
import field from "@/assets/deck-6-field.webp";

/*
 * The preloader: what a visitor sees for the first three seconds of a first
 * visit, before the site.
 *
 * On the site's own paper, at the centre of the screen: a deck of the work's
 * pictures flips through at a clip and shrinks away, and the initials are
 * drawn in its place — then the sheet lifts, and the page is underneath. The
 * background is white throughout; nothing goes dark and comes back.
 *
 * The initials are two lines. Both set off from the centre of the mark: the
 * V's from its top, falling to the point and rising again to the far corner;
 * the A's from its bottom, rising to the apex and falling to the far foot.
 * They draw outward together and finish as the letters. The A has no crossbar
 * — it is the V's line, the other way up.
 *
 * It plays once per visit. When it has, a cookie says so for the next few
 * hours, and the server reads that cookie and renders the root already marked
 * — so on the next load, in this tab or a new one, the panel is never painted
 * at all, with no script in the head to make it so and nothing to flash. The
 * cookie has a fixed life rather than a browser session's, because browsers
 * that reopen where they left off keep session cookies alive for days, and
 * someone coming back tomorrow should see the opening again. It does
 * not play for a reader who has asked for reduced motion, and without
 * JavaScript it is not shown at all — the page is server-rendered underneath
 * it and must never depend on a script to become visible.
 *
 * It sits beneath the custom cursor. The system cursor is hidden site-wide, so
 * a panel drawn above the disc would leave the visitor with no pointer at all
 * for the duration.
 *
 * And it cannot strand anyone. If the client bundle never arrives — blocked,
 * failed, or simply slow — nothing here ever runs, so the stylesheet carries a
 * bail-out of its own: after a fixed number of seconds the panel lifts on a
 * CSS animation with no script involved. Should the script then turn up late,
 * it sees that the deadline has passed and stands down rather than locking a
 * page that is already showing.
 */

/** The cookie set once the sequence has played. */
export const PRELOADED_KEY = "preloaded";
/** How long that holds: long enough to cover one visit, and no longer. */
const PRELOADED_FOR_SECONDS = 4 * 60 * 60;
/** The class the root shell renders on <html> when that cookie is present. */
export const PRELOADED_CLASS = "preloaded";

/**
 * Whether the sequence has already played this session — read off the request
 * on the server and off the document in the browser, so the shell renders the
 * same answer in both places and hydration has nothing to reconcile.
 */
export const hasPreloaded = createIsomorphicFn()
  .server(() => getCookie(PRELOADED_KEY) === "1")
  .client(() => document.cookie.split("; ").includes(`${PRELOADED_KEY}=1`));

/** Remember that it has played, for the rest of this visit. */
const markPreloaded = () => {
  try {
    document.cookie = `${PRELOADED_KEY}=1; path=/; max-age=${PRELOADED_FOR_SECONDS}; SameSite=Lax`;
  } catch {
    /* Cookies off: it will simply play again. */
  }
};

/** Six of the work's own pictures, drawn once at the 3:2 the deck shows them
 *  at — a fraction of the covers' weight, which matters here more than
 *  anywhere: these load ahead of the page they are standing in front of. */
const DECK = [watering, runner, cafe, dashboard, mochisHome, field];

/*
 * The mark, in a 191 × 121 box. Each letter is one polyline; the order of its
 * points is the order it is drawn in, which is what makes both lines set off
 * from the middle of the mark and travel outward.
 *
 * The two letters are the same shape, but a mitred point overshoots the
 * corner it turns at by 18.2 units, while a butt end overshoots its corner by
 * only 2.7 — so a V and an A whose corners sat at the same heights would not
 * share a top or a bottom of ink. These corners are placed so the ink does:
 * both letters run from 2 to 118.9 on the page, exactly.
 */
const V_LINE = "M 90 4.69 L 50 100.69 L 10 4.69";
const A_LINE = "M 98 116.2 L 138 20.2 L 178 116.2";
const MARK_BOX = "0 0 191 121";

/* One beat of the sequence, in milliseconds. */
const FLIP = 120; // each card
const HOLD = 250; // on the last card
const DISMISS = 350; // the deck shrinks away
const LEAD = 100; // the initials begin before the deck has quite gone
const DRAW = 800; // the two lines are drawn
const READ = 700; // and the letters are held
const LEAVE = 350; // the letters shrink away
const GAP = 50;
const LIFT = 750; // the sheet goes up and off

/* How long to wait for the deck's pictures before flipping regardless. The
   deck is the loading indicator, so it must not itself show blanks while it
   loads — but nor should one slow picture hold the whole site hostage. */
const DECK_GRACE = 1200;
/* The stylesheet's own deadline, after which it lifts the panel with no
   script involved. Must match the animation delay on .preloader. */
const BAIL_MS = 7000;

type Phase = "deck" | "dismiss" | "initials" | "leave" | "slide" | "done";

export function Preloader() {
  const [phase, setPhase] = useState<Phase>("deck");
  const [card, setCard] = useState(0);
  const panel = useRef<HTMLDivElement>(null);
  const deck = useRef<HTMLDivElement>(null);
  const timers = useRef<Array<ReturnType<typeof setTimeout>>>([]);

  useEffect(() => {
    /* Already played this session, the reader has asked for stillness, or the
       stylesheet's deadline has been and gone while the script was still on
       its way: the panel is hidden, or already leaving, so just get out of
       the way without ever locking the page. */
    const skip =
      hasPreloaded() ||
      document.documentElement.classList.contains(PRELOADED_CLASS) ||
      window.matchMedia("(prefers-reduced-motion: reduce)").matches ||
      performance.now() > BAIL_MS;
    if (skip) {
      setPhase("done");
      return;
    }

    /* Hold the page still, and keep the keyboard out of it, until the panel
       has gone: a Tab into a link under the panel would scroll it into view,
       and the lift would then reveal a page that had moved. */
    const root = document.documentElement;
    const previous = root.style.overflow;
    root.style.overflow = "hidden";
    const held = Array.from(document.body.children).filter(
      (el) => el !== panel.current && !el.hasAttribute("inert"),
    );
    held.forEach((el) => el.setAttribute("inert", ""));
    const release = () => {
      root.style.overflow = previous;
      held.forEach((el) => el.removeAttribute("inert"));
    };

    const later = (fn: () => void, ms: number) => {
      timers.current.push(setTimeout(fn, ms));
    };
    const delay = (ms: number) => new Promise<void>((r) => setTimeout(r, ms));

    let cancelled = false;

    const run = () => {
      let at = 0;
      for (let i = 1; i < DECK.length; i++) {
        at += FLIP;
        const which = i;
        later(() => setCard(which), at);
      }
      at += HOLD;
      later(() => setPhase("dismiss"), at);
      at += DISMISS - LEAD;
      later(() => setPhase("initials"), at);
      at += DRAW + READ;
      later(() => setPhase("leave"), at);
      at += LEAVE + GAP;
      later(() => setPhase("slide"), at);
      at += LIFT;
      later(() => {
        release();
        setPhase("done");
        markPreloaded();
      }, at);
    };

    /* Begin once every card is actually there to be seen — a flip onto a
       picture that has not arrived is a flip onto a blank. */
    const cards = Array.from(deck.current?.querySelectorAll("img") ?? []);
    Promise.race([
      Promise.all(cards.map((img) => img.decode().catch(() => undefined))),
      delay(DECK_GRACE),
    ]).then(() => {
      if (!cancelled) run();
    });

    return () => {
      cancelled = true;
      timers.current.forEach(clearTimeout);
      timers.current = [];
      release();
    };
  }, []);

  if (phase === "done") return null;

  return (
    <div
      ref={panel}
      className="preloader"
      data-phase={phase}
      aria-hidden="true"
      role="presentation"
    >
      <div ref={deck} className="preloader-deck">
        {DECK.map((src, i) => (
          <img
            key={src}
            src={src}
            alt=""
            /* Lazy so that React does not preload all six into the head of
               every page, and so that a panel hidden by the session flag does
               not fetch them at all. In view, a lazy picture loads at once. */
            loading="lazy"
            decoding="async"
            className="preloader-card"
            data-on={i === card ? "" : undefined}
          />
        ))}
      </div>

      {/* pathLength normalises each line to 1, so the same dash rule draws
          both from nothing to whole whatever their true lengths. */}
      <svg className="preloader-initials" viewBox={MARK_BOX} aria-hidden="true">
        <path d={V_LINE} pathLength={1} />
        <path d={A_LINE} pathLength={1} />
      </svg>
    </div>
  );
}
