import { Gutter, TextLink } from "@/components/primitives";

/*
 * The site header. Rendered once from the root route, so it persists on every
 * page rather than belonging to the homepage.
 *
 * Work and Contact are sections of the homepage, so they are addressed as
 * /#work and /#contact — a bare hash would do nothing on a case study page.
 * About is a page. The last two are the asks: a way to get in touch and the CV,
 * reachable from the top of every page rather than only from the foot of it.
 *
 * There was an Exploration link here, pointing at a page that was never
 * built. It is out of both the nav and the footer until there is something
 * behind it.
 *
 * All five show on a phone. They do not fit on one line beside the name, so
 * below the small breakpoint the header is two rows — the name, then the
 * navigation under it, wrapping if the screen is narrow enough to need it.
 * The alternative, which this replaces, was to show Contact alone and leave
 * the other four reachable only from the foot of the page.
 */

const CV = "/victorine-nyagwala-cv.pdf";

const links = [
  { label: "Work", href: "/#work" },
  { label: "About", href: "/about" },
  { label: "Contact", href: "/#contact" },
  // Served from public/, so it opens in the browser's PDF viewer.
  { label: "CV", href: CV, external: true },
];

export function SiteHeader() {
  return (
    <header className="bg-paper text-ink">
      <Gutter className="flex flex-col gap-3 py-4 sm:h-16 sm:flex-row sm:items-center sm:justify-between sm:gap-6 sm:py-0">
        {/* A link now that the header is site-wide: on a case study this is the
            way back to the homepage. */}
        <a
          href="/"
          className="type-body font-semibold transition-colors hover:text-ink/60"
        >
          Victorine Amani
        </a>

        {/* Same step as the footer's link columns, so the two sets of
            navigation read as one system. */}
        <nav className="flex flex-wrap items-center gap-x-5 gap-y-2 type-body sm:gap-8">
          {links.map((link) => (
            <TextLink
              key={link.label}
              href={link.href}
              {...(link.external ? { target: "_blank", rel: "noreferrer" } : {})}
            >
              {link.label}
            </TextLink>
          ))}
        </nav>
      </Gutter>
    </header>
  );
}
