import type { Metadata } from "next";

import { ApproveButton } from "@/app/admin/(secured)/estimates/approve-button";
import { RegeneratePanel } from "@/app/admin/(secured)/estimates/regenerate-panel";
import { databaseConfigured } from "@/lib/db";
import type { Estimate } from "@/lib/quote-estimate-schema";
import { currencySymbol } from "@/lib/quote-pdf";
import { formatBytes } from "@/lib/quote-uploads";
import { getSession, listEstimates, listFiles } from "@/lib/quote-store";

/**
 * The approval queue.
 *
 * !! THIS PAGE IS THE HUMAN GATE. NOTHING REACHES A CLIENT WITHOUT IT. !!
 *
 * lib/quote-estimate.ts writes an estimate and stops. It is deliberately not
 * allowed to send, because every piece of copy on this site refuses to state a
 * price and content/contact.ts says nobody can price work they have not looked
 * at. This is where somebody looks.
 *
 * The reviewer notes are the reason to read rather than skim. They are written
 * for whoever is standing here - what the model inferred rather than heard,
 * which figure it is least sure of, what it would want a call about - and they
 * are never rendered into the client's PDF.
 *
 * force-dynamic because a cached approval queue is a queue somebody approves
 * twice, or one that hides an estimate that arrived a minute ago.
 */
export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Estimates",
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

/** Ready first: it is the only status that needs somebody to do something. */
const STATUS_ORDER: Record<string, number> = {
  ready: 0,
  failed: 1,
  running: 2,
  queued: 3,
  approved: 4,
  sent: 5,
};

const STATUS_DOT: Record<string, string> = {
  ready: "bg-primary",
  failed: "bg-brand-red",
  running: "bg-foreground/40",
  queued: "bg-foreground/25",
  approved: "bg-primary/60",
  sent: "bg-foreground/20",
};

export default async function EstimatesPage() {
  if (!databaseConfigured()) {
    return (
      <Shell>
        <p className="text-muted-foreground">
          <code className="font-mono text-sm">DATABASE_URL</code> is not set, so
          no estimates are being recorded.
        </p>
      </Shell>
    );
  }

  const rows = await listEstimates();

  if (rows === null) {
    return (
      <Shell>
        <p className="text-muted-foreground">
          The database could not be reached. Check the server log for{" "}
          <code className="font-mono text-sm">[db]</code>.
        </p>
      </Shell>
    );
  }

  /*
   * The conversation behind each estimate, for the recipient and the brief,
   * and whatever they attached, so a reviewer does not have to leave this
   * page to see what the estimate was actually written from. Both fetched in
   * parallel - there are never many rows, and doing it in sequence would make
   * the page wait on two round trips per estimate instead of one.
   */
  const [sessions, files] = await Promise.all([
    Promise.all(rows.map((row) => getSession(row.conversation_id).catch(() => null))),
    Promise.all(rows.map((row) => listFiles(row.conversation_id).catch(() => []))),
  ]);

  const sorted = rows
    .map((row, index) => ({ row, session: sessions[index], files: files[index] }))
    .sort(
      (a, b) =>
        (STATUS_ORDER[a.row.status] ?? 9) - (STATUS_ORDER[b.row.status] ?? 9),
    );

  const waiting = rows.filter((row) => row.status === "ready").length;
  const failed = rows.filter((row) => row.status === "failed").length;

  return (
    <Shell>
      <div className="mb-8 flex flex-wrap gap-6 border-b border-foreground/10 pb-6 font-mono text-xs uppercase tracking-widest text-muted-foreground">
        <span className={waiting ? "text-primary" : undefined}>
          {waiting} waiting on you
        </span>
        <span>{rows.filter((row) => row.status === "sent").length} sent</span>
        {failed > 0 && <span className="text-brand-red">{failed} failed</span>}
        <span>{rows.length} total</span>
      </div>

      {rows.length === 0 ? (
        <p className="text-muted-foreground">
          Nothing queued yet. An estimate appears here once somebody finishes a
          conversation with QuoteBot.
        </p>
      ) : (
        <div className="space-y-4">
          {sorted.map(({ row, session, files: attachments }) => {
            const content = row.content as Estimate | null;
            const reference = row.id.slice(0, 8).toUpperCase();

            return (
              <details
                key={row.id}
                /* Open by default when it needs somebody. */
                open={row.status === "ready"}
                className="group border border-foreground/10 open:border-foreground/25"
              >
                <summary className="flex cursor-pointer flex-wrap items-center gap-x-5 gap-y-2 px-4 py-3 text-sm hover:bg-foreground/[0.02]">
                  <span
                    aria-hidden
                    className={`h-2 w-2 shrink-0 rounded-full ${STATUS_DOT[row.status] ?? "bg-foreground/25"}`}
                  />
                  <span className="font-mono text-xs uppercase tracking-widest text-muted-foreground">
                    {row.status}
                  </span>
                  <span className="font-mono text-xs text-muted-foreground">
                    {reference}
                  </span>
                  <span className="min-w-0 flex-1 truncate">
                    {session?.verifiedEmail ? (
                      <>
                        {session.name && `${session.name} · `}
                        {session.verifiedEmail}
                      </>
                    ) : (
                      <span className="text-muted-foreground">no recipient</span>
                    )}
                  </span>
                  {content && (
                    <span className="font-mono text-xs">
                      {currencySymbol(content.cost.currency)}
                      {content.cost.low}–{currencySymbol(content.cost.currency)}
                      {content.cost.high}
                    </span>
                  )}
                  <span className="font-mono text-xs text-muted-foreground">
                    {when(row.created_at)}
                  </span>
                </summary>

                <div className="space-y-6 border-t border-foreground/10 px-4 py-5 text-sm">
                  {row.status === "failed" && (
                    <p className="border border-brand-red/40 px-3 py-2 text-brand-red">
                      Failed after {row.attempts} attempts: {row.error}
                    </p>
                  )}

                  {content ? (
                    <>
                      {/*
                        The reviewer notes come FIRST, above the numbers.
                        They are the reason this page exists rather than an
                        auto-send, and putting them under a fold nobody opens
                        would turn approval back into a rubber stamp.
                      */}
                      <div className="border-l-2 border-primary/50 pl-4">
                        <h2 className="mb-2 font-mono text-xs uppercase tracking-widest text-primary">
                          Reviewer notes — not sent to the client
                        </h2>
                        <p className="whitespace-pre-wrap leading-relaxed">
                          {content.reviewerNotes}
                        </p>
                      </div>

                      <Field label="Summary">{content.summary}</Field>

                      <div className="flex flex-wrap gap-x-10 gap-y-3">
                        <Field label="Cost">
                          {currencySymbol(content.cost.currency)}
                          {content.cost.low} – {currencySymbol(content.cost.currency)}
                          {content.cost.high}
                        </Field>
                        <Field label="Timeline">{content.timeline.total}</Field>
                        <Field label="They asked for">
                          {session?.budget ?? "—"}
                          {session?.timeline ? ` · ${session.timeline}` : ""}
                        </Field>
                      </div>

                      <Field label="Basis">{content.cost.basis}</Field>

                      <div>
                        <h2 className="mb-2 font-mono text-xs uppercase tracking-widest text-muted-foreground">
                          Phases
                        </h2>
                        <ul className="space-y-1">
                          {content.phases.map((phase, index) => (
                            <li key={index} className="flex gap-3">
                              <span className="w-40 shrink-0 text-muted-foreground">
                                {phase.duration}
                              </span>
                              <span>{phase.name}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </>
                  ) : (
                    <p className="text-muted-foreground">
                      Not written yet.
                    </p>
                  )}

                  {/*
                    What they actually sent in, on the client's instruction
                    of 28 August 2026 - reading the estimate against the raw
                    document it was written from used to mean leaving this
                    page for /api/admin/files, unguessable path or not.
                  */}
                  <div>
                    <h2 className="mb-2 font-mono text-xs uppercase tracking-widest text-muted-foreground">
                      Attachments
                    </h2>
                    {attachments.length ? (
                      <ul className="space-y-1">
                        {attachments.map((file) => (
                          <li key={file.id}>
                            <a
                              href={`/api/admin/files/${file.id}`}
                              target="_blank"
                              rel="noreferrer"
                              className="text-primary underline decoration-primary/30 underline-offset-2 hover:decoration-primary"
                            >
                              {file.filename}
                            </a>
                            <span className="ml-2 font-mono text-xs text-muted-foreground">
                              {formatBytes(file.bytes)}
                            </span>
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <p className="text-muted-foreground">Nothing attached.</p>
                    )}
                  </div>

                  <div className="flex flex-wrap items-center gap-4 border-t border-foreground/10 pt-5">
                    {row.pdf_path && (
                      <a
                        href={`/api/admin/estimates/${row.id}/pdf`}
                        target="_blank"
                        rel="noreferrer"
                        className="border border-foreground/20 px-4 py-2 font-mono text-xs uppercase tracking-widest text-muted-foreground transition-colors hover:border-foreground/40 hover:text-foreground"
                      >
                        Read the PDF
                      </a>
                    )}

                    {row.status === "ready" && session?.verifiedEmail && (
                      <ApproveButton
                        id={row.id}
                        reference={reference}
                        email={session.verifiedEmail}
                      />
                    )}

                    {(row.status === "ready" || row.status === "failed") && (
                      <RegeneratePanel
                        id={row.id}
                        initialBudget={session?.budget ?? ""}
                        initialTimeline={session?.timeline ?? ""}
                      />
                    )}

                    {row.status === "sent" && (
                      <span className="font-mono text-xs text-muted-foreground">
                        Sent {when(row.sent_at)} to {session?.verifiedEmail}
                      </span>
                    )}
                  </div>

                  <p className="font-mono text-[11px] text-muted-foreground">
                    {row.id} · conversation {row.conversation_id} ·{" "}
                    {row.model ?? "no model"}
                  </p>
                </div>
              </details>
            );
          })}
        </div>
      )}
    </Shell>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <h2 className="mb-1 font-mono text-xs uppercase tracking-widest text-muted-foreground">
        {label}
      </h2>
      <p className="whitespace-pre-wrap leading-relaxed">{children}</p>
    </div>
  );
}

function Shell({ children }: { children: React.ReactNode }) {
  return (
    <main className="mx-auto max-w-5xl px-6 py-16">
      <h1 className="font-display text-3xl tracking-tight">Estimates</h1>
      <p className="mt-2 mb-10 text-sm text-muted-foreground">
        Nothing here reaches a client until you send it. Read the reviewer notes
        and the PDF before you do — the numbers were written by a model and they
        go out with this company&rsquo;s name on them.
      </p>
      {children}
    </main>
  );
}
