import type { Metadata } from "next";

/**
 * Keeps every /admin route out of the index, from the code rather than from
 * robots.txt.
 *
 * !! THIS IS NOW THE ONLY THING SAYING "DO NOT INDEX" ABOUT /admin !!
 *
 * app/robots.ts disallowed /admin until 2 September 2026 and no longer names
 * it at all - see the note there for why. That removes the public signpost,
 * and it also removes the crawl block, so this file is what a crawler that
 * guesses the path now reads instead. It has to keep working.
 *
 * Set on a layout rather than page by page because the pages beneath it
 * already prove that does not hold: four of them each carry their own copy,
 * which was four chances to forget and will be five the moment somebody adds
 * an admin page in a hurry. Next merges metadata down the tree, so a route
 * added under /admin tomorrow inherits this without anybody remembering.
 * The per-page copies stay where they are - they agree with this, they cost
 * nothing, and a page that states its own noindex is readable on its own.
 *
 * `follow: false` alongside `index: false` so a crawler that reaches the
 * login form does not walk its links, and `nocache` to keep it out of the
 * cached-copy feature as well.
 *
 * This wraps /admin/login too, which the (secured) layout deliberately does
 * not - see the note in that file. The login page is exactly the one under
 * /admin that renders HTML to somebody with no session, so it is the one that
 * most needs the tag.
 *
 * Renders children untouched. The visible admin chrome stays in
 * (secured)/layout.tsx; this exists for the metadata alone.
 */
export const metadata: Metadata = {
  robots: { index: false, follow: false, nocache: true },
};

export default function AdminRootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
