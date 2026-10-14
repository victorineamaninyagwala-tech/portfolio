import { useEffect, useRef, useState } from "react";

/*
 * The image well inside a project card.
 *
 * At rest it shows the first photograph, full bleed. On hover:
 *
 *   1. REVEAL: the mark becomes a mask over the *second* photograph, laid on
 *      top of the first. It starts enormous, so the card sits inside a single
 *      hole of the mark, then zooms OUT until the whole mark reads: a
 *      leaf-shaped window onto the next image, cut into the one behind it.
 *   2. OPEN: it zooms back in through that same hole and the mask is dropped,
 *      leaving the second image filling the frame.
 *   3. SCROLL: the column carries on downward through the rest.
 *
 * A slide marked `fit` zooms out to its full frame while it is the one in view,
 * with the card behind it going dark green. It stays zoomed out and the column
 * scrolls straight on from there; the crop is only restored once it is off
 * screen.
 *
 * Suppressed entirely under prefers-reduced-motion: the first image just sits.
 */

/**
 * A match cut, for a card whose first image turns up inside its second.
 *
 * The photograph is pushed into until one square of it fills the card, the
 * screen takes over at whatever scale puts the same square on the same
 * rectangle, and then the whole thing pulls back. Because both are the same
 * photograph at that instant, the swap cannot be seen.
 *
 * Every number is a fraction of the image it belongs to.
 */
export type MediaIntro = {
  /** The square of the first image that reappears in the second. */
  crop: { centreX: number; centreY: number; width: number };
  /** Where it reappears, measured on the second image as it is laid out. */
  target: { centreX: number; centreY: number; width: number };
};

export type MediaImage = {
  src: string;
  alt: string;
  /** Zoom out to show the whole frame rather than cropping it. */
  fit?: boolean;
  /** What the pointer presses to bring the next screen, as fractions of this
   *  image. A slide with no hotspot is the end of the walk. */
  hotspot?: { x: number; y: number };
  /** Fraction of the frame to push below the card, used to lose a watermark
   *  along the bottom edge. Needs extra zoom as well as a shift, since scaling
   *  alone crops the top by as much as the bottom. */
  hideBottom?: number;
};

/*
 * The zoom is driven frame by frame rather than by a CSS transition on
 * mask-size. Percentage mask-position aligns a fraction of the image with the
 * same fraction of the box, so as the size changes the anchor slides: the
 * pivot drifts toward the middle and then snaps back. Writing pixel offsets
 * each frame keeps one point of the mark pinned to one point of the card, which
 * is what makes it read as zooming through that hole.
 */

/** Mask width as a multiple of the card width, at each end of the zoom. */
const ZOOM_CLOSED = 26;
const ZOOM_OPEN = 0.58;

/** The hole to travel through, as a fraction of the mark. Measured by
 *  rasterising the SVG and taking the deepest interior point above the petals. */
const HOLE_X = 0.494;
const HOLE_Y = 0.188;

/* In on the face, then out from the avatar. The pull is the longer of the two
   because it travels 40 times as far. */
const PUSH_MS = 900;
const PULL_MS = 1800;

/* When the photograph lets go. By here the avatar underneath is close enough
   to its own size to stand on its own. */
/* The walkthrough's own beats, so a card and a case study move alike. */
const DWELL = 1500;
const REACH = 750;
const PRESS = 420;
const REST = { x: 44, y: 46 };

/* How far into the pull the photograph has become the avatar's circle. */
const ROUND_BY = 0.26;

const HAND_OVER_FROM = 0.72;
const HAND_OVER_TO = 0.9;

const REVEAL_MS = 1400;
const REVEAL_HOLD = 450;
const OPEN_MS = 420;

const SLIDE_MS = 2300;
const SCROLL_MS = 950;
const FIT_HOLD_IN = 450;
const FIT_ZOOM_MS = 700;
const FIT_HOLD_OUT = 1300;
const FIT_TOTAL = FIT_HOLD_IN + FIT_ZOOM_MS + FIT_HOLD_OUT;



const easeInOut = (t: number) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);

/*
 * The pointer, travelling to the control and pressing it.
 *
 * The screens are contained in the card rather than filling it, so a hotspot
 * given against the image has to be found through that letterbox before it
 * means anything in card pixels.
 */
function GuidedPointer({
  box,
  screen,
  hotspot,
  reaching,
  pressing,
}: {
  box: HTMLDivElement | null;
  screen: HTMLImageElement | null;
  hotspot: { x: number; y: number };
  reaching: boolean;
  pressing: boolean;
}) {
  let left = REST.x;
  let top = REST.y;
  if (reaching && box) {
    const { width, height } = box.getBoundingClientRect();
    const natural = screen && screen.naturalWidth ? screen.naturalWidth / screen.naturalHeight : 4 / 3;
    const shownH = width / natural;
    left = hotspot.x * 100;
    top = (((height - shownH) / 2 + hotspot.y * shownH) / height) * 100;
  }

  return (
    <span
      aria-hidden="true"
      className="wt-motion pointer-events-none absolute transition-[left,top] duration-700 ease-out"
      style={{ left: `${left}%`, top: `${top}%` }}
    >
      {pressing ? (
        <span
          className="wt-motion absolute size-10 rounded-full border border-ink/70 bg-ink/10"
          style={{ animation: `wt-press ${PRESS}ms ease-out forwards` }}
        />
      ) : null}
      <svg viewBox="0 0 24 24" className="block size-6 drop-shadow-sm">
        <path
          d="M5 2.5 19.5 12 13 13.2 16 20.4 13.4 21.5 10.4 14.4 5.6 18.4Z"
          fill="white"
          stroke="black"
          strokeWidth="1.2"
          strokeLinejoin="round"
        />
      </svg>
    </span>
  );
}

export function ProjectMedia({
  images,
  maskSrc,
  intro,
}: {
  images: MediaImage[];
  maskSrc?: string;
  intro?: MediaIntro;
}) {
  const [index, setIndex] = useState(0);
  const [phase, setPhase] = useState<"idle" | "masking" | "intro" | "playing">("idle");
  /** Which slide is currently zoomed out, or null. Held past the scroll so the
   *  slide does not zoom back in on its way out of view. */
  const [fittedIndex, setFittedIndex] = useState<number | null>(null);
  /** Set for a single frame while the column rebases, so the jump is not animated. */
  const [rebasing, setRebasing] = useState(false);
  /** Where the pointer is in the walk, for a card that is clicked through
   *  rather than scrolled. */
  const [reach, setReach] = useState(false);
  const [pressing, setPressing] = useState(false);
  /** Per-image scale and vertical shift. Measured individually because the
   *  photographs and the dashboard have different aspect ratios, and one shared
   *  factor letterboxes the others. */
  const [fills, setFills] = useState<Record<number, { scale: number; shift: number }>>({});

  const timers = useRef<Array<ReturnType<typeof setTimeout>>>([]);
  const frame = useRef(0);
  const boxRef = useRef<HTMLDivElement>(null);
  const maskRef = useRef<HTMLDivElement>(null);
  const faceRef = useRef<HTMLImageElement>(null);
  const screenRef = useRef<HTMLImageElement>(null);
  const clipRef = useRef<HTMLDivElement>(null);

  /** A card that opens on a match cut is walked through, not scrolled. */
  const guided = Boolean(intro);

  const clearTimers = () => {
    timers.current.forEach(clearTimeout);
    timers.current = [];
  };
  const later = (fn: () => void, ms: number) => {
    timers.current.push(setTimeout(fn, ms));
  };
  const stopFrame = () => {
    if (frame.current) cancelAnimationFrame(frame.current);
    frame.current = 0;
  };

  useEffect(
    () => () => {
      clearTimers();
      stopFrame();
    },
    [],
  );

  /** Write mask size and offset for a given zoom, keeping the hole pinned. */
  const applyZoom = (zoom: number) => {
    const el = maskRef.current;
    const box = boxRef.current;
    if (!el || !box) return;
    const { width, height } = box.getBoundingClientRect();

    // Where the hole should sit on the card: chosen so that at the open end the
    // whole mark lands centred, and it stays there for every other zoom.
    const anchorX = width / 2 - (0.5 - HOLE_X) * width * ZOOM_OPEN;
    const anchorY = height / 2 - (0.5 - HOLE_Y) * width * ZOOM_OPEN;

    const maskW = width * zoom;
    const offsetX = anchorX - HOLE_X * maskW;
    const offsetY = anchorY - HOLE_Y * maskW;

    el.style.maskSize = `${maskW}px`;
    el.style.webkitMaskSize = `${maskW}px`;
    el.style.maskPosition = `${offsetX}px ${offsetY}px`;
    el.style.webkitMaskPosition = `${offsetX}px ${offsetY}px`;
  };

  /**
   * Everything the match cut is measured from, in card pixels.
   *
   * The screen is laid out with object-contain, so it sits letterboxed inside
   * the card and a point on it has to be found through that box rather than
   * against the card itself.
   */
  const geometry = () => {
    const box = boxRef.current;
    const screen = screenRef.current;
    if (!box || !intro) return null;
    const { width, height } = box.getBoundingClientRect();

    const natural =
      screen && screen.naturalWidth ? screen.naturalWidth / screen.naturalHeight : 4 / 3;
    // Contained: the screen is wider than the well, so width decides.
    const shownW = width;
    const shownH = width / natural;
    const top = (height - shownH) / 2;

    // Where the avatar sits on the card with the screen at rest.
    const target = {
      x: intro.target.centreX * shownW,
      y: top + intro.target.centreY * shownH,
      w: intro.target.width * shownW,
    };
    // Where the same square sits on the photograph, which fills the card.
    const crop = {
      x: intro.crop.centreX * width,
      y: intro.crop.centreY * height,
      w: intro.crop.width * width,
    };
    // How far the screen has to come in before its avatar is as wide as the card.
    const zoom = width / target.w;
    return { width, height, target, crop, zoom };
  };

  /** The photograph, pushing in until the matched square fills the card. */
  const applyPush = (t: number) => {
    const img = faceRef.current;
    const g = geometry();
    if (!img || !g) return;

    const end = g.width / g.crop.w;
    const scale = Math.pow(end, t);
    // The square travels to the middle as the push goes in.
    const dx = g.width / 2 - g.crop.x;
    const dy = g.height / 2 - g.crop.y;
    const x = g.crop.x + dx * t;
    const y = g.crop.y + dy * t;
    img.style.transform = `translate(${x - scale * g.crop.x}px, ${y - scale * g.crop.y}px) scale(${scale})`;
    if (clipRef.current) clipRef.current.style.clipPath = "none";
  };

  /**
   * The pull-back. The screen opens from the avatar and the photograph rides
   * on top of it, pinned to the same square, until it is no longer needed.
   */
  const applyPull = (t: number) => {
    const img = faceRef.current;
    const screen = screenRef.current;
    const g = geometry();
    if (!img || !screen || !g) return;

    const z = Math.pow(g.zoom, 1 - t);
    // The avatar starts in the middle of the card and ends where it belongs.
    const x = g.width / 2 + (g.target.x - g.width / 2) * t;
    const y = g.height / 2 + (g.target.y - g.height / 2) * t;
    screen.style.transform = `translate(${x - z * g.target.x}px, ${y - z * g.target.y}px) scale(${z})`;

    // Same square, same place, so the photograph and the avatar stay one thing.
    const s = (g.target.w * z) / g.crop.w;
    img.style.transform = `translate(${x - s * g.crop.x}px, ${y - s * g.crop.y}px) scale(${s})`;

    // The photograph narrows to the avatar's own circle over the first part of
    // the pull. Until it has, it is wider than the card and nothing is cut.
    const clip = clipRef.current;
    if (clip) {
      const open = Math.hypot(g.width, g.height);
      const closed = (g.target.w * z) / 2;
      const k = Math.min(1, t / ROUND_BY);
      const r = open + (closed - open) * k;
      clip.style.clipPath = `circle(${r}px at ${x}px ${y}px)`;
    }

    const fade = (t - HAND_OVER_FROM) / (HAND_OVER_TO - HAND_OVER_FROM);
    img.style.opacity = String(1 - Math.max(0, Math.min(1, fade)));
  };

  /** Runs one beat of the opening, writing every frame. */
  const runIntro = (duration: number, write: (t: number) => void, done: () => void) => {
    const started = performance.now();
    const step = (now: number) => {
      const t = Math.min(1, (now - started) / duration);
      write(easeInOut(t));
      if (t < 1) frame.current = requestAnimationFrame(step);
      else done();
    };
    frame.current = requestAnimationFrame(step);
  };

  /** Geometric interpolation, so the zoom reads at a constant rate. */
  const runZoom = (from: number, to: number, duration: number, done: () => void) => {
    const started = performance.now();
    const step = (now: number) => {
      const t = Math.min(1, (now - started) / duration);
      applyZoom(from * Math.pow(to / from, easeInOut(t)));
      if (t < 1) {
        frame.current = requestAnimationFrame(step);
      } else {
        frame.current = 0;
        done();
      }
    };
    frame.current = requestAnimationFrame(step);
  };

  const start = () => {
    if (phase !== "idle" || images.length < 2) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    if (intro) {
      setPhase("intro");
      requestAnimationFrame(() => {
        applyPush(0);
        runIntro(PUSH_MS, applyPush, () => {
          // The swap. Both show the same square at the same size, so there is
          // nothing to see.
          applyPull(0);
          runIntro(PULL_MS, applyPull, () => {
            // The pull ends on the screen exactly contained, which is what the
            // column renders for a fitted slide, so the hand-back is a straight
            // swap rather than a move. Rebasing holds the transition off for a
            // frame: without it the column scrolls down into the screen the
            // reader is already looking at.
            setRebasing(true);
            setIndex(1);
            setFittedIndex(1);
            setPhase("playing");
          });
        });
      });
      return;
    }

    if (!maskSrc) return;

    // Jump the column straight to the second image; the first stays painted
    // behind, so the shrinking mask reads as a window cut into it.
    setIndex(1);
    setPhase("masking");

    // Commit the closed zoom before the first painted frame.
    requestAnimationFrame(() => {
      applyZoom(ZOOM_CLOSED);
      runZoom(ZOOM_CLOSED, ZOOM_OPEN, REVEAL_MS, () => {
        later(() => {
          runZoom(ZOOM_OPEN, ZOOM_CLOSED, OPEN_MS, () => setPhase("playing"));
        }, REVEAL_HOLD);
      });
    });
  };

  const reset = () => {
    clearTimers();
    stopFrame();
    setPhase("idle");
    setFittedIndex(null);
    setRebasing(false);
    setReach(false);
    setPressing(false);
    setIndex(0);
  };

  // Drives the column. Each slide schedules its own successor so a fitting
  // slide can take longer than a plain one.
  useEffect(() => {
    if (phase !== "playing" || images.length < 2) return;

    if (guided) {
      const here = images[index];
      // Every screen on a walked card is shown whole on the ground, so the
      // fitted slide follows the walk. Without this the reset below sees a
      // fitted slide that is no longer the current one, decides it has
      // scrolled clear, and takes the ground out from under the card.
      setFittedIndex(index);

      // No hotspot, nothing left to press: the walk rests on its last screen.
      if (!here?.hotspot || index >= images.length - 1) return;

      setReach(false);
      setPressing(false);
      later(() => setReach(true), DWELL);
      later(() => setPressing(true), DWELL + REACH);
      later(() => {
        setPressing(false);
        setReach(false);
        setIndex((i) => i + 1);
      }, DWELL + REACH + PRESS);
      return clearTimers;
    }

    // The last position is a clone of the first slide. Once the column has
    // scrolled onto it, jump back to the real first slide with the transition
    // suppressed: visually identical, but it means the column only ever
    // travels downward instead of rewinding to the top.
    if (index === images.length) {
      later(() => {
        setRebasing(true);
        setIndex(0);
      }, SCROLL_MS);
      return clearTimers;
    }

    const current = images[index];

    if (current?.fit) {
      later(() => setFittedIndex(index), FIT_HOLD_IN);
      later(() => setIndex((i) => i + 1), FIT_TOTAL);
    } else {
      later(() => setIndex((i) => i + 1), SLIDE_MS);
    }

    return clearTimers;
  }, [phase, index, images]);

  // The fitted slide keeps its zoom until it has scrolled clear, then resets
  // off-screen so it is cropped again next time round. Nothing scrolls clear
  // on a walked card: the screens replace each other in place.
  useEffect(() => {
    if (guided || fittedIndex === null || fittedIndex === index) return;
    const t = setTimeout(() => setFittedIndex(null), SCROLL_MS);
    return () => clearTimeout(t);
  }, [guided, fittedIndex, index]);

  // One frame with transitions off is enough for the jump to land unseen.
  useEffect(() => {
    if (!rebasing) return;
    let inner = 0;
    const outer = requestAnimationFrame(() => {
      inner = requestAnimationFrame(() => setRebasing(false));
    });
    return () => {
      cancelAnimationFrame(outer);
      cancelAnimationFrame(inner);
    };
  }, [rebasing]);

  const measureFill = (img: HTMLImageElement, i: number, hideBottom = 0) => {
    const box = boxRef.current;
    if (!box || !img.naturalWidth) return;
    const b = box.getBoundingClientRect();
    // With object-contain the image is letterboxed; this is the factor that
    // takes it back out to a full crop.
    const containScale = Math.min(b.width / img.naturalWidth, b.height / img.naturalHeight);
    const coverFactor = Math.max(b.width / img.naturalWidth, b.height / img.naturalHeight);
    const containedH = img.naturalHeight * containScale;

    let scale = coverFactor / containScale;
    let shift = 0;

    if (hideBottom > 0 && hideBottom < 0.5) {
      // For the unwanted strip to clear the bottom edge while the top edge is
      // still covered, the rendered height has to reach H / (1 - 2f).
      const needed = b.height / (1 - 2 * hideBottom);
      scale = Math.max(scale, needed / containedH);
      const rendered = containedH * scale;
      shift = -((rendered - b.height) / 2 - rendered * hideBottom);
    }

    setFills((prev) => ({ ...prev, [i]: { scale, shift } }));
  };

  // onLoad never fires for images already in cache, and the well height depends
  // on the viewport, so measure directly once mounted and again on resize.
  useEffect(() => {
    const box = boxRef.current;
    if (!box) return;
    const measureAll = () => {
      box.querySelectorAll<HTMLImageElement>("img[data-slide]").forEach((img) => {
        const i = Number(img.dataset.slide);
        if (img.complete) measureFill(img, i, slides[i]?.hideBottom ?? 0);
      });
    };
    measureAll();
    const observer = new ResizeObserver(measureAll);
    observer.observe(box);
    return () => observer.disconnect();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [images]);

  // A copy of the first slide tacked on the end gives the column somewhere to
  // scroll *down* into before it rebases.
  const slides = images.length > 1 ? [...images, images[0]] : images;
  const masking = phase === "masking";

  return (
    <div
      ref={boxRef}
      onPointerEnter={start}
      onPointerLeave={reset}
      className="relative aspect-[4/5] min-h-[70vh] w-full overflow-hidden"
      style={{
        backgroundColor: fittedIndex !== null ? "var(--ground)" : undefined,
        transition: `background-color ${FIT_ZOOM_MS}ms ease`,
      }}
    >
      {/* Painted behind the mask so the window has something to cut into. */}
      {masking && images[0] ? (
        <img
          src={images[0].src}
          alt=""
          aria-hidden="true"
          className="absolute inset-0 size-full object-contain"
          style={{
            transform: `translateY(${fills[0]?.shift ?? 0}px) scale(${fills[0]?.scale ?? 1.9})`,
          }}
        />
      ) : null}

      {/*
        The match cut runs on its own two layers rather than through the column,
        because both of them have to be moved against each other and the column
        can only scroll. It hands back at the end on the frame the column would
        have drawn anyway.
      */}
      {phase === "intro" && intro && images[0] && images[1] ? (
        <div className="absolute inset-0 z-10 overflow-hidden bg-ground">
          <img
            ref={screenRef}
            src={images[1].src}
            alt=""
            aria-hidden="true"
            className="absolute inset-0 size-full origin-top-left object-contain will-change-transform"
          />
          {/* The clip is written on this wrapper, in card pixels. Put on the
              photograph itself it would be carried along by its transform and
              stop following the avatar. */}
          <div ref={clipRef} className="absolute inset-0">
            <img
              ref={faceRef}
              src={images[0].src}
              alt=""
              aria-hidden="true"
              className="absolute inset-0 size-full origin-top-left object-cover will-change-transform"
            />
          </div>
        </div>
      ) : null}

      {/*
        The walk. One screen at a time, arriving rather than sliding in, with
        the pointer travelling to whatever brings the next one.
      */}
      {guided && phase === "playing" ? (
        <div className="absolute inset-0">
          <img
            key={index}
            src={(images[index] ?? images[0]).src}
            alt={images[index]?.alt ?? ""}
            className="wt-motion absolute inset-0 size-full object-contain"
            style={{ animation: "wt-screen-in 340ms ease-out" }}
          />
          {images[index]?.hotspot ? (
            <GuidedPointer
              box={boxRef.current}
              screen={screenRef.current}
              hotspot={images[index].hotspot}
              reaching={reach}
              pressing={pressing}
            />
          ) : null}
        </div>
      ) : null}

      {/*
        The mask lives on this wrapper, not on the track: mask-position resolves
        against the element's own box, and the track is translated.
      */}
      <div
        ref={maskRef}
        className="absolute inset-0"
        style={
          masking && maskSrc
            ? {
                // Quoted: Vite inlines this SVG as a data URI containing
                // "#46ae4d", and a bare # inside url() truncates the value so
                // the whole declaration is dropped.
                maskImage: `url("${maskSrc}")`,
                WebkitMaskImage: `url("${maskSrc}")`,
                maskRepeat: "no-repeat",
                WebkitMaskRepeat: "no-repeat",
              }
            : undefined
        }
      >
        {/* The column. Translating the track is what reads as a vertical scroll.
            A guided card never uses it; its screens are pressed into view. */}
        <div
          hidden={guided && phase === "playing"}
          className="absolute inset-0"
          style={{
            transform: `translateY(-${index * 100}%)`,
            transition:
              phase === "playing" && !rebasing
                ? `transform ${SCROLL_MS}ms cubic-bezier(0.32,0.72,0,1)`
                : "none",
          }}
        >
          {slides.map((image, i) => (
            <div
              key={`${image.src}-${i}`}
              className="absolute inset-x-0 h-full overflow-hidden"
              style={{ top: `${i * 100}%` }}
            >
              <img
                data-slide={i}
                src={image.src}
                alt={i === 0 ? image.alt : ""}
                aria-hidden={i === 0 ? undefined : true}
                onLoad={(e) => measureFill(e.currentTarget, i, image.hideBottom ?? 0)}
                className="size-full object-contain"
                style={{
                  transform:
                    image.fit && fittedIndex === i
                      ? "scale(1)"
                      : `translateY(${fills[i]?.shift ?? 0}px) scale(${fills[i]?.scale ?? 1.9})`,
                  transition: `transform ${FIT_ZOOM_MS}ms cubic-bezier(0.32,0.72,0,1)`,
                }}
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
