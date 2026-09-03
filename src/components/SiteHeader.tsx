import { Gutter, Label, TextLink } from "@/components/primitives";

/*
 * The site header. Rendered once from the root route, so it persists on every
 * page rather than belonging to the homepage.
 *
 * Work and About are sections of the homepage, so they are addressed as /#work
 * and /#about — a bare hash would do nothing on a case study page. Exploration
 * is a page of its own. Contact is not in the nav: the footer carries it on
 * every page.
 */

const links = [
  { label: "Work", href: "/#work" },
  { label: "About", href: "/#about" },
  { label: "Exploration", href: "/exploration" },
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
            <TextLink key={link.label} href={link.href}>
              {link.label}
            </TextLink>
          ))}
        </nav>

        <a href="/exploration" className="sm:hidden">
          <Label className="text-olive">Exploration</Label>
        </a>
      </Gutter>
    </header>
  );
}
