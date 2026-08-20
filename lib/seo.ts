import type { Metadata } from "next";
import { site } from "@/content/site";

/**
 * Metadata for one page.
 *
 * Every route needs a title, a description, a canonical URL and Open Graph
 * tags that agree with all three. Written out by hand that is fifteen lines
 * per page, three of which get forgotten. This is those fifteen lines, once.
 *
 * The title goes through the template in app/layout.tsx, so pass the page's
 * own name and let the brand be appended there.
 */
export function pageMetadata({
  title,
  description,
  path,
  absoluteTitle = false,
}: {
  /** The page's own name, without the company appended. */
  title: string;
  /** One or two sentences. Search results cut it around 155 characters. */
  description: string;
  /** Route path, leading slash, e.g. "/how-we-work". "/" for the home page. */
  path: string;
  /**
   * Skip the "%s - Hitasoft" template and use `title` verbatim. The home page
   * needs this: it leads with the company name rather than trailing it.
   */
  absoluteTitle?: boolean;
}): Metadata {
  return {
    title: absoluteTitle ? { absolute: title } : title,
    description,
    alternates: { canonical: path },
    openGraph: {
      title: absoluteTitle ? title : `${title} - ${site.name}`,
      description,
      url: path,
      siteName: site.name,
      locale: "en_GB",
      type: "website",
    },
  };
}
