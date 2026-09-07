import { useEffect, useRef, useState } from "react";

/*
 * The image well inside a project card.
 *
 * At rest it shows the first photograph, full bleed. On hover:
 *
 *   1. REVEAL — the mark becomes a mask over the *second* photograph, laid on
 *      top of the first. It starts enormous, so the card sits inside a single
 *      hole of the mark, then zooms OUT until the whole mark reads: a
 *      leaf-shaped window onto the next image, cut into the one behind it.
 *   2. OPEN — it zooms back in through that same hole and the mask is dropped,
 *      leaving the second image filling the frame.
 *   3. SCROLL — the column carries on downward through the rest.
 *
 * A slide marked `fit` zooms out to its full frame while it is the one in view,
 * with the card behind it going dark green. It stays zoomed out and the column
 * scrolls straight on from there; the crop is only restored once it is off
 * screen.
 *
 * Suppressed entirely under prefers-reduced-motion: the first image just sits.
 */

export type MediaImage = {
  src: string;
  alt: string;
  /** Zoom out to show the whole frame rather than cropping it. */
  fit?: boolean;
  /** Fraction of the frame to push below the card — used to lose a watermark
   *  along the bottom edge. Needs extra zoom as well as a shift, since scaling
   *  alone crops the top by as much as the bottom. */
  hideBottom?: number;
};

/*
 * The zoom is driven frame by frame rather than by a CSS transition on
 * mask-size. Percentage mask-position aligns a fraction of the image with the
 * same fraction of the box, so as the size changes the anchor slides — the
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

const REVEAL_MS = 1400;
const REVEAL_HOLD = 450;
const OPEN_MS = 420;

const SLIDE_MS = 2300;
const SCROLL_MS = 950;
const FIT_HOLD_IN = 450;
const FIT_ZOOM_MS = 700;
const FIT_HOLD_OUT = 1300;
const FIT_TOTAL = FIT_HOLD_IN + FIT_ZOOM_MS + FIT_HOLD_OUT;

const DARK_GREEN = "#1d4a21";

const easeInOut = (t: number) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);

export function ProjectMedia({
  images,
  maskSrc,
}: {
  images: MediaImage[];
  maskSrc?: string;
}) {
  const [index, setIndex] = useState(0);
  const [phase, setPhase] = useState<"idle" | "masking" | "playing">("idle");
  /** Which slide is currently zoomed out, or null. Held past the scroll so the
   *  slide does not zoom back in on its way out of view. */
  const [fittedIndex, setFittedIndex] = useState<number | null>(null);
  /** Set for a single frame while the column rebases, so the jump is not animated. */
  const [rebasing, setRebasing] = useState(false);
  /** Per-image scale and vertical shift. Measured individually because the
   *  photographs and the dashboard have different aspect ratios, and one shared
   *  factor letterboxes the others. */
  const [fills, setFills] = useState<Record<number, { scale: number; shift: number }>>({});

  const timers = useRef<Array<ReturnType<typeof setTimeout>>>([]);
  const frame = useRef(0);
  const boxRef = useRef<HTMLDivElement>(null);
  const maskRef = useRef<HTMLDivElement>(null);

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
    if (phase !== "idle" || images.length < 2 || !maskSrc) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

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
    setIndex(0);
  };

  // Drives the column. Each slide schedules its own successor so a fitting
  // slide can take longer than a plain one.
  useEffect(() => {
    if (phase !== "playing" || images.length < 2) return;

    // The last position is a clone of the first slide. Once the column has
    // scrolled onto it, jump back to the real first slide with the transition
    // suppressed — visually identical, but it means the column only ever
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
  // off-screen so it is cropped again next time round.
  useEffect(() => {
    if (fittedIndex === null || fittedIndex === index) return;
    const t = setTimeout(() => setFittedIndex(null), SCROLL_MS);
    return () => clearTimeout(t);
  }, [fittedIndex, index]);

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
  // on the viewport — so measure directly once mounted and again on resize.
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
        backgroundColor: fittedIndex !== null ? DARK_GREEN : undefined,
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
        {/* The column. Translating the track is what reads as a vertical scroll. */}
        <div
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
