import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  Outlet,
  Link,
  createRootRouteWithContext,
  useRouter,
  HeadContent,
  Scripts,
  type ErrorComponentProps,
} from "@tanstack/react-router";
import type { ReactNode } from "react";

import appCss from "../styles.css?url";
import { getOrigin } from "../lib/share";
import { CustomCursor } from "../components/CustomCursor";
import { SiteFooter } from "../components/SiteFooter";
import { SiteHeader } from "../components/SiteHeader";
import { PRELOADED_CLASS, Preloader, hasPreloaded } from "../components/Preloader";

/*
 * The 404.
 *
 * The number sits on a shelf and the nought has been knocked off it: it holds
 * for a beat, drops, bounces once and settles on its side a little to the
 * right of where it fell, because nothing lands where it was pushed from.
 *
 * Nothing is drawn. Whatever did it is off the page, which is the only version
 * of this joke that does not need a character, a licence or a second asset,
 * and the only one that still works if the rest of the site never mentions a
 * cat. Under prefers-reduced-motion the nought is simply already down.
 */
function NotFoundComponent() {
  return (
    <div className="flex min-h-[70vh] items-center justify-center bg-paper px-4 text-ink">
      <div className="max-w-md text-center">
        <h1 className="sr-only">404: page not found</h1>

        {/* The shelf. Room is kept for the nought so the two fours do not
            close the gap it left. */}
        <div className="relative mx-auto w-fit pb-[1.6em]">
          <p aria-hidden="true" className="flex gap-[0.08em] type-display leading-none">
            <span>4</span>
            <span className="invisible">0</span>
            <span>4</span>
          </p>
          <div className="mt-2 border-t border-ink/15" />
          <span aria-hidden="true" className="nf-nought absolute top-0 left-1/2 type-display leading-none">
            0
          </span>
        </div>

        <p className="mt-2 type-body text-ink/70">Nothing at this address.</p>
        <div className="mt-6">
          <Link
            to="/"
            className="inline-flex items-center justify-center border border-ink bg-ink px-5 py-2.5 type-label font-semibold text-paper transition-colors hover:bg-ink/85"
          >
            Go home
          </Link>
        </div>
      </div>
    </div>
  );
}

/* The router hands the error through as unknown, so nothing here may assume
   it is an Error. It is only logged. */
function ErrorComponent({ error, reset }: ErrorComponentProps) {
  console.error(error);
  const router = useRouter();

  return (
    <div className="flex min-h-[70vh] items-center justify-center bg-paper px-4 text-ink">
      <div className="max-w-md text-center">
        <h1 className="type-title">
          This page didn't load
        </h1>
        <p className="mt-4 type-body text-ink/70">
          Something went wrong on our end. You can try refreshing or head back home.
        </p>
        <div className="mt-6 flex flex-wrap justify-center gap-2">
          <button
            onClick={() => {
              router.invalidate();
              reset();
            }}
            className="inline-flex items-center justify-center border border-ink bg-ink px-5 py-2.5 type-label font-semibold text-paper transition-colors hover:bg-ink/85"
          >
            Try again
          </button>
          <a
            href="/"
            className="inline-flex items-center justify-center border border-ink/25 px-5 py-2.5 type-label font-semibold text-ink transition-colors hover:border-ink"
          >
            Go home
          </a>
        </div>
      </div>
    </div>
  );
}

export const Route = createRootRouteWithContext<{ queryClient: QueryClient }>()({
  /* Where the site is being served from, put into context so any route can
     write an absolute URL: the share image needs one. */
  beforeLoad: () => ({ origin: getOrigin() }),
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { name: "author", content: "Victorine Amani" },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [
      {
        rel: "stylesheet",
        href: appCss,
      },
      { rel: "preconnect", href: "https://fonts.googleapis.com" },
      { rel: "preconnect", href: "https://fonts.gstatic.com", crossOrigin: "anonymous" },
      /* Switzer sets the whole site now, headings and text alike, and it is
         not a Google face, so Fontshare is the origin that matters and Google
         is left serving one thing: the face the Selected Work heading swaps
         its letters into on hover. */
      { rel: "preconnect", href: "https://api.fontshare.com" },
      { rel: "preconnect", href: "https://cdn.fontshare.com", crossOrigin: "anonymous" },
      /* The heading weight, fetched beside the stylesheet rather than after
         the browser has parsed it. Without this the hero paints in Arial and
         reflows into Switzer a moment later, which is the first thing anyone
         sees. The URL is Fontshare's own hashed file for switzer@500: if they
         ever rotate it this preload simply goes unused and the stylesheet
         below still loads the face. */
      {
        rel: "preload",
        as: "font",
        type: "font/woff2",
        crossOrigin: "anonymous",
        href: "https://cdn.fontshare.com/wf/OYB4CXKJQXKTNSLJMTDQOIVUL2V5EL7S/WYO2P7DQVV5RNXGMCUO2HL4RJP4VFUAS/6XPIMU23OJVRY676OG5YVJMWEHWICATX.woff2",
      },
      {
        rel: "stylesheet",
        href: "https://fonts.googleapis.com/css2?family=Caacupe+One&display=swap",
      },
      /* 400 sets running text, 500 sets the display step, 600 is what every
         label and named thing on the site is set in. */
      {
        rel: "stylesheet",
        href: "https://api.fontshare.com/v2/css?f%5B%5D=switzer@400,500,600&display=swap",
      },
      { rel: "icon", href: "/favicon.svg", type: "image/svg+xml" },
      { rel: "icon", href: "/favicon.ico", type: "image/x-icon" },
    ],
    /*
     * The native cursor goes before the first paint, not after hydration.
     *
     * Every internal link is a document navigation, so each page arrives as a
     * fresh document. Adding the class from the cursor component's effect
     * leaves a window between paint and hydration where the real cursor is
     * showing, and over the link that was just clicked the real cursor is a
     * hand. Running the same two media checks here closes that window.
     *
     * It stays in JavaScript rather than moving into the stylesheet so that a
     * reader without JavaScript, who would get no custom cursor, is not left
     * with no cursor at all.
     */
    scripts: [
      {
        children:
          "try{var m=window.matchMedia;if(m('(hover: hover) and (pointer: fine)').matches&&!m('(prefers-reduced-motion: reduce)').matches){document.documentElement.classList.add('has-custom-cursor')}}catch(e){}",
      },
    ],
  }),

  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
  errorComponent: ErrorComponent,
});

function RootShell({ children }: { children: ReactNode }) {
  /* Rendered on the server from the session cookie, so a visitor the
     preloader has already played for gets a page with no panel in it at all:
     nothing to hide after the fact, nothing to flash. */
  const preloaded = hasPreloaded();
  return (
    /* The cookie can only differ between server and client if another tab set
       it mid-load; that one attribute is allowed to reconcile quietly. */
    <html lang="en" className={preloaded ? PRELOADED_CLASS : undefined} suppressHydrationWarning>
      <head>
        <HeadContent />
        {/* Without JavaScript the sequence cannot run, so the panel must not
            be there at all: the page is server-rendered underneath it. */}
        <noscript>
          <style>{".preloader{display:none}"}</style>
        </noscript>
      </head>
      <body>
        {children}
        <Scripts />
      </body>
    </html>
  );
}

function RootComponent() {
  const { queryClient } = Route.useRouteContext();

  return (
    <QueryClientProvider client={queryClient}>
      {/* First on a first visit, and gone once it has played. */}
      <Preloader />
      {/* Site-wide, so every page carries the same masthead and nav. */}
      <SiteHeader />
      {/* Required: nested routes render here. Removing <Outlet /> breaks all child routes. */}
      <Outlet />
      {/* Site-wide, so every page ends on the same contact block. */}
      <SiteFooter />
      <CustomCursor />
    </QueryClientProvider>
  );
}
