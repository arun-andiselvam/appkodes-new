/**
 * Numbered cards, in a column count that divides the row evenly.
 *
 * Used by the problem and capability sections on the service page and by the
 * bottleneck and use case sections on the industry pages. It lived inside
 * components/sections/service-landing.tsx until 21 August 2026, when the
 * second long form page wanted the same row. Written out twice they would
 * drift, and the pair being identical is the whole point.
 *
 * The card is the home page's capability card, reused rather than reinvented:
 * rounded, one hairline border, no shadow, and the border going primary on
 * hover. See components/sections/features.tsx. A long form page inventing its
 * own card would put two card shapes in front of the same visitor on one
 * visit.
 *
 * !! THE COLUMN COUNT FOLLOWS THE ITEM COUNT !!
 *
 * It was three columns whatever it was handed. The workflow automation page is
 * the first with four capabilities, one per child in its silo, and the fourth
 * card sat alone on a second row beside two empty cells. Four silo children is
 * a normal number, so this was going to recur across the pages still to build
 * rather than being one page's problem. Fixed 22 August 2026.
 *
 * Four goes to two by two rather than to a single row of four. Four across
 * puts a thirty word body in a column narrow enough to run seven lines, and
 * the section reads as a rail of tall thin slots. Two by two keeps the card
 * close to the proportion the three column rows already set.
 *
 * Five or more still falls back to three, which orphans again. Nothing passes
 * five today, and the honest fix then is fewer items rather than more columns.
 *
 * !! WRITING THE COPY IS HALF THE JOB !!
 *
 * The bodies have to be held within a few words of each other or the row reads
 * as broken rather than as a set. The capability section shipped once with
 * seventeen words beside twenty five and left the first card visibly half
 * empty. Around thirty words each is the working target.
 */
const COLUMNS: Record<number, string> = {
  1: "",
  2: "md:grid-cols-2",
  3: "md:grid-cols-3",
  4: "sm:grid-cols-2",
};

export function CardRow({ items }: { items: { title: string; body: string }[] }) {
  return (
    <ul className={`mt-12 grid gap-4 lg:gap-6 ${COLUMNS[items.length] ?? "md:grid-cols-3"}`}>
      {items.map((item, i) => (
        <li
          key={item.title}
          className="rounded-lg border border-border bg-card p-6 lg:p-8 transition-colors duration-300 hover:border-primary"
        >
          {/*
            Numbered from the index rather than from the content, so a card
            cannot be reordered into carrying the wrong number. Same padStart
            the service page's process section uses.
          */}
          <span className="font-mono text-sm text-muted-foreground">
            {String(i + 1).padStart(2, "0")}
          </span>
          <h3 className="mt-4 font-display text-2xl tracking-tight">{item.title}</h3>
          <p className="mt-3 text-muted-foreground leading-relaxed">{item.body}</p>
        </li>
      ))}
    </ul>
  );
}
