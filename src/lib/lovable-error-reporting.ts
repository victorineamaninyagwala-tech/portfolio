/*
 * Error reporting shim.
 *
 * The Lovable preview host listens for `lovable:error` postMessages from the
 * embedded app. Outside that host (local dev, production) this degrades to a
 * console.error, so callers never need to guard.
 */

type ErrorContext = Record<string, unknown>;

export function reportLovableError(error: unknown, context: ErrorContext = {}) {
  const normalized =
    error instanceof Error
      ? { name: error.name, message: error.message, stack: error.stack }
      : { name: "UnknownError", message: String(error), stack: undefined };

  console.error("[error]", normalized.message, context, error);

  if (typeof window === "undefined") return;

  try {
    window.parent?.postMessage(
      {
        type: "lovable:error",
        error: normalized,
        context,
        url: window.location.href,
      },
      "*",
    );
  } catch {
    // postMessage can throw across origins — reporting must never break the UI.
  }
}
