import { Gutter } from "@/components/primitives";
import { projects } from "@/data/projects";

/*
 * The two pieces of work that follow this one, offered at the foot of a case
 * study so the page has somewhere to go other than back.
 *
 * They are read from the same list the homepage and the footer use, in the same
 * order, and the list wraps: the last case study points at the first two.
 */

const HOW_MANY = 2;

export function MoreWork({ current }: { current: string }) {
  const here = projects.findIndex((p) => p.slug === current);
  if (here === -1) return null;

  const next = Array.from(
    { length: HOW_MANY },
    (_, i) => projects[(here + 1 + i) % projects.length],
  );

  return (
    <section>
      <Gutter>
        <div className="grid grid-cols-12 gap-y-10 border-t border-ink/10 pt-12 pb-16 sm:pt-16 sm:pb-24">
          <h2 className="col-span-12 type-headline md:col-span-4">See other works</h2>

          <div className="col-span-12 grid gap-8 sm:grid-cols-2 md:col-span-7 md:col-start-6">
            {next.map((project) => {
              const image = project.images?.[0];
              return (
                <a
                  key={project.slug}
                  href={`/work/${project.slug}`}
                  className="group block focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-olive"
                  data-cursor="view"
                >
                  {image ? (
                    <div className="aspect-[4/5] w-full overflow-hidden rounded-lg bg-ground">
                      <img
                        src={image.src}
                        alt={image.alt}
                        className="size-full object-cover transition-transform duration-500 group-hover:scale-[1.03]"
                      />
                    </div>
                  ) : null}
                  <h3 className="mt-4 type-body font-semibold transition-colors group-hover:text-olive">
                    {project.title}
                  </h3>
                  <p className="mt-1 type-caption text-ink/70">{project.discipline}</p>
                </a>
              );
            })}
          </div>
        </div>
      </Gutter>
    </section>
  );
}
