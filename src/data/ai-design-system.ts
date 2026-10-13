/*
 * The design system an agent can operate, as the page states it.
 *
 * Her case study document is the source for the account. Every number below was
 * counted from the project itself rather than copied across: the token files
 * under my-agentic-system/src/tokens, the alias block in src/index.css, and the
 * computed styles of the running build in both colour schemes.
 *
 * Two places where the document and the code disagree, and the code wins here:
 *
 * 1. The document says 842 properties are generated from the Figma export.
 *    830 are. The other 12 are the app aliases she wrote by hand in index.css.
 *    842 is right for the system; "generated" is right for 830 of them.
 *
 * 2. The document describes the chain as app alias → semantic → primitive →
 *    raw value. In the generated CSS the semantic tokens carry literal values
 *    and reference nothing, so the chain is one link shorter than that. The
 *    primitives are the palette the export ships, not a step in the lookup.
 */

/** The three layers, with what each one actually holds. */
export const layers = [
  {
    name: "Primitive",
    count: "407",
    holds: "375 colours named by hue and scale, and 32 numbers",
    note: "The palette Untitled UI ships. Nothing in the generated CSS refers to them, including the semantic layer above.",
  },
  {
    name: "Semantic",
    count: "303",
    holds: "Intent: background, text, border, foreground",
    note: "Each one restated three times: under :root, under prefers-color-scheme: dark, and under [data-theme=\"dark\"].",
  },
  {
    name: "App alias",
    count: "12",
    holds: "The names the components use",
    note: "The only place a var() appears. Below this, every value is written out.",
  },
];

/** The scales the agent needs before it can reason about a layout. */
export const scales = [
  { name: "Radius", value: "11" },
  { name: "Spacing", value: "17" },
  { name: "Widths", value: "12" },
  { name: "Containers", value: "3" },
  { name: "Typography", value: "33" },
  { name: "Shadows and focus rings", value: "20" },
  { name: "Grid sets", value: "8 sets · 24 properties" },
  { name: "Text styles", value: "44 utility classes" },
];

/*
 * The proof, measured off the running build rather than read off the source:
 * the same component, the same five declarations, two colour schemes.
 */
export const themeProof = {
  columns: ["Light", "Dark"],
  rows: [
    { heading: "--color-bg-surface", cells: ["#ffffff", "#0c0e12"] },
    { heading: "--color-text-main", cells: ["#181d27", "#f7f7f7"] },
    { heading: "--color-border-subtle", cells: ["#e9eaeb", "#22262f"] },
    { heading: "--card-padding", cells: ["24px", "24px"] },
    { heading: "--radius-md", cells: ["8px", "8px"] },
  ],
};

/** The four maintenance jobs, each one a thing a designer normally does by hand. */
export const workflows = [
  {
    name: "Spec audit",
    input: "Read the component's declared tokens, compare them to the styles actually applied.",
    finding: "A border colour and a padding were hardcoded, so a theme could not reach either of them.",
    outcome: "Both replaced with tokens, and the missing --color-border-subtle created with its own light and dark values.",
  },
  {
    name: "Figma drift check",
    input: "Cross-reference every token in the code against the Figma export.",
    finding: "The primitives were already in step. Nothing was missing.",
    outcome: "Confirmed in sync, and flagged the drift going the other way: tokens that exist in the code and not in Figma.",
  },
  {
    name: "Full token generation",
    input: "Parse tokens.json: seven variable collections and the style sets.",
    finding: "1,554 colour styles carried no value at all.",
    outcome: "Generated ten CSS files and 44 text-style classes. The valueless styles were left out.",
  },
  {
    name: "Source-of-truth reconciliation",
    input: "Resolve what two token sources disagreed about after a Material detour.",
    finding: "--radius-md was 12px in one and 8px in the other.",
    outcome: "Applied the one rule I had written down, that Untitled UI wins ties, so 8px, and remapped the app aliases onto it.",
  },
];

/** Where the test hit something it could not design around. */
export const limits = [
  "The local Dev Mode MCP server was not enabled in the Figma desktop app.",
  "The remote MCP server was rate-limited on the Starter plan.",
];
