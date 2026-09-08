import { useCallback, useEffect, useId, useRef, useState, type KeyboardEvent } from "react";

import { CARD_MAX_HEIGHT, CARD_RATIO } from "@/components/primitives";
import { cn } from "@/lib/utils";

/*
 * A flow that plays itself, the way a prototype recording does.
 *
 * Each step settles, a pointer travels to the button a farmer would press, the
 * press lands, and the next screen arrives. The reader can take it over at any
 * point: touching a tab, an arrow or the keyboard stops the playback and leaves
 * the step where they put it.
 *
 * The frame is the same card the page's pictures use, so the walkthrough is
 * exactly the size of the lead image and advancing never moves the page. The
 * screens are inset within it, centred on a ground taken from the product, so
 * the card reads as a device holding the flow rather than as the flow itself.
 * One screen is a page far taller than the rest: that one keeps the inset width
 * and scrolls, and playback scrolls it to the button before pressing.
 */

/* How much of the card the screen takes up. */
const SCREEN_SIZE = "80%";

/* One beat of playback, in milliseconds. */
const DWELL = 1900;
const REACH = 750;
const PRESS = 420;
const STEP_MS = DWELL + REACH + PRESS;

/* Where the pointer waits before it sets off. */
const REST = { x: 44, y: 46 };

export type WalkthroughStep = {
  /** Names the step in the tab strip. */
  label: string;
  /** The line that runs under the frame while this step is showing. */
  caption: string;
  src: string;
  alt: string;
  /** The screen's own size, which sets the shape it is shown at. */
  width: number;
  height: number;
  /**
   * The control a farmer would press to leave this screen, as a percentage of
   * the screen's own width and height. Playback aims the pointer here.
   */
  hotspot: { x: number; y: number };
  /** A page too long to crop into the card, which scrolls inside it instead. */
  tall?: boolean;
};

export function Walkthrough({
  steps,
  ground,
}: {
  steps: WalkthroughStep[];
  /** The card's ground, usually a colour lifted from the product itself. */
  ground?: string;
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

  /* Taking control stops the playback rather than fighting it. */
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

  /* The beats of one step: settle, reach for the button, press, move on. */
  useEffect(() => {
    if (!playing || !onScreen) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    setPhase("enter");
    const timers = [
      window.setTimeout(() => {
        setPhase("reach");
        /* Bring the button into the frame before reaching for it. */
        const el = frame.current;
        if (!el) return;
        const target = (step.hotspot.y / 100) * el.scrollHeight;
        el.scrollTo({ top: Math.max(0, target - el.clientHeight * 0.7), behavior: "smooth" });
      }, DWELL),
      window.setTimeout(() => setPhase("press"), DWELL + REACH),
      window.setTimeout(() => setActive((i) => (i + 1) % steps.length), STEP_MS),
    ];
    return () => timers.forEach(window.clearTimeout);
  }, [active, playing, onScreen, steps.length, step.hotspot.y]);

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
    document.getElementById(`${id}-tab-${next}`)?.focus();
  }

  const reaching = phase === "reach" || phase === "press";

  return (
    <figure className="rounded-lg border border-ink/10">
      <div role="tablist" onKeyDown={onKeyDown} className="flex overflow-x-auto">
        {steps.map((s, i) => (
          <button
            key={s.label}
            id={`${id}-tab-${i}`}
            type="button"
            role="tab"
            aria-selected={i === active}
            aria-controls={`${id}-panel`}
            tabIndex={i === active ? 0 : -1}
            onClick={() => goTo(i)}
            className={cn(
              "flex shrink-0 items-baseline gap-2 border-b px-4 py-3.5 type-label font-semibold whitespace-nowrap transition-colors sm:px-5",
              i > 0 && "border-l border-l-ink/10",
              i === active
                ? "border-b-ink text-ink"
                : "border-b-ink/10 text-ink/35 hover:text-ink/70",
            )}
          >
            <span aria-hidden="true" className="text-olive">
              {String(i + 1).padStart(2, "0")}
            </span>
            {s.label}
          </button>
        ))}
        {/* Carries the rule to the right edge once the steps run out. */}
        <span aria-hidden="true" className="grow border-b border-ink/10" />
      </div>

      {/* How far the current step has left to run. */}
      <div aria-hidden="true" className="h-px bg-ink/10">
        {playing && onScreen ? (
          <div
            key={active}
            className="wt-motion h-px origin-left bg-olive"
            style={{ animation: `wt-progress ${STEP_MS}ms linear forwards` }}
          />
        ) : null}
      </div>

      <div
        id={`${id}-panel`}
        ref={frame}
        role="tabpanel"
        aria-labelledby={`${id}-tab-${active}`}
        tabIndex={0}
        className="flex w-full items-center justify-center overflow-y-auto"
        style={{
          aspectRatio: CARD_RATIO,
          maxHeight: CARD_MAX_HEIGHT,
          backgroundColor: ground ?? "var(--cream)",
        }}
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

          {phase ? (
            <span
              aria-hidden="true"
              className="wt-motion pointer-events-none absolute transition-[left,top] duration-700 ease-out"
              style={{
                left: `${reaching ? step.hotspot.x : REST.x}%`,
                top: `${reaching ? step.hotspot.y : REST.y}%`,
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
      </div>

      {/* Fetched with the page so a step never waits on its screen. */}
      <div hidden>
        {steps.map((s) => (
          <img key={s.label} src={s.src} alt="" />
        ))}
      </div>

      <figcaption className="flex items-center justify-between gap-6 border-t border-ink/10 px-4 py-3.5 sm:px-5">
        <p className="max-w-[62ch] type-body text-ink/75">{step.caption}</p>
        <div className="flex shrink-0 gap-2">
          <FrameButton
            label={playing ? "Pause the walkthrough" : "Play the walkthrough"}
            glyph={playing ? "❚❚" : "▶"}
            onClick={() => {
              setPlaying(!playing);
              if (playing) setPhase(null);
            }}
          />
          <FrameButton
            label="Previous step"
            glyph="←"
            disabled={active === 0}
            onClick={() => goTo(active - 1)}
          />
          <FrameButton
            label="Next step"
            glyph="→"
            disabled={active === last}
            onClick={() => goTo(active + 1)}
          />
        </div>
      </figcaption>
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

function FrameButton({
  label,
  glyph,
  disabled = false,
  onClick,
}: {
  label: string;
  glyph: string;
  disabled?: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      aria-label={label}
      disabled={disabled}
      onClick={onClick}
      className="flex size-8 items-center justify-center rounded-lg border border-ink/15 type-caption text-ink/70 transition-colors hover:border-ink/40 hover:text-ink disabled:pointer-events-none disabled:opacity-30"
    >
      <span aria-hidden="true">{glyph}</span>
    </button>
  );
}
