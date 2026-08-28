import type { Metadata } from "next";

/**
 * The admin sign-in page.
 *
 * !! THIS IS THE ONE PAGE UNDER /admin THAT PROXY.TS LETS THROUGH UNGATED !!
 *
 * Read the note on adminGate in proxy.ts before touching the routing around
 * this - a login form behind its own login gate is a locked door with the
 * key inside it.
 *
 * A plain HTML form rather than a client component: signing in should not
 * depend on the page's JavaScript having finished loading, and there is
 * nothing here that needs a click handler - the browser's own form
 * submission is the whole mechanism. app/api/admin/login/route.ts is what
 * actually checks the credentials and sets the cookie.
 */

export const metadata: Metadata = {
  title: "Admin sign in",
  robots: { index: false, follow: false, nocache: true },
};

export default async function AdminLoginPage({
  searchParams,
}: {
  searchParams: Promise<{ next?: string; error?: string }>;
}) {
  const params = await searchParams;
  /* Only ever a same-site path - see the note in the login route on why. */
  const next = params.next && params.next.startsWith("/") ? params.next : "/admin/estimates";

  return (
    <main className="mx-auto flex min-h-[70vh] max-w-sm flex-col justify-center px-6 py-16">
      <h1 className="font-display text-2xl tracking-tight">Hitasoft admin</h1>
      <p className="mt-2 mb-8 text-sm text-muted-foreground">
        The estimate queue and the conversation archive live behind this.
      </p>

      {params.error && (
        <p className="mb-6 border border-brand-red/40 px-3 py-2 text-sm text-brand-red">
          {params.error === "rate_limited"
            ? "Too many attempts. Wait a minute and try again."
            : "That username or password is not right."}
        </p>
      )}

      <form method="post" action="/api/admin/login" className="space-y-4">
        <input type="hidden" name="next" value={next} />

        <label className="block">
          <span className="mb-1 block font-mono text-xs uppercase tracking-widest text-muted-foreground">
            Username
          </span>
          <input
            type="text"
            name="username"
            autoComplete="username"
            required
            autoFocus
            className="w-full border border-foreground/20 bg-transparent px-3 py-2.5 text-sm outline-none focus:border-primary"
          />
        </label>

        <label className="block">
          <span className="mb-1 block font-mono text-xs uppercase tracking-widest text-muted-foreground">
            Password
          </span>
          <input
            type="password"
            name="password"
            autoComplete="current-password"
            required
            className="w-full border border-foreground/20 bg-transparent px-3 py-2.5 text-sm outline-none focus:border-primary"
          />
        </label>

        <button
          type="submit"
          className="w-full bg-primary px-4 py-2.5 text-sm text-primary-foreground transition-colors hover:bg-primary/90"
        >
          Sign in
        </button>
      </form>
    </main>
  );
}
