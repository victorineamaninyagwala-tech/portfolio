import { createFileRoute } from "@tanstack/react-router";

import flowGuest from "@/assets/mochis-flow-6-guest.webp";
import flowHome from "@/assets/mochis-flow-1-home.webp";
import flowLocation from "@/assets/mochis-flow-2-location.webp";
import flowLocationOk from "@/assets/mochis-flow-2b-location-ok.webp";
import flowMenu from "@/assets/mochis-flow-3-menu.webp";
import flowPayment from "@/assets/mochis-flow-7-payment.webp";
import flowProduct from "@/assets/mochis-flow-4-product.webp";
import flowReview from "@/assets/mochis-flow-5-review.webp";
import flowSupport from "@/assets/mochis-flow-10-support.webp";
import flowTrack from "@/assets/mochis-flow-9-track.webp";
import phoneGuest from "@/assets/mochis-phone-7-guest.webp";
import phoneHome from "@/assets/mochis-phone-1-home.webp";
import phoneLocation from "@/assets/mochis-phone-2-location.webp";
import phoneLocationOk from "@/assets/mochis-phone-3-location-ok.webp";
import phoneMenu from "@/assets/mochis-phone-4-menu.webp";
import phonePayment from "@/assets/mochis-phone-8-payment.webp";
import phoneProduct from "@/assets/mochis-phone-5-product.webp";
import phoneReview from "@/assets/mochis-phone-6-review.webp";
import phoneTrack from "@/assets/mochis-phone-9-track.webp";
import systemColour from "@/assets/mochis-system-1-colour.webp";
import systemGrid from "@/assets/mochis-system-4-grid.webp";
import systemIcons from "@/assets/mochis-system-7-icons.webp";
import systemRadius from "@/assets/mochis-system-6-radius.webp";
import systemSpacing from "@/assets/mochis-system-5-spacing.webp";
import systemTokens from "@/assets/mochis-system-3-tokens.webp";
import systemTypography from "@/assets/mochis-system-2-typography.webp";
import logoBoltFood from "@/assets/logo-bolt-food.webp";
import logoDunkin from "@/assets/logo-dunkin.webp";
import logoGlovo from "@/assets/logo-glovo.webp";
import logoJavaHouse from "@/assets/logo-java-house.webp";
import logoPickupCoffee from "@/assets/logo-pickup-coffee.webp";
import logoStarbucks from "@/assets/logo-starbucks.webp";
import logoUberEats from "@/assets/logo-uber-eats.webp";

import { CaseStudyHero, type MetaRow } from "@/components/CaseStudyHero";
import {
  CaseStudySection,
  Prose,
  Subhead,
} from "@/components/CaseStudySection";
import { Frame, Label } from "@/components/primitives";
import { MoreWork } from "@/components/MoreWork";
import { Walkthrough, type WalkthroughStep } from "@/components/Walkthrough";
import { shareImage } from "@/lib/share";

export const Route = createFileRoute("/work/mochis")({
  head: ({ match }) => ({
    meta: [
      {
        title: "Mochi's Brew · A Service Design Case Study by Victorine Amani",
      },
      {
        name: "description",
        content:
          "A pickup ordering flow for Kenyan coffee shops, bridging the gap between walking in and paying for delivery.",
      },
      {
        property: "og:title",
        content:
          "Mochi's Brew · A Service Design Case Study by Victorine Amani",
      },
      {
        property: "og:description",
        content:
          "A pickup ordering flow for Kenyan coffee shops, bridging the gap between walking in and paying for delivery.",
      },
      ...shareImage(match.context.origin, "mochis", "The Mochi's Brew case study: the shop's plant-filled room beside the title."),
    ],
  }),
  component: MochisBrew,
});

/* The ordering systems taken apart before anything was drawn. */
const competitors = [
  { name: "Starbucks", logo: logoStarbucks },
  { name: "Dunkin'", logo: logoDunkin },
  { name: "Java House", logo: logoJavaHouse },
  { name: "Pickup", logo: logoPickupCoffee },
  { name: "Glovo", logo: logoGlovo },
  { name: "Uber Eats", logo: logoUberEats },
  { name: "Bolt Food", logo: logoBoltFood },
];

/* What the research turned up, in the order it mattered. */
const learnt = [
  "Starbucks is the only one that lets a guest buy end to end on the web.",
  "Dunkin' puts an account in front of the transaction, and validates phone numbers against US carriers only, so a Kenyan number cannot get through at all.",
  "Java House owns no ordering of its own and hands the customer to Glovo, Uber Eats or Bolt Food.",
  "Pickup Coffee uses the web as a catalogue and moves the checkout into its app.",
  "Every one of them is arranged around acquiring an account or migrating the customer to an app.",
  "Customisation data breaks on combinations the systems never mapped, and the failure is shown to the customer.",
];

/* The flow as charted: home, through the gate, to the menu and the product,
   reviewed, and only then the guest choice that sits immediately before
   payment. Tracking follows payment, and support follows tracking.

   Captured at the size they are shown at, so the screens read rather than
   being shrunk into the card. A page longer than the card keeps the card's
   width and scrolls. */
const DESK = { width: 1280, height: 800 };

const flow: WalkthroughStep[] = [
  { label: "Home", src: flowHome, ...DESK, hotspot: { x: 15.6, y: 77.3 }, alt: "The Mochi's Brew home screen, with an order waiting to be started" },
  { label: "Location Gate", src: flowLocation, width: 1280, height: 885, hotspot: { x: 76, y: 36.9 }, alt: "Where are you ordering from: permission, manual entry, the radius check and store hours" },
  { label: "Within Range", src: flowLocationOk, width: 1280, height: 885, hotspot: { x: 76, y: 39.9 }, alt: "You are within pickup range, with the way through to the menu" },
  { label: "Browse Menu", src: flowMenu, ...DESK, hotspot: { x: 34.6, y: 44.6 }, alt: "The menu: categories, search, product cards and availability" },
  { label: "Product Details", src: flowProduct, width: 1280, height: 1431, hotspot: { x: 55.2, y: 37 }, tall: true, alt: "A cappuccino: core configuration, customisation, fulfilment timing and product information" },
  { label: "Review Order", src: flowReview, width: 1280, height: 1146, hotspot: { x: 79.8, y: 36.8 }, tall: true, alt: "Review your order: the summary, the item breakdown, the price and the ways back out of it" },
  { label: "Guest Checkout", src: flowGuest, width: 1280, height: 1146, hotspot: { x: 50, y: 52.1 }, tall: true, alt: "How do you want to continue: carry on as a guest, or sign in" },
  { label: "Payment", src: flowPayment, width: 1280, height: 1115, hotspot: { x: 79.8, y: 47.5 }, tall: true, alt: "Payment: method selection, and the validation run at submission" },
  { label: "Track Order", src: flowTrack, ...DESK, hotspot: { x: 79.8, y: 68.1 }, alt: "Order status: order ID, pickup code, queue status, milestone states and notifications" },
  { label: "Support", src: flowSupport, ...DESK, alt: "Need help: fallback states, a manual status check, and a way to escalate" },
];

/* The same order on the phone it was designed for. */
const PHONE = { width: 860, height: 1864 };

const phoneFlow: WalkthroughStep[] = [
  { label: "Home", src: phoneHome, ...PHONE, hotspot: { x: 50, y: 43.6 }, alt: "The home screen on a phone, with Start Order under the wordmark" },
  { label: "Location Gate", src: phoneLocation, ...PHONE, hotspot: { x: 50, y: 73.1 }, alt: "The location gate on a phone, the map above the form" },
  { label: "Within Range", src: phoneLocationOk, ...PHONE, hotspot: { x: 50, y: 77.6 }, alt: "Within pickup range, with the way through to the menu" },
  { label: "Browse Menu", src: phoneMenu, ...PHONE, hotspot: { x: 26.5, y: 54.1 }, alt: "The menu on a phone, one card per drink" },
  { label: "Product Details", src: phoneProduct, ...PHONE, hotspot: { x: 65.1, y: 68.6 }, alt: "A cappuccino on a phone, with its configuration" },
  { label: "Review Order", src: phoneReview, ...PHONE, alt: "The order reviewed on a phone before anything is paid" },
  { label: "Guest Checkout", src: phoneGuest, ...PHONE, hotspot: { x: 50, y: 82 }, alt: "How do you want to continue: guest, or sign in" },
  { label: "Payment", src: phonePayment, ...PHONE, alt: "Payment on a phone, fulfilment above method" },
  { label: "Track Order", src: phoneTrack, ...PHONE, alt: "Order status on a phone, with the pickup code" },
];

/* The system the flow is drawn from. A board taller than the card is shown at
   a size that can be read and panned, rather than shrunk until it cannot. */
const system: WalkthroughStep[] = [
  { label: "Colour", src: systemColour, width: 1600, height: 636, alt: "The colour palettes, each ramp from 50 to 900" },
  { label: "Typography", src: systemTypography, width: 1600, height: 3607, tall: true, alt: "The type scale and its roles" },
  { label: "Tokens", src: systemTokens, width: 1600, height: 2153, tall: true, alt: "The tokens the components read from" },
  { label: "Grid", src: systemGrid, width: 1600, height: 944, alt: "The grid the layouts sit on" },
  { label: "Spacing", src: systemSpacing, width: 1600, height: 1502, tall: true, alt: "The spacing scale" },
  { label: "Radius", src: systemRadius, width: 1600, height: 1502, tall: true, alt: "The corner radii" },
  { label: "Icons", src: systemIcons, width: 1600, height: 2644, tall: true, alt: "The icon set" },
];

/*
 * Three of the ten pages, shown on both things they were drawn for: the web
 * app across the top, the phone under it, the same page in the same column.
 *
 * All three desktop screens are 1280 x 800 and all three phones 860 x 1864, so
 * each row is one ratio and nothing in it is cropped to match its neighbour.
 * The phones are held to a narrower measure than the desktops — at a third of
 * the page each they would stand taller than the section they sit in.
 */
const solutionPages = [
  {
    page: "Home",
    desk: flowHome,
    deskAlt: "The Mochi's Brew home screen, with an order waiting to be started",
    phone: phoneHome,
    phoneAlt: "The home screen on a phone, with Start Order under the wordmark",
  },
  {
    page: "Browse Menu",
    desk: flowMenu,
    deskAlt: "The menu: categories, search, product cards and availability",
    phone: phoneMenu,
    phoneAlt: "The menu on a phone, one card per drink",
  },
  {
    page: "Track Order",
    desk: flowTrack,
    deskAlt: "Order status: order ID, pickup code, queue status, milestone states and notifications",
    phone: phoneTrack,
    phoneAlt: "Order status on a phone, with the pickup code",
  },
];

function SolutionScreens() {
  return (
    /* On the ground, like every other screen on the site. The frames carry
       their own ground too, but a picture covers it, so without a panel
       underneath they would be the only screens on the site floating on the
       paper. Same corner and same padding as a Diagram. */
    <div className="space-y-10 rounded-lg bg-ground px-6 py-10 sm:px-10 sm:py-14">
      <div className="grid gap-6 sm:grid-cols-3">
        {solutionPages.map((p) => (
          <figure key={p.page}>
            <Frame ratio="1280 / 800">
              <img src={p.desk} alt={p.deskAlt} className="size-full object-cover" />
            </Frame>
            <figcaption className="mt-3">
              <Label className="text-ink/45">{p.page}</Label>
            </figcaption>
          </figure>
        ))}
      </div>

      {/* Three across where there is room. On a phone they stack and hold a
          reading width of their own: at a third of a 375px screen each one is
          98 pixels wide, which is a picture of a phone rather than a phone
          screen anybody can read. */}
      <div className="mx-auto grid max-w-[34rem] gap-8 sm:grid-cols-3 sm:gap-6">
        {solutionPages.map((p) => (
          <div key={p.page} className="mx-auto w-full max-w-[14rem] sm:max-w-none">
            <Frame ratio="860 / 1864">
              <img src={p.phone} alt={p.phoneAlt} className="size-full object-cover" />
            </Frame>
          </div>
        ))}
      </div>
    </div>
  );
}

const meta: MetaRow[] = [
  { label: "Type", value: "UX Case Study · Service Flow" },
  { label: "Role", value: "Product Designer" },
  { label: "Platform", value: "Responsive Web · Kenya" },
];

function MochisBrew() {
  return (
    <CaseStudyHero
      title="Mochi's Brew"
      meta={meta}
      deck="Designing a pickup ordering flow for Kenyan coffee shops. A service flow for on the go customers."
      media={<Walkthrough steps={flow} ratio="1280 / 800" />}
    >
      <CaseStudySection columns={1}>
        {/* Two sides: what the research was, on the left; what it turned up and
            what it left, on the right. */}
        <div className="grid gap-x-12 gap-y-14 md:grid-cols-2">
          <div className="space-y-6">
            <Subhead>Discovery</Subhead>
            <Prose wide>
              I set out to design a straightforward online ordering site for a single coffee
              shop: browse the menu, pay, and collect it on the way past.
            </Prose>

            <div className="pt-4">
              <Label className="text-olive">Market research</Label>
              {/* One card per system, all the same size, each mark filling its own. */}
              <ul className="mt-6 flex flex-wrap gap-2">
                {competitors.map((system) => (
                  <li key={system.name} className="w-[88px]">
                    <p className="type-caption font-semibold">{system.name}</p>
                    <div className="mt-2 aspect-square w-full overflow-hidden rounded-lg border border-ink/10 bg-paper">
                      <img src={system.logo} alt="" className="size-full object-contain" />
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="space-y-14">
            <div className="space-y-6">
              <Subhead>The emerging problem</Subhead>
              <Prose wide>
                A customer buying once, on the way, has nowhere to do it. Every route asks
                them to become a member first, install something, or pay for a delivery on a
                journey they are already making.
              </Prose>
            </div>

            <div className="space-y-6">
              <Subhead>What I learnt</Subhead>
              <ul className="space-y-3">
                {learnt.map((item) => (
                  <li key={item} className="flex gap-3">
                    <span
                      aria-hidden="true"
                      className="mt-[0.7em] size-1 shrink-0 rounded-full bg-ink/30"
                    />
                    <span className="type-body-lg text-ink/75">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </CaseStudySection>

      <CaseStudySection columns={1} figure={<SolutionScreens />}>
        <div className="space-y-6">
          <Subhead>The solution</Subhead>
          <Prose>
            Mochi&apos;s Brew is a pickup ordering flow the shop owns and a guest can finish
            end to end. No account, no app, no delivery fee.
          </Prose>
          <Prose>
            It runs on one shop&apos;s constraints: a single location, one preparation queue
            shared with the counter, and staff whose workload decides what can be promised.
            The system says what is true about that queue rather than naming a time it
            cannot keep, and leaves the decision to accept, delay or refuse an order with
            the people making the coffee.
          </Prose>
        </div>
      </CaseStudySection>

      <CaseStudySection
        title="Design system"
        columns={1}
        figure={<Walkthrough steps={system} guided={false} />}
      >
        <Prose wide>
          The colour, type, tokens, grid, spacing and icons the ordering flow is drawn from,
          kept as one set so a screen added later is built out of the same parts.
        </Prose>
      </CaseStudySection>

      <MoreWork current="mochis" />
    </CaseStudyHero>
  );
}
