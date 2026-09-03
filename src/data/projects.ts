import farmcloudField from "@/assets/farmcloud-research-field.jpg";
import farmcloudHero from "@/assets/farmcloud-hero.png";
import farmcloudPeppers from "@/assets/farmcloud-research-peppers.jpg";

/*
 * The single list of work. Both the homepage grid and the site footer read from
 * here, so a title or slug is only ever written once.
 */
export type Project = {
  n: string;
  slug: string;
  title: string;
  discipline: string;
  status?: string;
  images?: Array<{ src: string; alt: string; fit?: boolean; hideBottom?: number }>;
};

export const projects: Project[] = [
  {
    n: "01",
    slug: "farmcloud",
    title: "FarmCloud",
    discipline: "UX · UI Design · Product Management",
    images: [
      // Order drives the hover sequence: rest image, then the mark reveals the
      // dashboard, which is the only slide that zooms out onto the green.
      {
        src: farmcloudField,
        alt: "Two farmers reviewing crop data on a phone in a greenhouse",
        hideBottom: 0.1,
      },
      {
        src: farmcloudHero,
        alt: "FarmCloud dashboard shown on a laptop set in a green field",
        fit: true,
      },
      {
        src: farmcloudPeppers,
        alt: "Two farmers reviewing crop data on a phone among bell pepper plants",
        hideBottom: 0.1,
      },
    ],
  },
  {
    n: "02",
    slug: "bazaar",
    title: "Bazaar",
    discipline: "Product Strategy · Marketplace · Systems Design",
  },
  {
    n: "03",
    slug: "soulshape",
    title: "SoulShape",
    discipline: "UX · Healthcare · Systems Design",
  },
  {
    n: "04",
    slug: "spring",
    title: "Spring On The Go",
    discipline: "UX · Ecommerce · Audit & Redesign",
  },
  {
    n: "05",
    slug: "mochis",
    title: "Mochi's Brew",
    discipline: "UX · Service Design · F&B",
    status: "In progress",
  },
  {
    n: "06",
    slug: "ai-design-system",
    title: "A design system an AI agent can operate",
    discipline: "Design Systems · Tokens · AI",
    status: "Test project",
  },
];
