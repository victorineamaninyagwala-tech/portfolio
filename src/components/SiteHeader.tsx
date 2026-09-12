import { Gutter, Label, TextLink } from "@/components/primitives";

/*
 * The site header. Rendered once from the root route, so it persists on every
 * page rather than belonging to the homepage.
 *
 * Work, About and Contact are sections of the homepage, so they are addressed
 * as /#work, /#about and /#contact — a bare hash would do nothing on a case
 * study page. Exploration is a page of its own. The last two are the asks:
 * a way to get in touch and the CV, reachable from the top of every page
 * rather than only from the foot of it.
 */

const CV = "/victorine-nyagwala-cv.pdf";

const links = [
  { label: "Work", href: "/#work" },
  { label: "About", href: "/#about" },
  { label: "Exploration", href: "/exploration" },
  { label: "Contact", href: "/#contact" },
  // Served from public/, so it opens in the browser's PDF viewer.
  { label: "CV", href: CV, external: true },
];

export function SiteHeader() {
  return (
    <header className="bg-paper text-ink">
      <Gutter className="flex h-16 items-center justify-between">
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
        <nav className="hidden items-center gap-8 type-body sm:flex">
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

        {/* One link fits beside the name on a phone; the one that matters most
            is the way to get in touch. */}
        <a href="/#contact" className="sm:hidden">
          <Label className="text-olive">Contact</Label>
        </a>
      </Gutter>
    </header>
  );
}
