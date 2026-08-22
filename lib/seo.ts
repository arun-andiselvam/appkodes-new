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
      /*
       * !! THIS HAS TO BE HERE, NOT ONLY IN THE LAYOUT !!
       *
       * Setting `openGraph` on a page replaces the object it inherits rather
       * than merging into it, so every page calling this was silently dropping
       * the site's image. Added 22 August 2026, after the home page shared
       * with a preview and every other page shared as a bare text link.
       *
       * That is also why the app/opengraph-image.png file convention was not
       * used. It works, and it works by injecting into the very object this
       * function overwrites, so it covered the one page that does not call
       * this and no others. A file in public with an explicit reference is
       * predictable where that was subtle.
       *
       * metadataBase in app/layout.tsx makes this relative path absolute,
       * which matters because most scrapers ignore a relative og:image.
       */
      images: [
        {
          url: "/og-default.png",
          width: 1200,
          height: 630,
          alt: site.name,
        },
      ],
    },
  };
}
