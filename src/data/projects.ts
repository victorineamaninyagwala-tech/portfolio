import aiDesignSystemCard from "@/assets/card-ai-design-system.webp";
import bazaarCard from "@/assets/card-bazaar.webp";
import mochisCard from "@/assets/card-mochis.webp";
import soulshapeCard from "@/assets/card-soulshape.webp";
import springCard from "@/assets/card-spring.webp";
import farmcloudField from "@/assets/farmcloud-research-field.webp";
import farmcloudHero from "@/assets/farmcloud-hero.webp";
import farmcloudPeppers from "@/assets/farmcloud-research-peppers.webp";
import synnefaMark from "@/assets/synnefa-mark.svg";

/*
 * The single list of work. Both the homepage grid and the site footer read from
 * here, so a title or slug is only ever written once.
 */
export type Project = {
  slug: string;
  title: string;
  discipline: string;
  status?: string;
  images?: Array<{ src: string; alt: string; fit?: boolean; hideBottom?: number }>;
  /** Logo the hover carousel opens through. Only set where a sequence exists. */
  mask?: string;
};

export const projects: Project[] = [
  {
    slug: "farmcloud",
    title: "FarmCloud",
    discipline: "UX · UI Design · Product Management",
    mask: synnefaMark,
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
    slug: "soulshape",
    title: "SoulShape",
    discipline: "UX · Healthcare · Systems Design",
    images: [{ src: soulshapeCard, alt: "The SoulShape sign-up screen on a desktop in a clinic waiting room" }],
  },
  {
    slug: "mochis",
    title: "Mochi's Brew",
    discipline: "UX · Service Design · F&B",
    images: [{ src: mochisCard, alt: "The Mochi's Brew ordering flow on a phone" }],
    status: "In progress",
  },
  {
    slug: "bazaar",
    title: "Bazaar",
    discipline: "Product Strategy · Marketplace · Systems Design",
    images: [{ src: bazaarCard, alt: "The Bazaar wordmark debossed into cream paper stock" }],
  },
  {
    slug: "ai-design-system",
    title: "A design system an AI agent can operate",
    discipline: "Design Systems · Tokens · AI",
    images: [{ src: aiDesignSystemCard, alt: "A design token chain, one base colour branching into tonal ramps" }],
    status: "Test project",
  },
  {
    slug: "spring",
    title: "Spring On The Go",
    discipline: "UX · Ecommerce · Audit & Redesign",
    images: [{ src: springCard, alt: "The redesigned Spring On The Go grocery homepage on a tablet" }],
  },
];
