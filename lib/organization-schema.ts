import { channels } from "@/content/contact";
import { socialLinks } from "@/content/footer";
import { site } from "@/content/site";

/**
 * The one Organization block, emitted once per page from app/layout.tsx.
 *
 * !! NOTHING ELSE ON THE SITE MAY EMIT AN Organization !!
 *
 * Every page carried a `provider` naming Hitasoft inside its Service schema
 * and nothing anywhere defined the company itself, so the reference pointed at
 * an entity that did not exist. This is that entity. Two of them, differing in
 * any detail, would ask a search engine to reconcile two companies with the
 * same name.
 *
 * `sameAs` is the field that does the work. It is how a search engine ties
 * this site to the profiles it lists and resolves them into one thing, which
 * is what a knowledge panel is built from. It reads content/footer.ts so the
 * links a visitor can click and the links a crawler is told about cannot
 * disagree.
 *
 * The address, the phone numbers and the email come from content/contact.ts,
 * for the same reason: what the contact page shows and what the schema claims
 * are the same values, not two copies that drift.
 *
 * !! Organization RATHER THAN LocalBusiness, DELIBERATELY !!
 *
 * hitasoft.com publishes a ProfessionalService block with geo coordinates,
 * which is a LocalBusiness subtype and asks to be treated as a place people
 * visit. This company sells software services to clients in four countries and
 * meets most of them anywhere but Madurai. Organization with a postal address
 * says where the company is without claiming to be a local business, and it is
 * the type a knowledge panel for a services company is built from.
 *
 * If local search in Madurai ever becomes a goal, LocalBusiness is the change
 * and it needs opening hours and a Google Business Profile behind it. Adding
 * the type without those is a claim with nothing under it.
 */
export function organizationSchema() {
  const email = channels.find((c) => c.label === "Email")?.value;
  const office = channels.find((c) => c.label === "Office")?.value;

  /*
   * Every phone, typed by what it is for.
   *
   * The client split these on 22 August 2026 so a project enquiry does not
   * land in the queue for student ones, and contactType carries that split
   * through to anything reading the schema rather than flattening both into
   * one number.
   */
  const phones = channels.filter((c) => c.href?.startsWith("tel:"));

  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: site.name,
    url: site.url,
    logo: `${site.url}${site.logo.src}`,
    foundingDate: "2008",
    ...(office
      ? {
          address: {
            "@type": "PostalAddress",
            streetAddress: "Door No 9/1, Karthick Center, Kamala First Street, Chinna Chockikulam",
            addressLocality: "Madurai",
            addressRegion: "Tamil Nadu",
            postalCode: "625002",
            addressCountry: "IN",
          },
        }
      : {}),
    ...(phones.length > 0
      ? {
          contactPoint: phones.map((phone) => ({
            "@type": "ContactPoint",
            telephone: phone.href!.replace("tel:", ""),
            contactType:
              phone.label === "Project enquiries" ? "sales" : "customer service",
            ...(email ? { email } : {}),
            availableLanguage: ["English", "Tamil"],
            areaServed: ["IN", "ID", "AE", "VN"],
          })),
        }
      : {}),
    ...(email ? { email } : {}),
    ...(socialLinks.length > 0
      ? { sameAs: socialLinks.map((link) => link.href) }
      : {}),
  };
}
