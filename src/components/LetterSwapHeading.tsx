import { useEffect, useRef } from "react";

import { CURSOR_DISC_SIZE } from "./CustomCursor";

/*
 * A heading whose letters swap typeface under the cursor.
 *
 * Every character is its own span, and a span swaps when the cursor overlaps
 * it — so the disc covering four letters swaps all four, not just the one
 * directly under the pointer. That is why this uses geometry rather than
 * :hover, which can only ever match a single element.
 *
 * "The cursor" means the shape that is actually on screen. It is only the wide
 * disc while it is over a view surface; everywhere else it is a dot, and a dot
 * sitting below the line must not reach up and swap letters it is nowhere
 * near. So the radius follows the shape, decided the same way the cursor
 * decides it, and the two cannot disagree.
 *
 * The swapped face has wider metrics than the display face, so each span is
 * locked to the width it measures at rest; otherwise the line reflows mid-hover
 * and the letters slide out from under the cursor. The glyph overflows its
 * locked box instead, centred.
 */

/** Must match the face named in the .letter-swap rule in styles.css. */
const SWAP_FONT = "Caacupe One";

/** The surfaces the cursor grows into its disc over. Mirrors CustomCursor. */
const VIEWABLE = '[data-cursor="view"]';

export function LetterSwapHeading({
  text,
  className,
  ...rest
}: { text: string; className?: string } & React.HTMLAttributes<HTMLHeadingElement>) {
  const ref = useRef<HTMLHeadingElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const spans = () => Array.from(el.querySelectorAll<HTMLElement>("span"));

    const lock = () => {
      // Suppress the swap while measuring, so a re-measure that runs while
      // letters are swapped cannot bake the swapped width into the lock.
      el.classList.add("is-measuring");
      const list = spans();
      list.forEach((span) => {
        span.style.width = "";
      });
      list.forEach((span) => {
        span.style.width = `${span.getBoundingClientRect().width}px`;
      });
      el.classList.remove("is-measuring");
    };

    if (document.fonts?.ready) {
      // The swap face is only referenced from a class the cursor applies, so
      // the browser would not fetch it until the first overlap — showing a
      // frame of fallback type. Pull it down up front instead.
      const size = getComputedStyle(el).fontSize;
      document.fonts.load(`${size} "${SWAP_FONT}"`).catch(() => {});
      document.fonts.ready.then(lock).catch(lock);
    } else {
      lock();
    }

    let frame = 0;
    let cursorX = 0;
    let cursorY = 0;
    let pointerInside = false;

    const apply = () => {
      frame = 0;
      // Which shape the cursor is in right now. Hit-tested rather than read off
      // the disc element, because the disc only grows after React commits the
      // hover state — a frame behind the pointer — whereas the hit test is the
      // very thing that decides it. Over a view surface the cursor is the wide
      // disc, whose declared size is used so the first frame is not measured
      // small; anywhere else it is a dot, and a dot is treated as a point. No
      // disc element at all means the custom cursor is off: a point again.
      const hasDisc = document.querySelector("[data-cursor-disc]") !== null;
      const under = pointerInside ? document.elementFromPoint(cursorX, cursorY) : null;
      const onViewSurface = under?.closest(VIEWABLE) != null;
      const radius = hasDisc && onViewSurface ? CURSOR_DISC_SIZE / 2 : 0;

      // The pointer itself has to be on the line. The disc is wide enough to
      // graze the heading from a card standing underneath it, and a swap set
      // off from there reads as the letters changing at a distance.
      const line = el.getBoundingClientRect();
      const onLine =
        pointerInside &&
        cursorX >= line.left &&
        cursorX <= line.right &&
        cursorY >= line.top &&
        cursorY <= line.bottom;

      spans().forEach((span) => {
        if (!onLine) {
          span.classList.remove("is-swapped");
          return;
        }
        const box = span.getBoundingClientRect();
        // Closest point on the letter's box to the centre of the disc.
        const nearestX = Math.max(box.left, Math.min(cursorX, box.right));
        const nearestY = Math.max(box.top, Math.min(cursorY, box.bottom));
        const overlaps = Math.hypot(cursorX - nearestX, cursorY - nearestY) <= radius;
        span.classList.toggle("is-swapped", overlaps);
      });
    };

    const schedule = () => {
      if (!frame) frame = requestAnimationFrame(apply);
    };

    const onMove = (event: PointerEvent) => {
      cursorX = event.clientX;
      cursorY = event.clientY;
      pointerInside = true;
      schedule();
    };

    const onLeave = () => {
      pointerInside = false;
      schedule();
    };

    window.addEventListener("pointermove", onMove, { passive: true });
    window.addEventListener("scroll", schedule, { passive: true });
    document.addEventListener("pointerleave", onLeave);
    window.addEventListener("blur", onLeave);

    const observer = new ResizeObserver(lock);
    observer.observe(document.documentElement);

    return () => {
      if (frame) cancelAnimationFrame(frame);
      observer.disconnect();
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("scroll", schedule);
      document.removeEventListener("pointerleave", onLeave);
      window.removeEventListener("blur", onLeave);
    };
  }, [text]);

  return (
    <h2 ref={ref} className={className} {...rest}>
      {Array.from(text).map((char, i) => (
        <span key={i}>{char === " " ? " " : char}</span>
      ))}
    </h2>
  );
}
