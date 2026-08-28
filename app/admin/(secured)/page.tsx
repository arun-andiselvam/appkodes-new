import Link from "next/link";
import type { Metadata } from "next";

/**
 * /admin itself, on the client's instruction of 28 August 2026.
 *
 * Before this there was no page.tsx here at all - only the two real sections
 * underneath it - so landing on the bare path 404'd even once signed in.
 * This is just the front door: two links, nothing this page needs to fetch
 * itself.
 */

export const metadata: Metadata = {
  title: "Admin",
  robots: { index: false, follow: false, nocache: true },
};

const SECTIONS = [
  {
    href: "/admin/estimates",
    title: "Estimates",
    description: "The approval queue. Read, correct and send what QuoteBot has drafted.",
  },
  {
    href: "/admin/conversations",
    title: "Conversations",
    description: "Every conversation the assistant has had, scripted flow and QuoteBot alike.",
  },
];

export default function AdminIndexPage() {
  return (
    <main className="mx-auto max-w-5xl px-6 py-16">
      <h1 className="font-display text-3xl tracking-tight">Hitasoft admin</h1>
      <p className="mt-2 mb-10 text-sm text-muted-foreground">
        Two things live behind this sign-in.
      </p>

      <div className="grid gap-4 sm:grid-cols-2">
        {SECTIONS.map((section) => (
          <Link
            key={section.href}
            href={section.href}
            className="block border border-foreground/10 p-6 transition-colors hover:border-primary/50 hover:bg-foreground/[0.015]"
          >
            <h2 className="font-display text-xl tracking-tight">{section.title}</h2>
            <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
              {section.description}
            </p>
          </Link>
        ))}
      </div>
    </main>
  );
}
