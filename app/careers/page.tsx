import { pageMetadata } from "@/lib/seo";
import { CareersIndex } from "@/components/sections/careers-listing";

export const metadata = pageMetadata({
  title: "Careers",
  description:
    "Open roles at Hitasoft. Eighteen years in and a hundred and fifty people doing the work.",
  path: "/careers",
});

/**
 * Every open position, from Strapi. See lib/careers.ts and cms/README.md.
 *
 * !! NO CtaSection !!
 *
 * Every other page on the site closes with it, and this is deliberately the
 * exception: its copy in content/site.ts ("Book a free automation audit")
 * is written for a prospective client, not a candidate, the same reason
 * app/contact/page.tsx also skips it. content/careers.ts's empty state
 * already points a visitor who wants to write in without a live listing
 * toward /contact, which is the honest amount of closing this page needs
 * until there is a real reason to write a candidate-facing one.
 */
export default function CareersPage() {
  return (
    <main>
      <CareersIndex path="/careers" />
    </main>
  );
}
