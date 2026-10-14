import { createFileRoute } from "@tanstack/react-router";

import { CaseStudyHero, type MetaRow, type Outcome } from "@/components/CaseStudyHero";
import { Movement, Prose } from "@/components/CaseStudySection";
import { Diagram, Matrix, Row } from "@/components/Diagram";
import { MoreWork } from "@/components/MoreWork";
import { CodeBlock, Label } from "@/components/primitives";
import { layers, scales, tasks, themeProof } from "@/data/ai-design-system";
import { shareImage } from "@/lib/share";

/*
 * An AI operable Design system.
 *
 * Her document, set. The one case study here with no interface to photograph,
 * so it argues in source and in measured values: the token files, the spec in
 * the component, and the computed styles of the running build in both colour
 * schemes.
 */

/* The summary at the top of the page. */
const DECK =
  "As part of incorporating AI into my design workflow, I experimented with building a design pipeline around a coherent design system and component library that an AI agent could reference during the design process. I tested how well the structure supported component maintenance, token generation, and resolving inconsistencies between design and code.";

/* What a search result and a shared link carry. The deck above runs to about
   350 characters, which is more than either will show, so this is its second
   sentence: her words, at a length that survives the truncation. */
const DESCRIPTION =
  "I tested how well the structure supported component maintenance, token generation, and resolving inconsistencies between design and code.";

export const Route = createFileRoute("/work/ai-design-system")({
  head: ({ match }) => ({
    meta: [
      { title: "An AI operable Design system · Victorine Amani" },
      { name: "description", content: DESCRIPTION },
      { property: "og:title", content: "An AI operable Design system · Victorine Amani" },
      { property: "og:description", content: DESCRIPTION },
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
  { figure: "843", note: "Custom properties, including 830 generated from the export" },
  { figure: "303", note: "Semantic tokens with light and dark values" },
  { figure: "44", note: "Reusable text-style utility classes" },
  { figure: "4", note: "Maintenance tasks completed and verified with a passing production build" },
];

/* How one alias resolves, written out. */
const RESOLUTION = `--color-bg-surface: var(--colors-background-bg-primary);

:root {
  --colors-background-bg-primary: #ffffff;
}

@media (prefers-color-scheme: dark) {
  :root {
    --colors-background-bg-primary: #0c0e12;
  }
}

:root[data-theme="dark"] {
  --colors-background-bg-primary: #0c0e12;
}`;

const SPEC = `/**
 * @ai-component-spec
 * {
 *   "figmaName": "Components/BentoCard",
 *   "tokensUsed": [
 *     "--color-bg-surface",
 *     "--color-text-main",
 *     "--radius-md",
 *     "--color-border-subtle",
 *     "--card-padding"
 *   ]
 * }
 */`;

const APPLIED = `const cardStyle = {
  backgroundColor: 'var(--color-bg-surface)',
  color: 'var(--color-text-main)',
  borderRadius: 'var(--radius-md)',
  padding: 'var(--card-padding)',
  border: '1px solid var(--color-border-subtle)',
};`;

/* The three layers, with the count each one holds. */
function Layers() {
  return (
    <Diagram label="Token layers">
      <Row columns={3}>
        {layers.map((layer) => (
          <div key={layer.name} className="rounded-lg border border-ink/25 bg-paper px-6 py-6">
            <Label className="text-olive">{layer.name}</Label>
            <p className="mt-3 type-headline">{layer.count}</p>
            <p className="mt-3 type-body text-ink/75">{layer.body}</p>
          </div>
        ))}
      </Row>
    </Diagram>
  );
}

/* The resolution, and the rest of what the system carries. */
function Resolution() {
  return (
    <div className="space-y-8">
      <CodeBlock label="Token resolution">{RESOLUTION}</CodeBlock>

      <Diagram label="Other scales and styles">
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

/* The computed values, read off the build in both schemes. */
function ThemeProof() {
  return (
    <Diagram label="Computed values, light and dark">
      <div className="mx-auto max-w-[62ch]">
        <Matrix columns={themeProof.columns} rows={themeProof.rows} />
      </div>
    </Diagram>
  );
}

/* The specification, and the styles it was checked against. */
function Specification() {
  return (
    <div className="space-y-8">
      <CodeBlock label="The specification">{SPEC}</CodeBlock>
      <CodeBlock label="The styles it was checked against">{APPLIED}</CodeBlock>
    </div>
  );
}

/* The four tasks, each with what it was given and what came back. */
function Tasks() {
  return (
    <Diagram label="What was run, and what came back">
      <Row columns={4}>
        {tasks.map((task) => (
          <div key={task.number} className="rounded-lg border border-ink/25 bg-paper px-6 py-6">
            <Label className="text-olive">Task {task.number}</Label>
            <p className="mt-3 type-title">{task.name}</p>
            <p className="mt-4 type-body text-ink/75">{task.job}</p>
            {/* ink/60 rather than the paler greys elsewhere on the site: at this
                size anything lighter falls under the contrast floor. */}
            <p className="mt-5 type-label font-semibold text-ink/60">Result</p>
            <p className="mt-2 type-body text-ink/75">{task.result}</p>
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
      deck={DECK}
    >
      <Movement title="Overview">
        <Prose wide>
          The test used the Untitled UI Pro v7.0 token payload in a working Vite application. It
          covered one component and four maintenance tasks: auditing component styles, checking
          Figma against code, generating token stylesheets and resolving conflicting token values.
        </Prose>
      </Movement>

      <Movement title="Token architecture" figure={<Layers />}>
        <Prose wide>
          The system uses three token layers. A Figma export supplies the values, and a generation
          process produces the CSS.
        </Prose>
      </Movement>

      <Movement title="Token resolution" figure={<Resolution />}>
        <Prose wide>
          The component references --color-bg-surface. That alias resolves through
          --colors-background-bg-primary.
        </Prose>
      </Movement>

      <Movement title="Testing the theme" figure={<ThemeProof />}>
        <Prose wide>
          I ran the component in light and dark mode and checked the computed values.
        </Prose>
        <Prose wide>
          The three colour values changed with the theme. Padding and radius remained constant.
        </Prose>
        <Prose wide>
          The component also contained a hardcoded border colour and 24px padding. Both bypassed
          the token system. The agent replaced them with tokens and added light and dark values for
          --color-border-subtle.
        </Prose>
      </Movement>

      <Movement title="The component specification" figure={<Specification />}>
        <Prose wide>
          I added a machine-readable specification to the component, listing the tokens it should
          use. The specification was checked against the component&apos;s styles.
        </Prose>
        <Prose wide>
          This gave the audit a defined list of expected tokens to compare with the implementation.
        </Prose>
      </Movement>

      <Movement title="Maintenance tasks" figure={<Tasks />}>
        <Prose wide>Each task was verified with a production build.</Prose>
      </Movement>

      <Movement title="Figma access">
        <Prose wide>
          The test initially relied on the Figma MCP for access to design data. Live access was
          unavailable: the local Dev Mode MCP server was not enabled in the desktop app, and the
          remote server was rate-limited on the Starter plan.
        </Prose>
        <Prose wide>
          I switched to a manual export containing the primitive and semantic collections, along
          with the text, effect and grid styles. Its structure matched the generated stylesheets,
          allowing the test to continue without live access.
        </Prose>
        <Prose wide>
          This left live synchronisation outside the scope of the test. The export supported the
          maintenance tasks, but did not establish whether the same workflow would remain in sync
          automatically as the Figma file changed.
        </Prose>
      </Movement>

      <Movement title="Outcome">
        <Prose wide>
          All four maintenance tasks completed, and each change passed a production build.
        </Prose>
        <Prose wide>
          The test showed that an agent could audit component styles, compare token definitions,
          generate CSS and resolve conflicting values when the system provided explicit
          relationships and a source-of-truth rule.
        </Prose>
        <Prose wide>
          It also exposed the limits of the setup. Figma access depended on a manual export, and
          the test covered one component rather than a full component library. The results
          establish that these maintenance tasks were possible within this setup; broader use and
          live synchronisation remain untested.
        </Prose>
      </Movement>

      <MoreWork current="ai-design-system" />
    </CaseStudyHero>
  );
}
