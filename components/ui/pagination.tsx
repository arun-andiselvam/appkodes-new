import Link from "next/link";
import { ArrowLeft, ArrowRight } from "lucide-react";

/**
 * Page numbers for a paginated list.
 *
 * Page one lives at the category's own URL and every page after it at
 * `<base>/page/<n>`. Page one is never written as /page/1, because that would
 * be a second URL serving the same content as the category page and a
 * duplicate is the one thing pagination must not create.
 *
 * Renders nothing at all when there is one page. A pager with a single
 * disabled button is a control that exists to say it has nothing to do.
 *
 * Numbers rather than an endless "load more", because a reader who wants the
 * oldest piece should be able to reach it, and because a crawler cannot press
 * a button. Every page is a real link with a real href.
 */
export function Pagination({
  base,
  current,
  totalPages,
}: {
  /** Category path, no trailing slash, e.g. "/resources/integration-guides". */
  base: string;
  /** 1 based, matching the URL. */
  current: number;
  totalPages: number;
}) {
  if (totalPages <= 1) return null;

  const href = (n: number) => (n === 1 ? base : `${base}/page/${n}`);
  const pages = Array.from({ length: totalPages }, (_, i) => i + 1);

  return (
    <nav aria-label="Pagination" className="mt-12 border-t border-foreground/10 pt-6">
      <ul className="flex flex-wrap items-center gap-2">
        <li>
          {/*
            Previous and next are rendered as spans when they have nowhere to
            go, not as links to the current page. A disabled control should not
            be focusable and should not be a link at all.
          */}
          {current > 1 ? (
            <Link
              href={href(current - 1)}
              rel="prev"
              className="group/prev inline-flex items-center gap-2 border border-foreground/15 px-4 py-2 font-mono text-xs uppercase tracking-widest transition-colors hover:border-foreground/40"
            >
              <ArrowLeft
                aria-hidden
                className="w-3.5 h-3.5 transition-transform group-hover/prev:-translate-x-0.5"
              />
              Previous
            </Link>
          ) : (
            <span className="inline-flex items-center gap-2 border border-foreground/10 px-4 py-2 font-mono text-xs uppercase tracking-widest text-muted-foreground/40">
              <ArrowLeft aria-hidden className="w-3.5 h-3.5" />
              Previous
            </span>
          )}
        </li>

        <li className="flex flex-wrap gap-2 px-1">
          <ul className="flex flex-wrap gap-2">
            {pages.map((n) => (
              <li key={n}>
                {n === current ? (
                  <span
                    aria-current="page"
                    className="inline-block min-w-10 border border-foreground/25 bg-foreground/[0.04] px-3 py-2 text-center font-mono text-xs tabular-nums"
                  >
                    {n}
                  </span>
                ) : (
                  <Link
                    href={href(n)}
                    aria-label={`Page ${n}`}
                    className="inline-block min-w-10 border border-transparent px-3 py-2 text-center font-mono text-xs tabular-nums text-muted-foreground transition-colors hover:border-foreground/15 hover:text-foreground"
                  >
                    {n}
                  </Link>
                )}
              </li>
            ))}
          </ul>
        </li>

        <li>
          {current < totalPages ? (
            <Link
              href={href(current + 1)}
              rel="next"
              className="group/next inline-flex items-center gap-2 border border-foreground/15 px-4 py-2 font-mono text-xs uppercase tracking-widest transition-colors hover:border-foreground/40"
            >
              Next
              <ArrowRight
                aria-hidden
                className="w-3.5 h-3.5 transition-transform group-hover/next:translate-x-0.5"
              />
            </Link>
          ) : (
            <span className="inline-flex items-center gap-2 border border-foreground/10 px-4 py-2 font-mono text-xs uppercase tracking-widest text-muted-foreground/40">
              Next
              <ArrowRight aria-hidden className="w-3.5 h-3.5" />
            </span>
          )}
        </li>
      </ul>
    </nav>
  );
}
