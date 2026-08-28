import Link from "next/link";

/**
 * The thin bar every /admin page shares.
 *
 * Just enough to move between the two admin pages and to sign out - the
 * pages themselves render their own <main>, so this stays a <header> rather
 * than another wrapping landmark competing with it.
 *
 * Lives in the (secured) route group specifically so it does NOT wrap
 * /admin/login - a sign-out button and a "Conversations" link on the one
 * page reachable while signed out would be confusing rather than harmless.
 * The group folder is invisible in the URL: /admin/estimates is still
 * /admin/estimates.
 */
export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      {/*
        The site's own Navigation is `fixed`, not part of document flow - see
        components/layout/navigation.tsx - so without a top offset here this
        bar renders right under it and the two overlap. mt-20 matches the
        nav's own un-scrolled height (h-20); it shrinks to h-14 on scroll,
        the same way every other page's own top padding is sized to the
        larger of the two rather than tracking the nav pixel for pixel.
      */}
      <header className="mt-20 border-b border-foreground/10 bg-foreground/[0.015] px-6 py-3">
        <div className="mx-auto flex max-w-5xl items-center justify-between gap-4">
          <nav className="flex items-center gap-5 font-mono text-xs uppercase tracking-widest text-muted-foreground">
            <Link href="/admin" className="text-foreground transition-colors hover:text-primary">
              Hitasoft admin
            </Link>
            <Link href="/admin/estimates" className="transition-colors hover:text-foreground">
              Estimates
            </Link>
            <Link href="/admin/conversations" className="transition-colors hover:text-foreground">
              Conversations
            </Link>
          </nav>
          <form method="post" action="/api/admin/logout">
            <button
              type="submit"
              className="font-mono text-xs uppercase tracking-widest text-muted-foreground transition-colors hover:text-foreground"
            >
              Log out
            </button>
          </form>
        </div>
      </header>
      {children}
    </>
  );
}
