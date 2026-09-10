import { useCallback, useEffect, useId, useRef, useState, type KeyboardEvent } from "react";

import { Frame, type FrameSize } from "@/components/primitives";
import { cn } from "@/lib/utils";

/*
 * Screens that play themselves.
 *
 * Guided, it reads as a prototype recording: each step settles, a pointer
 * travels to the button a farmer would press, the press lands, and the next
 * screen arrives. Unguided, it is a carousel — the same screens turning over on
 * their own, with no pointer and nothing joining one to the next, which is what
 * a set of pages with no flow between them looks like.
 *
 * It is held in the site's Frame, so a walkthrough is exactly the size of the
 * pictures around it and advancing never moves the page. The screens are inset
 * within the frame and centred on its ground, so the frame reads as a device
 * holding the flow rather than as the flow itself. One screen is a page far
 * taller than the rest: that one keeps the inset width and scrolls, and
 * playback scrolls it to the button before pressing.
 */

/* How much of the card the screen takes up. Close to all of it: a screen set
   much smaller than this stops being readable. */
const SCREEN_SIZE = "94%";

/* One beat of playback, in milliseconds. */
const DWELL = 1900;
const REACH = 750;
const PRESS = 420;
const STEP_MS = DWELL + REACH + PRESS;

/* A board taller than its card is not shrunk to fit, because that is what
   makes it unreadable. It is shown at a size that can be read and panned
   instead: a beat to take in the top, a slow travel down at a reading pace,
   and a beat at the foot before the next board. */
const READ_TOP = 2200;
const READ_FOOT = 1400;
const PAN_PX_PER_SECOND = 110;
const PAN_MAX = 16000;

const panDuration = (overflow: number) =>
  Math.min(PAN_MAX, Math.round((overflow / PAN_PX_PER_SECOND) * 1000));

/* Where the pointer waits before it sets off. */
const REST = { x: 44, y: 46 };

export type WalkthroughStep = {
  /** Names the step for anyone reading the page with a screen reader. */
  label: string;
  src: string;
  alt: string;
  /** The screen's own size, which sets the shape it is shown at. */
  width: number;
  height: number;
  /**
   * The control a farmer would press to leave this screen, as a percentage of
   * the screen's own width and height. Guided playback aims the pointer here;
   * a carousel has no use for it.
   */
  hotspot?: { x: number; y: number };
  /** A page too long to crop into the card, which scrolls inside it instead. */
  tall?: boolean;
};

export function Walkthrough({
  steps,
  size = "full",
  ratio,
  fit,
  guided = true,
}: {
  steps: WalkthroughStep[];
  /** Passed through to the frame: full column width, or one of a two-up pair. */
  size?: FrameSize;
  /** The frame's shape, for a flow that is not the site's usual landscape:
   *  a phone wants a portrait card. */
  ratio?: string;
  /** Passed through to the frame: a portrait flow measures from its height. */
  fit?: "width" | "height";
  /** False turns the pointer off and leaves the screens simply turning over. */
  guided?: boolean;
}) {
  const id = useId();
  const [active, setActive] = useState(0);
  const [playing, setPlaying] = useState(true);
  /* Kept apart from `playing`: the reader's choice is not the same as whether
     the frame happens to be on screen, and the two must not overwrite each
     other. */
  const [onScreen, setOnScreen] = useState(false);
  /* Playback runs enter → reach → press; null while the reader is in charge. */
  const [phase, setPhase] = useState<"enter" | "reach" | "press" | null>(null);
  const last = steps.length - 1;
  const frame = useRef<HTMLDivElement>(null);
  const step = steps[active];

  /* Stepping by hand stops the playback rather than fighting it. */
  const goTo = useCallback((next: number) => {
    setPlaying(false);
    setPhase(null);
    setActive(next);
  }, []);

  /* A step that scrolled hands the next one its own top. */
  useEffect(() => {
    frame.current?.scrollTo({ top: 0 });
  }, [active]);

  /* Playing to nobody is just work, so it waits until the frame is in view. */
  useEffect(() => {
    const el = frame.current;
    if (!el || typeof IntersectionObserver === "undefined") {
      setOnScreen(true);
      return;
    }
    const observer = new IntersectionObserver(([entry]) => setOnScreen(entry.isIntersecting), {
      threshold: 0.3,
    });
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  /* The beats of one step: settle, reach for the button, press, move on.
     A carousel has no button to press, so a board that overflows its card is
     panned instead, slowly enough to be read. */
  useEffect(() => {
    if (!playing || !onScreen) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    setPhase("enter");
    const advance = () => setActive((i) => (i + 1) % steps.length);

    if (!guided) {
      const el = frame.current;
      const overflow = el ? el.scrollHeight - el.clientHeight : 0;
      if (overflow <= 4) {
        const hold = window.setTimeout(advance, STEP_MS);
        return () => window.clearTimeout(hold);
      }

      const travel = panDuration(overflow);
      let raf = 0;
      let start = 0;
      const timers: number[] = [];

      timers.push(
        window.setTimeout(() => {
          /* Linear, because the eye is reading rather than being swept. */
          const tick = (now: number) => {
            if (!start) start = now;
            const t = Math.min(1, (now - start) / travel);
            if (frame.current) frame.current.scrollTop = overflow * t;
            if (t < 1) raf = window.requestAnimationFrame(tick);
          };
          raf = window.requestAnimationFrame(tick);
        }, READ_TOP),
      );
      timers.push(window.setTimeout(advance, READ_TOP + travel + READ_FOOT));

      return () => {
        timers.forEach(window.clearTimeout);
        window.cancelAnimationFrame(raf);
      };
    }

    const timers = [
      window.setTimeout(() => {
        setPhase("reach");
        /* Bring the button into the frame before reaching for it. */
        const el = frame.current;
        if (!el) return;
        const target = ((step.hotspot?.y ?? 50) / 100) * el.scrollHeight;
        el.scrollTo({ top: Math.max(0, target - el.clientHeight * 0.7), behavior: "smooth" });
      }, DWELL),
      window.setTimeout(() => setPhase("press"), DWELL + REACH),
      window.setTimeout(advance, STEP_MS),
    ];
    return () => timers.forEach(window.clearTimeout);
  }, [active, playing, onScreen, guided, steps.length, step.hotspot?.y]);

  /* Left and right walk the strip, the way a tab list is expected to behave. */
  function onKeyDown(event: KeyboardEvent<HTMLDivElement>) {
    const next =
      event.key === "ArrowRight"
        ? (active + 1) % steps.length
        : event.key === "ArrowLeft"
          ? (active + last) % steps.length
          : null;
    if (next === null) return;
    event.preventDefault();
    goTo(next);
  }

  const reaching = phase === "reach" || phase === "press";

  return (
    <figure onKeyDown={onKeyDown}>
      <Frame
        size={size}
        ratio={ratio}
        fit={fit}
        id={`${id}-panel`}
        ref={frame}
        role="group"
        aria-label={`${active + 1} of ${steps.length}: ${step.label}`}
        tabIndex={0}
        /* Safe centring: a screen that fits is centred, one that overflows is
           aligned to the top instead. Plain centring would push its head above
           the scroll origin, where it can never be reached. */
        className="flex [align-items:safe_center] justify-center overflow-y-auto"
      >
        {/* Sized to the screen's own shape, so the whole screen is shown and the
            pointer's percentages land on the screen rather than on the ground
            around it. */}
        <div
          key={active}
          className={cn("wt-motion relative shrink-0", step.tall && "my-10")}
          style={
            step.tall
              ? { animation: "wt-screen-in 340ms ease-out", width: SCREEN_SIZE }
              : {
                  animation: "wt-screen-in 340ms ease-out",
                  aspectRatio: `${step.width} / ${step.height}`,
                  maxWidth: SCREEN_SIZE,
                  maxHeight: SCREEN_SIZE,
                }
          }
        >
          <img
            src={step.src}
            alt={step.alt}
            className={step.tall ? "block w-full" : "block size-full"}
          />

          {guided && phase ? (
            <span
              aria-hidden="true"
              className="wt-motion pointer-events-none absolute transition-[left,top] duration-700 ease-out"
              style={{
                left: `${reaching ? (step.hotspot?.x ?? REST.x) : REST.x}%`,
                top: `${reaching ? (step.hotspot?.y ?? REST.y) : REST.y}%`,
              }}
            >
              {phase === "press" ? (
                <span
                  className="wt-motion absolute size-10 rounded-full border border-ink/70 bg-ink/10"
                  style={{ animation: `wt-press ${PRESS}ms ease-out forwards` }}
                />
              ) : null}
              <Pointer />
            </span>
          ) : null}
        </div>
      </Frame>

      {/* Fetched with the page so a step never waits on its screen. */}
      <div hidden>
        {steps.map((s) => (
          <img key={s.label} src={s.src} alt="" />
        ))}
      </div>

    </figure>
  );
}

/* The pointer itself, drawn rather than an image so it stays sharp. */
function Pointer() {
  return (
    <svg viewBox="0 0 24 24" className="block size-6 drop-shadow-sm" aria-hidden="true">
      <path
        d="M5 2.5 19.5 12 13 13.2 16 20.4 13.4 21.5 10.4 14.4 5.6 18.4Z"
        fill="white"
        stroke="black"
        strokeWidth="1.1"
        strokeLinejoin="round"
      />
    </svg>
  );
}
