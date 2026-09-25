import { createFileRoute } from "@tanstack/react-router";

import { CaseStudyHero, type MetaRow, type Outcome } from "@/components/CaseStudyHero";
import { Movement, Prose } from "@/components/CaseStudySection";
import { Diagram, Matrix, Row, Stack } from "@/components/Diagram";
import { MoreWork } from "@/components/MoreWork";
import { CodeBlock, Label } from "@/components/primitives";
import { layers, limits, scales, themeProof, workflows } from "@/data/ai-design-system";
import { shareImage } from "@/lib/share";

/*
 * A design system an AI agent can operate.
 *
 * The one case study on this site with no interface to photograph. Its subject
 * is a token file, a comment block and a build, so it argues in source and in
 * measured values rather than in screens — and the measurements were taken off
 * the running project rather than repeated from the write-up.
 */

export const Route = createFileRoute("/work/ai-design-system")({
  head: ({ match }) => ({
    meta: [
      { title: "A design system an AI agent can operate · Victorine Amani" },
      { name: "description", content: "A self-directed test project: build a design system an AI agent can use, then hand it real maintenance tasks and see whether the structure alone is enough." },
      { property: "og:title", content: "A design system an AI agent can operate · Victorine Amani" },
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

/* The same component, the same five declarations, two colour schemes —
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
      title="A design system an AI agent can operate"
      meta={meta}
      outcomes={outcomes}
      deck="Don't use AI to build a design system. Build a design system an AI agent can use, then hand it real maintenance tasks and see whether the structure alone is enough for it to make the right calls."
      note="A design system improves efficiency and consistency, but never at the cost of user experience. Great UX makes users feel in control."
    >
      <Movement title="The hypothesis">
        <Prose wide>
          A design system stops being documentation for developers and becomes instructions for a
          machine. If the token architecture is semantically layered, the component declares which
          tokens it uses, and the Figma export mirrors the code, then an agent should be able to do
          maintenance that normally needs a designer: catching hardcoded values, keeping Figma and
          code in step, reconciling sources that disagree, and holding light and dark together.
        </Prose>
        <Prose wide>
          Not a demo with two buttons. I used the real token payload of Untitled UI Pro v7.0 —
          hundreds of primitives, a full light and dark semantic layer, type and elevation scales —
          driving an actual Vite build.
        </Prose>
        <Prose wide>
          The scope was deliberately narrow: one real component and a demo app. The complexity
          under test was the token layer, not the component count.
        </Prose>
      </Movement>

      <Movement title="Token architecture" figure={<Layers />}>
        <Prose wide>
          The system exports from Figma as a single tokens file and generates one stylesheet per
          dataset. Three layers, and only one of them is a lookup.
        </Prose>
        <Prose wide>
          The primitives are the palette the export ships — 375 colours named by hue and scale, and
          32 numbers. Nothing in the generated CSS names one. The semantic layer sits above them
          and carries intent rather than colour, and every semantic token holds its own value three
          times over, once under each way of asking for a colour scheme.
        </Prose>
        <Prose wide>
          On top sit twelve app aliases: the only words a component is allowed to say, and the only
          place a var() appears anywhere in the system. Everything beneath that line is a literal
          value.
        </Prose>
        <Prose wide>
          That is what makes it machine-readable. Meeting a name like --color-bg-surface, the agent
          does not need colour theory. It needs a name it can follow.
        </Prose>
      </Movement>

      <Movement title="The chain, and what is under it" figure={<Chain />}>
        <Prose wide>
          One alias, one semantic token, one value per scheme. The component never learns what
          colour it is.
        </Prose>
        <Prose wide>
          Underneath sit the scales the agent needs before it can reason about a layout at all:
          radii, spacing, widths, containers, type, shadows and focus rings, the grid sets, and 44
          text styles emitted as classes rather than left as descriptions.
        </Prose>
      </Movement>

      <Movement title="Dark mode as proof" figure={<ThemeProof />}>
        <Prose wide>
          Dark mode is the simplest test of whether the architecture holds. The component names
          aliases, the aliases point at semantic tokens, and the semantic layer swaps its values
          under the two ways a browser can be asked for a dark scheme. So dark mode is automatic.
          No component knows it is in dark mode.
        </Prose>
        <Prose wide>
          The values beside this were measured off the running build in both schemes. Three of the
          five change and two do not, which is the point: the padding and the radius are as much
          part of the contract as the colours, and neither is a thing a theme should move.
        </Prose>
        <Prose wide>
          The agent had already caught the inverse case. A hardcoded border colour and a hardcoded
          24px padding sat in the card where tokens should have been, and neither would have
          answered to a theme at all.
        </Prose>
      </Movement>

      <Movement title="The component contract" figure={<Contract />}>
        <Prose wide>
          The bridge between the design and the code is a machine-readable spec embedded in the
          component itself. It is written for the agent, not for a person browsing Figma.
        </Prose>
        <Prose wide>
          It declares which tokens the component is supposed to use, so the agent can hold that
          declaration against the styles actually applied and say where the two have drifted apart.
          It is the difference between a card component and a contract something can be audited
          against.
        </Prose>
      </Movement>

      <Movement title="What the agent did" figure={<Workflows />}>
        <Prose wide>
          Each of these is a job a designer normally does by hand. Each one worked because the
          agent could read the architecture, hold the export against the code, and decide from the
          naming rather than from a script.
        </Prose>
        <Prose wide>
          The part that mattered is the last one. Asked only whether code and Figma were in sync,
          it decided by itself to check every token, separate what was missing from what was
          redundant, and — where two sources disagreed outright — settle it against a single
          declared rule rather than picking. Every change was verified by a production build.
        </Prose>
      </Movement>

      <Movement title="Where it hit a wall">
        <Prose wide>
          Reading Figma live went through the Figma MCP, and that is where the test ran out of
          room.
        </Prose>
        {limits.map((limit) => (
          <Prose key={limit} wide>
            {limit}
          </Prose>
        ))}
        <Prose wide>
          So instead of reading variables live I fell back on a manual export as the hand-off, and
          that export is the contract: primitive and semantic collections mirroring the stylesheet
          structure, with the text, effect and grid styles beside them. The agent knew which part
          to ask for because the structure is explicit rather than a monolith with everything mixed
          together.
        </Prose>
      </Movement>

      <Movement title="What I learned">
        <Prose wide>
          Quality becomes measurable. When every token has a semantic name, every component
          declares the tokens it uses and every Figma variable maps to a custom property, the
          health of a design system stops being a feeling and becomes a number — and the agent can
          point at exactly where the gaps are.
        </Prose>
        <Prose wide>
          The limitation was real and survivable. Live Figma access needed tooling this test did
          not have. A structured export and a contract written into the component served the same
          purpose, and the system worked without the enterprise tier.
        </Prose>
        <Prose wide>
          And the craft is in the vocabulary, not the assembly. An agent assembling from a poorly
          made system produces forgettable work. Operating inside one with deliberate colour,
          considered type and opinionated spacing, the same agent produces something that looks
          designed. The design system is no longer documentation for developers. It is instructions
          for a machine, and the quality of those instructions is the design work.
        </Prose>
      </Movement>

      <MoreWork current="ai-design-system" />
    </CaseStudyHero>
  );
}
