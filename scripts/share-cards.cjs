/*
 * Draws the share cards in public/og — one per page, 1200×630, the picture a
 * link turns into when it is pasted into LinkedIn, Slack or a message.
 *
 * They are drawn against the running site rather than from scratch: the script
 * loads the homepage so the site's own stylesheet and fonts are in the page,
 * replaces the body with a card built from the site's own type steps and
 * colour tokens, and photographs it. That is what keeps a card the same thing
 * as the page it stands for, in DotGothic16 and Ubuntu on the real paper
 * colour, rather than a lookalike drawn in something else.
 *
 * Run it again whenever a cover, a title, a description or the type changes:
 *
 *   1. npm run dev            (the site must be up on http://localhost:3000)
 *   2. node scripts/share-cards.cjs
 *
 * It needs two packages the site itself does not, and a Chrome to drive:
 *
 *   npm i -D puppeteer-core sharp
 *
 * Layout is written inline because Tailwind only emits the classes it finds in
 * source, so an arbitrary width class used only here would not exist. The type
 * steps and colours it does use — type-display, type-headline, type-body-lg,
 * type-label, text-olive, text-ink/70, bg-paper, bg-ground — all already do.
 *
 * The one-line description on each card is the page's own meta description,
 * lightly tightened where it ran long. Keep them in step with the routes.
 */

const path = require("path");
const fs = require("fs");
const puppeteer = require("puppeteer-core");
const sharp = require("sharp");

const SITE = "http://localhost:3000";
const OUT = path.join(__dirname, "..", "public", "og");
const CHROME =
  process.env.CHROME ||
  (process.platform === "win32"
    ? "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe"
    : process.platform === "darwin"
      ? "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome"
      : "/usr/bin/google-chrome");

/* The size every platform agrees on. Mirrors CARD_WIDTH / CARD_HEIGHT in
   src/lib/share.ts; change both or neither. */
const W = 1200;
const H = 630;

const esc = (s) => s.replace(/&/g, "&amp;").replace(/</g, "&lt;");

/* The homepage card: the name, the eyebrow, and the one sentence the site
   makes. Balanced so the last line is not a single word. */
const home = () => `
<div class="bg-paper text-ink" style="width:${W}px;height:${H}px;padding:72px;box-sizing:border-box;display:flex;flex-direction:column;justify-content:space-between">
  <div>
    <span class="type-label font-semibold text-olive">Product Designer · Nairobi</span>
    <h1 class="type-display" style="margin-top:22px">Victorine Amani</h1>
  </div>
  <p class="type-headline text-ink/70" style="margin:0;max-width:1056px;text-wrap:balance">My work explores when systems should automate complexity and when they should expose it to support human judgment, accountability, and agency.</p>
</div>`;

/* A case study card: the writing on the left, the cover on the right in the
   4:5 the homepage grid uses, so every card shares one silhouette whatever
   shape its cover happens to be. Covers are read straight from src/assets,
   which Vite serves in development. */
const study = ({ title, discipline, line, cover, titleStep = "type-display" }) => `
<div class="bg-paper text-ink" style="width:${W}px;height:${H}px;padding:64px 72px;box-sizing:border-box;display:flex;gap:56px;align-items:stretch">
  <div style="flex:1;min-width:0;display:flex;flex-direction:column;justify-content:space-between">
    <div>
      <span class="type-label font-semibold text-olive">Case study · ${esc(discipline)}</span>
      <h1 class="${titleStep}" style="margin-top:22px">${esc(title)}</h1>
      <p class="type-body-lg text-ink/70" style="margin-top:22px;max-width:40ch">${esc(line)}</p>
    </div>
    <span class="type-body font-semibold">Victorine Amani</span>
  </div>
  <div class="rounded-lg bg-ground overflow-hidden" style="flex:none;width:402px;height:502px">
    <img src="/src/assets/${cover}" class="size-full object-cover" alt="">
  </div>
</div>`;

const CARDS = [
  { slug: "home", html: home() },
  {
    slug: "farmcloud",
    html: study({
      title: "FarmCloud",
      discipline: "UX · UI Design · Product Management",
      line: "A farm management dashboard built for farmers, with agronomists alongside to turn data into better decisions.",
      cover: "farmcloud-card-watering.webp",
    }),
  },
  {
    slug: "soulshape",
    html: study({
      title: "SoulShape",
      discipline: "UX · Healthcare · Systems Design",
      line: "A care coordination platform for multi-disciplinary weight-loss programs, aligned with the Kenya Digital Health Act 2023.",
      cover: "card-soulshape.webp",
    }),
  },
  {
    slug: "mochis",
    html: study({
      title: "Mochi's Brew",
      discipline: "UX · Service Design · F&B",
      line: "A pickup ordering flow for Kenyan coffee shops, bridging the gap between walking in and paying for delivery.",
      cover: "card-mochis.webp",
    }),
  },
  {
    slug: "bazaar",
    html: study({
      title: "Bazaar",
      discipline: "Product Strategy · Marketplace · Systems Design",
      line: "A trust and discovery layer for independent shops in Kenya: each shop gets its own branded, verified storefront on shared infrastructure.",
      cover: "card-bazaar.webp",
    }),
  },
  {
    slug: "ai-design-system",
    html: study({
      title: "A design system an AI agent can operate",
      discipline: "Design Systems · Tokens · AI",
      /* Nine words: one step down, or it runs to three lines and crowds the
         description below it. */
      titleStep: "type-headline",
      line: "Build a design system an AI agent can use, then hand it real maintenance tasks and see whether the structure alone is enough.",
      cover: "card-ai-design-system.webp",
    }),
  },
  {
    slug: "spring",
    html: study({
      title: "Spring On The Go",
      discipline: "UX · Ecommerce · Audit & Redesign",
      line: "A UX audit and e-commerce redesign concept for a Kenyan convenience retailer, rebuilt around intent rather than inventory.",
      cover: "card-spring.webp",
    }),
  },
];

(async () => {
  fs.mkdirSync(OUT, { recursive: true });
  const browser = await puppeteer.launch({ executablePath: CHROME, headless: "new" });
  const page = await browser.newPage();
  /* Drawn at twice the size and brought down, so the type is crisp. */
  await page.setViewport({ width: W, height: H, deviceScaleFactor: 2 });
  await page.goto(SITE + "/", { waitUntil: "networkidle0" });
  await page.evaluate(() => document.fonts.ready);

  for (const card of CARDS) {
    await page.evaluate((html) => {
      document.body.innerHTML = html;
      document.body.style.margin = "0";
    }, card.html);
    await page.evaluate(async () => {
      await document.fonts.ready;
      await Promise.all(
        [...document.images].map((i) =>
          i.complete ? null : new Promise((r) => { i.onload = i.onerror = r; }),
        ),
      );
    });
    await new Promise((r) => setTimeout(r, 300));

    /* A card whose writing has run out of the frame is not a card. */
    const overflow = await page.evaluate(() => {
      const root = document.body.firstElementChild;
      const box = root.getBoundingClientRect();
      let worst = 0;
      root.querySelectorAll("h1, p, span").forEach((el) => {
        const r = el.getBoundingClientRect();
        worst = Math.max(worst, r.bottom - box.bottom, r.right - box.right);
      });
      return Math.round(worst);
    });

    const png = await page.screenshot({ type: "png", clip: { x: 0, y: 0, width: W, height: H } });
    const dest = path.join(OUT, `${card.slug}.jpg`);
    await sharp(png).resize(W, H).jpeg({ quality: 88, mozjpeg: true }).toFile(dest);
    console.log(
      card.slug.padEnd(17),
      Math.round(fs.statSync(dest).size / 1024) + "kb",
      overflow > 0 ? `OVERFLOWS by ${overflow}px` : "fits",
    );
  }
  await browser.close();
})().catch((e) => {
  console.error(e.message);
  process.exit(1);
});
