import { Enclosure, EnclosureCell, Gutter, Label, Pill, TextLink } from "@/components/primitives";
import { listed } from "@/data/projects";

/*
 * The site footer. Rendered once from the root route, so it persists on every
 * page rather than belonging to the homepage.
 *
 * The Selected works column is derived from the project list rather than
 * duplicated, so titles and slugs stay in step with the homepage grid.
 */

const columns: Array<{
  label: string;
  items: Array<{ text: string; href?: string; pills?: string[]; external?: boolean }>;
}> = [
  {
    label: "Contact",
    items: [
      { text: "victorinenyagwala@gmail.com", href: "mailto:victorinenyagwala@gmail.com" },
      { text: "+254-798-975-590", href: "tel:+254798975590" },
      { text: "LinkedIn", href: "https://www.linkedin.com/in/victorine-nyagwala/" },
      // Served from public/, so it opens in the browser's PDF viewer rather
      // than downloading.
      { text: "CV", href: "/victorine-nyagwala-cv.pdf", external: true },
    ],
  },
  {
    label: "Selected works",
    items: listed.map((p) => ({ text: p.title, href: `/work/${p.slug}` })),
  },
  {
    label: "Info",
    items: [
      // Both of these used to point at pages that were never built, /about and
      // /exploration, and both answered 404. About is a section of the
      // homepage and is addressed as one, the same way the header does it;
      // Exploration is gone until there is a page to send anybody to.
      { text: "About", href: "/#about" },
      { text: "Open to", pills: ["Full time", "Consulting"] },
    ],
  },
];

export function SiteFooter() {
  return (
    <footer id="contact" className="bg-paper text-ink">
      <Gutter>
        <div className="pt-16 pb-20 sm:pt-24 sm:pb-28">
          {/* Addressed to whoever is reading, not to a client: the pills below
              already say which conversations are open. */}
          <h2 className="type-headline">Let&apos;s talk.</h2>
          {/* The address is one unbreakable string, and at the headline step
              it is wider than a phone's measure — given no break to take, it
              pushed every page on the site sideways. The <wbr> offers it the
              one break worth taking, at the @, rather than letting the line
              break wherever it runs out and leaving a letter stranded.
              Above about 410px it stays on one line and the wbr does nothing. */}
          <a
            href="mailto:victorinenyagwala@gmail.com"
            className="mt-6 inline-block type-headline text-ink underline decoration-ink/20 underline-offset-[6px] transition-colors hover:decoration-olive"
          >
            victorinenyagwala@<wbr />gmail.com
          </a>
          {/* The CV beside the address rather than only down in the columns:
              for the reader who is hiring, it is the second thing they want. */}
          <div className="mt-5">
            <TextLink
              href="/victorine-nyagwala-cv.pdf"
              target="_blank"
              rel="noreferrer"
              className="type-body font-semibold"
            >
              Read the CV
            </TextLink>
          </div>
        </div>

        <Enclosure columns={3}>
          {columns.map((col) => (
            <EnclosureCell
              key={col.label}
              className="flex flex-col justify-between py-9 md:min-h-[240px] md:py-10"
            >
              <Label dot className="text-ink/70">
                {col.label}
              </Label>
              <div className="mt-12 space-y-1.5 type-body text-ink">
                {col.items.map((item) =>
                  item.pills ? (
                    <div key={item.text} className="flex flex-wrap items-center gap-1.5">
                      <span className="text-ink/70">{item.text}</span>
                      {item.pills.map((pill) => (
                        <Pill key={pill}>{pill}</Pill>
                      ))}
                    </div>
                  ) : item.href ? (
                    <div key={item.text}>
                      <TextLink
                        href={item.href}
                        {...(item.external || item.href.startsWith("http")
                          ? { target: "_blank", rel: "noreferrer" }
                          : {})}
                      >
                        {item.text}
                      </TextLink>
                    </div>
                  ) : (
                    <div key={item.text}>{item.text}</div>
                  ),
                )}
              </div>
            </EnclosureCell>
          ))}
        </Enclosure>

        <div className="py-6">
          <Label className="text-ink/70">© {new Date().getFullYear()} Victorine Amani</Label>
        </div>
      </Gutter>
    </footer>
  );
}
