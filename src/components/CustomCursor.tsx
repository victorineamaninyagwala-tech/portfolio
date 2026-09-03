import { useEffect, useRef, useState } from "react";

/*
 * Replaces the system cursor with two states:
 *   - a small dot over ordinary content, and over text links (those get the
 *     sliding arrow from the .hover-arrow class instead)
 *   - a large labelled disc over surfaces that opt in with data-cursor="view",
 *     which is the treatment for cards and image blocks
 *
 * The disc picks whichever of ink / paper / grey contrasts best with the
 * background underneath it, so it stays visible on any surface. Override the
 * label per element with data-cursor-label="Read".
 */

/** Diameter of the disc shown over data-cursor="view" surfaces. */
export const CURSOR_DISC_SIZE = 88;

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
  const [label, setLabel] = useState("View");
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
      setLabel(hit?.getAttribute("data-cursor-label") ?? "View");
      setTone(toneFor(target));
    };

    const onLeave = () => {
      visibleRef.current = false;
      setVisible(false);
    };

    const onEnter = () => {
      visibleRef.current = true;
      setVisible(true);
    };

    window.addEventListener("pointermove", onMove, { passive: true });
    document.addEventListener("pointerover", onOver, true);
    document.addEventListener("pointerleave", onLeave);
    document.addEventListener("pointerenter", onEnter);
    window.addEventListener("blur", onLeave);

    return () => {
      if (frame) cancelAnimationFrame(frame);
      document.documentElement.classList.remove("has-custom-cursor");
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
      <div
        data-cursor-disc=""
        className="flex items-center justify-center rounded-full"
        style={{
          width: active ? CURSOR_DISC_SIZE : 9,
          height: active ? CURSOR_DISC_SIZE : 9,
          marginLeft: active ? -CURSOR_DISC_SIZE / 2 : -4.5,
          marginTop: active ? -CURSOR_DISC_SIZE / 2 : -4.5,
          // Over a project the disc is a lens: no fill, the backdrop inverts.
          // border-radius clips the filter, so only the circle is affected.
          backgroundColor: active ? "transparent" : color,
          backdropFilter: active ? "invert(1)" : "none",
          WebkitBackdropFilter: active ? "invert(1)" : "none",
          transition:
            "width 260ms cubic-bezier(0.32,0.72,0,1), height 260ms cubic-bezier(0.32,0.72,0,1), margin 260ms cubic-bezier(0.32,0.72,0,1), background-color 200ms ease",
        }}
      >
        <span
          // Size and tracking come from the scale; only the tone and the fade
          // have to be computed here.
          className="type-caption"
          style={{
            color: tone === "paper" ? TONES.ink : TONES.paper,
            opacity: active ? 1 : 0,
            transition: "opacity 160ms ease",
          }}
        >
          {label}
        </span>
      </div>
    </div>
  );
}
