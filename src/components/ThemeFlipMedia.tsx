import { useEffect, useRef, useState } from "react";

/*
 * The image well on the design system card.
 *
 * That project has no interface to walk through and no logo to open from. What
 * it has is the claim the whole case study rests on: the component carries no
 * theme code, and the values underneath it swap. So the card makes that claim
 * rather than describing it.
 *
 * At rest it shows the token board. On hover the demo arrives in light and then
 * turns over into dark, which is the same build photographed twice with nothing
 * changed between the two but the colour scheme asked for.
 *
 * Suppressed under prefers-reduced-motion: the board just sits.
 */

/** Long enough to read the screen before it turns over. */
const HOLD_LIGHT = 900;
const FADE_MS = 420;

type Still = { src: string; alt: string };

export function ThemeFlipMedia({
  cover,
  light,
  dark,
}: {
  cover: Still;
  light: Still;
  dark: Still;
}) {
  /* 0 the board, 1 the demo in light, 2 the demo in dark. */
  const [step, setStep] = useState(0);
  const timers = useRef<Array<ReturnType<typeof setTimeout>>>([]);

  const clear = () => {
    timers.current.forEach(clearTimeout);
    timers.current = [];
  };
  useEffect(() => clear, []);

  const start = () => {
    if (step !== 0) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    setStep(1);
    timers.current.push(setTimeout(() => setStep(2), FADE_MS + HOLD_LIGHT));
  };

  const reset = () => {
    clear();
    setStep(0);
  };

  return (
    <div
      onPointerEnter={start}
      onPointerLeave={reset}
      className="relative aspect-[4/5] min-h-[70vh] w-full overflow-hidden bg-ground"
    >
      {/* The board fills the well; the two stills are the shape of the well
          already, so nothing is cropped off either of them. */}
      <img
        src={cover.src}
        alt={cover.alt}
        className="absolute inset-0 size-full object-cover transition-opacity duration-500"
        style={{ opacity: step === 0 ? 1 : 0 }}
      />
      <img
        src={light.src}
        alt=""
        aria-hidden="true"
        loading="lazy"
        decoding="async"
        className="absolute inset-0 size-full object-cover transition-opacity"
        style={{ opacity: step === 1 ? 1 : 0, transitionDuration: `${FADE_MS}ms` }}
      />
      <img
        src={dark.src}
        alt=""
        aria-hidden="true"
        loading="lazy"
        decoding="async"
        className="absolute inset-0 size-full object-cover transition-opacity"
        style={{ opacity: step === 2 ? 1 : 0, transitionDuration: `${FADE_MS}ms` }}
      />
    </div>
  );
}
