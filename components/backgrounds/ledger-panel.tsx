import type { IndustryLanding } from "@/content/types";

type Ledger = IndustryLanding["ledger"];

/**
 * The hero visual for an industry page: that trade's own document.
 *
 * !! THIS EXISTS SO THE INDUSTRY HERO IS NOT THE SERVICE HERO !!
 *
 * The page opened with IntegrationDiagram, the CSS 3D architecture stack, with
 * its boxes relabelled. That component is the service page's signature, and
 * reusing it gave two pages meant to be distinct the same opening. A sector
 * page should show the thing the sector recognises, and for finance that is a
 * ledger rather than a block diagram.
 *
 * No "use client" and no animation. The service page hero already runs a
 * canvas and a pointer tracked 3D transform beside it, and a second hero
 * running its own loop would be a cost paid on every industry page for no
 * argument. This is markup.
 *
 * Every value is real text for the same reason the diagram's labels are: a
 * bitmap of a ledger is invisible to search, to a screen reader and to the
 * answer engines this page's schema was written for.
 *
 * The flagged row is not decoration. It carries the same claim the workflow
 * section makes, that a person still checks what the model was unsure about,
 * and it is the reason none of this page promises "no human intervention".
 */
export function LedgerPanel({ ledger }: { ledger: Ledger }) {
  return (
    <figure className="hidden lg:block select-none">
      {/*
        The caption is the text alternative. It is hidden from sighted readers,
        who have the panel, and not from anything else.
      */}
      <figcaption className="sr-only">{ledger.caption}</figcaption>

      <div className="rounded-xl border border-foreground/15 bg-background/80 backdrop-blur-[2px] shadow-[0_22px_48px_-24px_rgb(0_0_0/0.28)]">
        <div className="flex items-center justify-between border-b border-foreground/10 px-5 py-3.5">
          <span className="font-mono text-xs uppercase tracking-widest text-muted-foreground">
            {ledger.label}
          </span>
          {/*
            Three dots, the universal shorthand for "this is an application
            window". Cheaper than drawing a chrome bar and it reads instantly.
          */}
          <span aria-hidden className="flex gap-1.5">
            {[0, 1, 2].map((i) => (
              <span key={i} className="h-1.5 w-1.5 rounded-full bg-foreground/20" />
            ))}
          </span>
        </div>

        <ul>
          {ledger.rows.map((row) => (
            <li
              key={`${row.date}-${row.description}`}
              className="grid grid-cols-[auto_1fr_auto] items-center gap-x-4 border-b border-foreground/[0.07] px-5 py-3.5 last:border-0"
            >
              <span className="font-mono text-[11px] text-muted-foreground">{row.date}</span>
              <span className="min-w-0 truncate text-sm">{row.description}</span>
              <span className="text-right font-mono text-sm tabular-nums">{row.amount}</span>

              {/*
                The category sits on its own line under the description rather
                than in a fourth column. Four columns at this width squeezed
                the description to nothing, and the description is the part a
                reader scans.

                The flagged row takes the accent and the others stay quiet, so
                the eye lands on the exception. That is the whole story of the
                panel in one colour change.
              */}
              <span
                className={`col-start-2 -mt-0.5 justify-self-start border px-2 py-0.5 font-mono text-[10px] uppercase tracking-wider ${
                  row.flagged
                    ? "border-brand-red/40 text-brand-red"
                    : "border-foreground/15 text-muted-foreground"
                }`}
              >
                {row.category}
              </span>
            </li>
          ))}
        </ul>

        <p className="border-t border-foreground/10 px-5 py-3 font-mono text-[11px] text-muted-foreground">
          {ledger.footnote}
        </p>
      </div>
    </figure>
  );
}
