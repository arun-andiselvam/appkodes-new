import type { SocialLink } from "./types";

export const footerLinks = {
  // "Pricing" pointed at #pricing, a section removed on 19 August 2026 along
  // with its $0 and $29 tiers. Nothing replaced the anchor, so the link went
  // with it rather than scrolling nowhere.
  Product: [
    { name: "Features", href: "#features" },
    { name: "How it works", href: "#how-it-works" },
    { name: "Integrations", href: "#integrations" },
  ],
  Developers: [
    { name: "Documentation", href: "#developers" },
    { name: "API Reference", href: "#" },
    { name: "SDK", href: "#developers" },
    { name: "Status", href: "#" },
  ],
  Company: [
    { name: "About", href: "#" },
    { name: "Blog", href: "#" },
    { name: "Careers", href: "#", badge: "Hiring" },
    { name: "Contact", href: "#" },
  ],
  Legal: [
    { name: "Privacy", href: "#" },
    { name: "Terms", href: "#" },
    { name: "Security", href: "#security" },
  ],
};
export const socialLinks: SocialLink[] = [
  { name: "Twitter", href: "#" },
  { name: "GitHub", href: "#" },
  { name: "LinkedIn", href: "#" },
];
