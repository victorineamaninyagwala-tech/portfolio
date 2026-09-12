import { createIsomorphicFn } from "@tanstack/react-start";
import { getRequestUrl } from "@tanstack/react-start/server";

/*
 * The share card: what a link to a page turns into when it is pasted somewhere.
 *
 * Scrapers do not resolve a relative og:image against the page, so the URL has
 * to be absolute, and the site has no idea where it is being served from until
 * a request arrives. So the origin is read off the request rather than written
 * into a setting: a preview deployment shares its own pictures, production
 * shares its own, and nobody has to remember to change anything between them.
 */

export const getOrigin = createIsomorphicFn()
  /* Behind a proxy the request reaches us on an internal host; the forwarded
     header carries the one the visitor typed. */
  .server(() => getRequestUrl({ xForwardedHost: true }).origin)
  .client(() => window.location.origin);

/* Every card is drawn at the size the platforms agree on. */
export const CARD_WIDTH = 1200;
export const CARD_HEIGHT = 630;

/**
 * The meta tags for a page's share card. The picture itself lives in
 * public/og, one per page, drawn from the site's own type and pictures by
 * scripts/share-cards.cjs — run that again after a cover, a title or the type
 * changes, or the card will go on showing the old one.
 */
export function shareImage(origin: string, slug: string, alt: string) {
  return [
    { property: "og:image", content: `${origin}/og/${slug}.jpg` },
    { property: "og:image:width", content: String(CARD_WIDTH) },
    { property: "og:image:height", content: String(CARD_HEIGHT) },
    { property: "og:image:alt", content: alt },
  ];
}
