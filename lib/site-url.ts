import { headers } from "next/headers";

import { site } from "@/content/site";

/**
 * The absolute origin this request is being served from.
 *
 * Canonicals, Open Graph URLs, the sitemap and every JSON-LD `url` have to be
 * absolute, so all of them need one answer to "where is this site". That
 * answer used to be the constant in content/site.ts, which is right in
 * production and wrong everywhere else: on localhost every page declared a
 * canonical pointing at hitasoft.com, so an SEO audit run against the dev
 * server reported every single page as canonicalised away to somewhere else.
 *
 * The real cost of that was not the warning. It was that a genuine canonical
 * mistake and the localhost artefact looked identical, so the check was
 * useless exactly where you would want to run it.
 *
 * !! PRODUCTION IS DELIBERATELY NOT DERIVED FROM THE REQUEST !!
 *
 * The obvious version of "make it dynamic" is to mirror whatever Host header
 * arrived. Do not. A canonical exists to name one URL out of several that
 * serve the same page, and a canonical that echoes the request agrees with
 * every one of them instead. hitasoft.com and www.hitasoft.com would each
 * declare themselves canonical, and so would every preview deployment, which
 * is how a staging copy of a site ends up indexed and competing with the
 * thing it is a copy of.
 *
 * So the order is: an explicit NEXT_PUBLIC_SITE_URL wins, because a staging
 * environment that genuinely wants its own canonical says so. Otherwise
 * production is the fixed brand origin. Only development reads the request,
 * where there is no index to poison and where matching the address bar is the
 * whole point.
 */
export async function siteOrigin(): Promise<string> {
  /*
   * content/site.ts already folds NEXT_PUBLIC_SITE_URL in, so this reads the
   * variable directly rather than comparing against site.url. Otherwise there
   * is no way to tell "set to the production origin on purpose" apart from
   * "not set, defaulted to the production origin".
   */
  const explicit = process.env.NEXT_PUBLIC_SITE_URL;
  if (explicit) return trimSlash(explicit);

  if (process.env.NODE_ENV === "production") return trimSlash(site.url);

  const h = await headers();
  /*
   * x-forwarded-host first: behind a proxy, `host` is the internal address
   * rather than the one in anybody's address bar.
   */
  const host = h.get("x-forwarded-host") ?? h.get("host");
  if (!host) return trimSlash(site.url);

  const proto = h.get("x-forwarded-proto") ?? (isLocal(host) ? "http" : "https");
  return `${proto}://${host}`;
}

/** Loopback in the forms a Host header actually arrives in. */
function isLocal(host: string) {
  const name = host.split(":")[0];
  return name === "localhost" || name === "127.0.0.1" || name === "[::1]" || name.endsWith(".local");
}

/** A trailing slash here doubles every slash in a joined URL. */
function trimSlash(url: string) {
  return url.replace(/\/+$/, "");
}
