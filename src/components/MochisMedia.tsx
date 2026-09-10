import { useEffect, useRef, useState } from "react";

import cafe from "@/assets/card-mochis.webp";
import navLayer from "@/assets/mochis-home-nav.webp";
import mastheadLayer from "@/assets/mochis-home-masthead.webp";
import questionLayer from "@/assets/mochis-home-question.webp";
import actionsLayer from "@/assets/mochis-home-actions.webp";
import mockup from "@/assets/mochis-card-mockup.webp";

/*
 * The Mochi's Brew card, which builds its own subject and then finds it.
 *
 * The cover photograph is not a photograph chosen for the card: it is the file
 * the shop's own homepage lays behind its hero. So the card can assemble the
 * page out of it, and then hand that page to the phone it was really made for.
 * On hover:
 *
 *   1. OPEN   — the crop pulls back until the whole photograph sits in the
 *               16:10 the site is drawn at, and the hero's green scrim comes
 *               over it, exactly as the app paints it.
 *   2. BUILD  — the header drops in and the masthead, the question and the
 *               order controls arrive under it, each in the position it holds
 *               on the real screen. The page finishes itself.
 *   3. SWAP   — the desktop page leaves through the top and the phone rises
 *               into the emptied card behind it.
 *   4. CLOSE  — it is moved in on, until the screen is all there is.
 *   5. REVEAL — the product shot arrives around it and the pull-back settles
 *               into it. What the phone was showing turns out to have been
 *               inside the photograph all along.
 *
 * The last two beats are a pull-back rather than a dissolve. The frame standing
 * on the card is not a picture of a phone: it is a window onto the product shot
 * itself, blown up so the shot's own screen fills it exactly, and it rises to
 * the exact place that screen occupies. So there is never a moment where two
 * pictures of the same phone have to agree — there is only ever one picture,
 * seen through more or less of a hole, and the world fills in around something
 * already standing where it belongs.
 *
 * From the swap onward the sequence works in the card's own box rather than the
 * 16:10 frame, because the shot has to cover the card at the end and the frame
 * is only half its height.
 *
 * Suppressed under prefers-reduced-motion: the photograph just sits.
 */

const SCRIM = "rgb(11 39 13 / 0.72)";

/* The shape the site is drawn at, which the desktop page is held in. */
const STAGE_RATIO = 16 / 10;

/* Where each piece sits on that frame, as a percentage of it. Measured off the
   running app rather than eyeballed, so the page it builds is the real one. */
const PIECES = [
  { src: navLayer, left: 0, top: 0, width: 100, from: "translateY(-100%)", at: 0 },
  { src: mastheadLayer, left: 6.25, top: 29.313, width: 87.5, from: "translateX(-5%)", at: 260 },
  { src: questionLayer, left: 6.25, top: 65.313, width: 87.5, from: "translateX(-5%)", at: 540 },
  { src: actionsLayer, left: 6.25, top: 73.813, width: 87.5, from: "translateY(45%)", at: 800 },
] as const;

const BUILD_MS = 800;

/* The product shot, and where the phone's screen sits inside it as a percentage
   of the file. Measured off the file by finding the lit area inside the bezel,
   not estimated: the whole reveal hangs off these four numbers. */
const MOCKUP_W = 1500;
const MOCKUP_H = 1125;
const SCREEN = { left: 39.533, top: 17.778, width: 22.467, height: 64.889 };

/* The phone's proportions, read off the shot rather than asserted, so nothing
   drifts out of shape if the measurement is ever revised. Comes to 0.4616. */
const PHONE_RATIO = (SCREEN.width * MOCKUP_W) / (SCREEN.height * MOCKUP_H);

/* Blowing the shot up inside a window the shape of its screen, by exactly the
   factor that makes the screen fill it. Percentages of the window, which is why
   the window has to keep the screen's proportions. This is what makes the last
   beat a match cut: the frame standing on the card is not a picture of the
   shot's phone, it is that phone, seen through a hole. */
const LENS = {
  width: (100 / SCREEN.width) * 100,
  left: (-SCREEN.left / SCREEN.width) * 100,
  height: (100 / SCREEN.height) * 100,
  top: (-SCREEN.top / SCREEN.height) * 100,
};

/* The screen's own corner, as a fraction of its width, so the window cuts the
   shot exactly where the shot's screen already ends. */
const CORNER = 0.13;

/* How tall the phone stands when it is moved in on, as a multiple of the card's
   height. Far enough past 1 to be a real pull-back afterwards, and no further:
   the shot is 1500px on its long edge, and every extra step in costs sharpness
   at exactly the moment it takes the frame over. */
const CLOSE_TALL = 1.15;
/* Where it waits, far enough under the card to be clear of it. */
const BELOW_TOP = 1.06;

const OPEN_MS = 1500;
const SWAP_MS = 1400;
const CLOSE_MS = 1400;
const FADE_MS = 700;
const SETTLE_MS = 2200;
const EASE = "cubic-bezier(0.32,0.72,0,1)";

/* The beats, in the order they play. Each holds for its own length, so a move
   gets its running time plus however long it is meant to sit there. */
const TIMELINE = [
  { phase: "open", ms: OPEN_MS },
  { phase: "build", ms: 1800 },
  { phase: "swap", ms: SWAP_MS + 350 },
  { phase: "close", ms: CLOSE_MS + 500 },
  { phase: "reveal", ms: 900 },
  { phase: "settle", ms: SETTLE_MS + 600 },
] as const;

type Phase = "rest" | (typeof TIMELINE)[number]["phase"];

/** The beat the page is finished on, and the ones it has already left by. */
const BUILT: Phase[] = ["build", "swap", "close", "reveal", "settle"];
const GONE: Phase[] = ["swap", "close", "reveal", "settle"];
/** From here the whole shot is carrying the card rather than the phone. */
const SHOWN: Phase[] = ["reveal", "settle"];

type Rect = { left: number; top: number; width: number; height: number };

export function MochisMedia({ alt }: { alt: string }) {
  const [phase, setPhase] = useState<Phase>("rest");
  /* The card's own box. Its height is capped by a minimum as well as by its
     ratio, so everything below is measured off it rather than assumed. */
  const [well, setWell] = useState({ width: 0, height: 0 });

  const box = useRef<HTMLDivElement>(null);
  const timers = useRef<Array<ReturnType<typeof setTimeout>>>([]);

  const clearTimers = () => {
    timers.current.forEach(clearTimeout);
    timers.current = [];
  };

  useEffect(() => clearTimers, []);

  useEffect(() => {
    const el = box.current;
    if (!el) return;
    const measure = () => {
      const { width, height } = el.getBoundingClientRect();
      if (width) setWell({ width, height });
    };
    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const start = () => {
    if (phase !== "rest") return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    let at = 0;
    for (const beat of TIMELINE) {
      const when = at;
      timers.current.push(setTimeout(() => setPhase(beat.phase), when));
      at += beat.ms;
    }
  };

  const reset = () => {
    clearTimers();
    setPhase("rest");
  };

  /* How far the 16:10 frame has to be blown up to cover the card. */
  const restScale = well.width ? Math.max(1, (well.height * STAGE_RATIO) / well.width) : 2;

  /* The frame sits a quarter of the way down the card, so a page that travels
     its own height only reaches the frame's top edge — where it would be eaten
     by a line across the middle of the card rather than leaving. This is the
     distance from the page's own bottom edge to the top of the card, which is
     what it takes to actually be gone. */
  const stageHeight = well.width / STAGE_RATIO;
  const exit = (well.height + stageHeight) / 2;

  /* The shot, cover-fitted to the card. It is taller than it is wide relative to
     the card, so it fits by height and is cropped at the sides. */
  const fit = Math.max(well.width / MOCKUP_W, well.height / MOCKUP_H) || 1;
  const shot = {
    width: MOCKUP_W * fit,
    height: MOCKUP_H * fit,
    left: (well.width - MOCKUP_W * fit) / 2,
    top: (well.height - MOCKUP_H * fit) / 2,
  };

  /* Where the shot's own phone lands once it has settled — and therefore where
     the phone standing on the card has to end up. */
  const HOME: Rect = {
    left: shot.left + (SCREEN.left / 100) * shot.width,
    top: shot.top + (SCREEN.top / 100) * shot.height,
    width: (SCREEN.width / 100) * shot.width,
    height: (SCREEN.height / 100) * shot.height,
  };

  /** A phone of a given height, standing in the middle of the card. */
  const upright = (height: number): Rect => {
    const width = height * PHONE_RATIO;
    return {
      left: (well.width - width) / 2,
      top: (well.height - height) / 2,
      width,
      height,
    };
  };

  /* It arrives at the size it will finish at, so the only thing the last beat
     changes is how much of the world is around it. */
  const ARRIVES = upright(HOME.height);
  const CLOSE = upright(well.height * CLOSE_TALL);
  const BELOW = { ...ARRIVES, top: well.height * BELOW_TOP };

  /**
   * The transform that lays the shot's own screen exactly over a given rect, so
   * the whole shot can take the frame over from the phone without anything
   * moving. Measured from the card's top-left corner, which is what makes it a
   * plain scale-then-shift with nothing to unwind.
   */
  /* Where the screen sits inside the shot's own box, rather than on the card.
     Everything below is written against the shot's top-left corner, because
     that is where its transform is measured from. */
  const EYE = {
    x: (SCREEN.left / 100) * shot.width,
    y: (SCREEN.top / 100) * shot.height,
  };

  /**
   * The transform that lays the shot's own screen exactly over a given rect, so
   * the whole shot can take the card over from the phone without anything
   * moving.
   */
  const align = (rect: Rect) => {
    const scale = HOME.height ? rect.height / HOME.height : 1;
    return `translate(${rect.left - shot.left - scale * EYE.x}px, ${
      rect.top - shot.top - scale * EYE.y
    }px) scale(${scale})`;
  };

  const built = BUILT.includes(phase);
  const gone = GONE.includes(phase);
  const shown = SHOWN.includes(phase);
  const standing = phase === "close" || shown ? CLOSE : gone ? ARRIVES : BELOW;

  return (
    <div
      ref={box}
      onPointerEnter={start}
      onPointerLeave={reset}
      className="relative aspect-[4/5] min-h-[70vh] w-full overflow-hidden bg-ground"
    >
      {/* The desktop page, held in the 16:10 the site is drawn at: blown up to
          fill the card until the sequence pulls it back, then sent up and out
          through the top of the card. Scaling the frame rather than the picture
          inside it means the scrim and every piece laid on it travel together.
          The frame itself does not clip — the card does — or the page would
          vanish into the frame's own top edge partway down the card instead of
          sliding off the end of it. */}
      <div
        className="absolute inset-x-0 top-1/2"
        style={{
          aspectRatio: `${STAGE_RATIO}`,
          transform: `translateY(-50%) scale(${phase === "rest" ? restScale : 1})`,
          transition: `transform ${OPEN_MS}ms ${EASE}`,
        }}
      >
        <div
          className="absolute inset-0 overflow-hidden"
          style={{
            transform: gone ? `translateY(${-exit}px)` : "none",
            transition: `transform ${SWAP_MS}ms ${EASE}`,
          }}
        >
          <img src={cafe} alt={alt} className="size-full object-cover" />

          <div
            aria-hidden="true"
            className="absolute inset-0 transition-opacity"
            style={{
              background: SCRIM,
              opacity: phase === "rest" ? 0 : 1,
              transitionDuration: `${FADE_MS}ms`,
            }}
          />

          {PIECES.map((piece) => (
            <img
              key={piece.src}
              src={piece.src}
              alt=""
              aria-hidden="true"
              className="absolute"
              style={{
                left: `${piece.left}%`,
                top: `${piece.top}%`,
                width: `${piece.width}%`,
                opacity: built ? 1 : 0,
                transform: built ? "none" : piece.from,
                transition: `transform ${BUILD_MS}ms ${EASE} ${built ? piece.at : 0}ms, opacity ${BUILD_MS}ms ease ${built ? piece.at : 0}ms`,
              }}
            />
          ))}
        </div>
      </div>

      {/* The phone: no device around it, just the screen in a frame — and the
          screen is the shot's own, blown up behind a hole the shape of it, so
          the frame rises to the spot the shot will later prove it was standing
          in and hands over without a pixel moving. */}
      <div
        aria-hidden="true"
        className="absolute overflow-hidden"
        style={{
          left: `${standing.left}px`,
          top: `${standing.top}px`,
          width: `${standing.width}px`,
          height: `${standing.height}px`,
          borderRadius: `${standing.width * CORNER}px`,
          /* Held at full strength while the shot fades in over it, and dropped
             only once the shot is covering the whole card. Fading both at once
             would let the ground show through the pair of them at the halfway
             point — two half-opaque copies of the same thing do not add back up
             to one — and the phone would wash out at exactly the moment it is
             meant to be the one thing holding still. */
          opacity: phase === "settle" ? 0 : 1,
          transition: `left ${phase === "close" ? CLOSE_MS : SWAP_MS}ms ${EASE}, top ${phase === "close" ? CLOSE_MS : SWAP_MS}ms ${EASE}, width ${phase === "close" ? CLOSE_MS : SWAP_MS}ms ${EASE}, height ${phase === "close" ? CLOSE_MS : SWAP_MS}ms ${EASE}, border-radius ${CLOSE_MS}ms ${EASE}`,
        }}
      >
        <img
          src={mockup}
          alt=""
          className="absolute max-w-none"
          style={{
            left: `${LENS.left}%`,
            top: `${LENS.top}%`,
            width: `${LENS.width}%`,
            height: `${LENS.height}%`,
          }}
        />
      </div>

      {/* The shot, covering the card. It arrives already lined up with the phone
          it is taking over from, so all that appears is everything around it,
          and then it settles back into itself — far enough to show the phone
          whole with a good margin of the beans, and no further. */}
      <img
        src={mockup}
        alt=""
        aria-hidden="true"
        className="absolute max-w-none"
        style={{
          /* Laid out at the size that covers the card rather than cropped to
             it, so that the transform can move it around above and below the
             card's own edges while the card goes on showing a full bleed. */
          left: `${shot.left}px`,
          top: `${shot.top}px`,
          width: `${shot.width}px`,
          height: `${shot.height}px`,
          transformOrigin: "0 0",
          transform: phase === "settle" ? "none" : align(CLOSE),
          opacity: shown ? 1 : 0,
          transition: `transform ${SETTLE_MS}ms ${EASE}, opacity ${FADE_MS}ms ease`,
        }}
      />
    </div>
  );
}
