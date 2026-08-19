import { Boxes, KeyRound, ScrollText, Server, ShieldCheck, UserCheck } from "lucide-react";

import type { SecurityFeature } from "./types";

/**
 * How the client's automation is secured, not which badges we own.
 *
 * !! WHAT WAS HERE BEFORE WAS NOT SAFE TO PUBLISH !!
 *
 * The template claimed SOC 2 Type II with "independently audited security
 * controls", "full compliance" with GDPR and HIPAA, and a chip row reading
 * SOC 2, ISO 27001, HIPAA, GDPR, CCPA. docs/positioning.md bans every one of
 * those until Appkodes confirms it holds them, and for good reason. A SOC 2
 * claim is not marketing language. Either an auditor issued a report or they
 * did not, and a healthcare buyer is entitled to rely on the answer. That is a
 * different order of risk from the fabricated Stripe stat the template also
 * shipped with.
 *
 * So the section describes process instead, which is what the positioning doc
 * asks for. Every line below is something Appkodes can do by deciding to do
 * it, with no auditor involved.
 *
 * The cards are ordered by what an SMB buyer actually asks. The first two
 * answer where the data goes, which is the question that stops AI projects
 * before they start. The middle two cover what happens when the automation is
 * wrong, because it will be at some point. The last two are about us, and they
 * matter because the client has to trust a supplier with access to live
 * systems.
 *
 * If Appkodes does hold a certification, add it back. A real badge is worth
 * more than any paragraph here.
 */
export const securityFeatures: SecurityFeature[] = [
  {
    icon: ShieldCheck,
    title: "Nobody trains on your data",
    description:
      "Your inputs stay out of training data. That is a setting somebody has to turn on, and most projects never bother to check.",
  },
  {
    icon: Server,
    title: "The model can run on your server",
    description:
      "Open weight models handle plenty of this work. When the data cannot leave your building, that is the option we reach for first.",
  },
  {
    icon: UserCheck,
    title: "A person approves what matters",
    description:
      "Anything touching money or a customer waits for a person. Which steps run unattended is a decision you make, not one we make for you.",
  },
  {
    icon: ScrollText,
    title: "Every run leaves a record",
    description:
      "You see what ran and what it decided. The record matters most on the day something breaks, which is why we keep all of it.",
  },
  {
    icon: KeyRound,
    title: "Our access is narrow",
    description:
      "Our engineers work from named accounts, never a shared login. Access is scoped to the job, and every credential is rotated the day we hand over.",
  },
  {
    icon: Boxes,
    title: "The accounts are in your name",
    description:
      "The cloud account is yours from day one. Locking a client out of their own system is not a business model we want.",
  },
];

/**
 * Replaces the certification chips.
 *
 * Every item is a commitment rather than a credential, so none of it needs an
 * auditor to be true. Read the label above the row as part of the sentence.
 * Without it a row of short tags in a security section reads as badges, which
 * is the exact misunderstanding this rewrite exists to remove.
 */
export const commitments: string[] = [
  "NDA",
  "Data processing agreement",
  "Named accounts",
  "Credentials rotated",
  "Your accounts, your keys",
];

export const commitmentsLabel = "In the contract, not the brochure";
