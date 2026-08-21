import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { trailFor } from "@/content/navigation";
import { site } from "@/content/site";

/**
 * The path back up the silo.
 *
 * Every page below the top level renders one. It is the only link on a child
 * page that points at its own parent, and without it a visitor who arrived
 * from a search result has the main menu and nothing else.
 *
 * The last crumb is the page itself, so it is text rather than a link. A
 * breadcrumb whose final item navigates to where you already are is a small
 * lie that people click anyway.
 *
 * !! THE SCHEMA AND THE VISIBLE TRAIL COME FROM ONE SOURCE !!
 *
 * Both are built from the same trailFor() call below. Google requires the
 * name in the markup to match what the reader sees, and the usual way that
 * breaks is a hand written schema block drifting from the rendered list after
 * somebody renames a menu item. Deriving both here means a rename in
 * content/navigation.ts moves the two together or neither.
 */
export function Breadcrumbs({ path }: { path: string }) {
  const trail = trailFor(path);
  if (trail.length < 2) return null;

  /*
   * BreadcrumbList, which is what puts "appkodes.com > Services > AI
   * Integration" in a search result in place of the raw URL. Three things
   * Google is strict about, all handled here:
   *
   * - `item` has to be an absolute URL, so site.url is prefixed. A relative
   *   path is ignored rather than reported as an error, which is the quiet
   *   way this feature fails.
   * - `position` is 1 based and has to run unbroken from the first crumb.
   * - The final entry carries no `item`. It is the page being viewed, and
   *   Google's own example omits the URL there.
   *
   * Home stays in the list. It is a legitimate first crumb and it gives the
   * trail somewhere to start. Its href is "/", so the join below drops the
   * slash rather than emitting a doubled one.
   */
  const schema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: trail.map((crumb, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: crumb.name,
      ...(i === trail.length - 1
        ? {}
        : { item: `${site.url}${crumb.href === "/" ? "" : crumb.href}` }),
    })),
  };

  return (
    <>
      {/*
        Emitted beside the trail rather than from the route, so every page that
        renders a breadcrumb gets its schema without anybody remembering to
        wire it. Six routes render this component and none render it twice, so
        that stays one block per page.
      */}
      <script
        type="application/ld+json"
        // Our own copy, and JSON.stringify escapes the quotes. The `<` guard
        // covers the one character that could still close the tag early.
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(schema).replace(/</g, "\\u003c"),
        }}
      />
      <nav aria-label="Breadcrumb" className="mb-8">
        <ol className="flex flex-wrap items-center gap-x-2 gap-y-1 text-sm text-muted-foreground">
          {trail.map((crumb, i) => {
            const last = i === trail.length - 1;
            return (
              <li key={crumb.href} className="flex items-center gap-2">
                {i > 0 && (
                  <ChevronRight aria-hidden className="w-3.5 h-3.5 opacity-50" />
                )}
                {last ? (
                  <span aria-current="page" className="text-foreground">
                    {crumb.name}
                  </span>
                ) : (
                  <Link
                    href={crumb.href}
                    className="hover:text-foreground transition-colors"
                  >
                    {crumb.name}
                  </Link>
                )}
              </li>
            );
          })}
        </ol>
      </nav>
    </>
  );
}
