import { createFileRoute } from "@tanstack/react-router";

import { CaseStudyHero, type MetaRow } from "@/components/CaseStudyHero";
import { MoreWork } from "@/components/MoreWork";

export const Route = createFileRoute("/work/ai-design-system")({
  head: () => ({
    meta: [
      { title: "A design system an AI agent can operate · Victorine Amani" },
      { name: "description", content: "A self-directed test project: build a design system an AI agent can use, then hand it real maintenance tasks and see whether the structure alone is enough." },
      { property: "og:title", content: "A design system an AI agent can operate · Victorine Amani" },
      { property: "og:description", content: "Design systems, tokens and AI: a self-directed test project." },
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

function AiDesignSystem() {
  return (
    <CaseStudyHero
      title="A design system an AI agent can operate"
      meta={meta}
      deck="Don't use AI to build a design system. Build a design system an AI agent can use, then hand it real maintenance tasks and see whether the structure alone is enough for it to make the right calls."
    >
      <MoreWork current="ai-design-system" />
    </CaseStudyHero>
  );
}
