/**
 * Three numbered cards across.
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
 * !! WRITING THE COPY IS HALF THE JOB !!
 *
 * The bodies have to be held within a few words of each other or the row reads
 * as broken rather than as a set. The capability section shipped once with
 * seventeen words beside twenty five and left the first card visibly half
 * empty. Around thirty words each is the working target.
 */
export function CardRow({ items }: { items: { title: string; body: string }[] }) {
  return (
    <ul className="mt-12 grid md:grid-cols-3 gap-4 lg:gap-6">
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
