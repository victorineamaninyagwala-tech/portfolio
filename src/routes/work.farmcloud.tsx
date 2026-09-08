import { createFileRoute } from "@tanstack/react-router";

import heroImage from "@/assets/farmcloud-hero.webp";
import legacyImage from "@/assets/farmcloud-legacy.webp";
import onboardingAccount from "@/assets/farmcloud-onboarding-1-account.webp";
import onboardingCode from "@/assets/farmcloud-onboarding-3-code.webp";
import onboardingContact from "@/assets/farmcloud-onboarding-4-contact.webp";
import onboardingFarmSetup from "@/assets/farmcloud-onboarding-5-farm-setup.webp";
import onboardingVerify from "@/assets/farmcloud-onboarding-2-verify.webp";
import researchBoard from "@/assets/farmcloud-research-board.webp";
import { CaseStudyHero, type MetaRow } from "@/components/CaseStudyHero";
import {
  CaseStudySection,
  FactList,
  Prose,
  SectionImage,
} from "@/components/CaseStudySection";
import { Walkthrough, type WalkthroughStep } from "@/components/Walkthrough";

export const Route = createFileRoute("/work/farmcloud")({
  head: () => ({
    meta: [
      { title: "FarmCloud · A UX Case Study by Victorine Amani" },
      {
        name: "description",
        content:
          "A farm management dashboard built for farmers, with agronomists alongside to provide the context and expertise to turn data into better decisions.",
      },
      { property: "og:title", content: "FarmCloud · A UX Case Study" },
      {
        property: "og:description",
        content:
          "Sole product designer on FarmCloud at Synnefa, serving 5,000+ farmers across 14 countries.",
      },
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

/* The dark green FarmCloud sets beside its sign-up form, sampled from the
   screen itself, so the card the flow sits in belongs to the product. */
const FARM_GREEN = "#062e17";

/* The three rebuilt steps, in the order a farmer meets them. */
const onboarding: WalkthroughStep[] = [
  {
    label: "Your account",
    caption:
      "An email is optional once a mobile number is given, and every field says what it is for.",
    src: onboardingAccount,
    width: 1600,
    height: 1198,
    hotspot: { x: 74.1, y: 88.5 },
    alt: "Step 1 of 3, Your account: the FarmCloud sign-up form with helper text under each field",
  },
  {
    label: "Send the code",
    caption:
      "The code goes to whichever the farmer gave, so an address is never the price of entry.",
    src: onboardingVerify,
    width: 1600,
    height: 1125,
    hotspot: { x: 50, y: 68.1 },
    alt: "How should we send your code: a choice between a text message and an email",
  },
  {
    label: "Enter the code",
    caption:
      "Six digits, with a way back if it never arrives and a switch to the other channel.",
    src: onboardingCode,
    width: 1600,
    height: 1125,
    hotspot: { x: 50, y: 57.4 },
    alt: "Verify your number: six code boxes above a verify button",
  },
  {
    label: "Contact preference",
    caption:
      "The farmer picks the one channel they check, and it carries alerts rather than marketing.",
    src: onboardingContact,
    width: 1600,
    height: 1125,
    hotspot: { x: 75, y: 78.3 },
    alt: "Step 2 of 3, Contact preference: a choice of SMS, WhatsApp or email",
  },
  {
    label: "Farm setup",
    caption: "Two grouped parts: the general farm profile, then its operational data.",
    src: onboardingFarmSetup,
    width: 1600,
    height: 2356,
    hotspot: { x: 78.4, y: 95 },
    tall: true,
    alt: "Step 3 of 3, Farm setup: a general farm profile section above an operational data section",
  },
];

function FarmCloud() {
  return (
    <CaseStudyHero
      title="FarmCloud"
      meta={meta}
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
        <Prose>
          Onboarding ran through agents. A farmer was signed up in person, by staff, and
          self-onboarding barely happened.
        </Prose>
        <Prose>
          The system did not carry Synnefa&apos;s branding or its tone either, so the product a
          farmer used did not read as the company&apos;s own.
        </Prose>
        <Prose>
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
        figure={<Walkthrough steps={onboarding} ground={FARM_GREEN} />}
      >
        {responses.map((block) => (
          <FactList key={block.label} label={block.label} items={block.items} />
        ))}
      </CaseStudySection>
    </CaseStudyHero>
  );
}
