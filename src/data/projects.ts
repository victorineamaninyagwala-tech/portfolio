import aiDesignSystemCard from "@/assets/card-ai-design-system.webp";
import bazaarCard from "@/assets/card-bazaar.webp";
import mochisCard from "@/assets/card-mochis.webp";
import soulshapeCard from "@/assets/card-soulshape.webp";
import springCard from "@/assets/card-spring.webp";
import farmcloudWatering from "@/assets/farmcloud-card-watering.webp";
import farmcloudHero from "@/assets/farmcloud-hero.webp";
import farmcloudPeppers from "@/assets/farmcloud-research-peppers.webp";
import soulshapePatients from "@/assets/ss-phase-maintenance.webp";
import soulshapeRecord from "@/assets/ss-record-history.webp";
import soulshapeSummary from "@/assets/soulshape-summary.webp";
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
  /** Opens by matching a square of the first image to where it reappears in
   *  the second, instead of through a mark. */
  intro?: {
    crop: { centreX: number; centreY: number; width: number };
    target: { centreX: number; centreY: number; width: number };
  };
  /** Set where the card builds its own subject on hover rather than turning
   *  over a sequence of stills. */
  hover?: "assemble";
  /** A case study that is not finished. Its route still answers, for anyone
   *  holding the link, but it is listed nowhere: not the homepage grid, not
   *  the footer, not the way on at the foot of another study. */
  unlisted?: boolean;
};

const all: Project[] = [
  {
    slug: "farmcloud",
    title: "FarmCloud",
    discipline: "UX · Systems Design · USSD",
    mask: synnefaMark,
    images: [
      // Order drives the hover sequence: rest image, then the mark reveals the
      // dashboard, which is the only slide that zooms out onto the green.
      {
        src: farmcloudWatering,
        alt: "A farmer watering young plants, seen from among the leaves",
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
    /* The coordinator's account photograph in the prototype is this same
       runner, cropped to her head and shoulder, so the card can cut from one
       to the other without anything in between.

       `crop` is where that square sits in the photograph, found by matching
       avatar-grace.jpg against it. `target` is where it turns up on the
       summary, measured off the running prototype at the size the screen was
       shot at. The avatar is a fortieth of the width, which is how far the
       screen has to come in before the two line up. */
    intro: {
      crop: { centreX: 0.5508, centreY: 0.1281, width: 0.3203 },
      target: { centreX: 0.972, centreY: 0.0367, width: 0.0248 },
    },
    images: [
      { src: soulshapeCard, alt: "A runner mid-stride, caught in motion blur against a warm ground" },
      /* All three screens are landscape and the card well is a 4:5 portrait, so
         each is shown whole on the green instead of cropped to a slot half its
         width. */
      {
        src: soulshapeSummary,
        alt: "The coordinator's summary: active patients across four programmes, critical alerts, and the caseload by phase",
        fit: true,
      },
      {
        src: soulshapePatients,
        alt: "The patients list: a phase caseload with each patient's most recent signal and last activity",
        fit: true,
      },
      {
        src: soulshapeRecord,
        alt: "A patient record carrying its accumulated history: the phase timeline, the coordination stream and the check-ins behind it",
        fit: true,
      },
    ],
  },
  {
    slug: "mochis",
    title: "Mochi's Brew",
    discipline: "UX · Service Design · F&B",
    hover: "assemble",
    images: [{ src: mochisCard, alt: "The shop itself: a plant-filled room, the counter and the menu board behind it" }],
  },
  {
    slug: "bazaar",
    unlisted: true,
    title: "Bazaar",
    discipline: "Product Strategy · Marketplace · Systems Design",
    images: [{ src: bazaarCard, alt: "The Bazaar wordmark debossed into cream paper stock" }],
  },
  {
    slug: "ai-design-system",
    title: "An AI operable Design system",
    discipline: "Design Systems · Tokens · AI",
    images: [{ src: aiDesignSystemCard, alt: "A design token chain, one base colour branching into tonal ramps" }],
    status: "Test project",
  },
  {
    slug: "spring",
    unlisted: true,
    title: "Spring On The Go",
    discipline: "UX · Ecommerce · Audit & Redesign",
    images: [{ src: springCard, alt: "The redesigned Spring On The Go grocery homepage on a tablet" }],
  },
];

/** Every project, finished or not. What the site shows is `listed`, below. */
export const projects = all;

/**
 * The projects the site shows. The homepage grid, the footer column and the
 * way on at the foot of a case study all read this one, so an unfinished study
 * disappears from all three at once and comes back the same way.
 */
export const listed = all.filter((p) => !p.unlisted);
