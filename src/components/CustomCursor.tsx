import { useEffect, useRef, useState } from "react";



/** Diameter of the disc shown over data-cursor="view" surfaces. */
export const CURSOR_DISC_SIZE = 88;

/** Box the paw is drawn in. Big enough to read as a paw, small enough to
 *  still point at something. */
const PAW_SIZE = 26;

/** One clip path, referenced by the single cursor element. */
const CLIP_ID = "cursor-paw-clip";

type Tone = "ink" | "paper" | "grey";

const TONES: Record<Tone, string> = {
  ink: "#111111",
  paper: "#ffffff",
  grey: "#8a8a8a",
};

// Only opted-in surfaces get the disc. Text links keep the dot.
const VIEWABLE = '[data-cursor="view"]';

let probe: CanvasRenderingContext2D | null = null;

/** Paint `color` over `under` and read the result — resolves oklch/oklab too. */
function paint(color: string, under: string): [number, number, number] | null {
  if (!probe) {
    const canvas = document.createElement("canvas");
    canvas.width = canvas.height = 1;
    probe = canvas.getContext("2d", { willReadFrequently: true });
  }
  if (!probe) return null;
  probe.clearRect(0, 0, 1, 1);
  probe.fillStyle = under;
  probe.fillRect(0, 0, 1, 1);
  probe.fillStyle = color;
  probe.fillRect(0, 0, 1, 1);
  const d = probe.getImageData(0, 0, 1, 1).data;
  return [d[0], d[1], d[2]];
}

function luminance([r, g, b]: [number, number, number]) {
  const channel = (value: number) => {
    const c = value / 255;
    return c <= 0.04045 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
  };
  return 0.2126 * channel(r) + 0.7152 * channel(g) + 0.0722 * channel(b);
}

function ratio(a: number, b: number) {
  return (Math.max(a, b) + 0.05) / (Math.min(a, b) + 0.05);
}

/** Walk up until we hit a background that actually paints, then pick a tone. */
function toneFor(start: Element | null): Tone {
  let node: Element | null = start;

  while (node && node !== document.documentElement) {
    const bg = getComputedStyle(node).backgroundColor;
    const onWhite = paint(bg, "#ffffff");
    const onBlack = paint(bg, "#000000");

    if (onWhite && onBlack) {
      // Identical over both grounds means the colour is opaque.
      const spread =
        Math.abs(onWhite[0] - onBlack[0]) +
        Math.abs(onWhite[1] - onBlack[1]) +
        Math.abs(onWhite[2] - onBlack[2]);

      if (spread < 12) {
        const bgLum = luminance(onWhite);
        let best: Tone = "ink";
        let bestRatio = 0;
        (Object.keys(TONES) as Tone[]).forEach((tone) => {
          const rgb = paint(TONES[tone], "#ffffff");
          if (!rgb) return;
          const r = ratio(luminance(rgb), bgLum);
          if (r > bestRatio) {
            bestRatio = r;
            best = tone;
          }
        });
        return best;
      }
    }

    node = node.parentElement;
  }

  return "ink";
}

export function CustomCursor() {
  const ref = useRef<HTMLDivElement>(null);
  const visibleRef = useRef(false);

  const [enabled, setEnabled] = useState(false);
  const [visible, setVisible] = useState(false);
  const [active, setActive] = useState(false);
  const [pressed, setPressed] = useState(false);
  const [tone, setTone] = useState<Tone>("ink");

  useEffect(() => {
    const fine = window.matchMedia("(hover: hover) and (pointer: fine)");
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)");

    // Touch devices have no cursor to replace, and hiding the system cursor is
    // hostile to anyone who has asked for reduced motion.
    if (!fine.matches || reduced.matches) return;

    setEnabled(true);
    document.documentElement.classList.add("has-custom-cursor");

    let frame = 0;
    let x = 0;
    let y = 0;

    const apply = () => {
      frame = 0;
      const el = ref.current;
      if (el) el.style.transform = `translate3d(${x}px, ${y}px, 0)`;
    };

    const onMove = (event: PointerEvent) => {
      x = event.clientX;
      y = event.clientY;
      if (!frame) frame = requestAnimationFrame(apply);
      if (!visibleRef.current) {
        visibleRef.current = true;
        setVisible(true);
      }
    };

    // Fires only when the element under the pointer changes, so the hit test
    // and colour sampling stay off the mousemove path.
    const onOver = (event: Event) => {
      const target = event.target as Element | null;
      const hit = target?.closest?.(VIEWABLE) ?? null;
      setActive(Boolean(hit));
      setTone(toneFor(target));
    };

    const onLeave = () => {
      visibleRef.current = false;
      setVisible(false);
      setPressed(false);
    };

    const onEnter = () => {
      visibleRef.current = true;
      setVisible(true);
    };

    const onDown = () => setPressed(true);
    // pointerup can land outside the window, so the release is also cleared
    // on cancel and on blur rather than only on the matching up.
    const onUp = () => setPressed(false);

    window.addEventListener("pointerdown", onDown, { passive: true });
    window.addEventListener("pointerup", onUp, { passive: true });
    window.addEventListener("pointercancel", onUp, { passive: true });
    window.addEventListener("pointermove", onMove, { passive: true });
    document.addEventListener("pointerover", onOver, true);
    document.addEventListener("pointerleave", onLeave);
    document.addEventListener("pointerenter", onEnter);
    window.addEventListener("blur", onLeave);

    return () => {
      if (frame) cancelAnimationFrame(frame);
      document.documentElement.classList.remove("has-custom-cursor");
      window.removeEventListener("pointerdown", onDown);
      window.removeEventListener("pointerup", onUp);
      window.removeEventListener("pointercancel", onUp);
      window.removeEventListener("pointermove", onMove);
      document.removeEventListener("pointerover", onOver, true);
      document.removeEventListener("pointerleave", onLeave);
      document.removeEventListener("pointerenter", onEnter);
      window.removeEventListener("blur", onLeave);
    };
  }, []);

  if (!enabled) return null;

  const color = TONES[tone];

  return (
    <div
      ref={ref}
      aria-hidden="true"
      className="pointer-events-none fixed top-0 left-0 z-[9999] will-change-transform"
      style={{ opacity: visible ? 1 : 0, transition: "opacity 150ms ease" }}
    >
      {/*
        The paw, as a clip rather than as a drawing. One element the whole
        time: clipped to this shape it either fills with ink, at rest, or
        inverts what is behind it, over a project. The shape never changes,
        only its size and what it does to the backdrop, so the small paw and
        the big lens are recognisably the same animal.

        clipPathUnits="objectBoundingBox" is what lets one path serve both
        sizes: the coordinates are fractions of the element, so the paw grows
        with the box instead of needing a second path.
      */}
      <svg width="0" height="0" aria-hidden="true" className="absolute">
        <clipPath id={CLIP_ID} clipPathUnits="objectBoundingBox">
          <ellipse cx="0.1917" cy="0.4333" rx="0.1083" ry="0.1417" transform="rotate(-22 0.1917 0.4333)" />
          <ellipse cx="0.3917" cy="0.2542" rx="0.1125" ry="0.1583" transform="rotate(-8 0.3917 0.2542)" />
          <ellipse cx="0.6083" cy="0.2542" rx="0.1125" ry="0.1583" transform="rotate(8 0.6083 0.2542)" />
          <ellipse cx="0.8083" cy="0.4333" rx="0.1083" ry="0.1417" transform="rotate(22 0.8083 0.4333)" />
          <path d="M0.5 0.5083C0.6792 0.5083 0.8292 0.625 0.8292 0.7625C0.8292 0.8792 0.7292 0.9375 0.625 0.9083C0.5417 0.8875 0.4583 0.8875 0.375 0.9083C0.2708 0.9375 0.1708 0.8792 0.1708 0.7625C0.1708 0.625 0.3208 0.5083 0.5 0.5083Z" />
        </clipPath>
      </svg>

      <div
        data-cursor-disc=""
        style={{
          width: active ? CURSOR_DISC_SIZE : PAW_SIZE,
          height: active ? CURSOR_DISC_SIZE : PAW_SIZE,
          marginLeft: active ? -CURSOR_DISC_SIZE / 2 : -PAW_SIZE / 2,
          marginTop: active ? -CURSOR_DISC_SIZE / 2 : -PAW_SIZE / 2,
          clipPath: `url(#${CLIP_ID})`,
          WebkitClipPath: `url(#${CLIP_ID})`,
          // At rest the paw is solid. Over a project it empties out and the
          // backdrop inverts inside the same outline, which is the effect the
          // circle used to carry. No label: the shape is the invitation.
          backgroundColor: active ? "transparent" : color,
          backdropFilter: active ? "invert(1)" : "none",
          WebkitBackdropFilter: active ? "invert(1)" : "none",
          transform: pressed
            ? active
              ? "scale(0.94)"
              : "scale(0.9, 0.78) translateY(1.5px)"
            : "scale(1)",
          transition:
            "width 260ms cubic-bezier(0.32,0.72,0,1), height 260ms cubic-bezier(0.32,0.72,0,1), margin 260ms cubic-bezier(0.32,0.72,0,1), background-color 200ms ease, transform 120ms ease-out",
        }}
      />
    </div>
  );
}
