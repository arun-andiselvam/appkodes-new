import type { CaseStudy } from "@/lib/case-studies";

/**
 * !! NOT REAL CLIENTS. NOT REAL NUMBERS. DO NOT LAUNCH WITH THIS WIRED UP. !!
 *
 * Four invented engagements, added 21 August 2026 so the case study index and
 * the detail page can be judged with content in them. Nothing here happened.
 *
 * !! THE COMPANY NAMES ARE FICTIONAL ON PURPOSE !!
 *
 * Northbound Logistics, Meridian Clinics, Larkfield Retail and Cassio Finance
 * do not exist and are deliberately not the six real clients named in
 * content/testimonials.ts. A made up story under a made up name is a layout
 * exercise. The same story under a real client's name is a false statement
 * about somebody else's business, and docs/positioning.md line 199 forbids
 * attaching numbers to companies on exactly that basis.
 *
 * The percentages are the most dangerous thing in this file. The site has
 * already been cleaned once of a template that credited "98% faster
 * deployment" to Stripe. Every figure below is invented and every one has to
 * be replaced by something the client has confirmed, or deleted.
 *
 * The quotes are invented too, including the names and the job titles. Real
 * client words already exist in content/testimonials.ts, pulled from
 * Trustpilot and unedited. Those are the ones to use.
 *
 * The photographs in public/sample are picsum.photos placeholders under the
 * Unsplash licence, converted to monochrome. They are not pictures of these
 * companies, because these companies are not real.
 *
 * Cleanup: USE_SAMPLE_CASE_STUDIES in lib/case-studies.ts, this file, and the
 * four case-*.webp files in public/sample.
 */
export const sampleCaseStudies: CaseStudy[] = [
  {
    slug: "northbound-logistics",
    title: "How Northbound put quoting in the hands of the software",
    client: "Northbound Logistics",
    industry: "Logistics",
    companySize: "80 to 120",
    location: "Manchester, United Kingdom",
    summary:
      "Freight quotes were built by hand from four price lists and a spreadsheet nobody owned. The quoting logic now runs against the same lists, and a person signs off the ones that fall outside the rules.",
    image: "/sample/case-northbound-logistics.webp",
    results: [
      { value: "6 min", label: "average quote, down from most of an afternoon" },
      { value: "1 in 9", label: "quotes now need a person, rather than all of them" },
    ],
    challenge:
      "Every quote was assembled by hand. Four carrier price lists, a fuel surcharge that moved weekly, and a spreadsheet whose formulas nobody who still worked there had written. Two people spent most of their week on it, and a mistake was only ever found by the customer.",
    approach:
      "We read the spreadsheet before we wrote anything, because the pricing rules only existed inside it. Those rules were moved into a service the existing system calls, with a model reading the carrier sheets as they arrive rather than waiting for somebody to retype them. Anything the rules do not cover goes to a queue with the reason attached.",
    outcome:
      "Quoting is a review rather than a build. The two people who did it by hand now handle exceptions and the accounts that need a human on the phone, and the pricing rules are written down somewhere other than one file.",
    quote: {
      text: "The part that mattered was not the speed. It was that somebody could finally answer why a number was what it was.",
      name: "Alan Rowntree",
      role: "Operations Director, Northbound Logistics",
    },
    sendsTo: "/services/ai-workflow-automation",
  },
  {
    slug: "meridian-clinics",
    title: "How Meridian stopped retyping referral letters",
    client: "Meridian Clinics",
    industry: "Healthcare",
    companySize: "40 to 60",
    location: "Dublin, Ireland",
    summary:
      "Referrals arrived as scanned letters and were typed into the patient system by hand. They are now read on arrival, with anything the model is unsure about held for a person.",
    image: "/sample/case-meridian-clinics.webp",
    results: [
      { value: "4 hours", label: "of daily typing returned to the admin team" },
      { value: "0", label: "patient records sent to a public model" },
    ],
    challenge:
      "Referral letters came in as scans and photographs from a dozen practices, none of them in the same format. Two administrators typed them into the patient system every morning, and a backlog on a busy week pushed appointments back by days.",
    approach:
      "The data could not leave the building, so the model runs on their own hardware rather than a hosted endpoint. It reads each letter, fills the fields it is confident about, and holds the rest. Residency and the audit trail were settled in week one, before anything touched a record.",
    outcome:
      "The morning backlog is gone and the administrators check rather than type. Every extraction is logged with the source letter beside it, which is what made the clinical team willing to try it at all.",
    quote: {
      text: "We were not going to send patient letters to somebody else's server. Being shown how to avoid that was the whole conversation.",
      name: "Dr Niamh Carroll",
      role: "Clinical Lead, Meridian Clinics",
    },
    sendsTo: "/services/ai-software-integration/secure-ai-compliance-architecture",
  },
  {
    slug: "larkfield-retail",
    title: "How Larkfield made twelve years of orders searchable",
    client: "Larkfield Retail",
    industry: "Retail",
    companySize: "120 to 200",
    location: "Coimbatore, India",
    summary:
      "Twelve years of orders sat in a system that could only be searched by exact reference. Staff now ask in plain words and the answer comes back with the record it came from.",
    image: "/sample/case-larkfield-retail.webp",
    results: [
      { value: "12 years", label: "of order history brought into one search" },
      { value: "2 weeks", label: "from first audit to the team using it" },
    ],
    challenge:
      "The order system did what it was built for in 2013 and nothing since. Finding anything meant knowing the reference number already, so the answer to most questions was whoever had been there longest. When that person was on leave, the answer was a guess.",
    approach:
      "Nothing was replaced. We indexed the order history into a vector store beside the existing database and put a search box into the screen the team already opens. Results carry the record they came from, so an answer can always be checked rather than trusted.",
    outcome:
      "A question that used to go to one person now goes to the software. The original system is untouched, which mattered to a business that had been told twice before that it needed replacing.",
    sendsTo: "/services/ai-data-predictive-analytics/data-engineering-vector-databases",
  },
  {
    slug: "cassio-finance",
    title: "How Cassio cut the month end close to a review",
    client: "Cassio Finance",
    industry: "Fintech",
    companySize: "50 to 80",
    location: "Dubai, United Arab Emirates",
    summary:
      "Transactions were categorised and reconciled by hand at month end. They are matched against the ledger as they arrive now, and only the exceptions reach a person.",
    image: "/sample/case-cassio-finance.webp",
    results: [
      { value: "3 days", label: "off the month end close" },
      { value: "1 in 20", label: "transactions reaching a person, rather than all of them" },
    ],
    challenge:
      "Money moved between a payment provider, a banking feed and an accounting package that had never been introduced to each other. Somebody reconciled them at month end, which meant every discrepancy was found weeks after it happened.",
    approach:
      "Transactions are read from the feed as they arrive and matched against the ledger by rules the finance team wrote down during the audit. Anything that does not match goes to a queue with the reason attached rather than being buried in a total.",
    outcome:
      "Month end is a review rather than a rebuild, and a discrepancy surfaces the day it happens. The finance team writes the rules and can change them without calling us.",
    quote: {
      text: "We expected to be sold a replacement for the accounting system. Nobody tried to, and that is why we went ahead.",
      name: "Priya Raghunathan",
      role: "Finance Director, Cassio Finance",
    },
    sendsTo: "/industries/fintech-and-finance",
  },
];
