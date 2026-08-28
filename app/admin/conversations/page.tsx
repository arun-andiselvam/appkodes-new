import type { Metadata } from "next";
import { listConversations, databaseConfigured } from "@/lib/db";

/**
 * Every conversation the assistant has had.
 *
 * !! THE PASSWORD IS NOT IN THIS FILE, AND MUST NOT BE !!
 *
 * proxy.ts gates everything under /admin with basic auth before a request ever
 * reaches a route. That is the only check, deliberately - a second one here
 * would be a second thing to keep right, and the middleware runs first for
 * static assets, API routes and pages alike. See the shouted note there for
 * why that gate fails closed when nothing is configured.
 *
 * force-dynamic because this reads a table that changes every few minutes, and
 * a cached admin page showing yesterday's leads is worse than no admin page.
 */
export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Conversations",
  /*
   * Belt and braces. robots.ts already disallows /admin and basic auth means a
   * crawler is refused before it sees anything, but a page holding other
   * people's email addresses should carry its own noindex regardless.
   */
  robots: { index: false, follow: false, nocache: true },
};

function when(value: string | null) {
  if (!value) return "—";
  return new Date(value).toLocaleString("en-GB", {
    day: "2-digit",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export default async function ConversationsPage() {
  if (!databaseConfigured()) {
    return (
      <Shell>
        <p className="text-muted-foreground">
          <code className="font-mono text-sm">DATABASE_URL</code> is not set, so
          nothing is being recorded. Add it and run{" "}
          <code className="font-mono text-sm">pnpm db:migrate</code>.
        </p>
      </Shell>
    );
  }

  const rows = await listConversations();

  if (rows === null) {
    return (
      <Shell>
        <p className="text-muted-foreground">
          The database could not be reached. The site itself is unaffected —
          enquiries still send. Check the server log for{" "}
          <code className="font-mono text-sm">[db]</code>.
        </p>
      </Shell>
    );
  }

  const submitted = rows.filter((row) => row.submitted_at).length;

  return (
    <Shell>
      <div className="mb-8 flex flex-wrap gap-6 border-b border-foreground/10 pb-6 font-mono text-xs uppercase tracking-widest text-muted-foreground">
        <span>{rows.length} conversations</span>
        <span>{submitted} sent an enquiry</span>
        <span>{rows.length - submitted} walked away</span>
      </div>

      {rows.length === 0 ? (
        <p className="text-muted-foreground">
          Nothing recorded yet. Open the quote assistant on the site and it will
          appear here.
        </p>
      ) : (
        <div className="space-y-4">
          {rows.map((row) => (
            <details
              key={row.id}
              className="group border border-foreground/10 open:border-foreground/25"
            >
              <summary className="flex cursor-pointer flex-wrap items-center gap-x-5 gap-y-2 px-4 py-3 text-sm hover:bg-foreground/[0.02]">
                <span
                  aria-hidden
                  className={`h-2 w-2 shrink-0 rounded-full ${
                    row.submitted_at
                      ? "bg-primary"
                      : row.off_topic > 0
                        ? "bg-brand-red"
                        : "bg-foreground/25"
                  }`}
                />
                <span className="font-mono text-xs text-muted-foreground">
                  {when(row.updated_at)}
                </span>
                <span className="min-w-0 flex-1 truncate">
                  {row.name || row.email ? (
                    <>
                      {row.name}
                      {row.email && (
                        <a
                          href={`mailto:${row.email}`}
                          className="ml-2 text-muted-foreground underline decoration-foreground/20 underline-offset-4"
                        >
                          {row.email}
                        </a>
                      )}
                    </>
                  ) : (
                    <span className="text-muted-foreground">
                      No contact details — did not submit
                    </span>
                  )}
                </span>
                <span className="font-mono text-xs text-muted-foreground">
                  {row.placement ?? "—"}
                </span>
                <span className="font-mono text-xs text-muted-foreground">
                  {row.turns} asked
                  {row.off_topic > 0 && ` · ${row.off_topic} off-topic`}
                </span>
              </summary>

              <div className="space-y-6 border-t border-foreground/10 px-4 py-5 text-sm">
                {row.answers?.length > 0 && (
                  <div>
                    <h2 className="mb-2 font-mono text-xs uppercase tracking-widest text-muted-foreground">
                      Answers
                    </h2>
                    <dl className="space-y-1">
                      {row.answers.map((answer, index) => (
                        <div key={index} className="flex gap-3">
                          <dt className="w-28 shrink-0 text-muted-foreground">
                            {answer.field}
                          </dt>
                          <dd>{answer.label}</dd>
                        </div>
                      ))}
                    </dl>
                  </div>
                )}

                {row.brief && (
                  <div>
                    <h2 className="mb-2 font-mono text-xs uppercase tracking-widest text-muted-foreground">
                      Brief
                    </h2>
                    <p className="whitespace-pre-wrap leading-relaxed">{row.brief}</p>
                  </div>
                )}

                {row.attachment_name && (
                  <p className="font-mono text-xs text-muted-foreground">
                    {/*
                      The name only. The file itself went out with the email and
                      is not stored - putting uploaded documents on disk is a
                      different decision with different consequences, and it has
                      not been taken.
                    */}
                    Attached: {row.attachment_name}
                    {row.attachment_bytes
                      ? ` (${Math.round(row.attachment_bytes / 1024)} KB)`
                      : ""} — sent with the email, not stored here
                  </p>
                )}

                {row.transcript?.length > 0 && (
                  <div>
                    <h2 className="mb-2 font-mono text-xs uppercase tracking-widest text-muted-foreground">
                      Chat
                    </h2>
                    <div className="space-y-2">
                      {row.transcript.map((turn, index) => (
                        <div key={index} className="flex gap-3">
                          <span
                            className={`w-20 shrink-0 font-mono text-xs ${
                              turn.flag === "OFF"
                                ? "text-brand-red"
                                : "text-muted-foreground"
                            }`}
                          >
                            {turn.role === "user" ? "visitor" : turn.flag ?? "bot"}
                          </span>
                          <p className="min-w-0 whitespace-pre-wrap leading-relaxed">
                            {turn.content}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                <p className="font-mono text-[11px] text-muted-foreground">
                  {row.id} · opened {when(row.started_at)}
                </p>
              </div>
            </details>
          ))}
        </div>
      )}
    </Shell>
  );
}

function Shell({ children }: { children: React.ReactNode }) {
  return (
    <main className="mx-auto max-w-5xl px-6 py-16">
      <h1 className="font-display text-3xl tracking-tight">Conversations</h1>
      <p className="mt-2 mb-10 text-sm text-muted-foreground">
        Everything said to the quote assistant. Handle it accordingly — this is
        other people&rsquo;s contact details and other people&rsquo;s business.
      </p>
      {children}
    </main>
  );
}
