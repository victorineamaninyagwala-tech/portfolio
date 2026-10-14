/*
 * The design system an agent can operate.
 *
 * Her document is the copy, word for word. Every number in it was checked
 * against the project before it went on the page: the token files under
 * my-agentic-system/src/tokens, the alias block in src/index.css, and the
 * computed styles of the running build in both colour schemes.
 */

/** The three token layers, and what each one holds. */
export const layers = [
  {
    name: "Primitive",
    count: "407",
    body: "375 colours named by hue and scale, plus 32 numbers. These values form the base palette.",
  },
  {
    name: "Semantic",
    count: "303",
    body: 'Tokens organised by purpose, including background, text, border and foreground. Values are defined under :root, prefers-color-scheme: dark and [data-theme="dark"].',
  },
  {
    name: "App aliases",
    count: "13",
    body: "The tokens used by components. Each alias references a semantic token, which resolves to a literal value for the active colour scheme.",
  },
];

/** The other scales and styles the system carries. */
export const scales = [
  { name: "Radius", value: "11" },
  { name: "Spacing", value: "17" },
  { name: "Widths", value: "12" },
  { name: "Containers", value: "3" },
  { name: "Typography", value: "33" },
  { name: "Shadows and focus rings", value: "20" },
  { name: "Grid sets", value: "8 sets, 24 properties" },
  { name: "Text styles", value: "44 utility classes" },
];

/* The component run in light and dark, with the computed values read off it. */
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

/** The four maintenance tasks, numbered as she numbers them. */
export const tasks = [
  {
    number: "1",
    name: "Component audit",
    job: "The agent compared the component specification with its applied styles.",
    result:
      "It found a hardcoded border colour and padding, replaced both with tokens, and added the missing --color-border-subtle definition for light and dark mode.",
  },
  {
    number: "2",
    name: "Figma and code comparison",
    job: "The agent cross-referenced the code against the Figma export.",
    result:
      "The primitive values were in sync. The audit also identified tokens present in code without corresponding definitions in the export.",
  },
  {
    number: "3",
    name: "Token generation",
    job: "The agent parsed tokens.json, which contained seven variable collections and the style sets.",
    result:
      "The export contained 1,554 colour styles without values. The generation process produced ten CSS files and 44 text-style classes, skipping styles without values.",
  },
  {
    number: "4",
    name: "Conflicting token values",
    job: "Two sources defined --radius-md differently: 12px in one and 8px in the other. I had established a precedence rule that gave Untitled UI priority.",
    result:
      "The agent applied the rule, set the value to 8px and remapped the app aliases. It did not need to choose between the values without guidance.",
  },
];
