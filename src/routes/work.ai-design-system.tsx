import { createFileRoute } from "@tanstack/react-router";

import { CaseStudyHero, type MetaRow, type Outcome } from "@/components/CaseStudyHero";
import { Movement, Prose } from "@/components/CaseStudySection";
import { Diagram, Matrix, Row, Stack } from "@/components/Diagram";
import { MoreWork } from "@/components/MoreWork";
import { CodeBlock, Label } from "@/components/primitives";
import { layers, limits, scales, themeProof, workflows } from "@/data/ai-design-system";
import { shareImage } from "@/lib/share";

/*
 * An AI operable Design system.
 *
 * The one case study on this site with no interface to photograph. Its subject
 * is a token file, a comment block and a build, so it argues in source and in
 * measured values rather than in screens, and the measurements were taken off
 * the running project rather than repeated from the write-up.
 */

export const Route = createFileRoute("/work/ai-design-system")({
  head: ({ match }) => ({
    meta: [
      { title: "An AI operable Design system · Victorine Amani" },
      { name: "description", content: "A self-directed test project: build a design system an AI agent can use, then hand it real maintenance tasks and see whether the structure alone is enough." },
      { property: "og:title", content: "An AI operable Design system · Victorine Amani" },
      { property: "og:description", content: "Design systems, tokens and AI: a self-directed test project." },
      ...shareImage(match.context.origin, "ai-design-system", "The design-system case study: a board of colour tokens beside the title."),
    ],
  }),
  component: AiDesignSystem,
});

const meta: MetaRow[] = [
  { label: "Type", value: "Self-directed test project" },
  { label: "Role", value: "Design Systems / Product Design" },
  { label: "Stack", value: "React · Vite 8 · CSS Custom Properties" },
  { label: "Token source", value: "Untitled UI Pro v7.0" },
];

const outcomes: Outcome[] = [
  { figure: "842", note: "Custom properties in the system, 830 of them generated from the export" },
  { figure: "303", note: "Semantic tokens, each carrying a light value and a dark one" },
  { figure: "44", note: "Text styles emitted as reusable utility classes" },
  { figure: "4", note: "Maintenance jobs run end to end, each confirmed by a passing build" },
];

/* The resolution, written out. One alias, one semantic token, one value per
   way of asking for a colour scheme. */
const RESOLVED = `--color-bg-surface: var(--colors-background-bg-primary);

:root                                --colors-background-bg-primary: #ffffff;
@media (prefers-color-scheme: dark)  --colors-background-bg-primary: #0c0e12;
:root[data-theme="dark"]             --colors-background-bg-primary: #0c0e12;`;

const SPEC = `/**
 * @ai-component-spec
 * {
 *   "figmaName": "Components/BentoCard",
 *   "tokensUsed": ["--color-bg-surface", "--color-text-main",
 *                  "--radius-md", "--color-border-subtle", "--card-padding"]
 * }
 */`;

const APPLIED = `const cardStyle = {
  backgroundColor: 'var(--color-bg-surface)',
  color:           'var(--color-text-main)',
  borderRadius:    'var(--radius-md)',
  padding:         'var(--card-padding)',
  border:          '1px solid var(--color-border-subtle)',
};`;

/* What the layers hold, and what each one is for. The counts are from the
   generated files; only the last card contains a var(). */
function Layers() {
  return (
    <Diagram label="What the system is made of">
      <Row columns={3}>
        {layers.map((layer) => (
          <div key={layer.name} className="rounded-lg border border-ink/25 bg-paper px-6 py-6">
            <Label className="text-olive">{layer.name}</Label>
            <p className="mt-3 type-headline">{layer.count}</p>
            <p className="mt-3 type-body text-ink/75">{layer.holds}</p>
            <p className="mt-4 type-caption text-ink/45">{layer.note}</p>
          </div>
        ))}
      </Row>
    </Diagram>
  );
}

/* The chain a component actually walks, and the scales beside it. */
function Chain() {
  return (
    <div className="space-y-8">
      <Diagram label="The one indirection">
        <Stack
          layers={[
            {
              name: "What the component says",
              contents: ["--color-bg-surface"],
              note: "Five names, and not one of them a colour",
            },
            {
              name: "What the system answers",
              contents: ["--colors-background-bg-primary"],
              note: "A literal value, restated once per colour scheme",
            },
          ]}
        />
      </Diagram>

      <CodeBlock label="Resolved">{RESOLVED}</CodeBlock>

      <Diagram label="The scales underneath">
        <div className="mx-auto grid max-w-[62ch] grid-cols-1 gap-x-10 gap-y-4 sm:grid-cols-2">
          {scales.map((scale) => (
            <div
              key={scale.name}
              className="flex items-baseline justify-between gap-4 border-b border-ink/10 pb-3"
            >
              <span className="type-body text-ink/75">{scale.name}</span>
              <span className="type-body font-semibold">{scale.value}</span>
            </div>
          ))}
        </div>
      </Diagram>
    </div>
  );
}

/* The same component, the same five declarations, two colour schemes,
   measured off the running build rather than read off the source. */
function ThemeProof() {
  return (
    <Diagram label="One component, no theme code, two colour schemes">
      <div className="mx-auto max-w-[62ch]">
        <Matrix columns={themeProof.columns} rows={themeProof.rows} />
      </div>
    </Diagram>
  );
}

/* The contract, and the styles it is a contract about. */
function Contract() {
  return (
    <div className="space-y-8">
      <CodeBlock label="The declaration, written for the agent">{SPEC}</CodeBlock>
      <CodeBlock label="The styles it is answerable to">{APPLIED}</CodeBlock>
    </div>
  );
}

/* Four jobs, each one a thing a designer normally does by hand. */
function Workflows() {
  return (
    <Diagram label="What it was handed, and what it did">
      <Row columns={4}>
        {workflows.map((flow) => (
          <div key={flow.name} className="rounded-lg border border-ink/25 bg-paper px-6 py-6">
            <Label className="text-olive">{flow.name}</Label>
            <p className="mt-4 type-caption text-ink/45">The job</p>
            <p className="mt-1 type-body text-ink/75">{flow.input}</p>
            <p className="mt-4 type-caption text-ink/45">What it found</p>
            <p className="mt-1 type-body text-ink/75">{flow.finding}</p>
            <p className="mt-4 type-caption text-ink/45">What it did</p>
            <p className="mt-1 type-body text-ink/75">{flow.outcome}</p>
          </div>
        ))}
      </Row>
    </Diagram>
  );
}

function AiDesignSystem() {
  return (
    <CaseStudyHero
      title="An AI operable Design system"
      meta={meta}
      outcomes={outcomes}
      deck="Don't use AI to build a design system. Build a design system an AI agent can use, then hand it real maintenance tasks and see whether the structure alone is enough for it to make the right calls."
      note="A design system improves efficiency and consistency, but never at the cost of user experience. Great UX makes users feel in control."
    >
      <Movement title="The hypothesis">
        <Prose wide>
          A design system stops being documentation for developers and becomes instructions for a
          machine. What I wanted to find out was how much of that is true in practice, and what the
          system has to look like before it is.
        </Prose>
        <Prose wide>
          My guess was that three things had to hold: tokens layered by intent, a component that
          declares which tokens it uses, and a Figma export that matches the code. If all three
          held, an agent should be able to do the maintenance a designer usually does by hand.
          Finding hardcoded values, keeping Figma and the code in step, settling it when two
          sources disagree, checking that light and dark still match.
        </Prose>
        <Prose wide>
          Not a demo with two buttons. I used the real token payload of Untitled UI Pro v7.0:
          hundreds of primitives, a full light and dark semantic layer, type and elevation scales,
          all of it running in a Vite build. One component and a demo app was enough, because what
          I was testing was the token layer and not how many components I could draw.
        </Prose>
      </Movement>

      <Movement title="Token architecture" figure={<Layers />}>
        <Prose wide>
          Figma exports one tokens file, and a script turns it into one stylesheet per dataset.
          There are three layers in it, and only the top one is a lookup.
        </Prose>
        <Prose wide>
          The primitives are the palette Untitled UI ships: 375 colours named by hue and scale,
          plus 32 numbers. Nothing in the generated CSS refers to any of them. Above them is the
          semantic layer, where a token is named for its job, background or text or border or
          foreground, and each one carries its value three times over, once for each way a browser
          can be asked for a colour scheme.
        </Prose>
        <Prose wide>
          On top are twelve app aliases. These are the names the components use, and they are the
          only place a var() appears in the whole system. Below them every value is written out.
        </Prose>
        <Prose wide>
          That is what makes it readable by a machine. When the agent hits a name like
          --color-bg-surface it does not have to know anything about colour, only how to follow the
          name one step down.
        </Prose>
      </Movement>

      <Movement title="The chain, and what is under it" figure={<Chain />}>
        <Prose wide>
          One alias, one semantic token, one value for each scheme. There is no colour anywhere in
          the card's own code.
        </Prose>
        <Prose wide>
          Underneath are the scales the agent needs before it can work on a layout at all: radii,
          spacing, widths, containers, type, shadows and focus rings, the grid sets, and 44 text
          styles, which come out as classes so they can be used directly.
        </Prose>
      </Movement>

      <Movement title="Dark mode as proof" figure={<ThemeProof />}>
        <Prose wide>
          Dark mode is the easiest way to check the architecture holds. The component names
          aliases, the aliases point at semantic tokens, and the semantic layer swaps its values
          under both of the ways a browser can be asked for a dark scheme. So dark mode is
          automatic. No component knows it is in dark mode.
        </Prose>
        <Prose wide>
          The values beside this come off the running build, read in both schemes. Three of the
          five change and two do not. The padding and the radius belong to the contract as much as
          the colours do, and a theme has no business moving either one.
        </Prose>
        <Prose wide>
          The agent had already caught this going the other way. A hardcoded border colour and a
          hardcoded 24px padding were sitting in the card where tokens should have been, and a
          theme would not have touched either of them.
        </Prose>
      </Movement>

      <Movement title="The component contract" figure={<Contract />}>
        <Prose wide>
          The bridge between the design and the code is a machine-readable spec embedded in the
          component itself. It is written for the agent, not for a person browsing Figma.
        </Prose>
        <Prose wide>
          It lists the tokens the component is supposed to use, so the agent can put that list
          next to the styles actually applied and report where the two have come apart. That is
          the difference between a card component and a contract the agent can audit against.
        </Prose>
      </Movement>

      <Movement title="What the agent did" figure={<Workflows />}>
        <Prose wide>
          Each of these is a job a designer normally does by hand. They worked because the agent
          could read the architecture, put the export next to the code, and make the call from the
          names it found there.
        </Prose>
        <Prose wide>
          The last one is the one I care about. I asked only whether the code and Figma were in
          sync. It went and checked every token, sorted what was missing from what was redundant,
          and when the two sources gave different answers it applied the one rule I had written
          down instead of guessing. Every change was checked against a production build.
        </Prose>
      </Movement>

      <Movement title="Where it hit a wall">
        <Prose wide>
          Live reads from Figma go through the Figma MCP, and that is where this ran out of
          room.
        </Prose>
        {limits.map((limit) => (
          <Prose key={limit} wide>
            {limit}
          </Prose>
        ))}
        <Prose wide>
          So I fell back on a manual export, and the export became the hand-off: primitive and
          semantic collections laid out the same way the stylesheets are, with the text, effect and
          grid styles beside them. The agent could find the part it needed because the file is
          split along the same lines as the system.
        </Prose>
      </Movement>

      <Movement title="What I learned">
        <Prose wide>
          Quality becomes measurable. When every token has a semantic name, every component
          declares the tokens it uses and every Figma variable maps to a custom property, the state
          of a design system stops being something you have an opinion about and becomes something
          you can count. The agent can show you where the gaps are.
        </Prose>
        <Prose wide>
          The limitation was real and survivable. Live Figma access needed tooling this test did
          not have, so a structured export and a contract written into the component did the same
          job. The system worked without the enterprise tier.
        </Prose>
        <Prose wide>
          And the craft is in the vocabulary, not the assembly. An agent working from a poorly
          made system produces forgettable work. Put the same agent inside one with deliberate
          colour, considered type and opinionated spacing, and what comes out looks designed. The
          design system is no longer documentation for developers. It is instructions for a
          machine, and the quality of those instructions is the design work.
        </Prose>
      </Movement>

      <MoreWork current="ai-design-system" />
    </CaseStudyHero>
  );
}
