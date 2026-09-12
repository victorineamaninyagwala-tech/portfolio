import { createFileRoute } from "@tanstack/react-router";

import heroImage from "@/assets/farmcloud-hero.webp";
import legacyImage from "@/assets/farmcloud-legacy.webp";
import onboardingAccount from "@/assets/farmcloud-onboarding-1-account.webp";
import onboardingCode from "@/assets/farmcloud-onboarding-3-code.webp";
import onboardingContact from "@/assets/farmcloud-onboarding-4-contact.webp";
import onboardingFarmSetup from "@/assets/farmcloud-onboarding-5-farm-setup.webp";
import afterCrop from "@/assets/farmcloud-after-2-crop.webp";
import afterElement from "@/assets/farmcloud-after-1-element.webp";
import afterExpense from "@/assets/farmcloud-after-4-expense.webp";
import afterInventory from "@/assets/farmcloud-after-3-inventory.webp";
import afterReport from "@/assets/farmcloud-after-5-report.webp";
import beforeDashboard from "@/assets/farmcloud-before-1-dashboard.webp";
import beforeElement from "@/assets/farmcloud-before-3-element.webp";
import beforeElements from "@/assets/farmcloud-before-2-elements.webp";
import beforeInventoryPage from "@/assets/farmcloud-before-4-inventory.webp";
import beforeReports from "@/assets/farmcloud-before-5-reports.webp";
import onboardingVerify from "@/assets/farmcloud-onboarding-2-verify.webp";
import researchBoard from "@/assets/farmcloud-research-board.webp";
import { CaseStudyHero, type MetaRow, type Outcome } from "@/components/CaseStudyHero";
import {
  CaseStudySection,
  FactList,
  Prose,
  SectionImage,
  Subhead,
} from "@/components/CaseStudySection";
import { MoreWork } from "@/components/MoreWork";
import { Walkthrough, type WalkthroughStep } from "@/components/Walkthrough";
import { shareImage } from "@/lib/share";

export const Route = createFileRoute("/work/farmcloud")({
  head: ({ match }) => ({
    meta: [
      { title: "FarmCloud · A UX Case Study by Victorine Amani" },
      {
        name: "description",
        content:
          "A farm management dashboard built for farmers, with agronomists alongside to provide the context and expertise to turn data into better decisions.",
      },
      { property: "og:title", content: "FarmCloud · A UX Case Study by Victorine Amani" },
      {
        property: "og:description",
        content:
          "Sole product designer on FarmCloud at Synnefa, serving 5,000+ farmers across 14 countries.",
      },
      ...shareImage(match.context.origin, "farmcloud", "The FarmCloud case study: a farmer watering young plants beside the title."),
    ],
  }),
  component: FarmCloud,
});

const meta: MetaRow[] = [
  { label: "Company", value: "Synnefa" },
  { label: "Year", value: "Dec 2023 – Mar 2026" },
  { label: "Role", value: "Sole Product Designer" },
  { label: "Reach", value: "5,000+ farmers · 14 countries" },
];

/* What the work came to, carried at the top of the page. */
const outcomes: Outcome[] = [
  { figure: "5,000+", note: "Farmers actively using FarmCloud" },
  { figure: "70%", note: "Self-onboarding success, up from 10% on the legacy system" },
  { figure: "6 / 7", note: "Core surfaces originated from research findings" },
  { figure: "14", note: "Countries reached across East and Southern Africa" },
];

/* The usability test of the legacy system, as blocks rather than prose. */
const startingPoint = [
  {
    label: "Approach",
    items: [
      "A usability test of the legacy system, run in person.",
      "Two tasks: complete onboarding, and log a daily work report.",
    ],
  },
  {
    label: "Test group",
    items: [
      "20 existing farmers.",
      "Low to mid digital literacy.",
      "Personal phones, no laptops.",
    ],
  },
  {
    label: "What was tested",
    items: ["Onboarding: whether a farmer could get into the product unaided."],
  },
  {
    label: "Constraints",
    items: [
      "The legacy system was not responsive, so it could not be used on a phone.",
      "Devices had to be provided for the test to run at all.",
    ],
  },
  {
    label: "Outcome",
    items: [
      "2 of 20 farmers completed onboarding on their own.",
      "The other 18 asked for help, and still took over 30 minutes.",
      "One farmer phoned his son partway through. The son got through onboarding, then failed the daily work report.",
      "15 of 20 had no email address, which the flow required before anything else.",
    ],
  },
];

/* Each finding is the problem the rebuilt step below it answers. */
const findings = [
  {
    label: "Sign-up",
    items: [
      "An email address was required before anything else, and 15 of the 20 farmers tested did not have one.",
    ],
  },
  {
    label: "Field labels",
    items: [
      "Fields were named in the product's own terms, so a farmer could not tell what was being asked of them.",
    ],
  },
  {
    label: "The form itself",
    items: [
      "Everything was asked at once, in one undifferentiated run, with nothing to say what belonged together or how much was left.",
    ],
  },
];

/* One answer per finding above, under the same label and in the same order. */
const responses = [
  {
    label: "Sign-up",
    items: [
      "Takes a mobile number or an email, and the farmer sets which of the two to be reached on, so nobody is stopped at the door for lacking an address.",
    ],
  },
  {
    label: "Field labels",
    items: ["Every label was rewritten, with helper text added throughout."],
  },
  {
    label: "The form itself",
    items: [
      "Onboarding was restructured into three steps.",
      "The third splits the farm into two grouped parts: a general profile, and its operational data.",
    ],
  },
];

/* The three rebuilt steps, in the order a farmer meets them. */
const onboarding: WalkthroughStep[] = [
  {
    label: "Your account",
    src: onboardingAccount,
    width: 1600,
    height: 1198,
    hotspot: { x: 74.1, y: 88.5 },
    alt: "Step 1 of 3, Your account: the FarmCloud sign-up form with helper text under each field",
  },
  {
    label: "Send the code",
    src: onboardingVerify,
    width: 1600,
    height: 1125,
    hotspot: { x: 50, y: 68.1 },
    alt: "How should we send your code: a choice between a text message and an email",
  },
  {
    label: "Enter the code",
    src: onboardingCode,
    width: 1600,
    height: 1125,
    hotspot: { x: 50, y: 57.4 },
    alt: "Verify your number: six code boxes above a verify button",
  },
  {
    label: "Contact preference",
    src: onboardingContact,
    width: 1600,
    height: 1125,
    hotspot: { x: 75, y: 78.3 },
    alt: "Step 2 of 3, Contact preference: a choice of SMS, WhatsApp or email",
  },
  {
    label: "Farm setup",
    src: onboardingFarmSetup,
    width: 1600,
    height: 2356,
    hotspot: { x: 78.4, y: 95 },
    tall: true,
    alt: "Step 3 of 3, Farm setup: a general farm profile section above an operational data section",
  },
];

/* What the second round of research found, and the flow it produced. */
const lifecycle = [
  {
    label: "Where it stood",
    items: [
      "The rebuilt onboarding lifted self-onboarding by 70%.",
      "Analytics then showed farmers leaving straight after it. One was still actively using the platform.",
    ],
  },
  {
    label: "A second round of research",
    items: [
      "Shadow sessions with 7 farmers who already held accounts, watching how they worked rather than asking them.",
    ],
  },
  {
    label: "What it showed",
    items: [
      "Farmers were already keeping records, spread across notebooks and separate logs.",
      "The platform carried the same fragmentation instead of resolving it.",
      "Work is followed by stage of production: before planting, during it, and after harvest.",
      "The crop is what all of it hangs on. Without a crop there is no farming, and without farming there is nothing to record, so every process now sits before, during or after one.",
    ],
  },
  {
    label: "The flow it produced",
    items: [
      "A new farm opens on the dashboard.",
      "Add the section of the farm being planted, then the crop going into it.",
      "Add the inventory, whether for that crop or everything the farm holds.",
      "Logging an item offers to raise the expense against it, left to the farmer to take or leave.",
      "A daily work report records what was used, and takes that amount off the inventory item.",
      "Applications and expenses keep logging until harvest.",
      "The harvest report offers to hold the yield as a product, a product being anything the farm can sell.",
      "It stays an offer. A farmer keeping the yield for the household declines it, and the next step is theirs to take either way.",
      "A product that sells is invoiced from accounting, and a fulfilled invoice reads through as revenue.",
      "The record then runs the length of the season: before planting, during it, and after harvest.",
    ],
  },
];

/* Two decisions taken outside the core flow, each one argued from research. */
const beyond = [
  {
    title: "USSD",
    blocks: [
      {
        label: "The research",
        items: [
          "In-person interviews with 12 farmers on their own farms, after the beta. Most had no smartphone.",
          "Tech-savvy farmers ran the platform unaided, moderately conversant ones managed with guidance, and non-tech farmers held feature phones only.",
          "That third group would have been excluded outright without a deliberate alternative.",
        ],
      },
      {
        label: "The constraints",
        items: [
          "The direction given was to mirror as much of the platform as possible in USSD.",
          "Mapped with Africa's Talking: 182 characters a message, 180-second sessions, no multimedia, stateless sessions needing their own session management, one session per device.",
          "Stakeholders aligned once the constraints were written down.",
        ],
      },
      {
        label: "What it carries",
        items: [
          "Satellite data arrived as crop health, weather, soil and eleven indices. Accurate, and unusable as a text message.",
          "Narrowed to three things a farmer can act on: NDVI as how green a mapped area is, weather as current conditions with a five-day forecast and up to a year of history, and soil as ambient temperature, humidity and soil temperature to 10cm.",
          "A farmer handbook covers USSD use, a daily work report worksheet and a pests and diseases reference, so the group can work without calling an agronomist first.",
        ],
      },
    ],
  },
  {
    title: "Market Linkage",
    blocks: [
      {
        label: "The research",
        items: [
          "A shadowing study across 7 farms, large agricultural corporations and smallholders alike, run with a research assistant.",
          "6 of the 7 were actively using FarmCloud, and production tracking was working. What kept surfacing sat outside it: manual buyer connections landed about 40% of the time, and good yields went to waste.",
        ],
      },
      {
        label: "The other side of it",
        items: [
          "A separate round with 10 buyers, recruited through the customer network and stakeholder referrals.",
          "Farmers said brokers were cutting into their margins. Buyers said the same brokers were inflating their costs.",
          "The same problem arriving from both ends of one transaction is what made it worth building.",
        ],
      },
      {
        label: "Scoped to connections",
        items: [
          "The concept on the table was a full marketplace with transactions on the platform.",
          "FarmCloud had no transaction infrastructure, and building it would have taken time the platform did not have.",
          "Scoped instead to connections: farmers and buyers post requests for quotation, respond with quotes, and settle the order offline.",
          "Renaming it from Marketplace to Market Linkage came out of that decision, so the platform's part in the deal is not overstated.",
        ],
      },
    ],
  },
];

/* The pages as they stand on their own, with nothing joining one to the next. */
const lifecycleBefore: WalkthroughStep[] = [
  { label: "Summary", src: beforeDashboard, width: 1600, height: 1125, alt: "The FarmCloud summary dashboard" },
  { label: "Farm elements", src: beforeElements, width: 1600, height: 1125, alt: "The farm elements list" },
  { label: "A farm element", src: beforeElement, width: 1600, height: 1125, alt: "One farm element and the plants in it" },
  { label: "Farm inventory", src: beforeInventoryPage, width: 1600, height: 1125, alt: "The farm inventory list" },
  { label: "Daily work reports", src: beforeReports, width: 1600, height: 1125, alt: "The daily work reports page" },
];

/* The same product walked in the order a season is actually recorded, each
   step logged against the crop the one before it set up. */
const lifecycleAfter: WalkthroughStep[] = [
  {
    label: "The land",
    src: afterElement,
    width: 1600,
    height: 1125,
    hotspot: { x: 75.5, y: 67.2 },
    alt: "Farm elements with the add greenhouse dialog open",
  },
  {
    label: "The crop",
    src: afterCrop,
    width: 1600,
    height: 1125,
    hotspot: { x: 64.6, y: 67 },
    alt: "A farm element with the dialog asking what type of record to add",
  },
  {
    label: "The inputs",
    src: afterInventory,
    width: 1600,
    height: 1125,
    hotspot: { x: 75.5, y: 69.5 },
    alt: "Farm inventory with the add fertilizer dialog open",
  },
  {
    label: "What it cost",
    src: afterExpense,
    width: 1600,
    height: 1125,
    hotspot: { x: 75.5, y: 69.5 },
    alt: "The same dialog with the create associated expense switch turned on",
  },
  {
    label: "The work done",
    src: afterReport,
    width: 1600,
    height: 1125,
    hotspot: { x: 86.5, y: 81.6 },
    alt: "Daily work reports with a report open against the crop",
  },
];

function FarmCloud() {
  return (
    <CaseStudyHero
      title="FarmCloud"
      meta={meta}
      outcomes={outcomes}
      deck="FarmCloud is a simple farm record keeping platform. It logs all your farm activities, tracks income and expenses, manages your inventory, and connects you to the market."
      image={{
        src: heroImage,
        alt: "FarmCloud dashboard shown on a laptop set in a green field",
        width: 1448,
        height: 1086,
      }}
    >
      <CaseStudySection
        title="Why it was rebuilt"
        align="right"
        media={
          <SectionImage
            src={legacyImage}
            alt="The legacy FarmCloud dashboard: a farm overview beside a farm list"
            caption="The legacy system."
            width={615}
            height={246}
          />
        }
      >
        <Prose align="right">
          Onboarding ran through agents. A farmer was signed up in person, by staff, and
          self-onboarding barely happened.
        </Prose>
        <Prose align="right">
          The system did not carry Synnefa&apos;s branding or its tone either, so the product a
          farmer used did not read as the company&apos;s own.
        </Prose>
        <Prose align="right">
          And once a farmer was onboarded, they did not come back. Farmers simply stopped
          using it after sign-up. It was a shell.
        </Prose>
      </CaseStudySection>

      <CaseStudySection
        title="The starting point"
        figure={
          <SectionImage
            src={researchBoard}
            alt="A pinboard of research findings from the farmer onboarding journey, written on sticky notes"
            width={1408}
            height={768}
            card
          />
        }
      >
        {startingPoint.map((block) => (
          <FactList key={block.label} label={block.label} items={block.items} />
        ))}
      </CaseStudySection>

      <CaseStudySection title="What the research told us">
        {findings.map((block) => (
          <FactList key={block.label} label={block.label} items={block.items} />
        ))}
      </CaseStudySection>

      <CaseStudySection
        title="What we did with the findings"
        figure={<Walkthrough steps={onboarding} />}
      >
        {responses.map((block) => (
          <FactList key={block.label} label={block.label} items={block.items} />
        ))}
      </CaseStudySection>

      <CaseStudySection
        title="The Crop Lifecycle Framework"
        figure={
          <div className="grid gap-8 lg:grid-cols-2">
            <Walkthrough steps={lifecycleBefore} size="half" guided={false} />
            <Walkthrough steps={lifecycleAfter} size="half" />
          </div>
        }
      >
        {lifecycle.map((block) => (
          <FactList key={block.label} label={block.label} items={block.items} />
        ))}
      </CaseStudySection>

      <CaseStudySection title="Beyond the Core Flow" columns={1}>
        {beyond.map((decision) => (
          <div key={decision.title}>
            <Subhead>{decision.title}</Subhead>
            {/* The three blocks run across the width; the decisions themselves
                stay stacked, one above the other. */}
            <div className="mt-8 grid gap-x-10 gap-y-10 md:grid-cols-3">
              {decision.blocks.map((block) => (
                <FactList key={block.label} label={block.label} items={block.items} />
              ))}
            </div>
          </div>
        ))}
      </CaseStudySection>

      <MoreWork current="farmcloud" />
    </CaseStudyHero>
  );
}
