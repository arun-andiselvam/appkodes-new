import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Section } from "@/components/primitives/section";
import { Container } from "@/components/primitives/container";
import { Eyebrow } from "@/components/primitives/eyebrow";
import { Breadcrumbs } from "@/components/layout/breadcrumbs";
import { mainNav } from "@/content/navigation";

/**
 * A silo parent, listing what sits under it.
 *
 * Reads the same tree the menu reads, so a child page added to
 * content/navigation.ts appears here without anybody remembering to add it
 * twice. The alternative is a hand-kept list on the hub that disagrees with
 * the menu about what the company offers.
 *
 * `item` is matched by href rather than passed in whole, so a route file only
 * has to know its own path.
 */
export function SiloHub({
  path,
  eyebrow,
  title,
  lede,
}: {
  path: string;
  eyebrow: string;
  title: string;
  lede: string;
}) {
  const item = mainNav.find((entry) => entry.href === path);
  const groups = item?.panel?.groups ?? [];

  return (
    <>
      <Section spacing="none" className="pt-32 lg:pt-40 pb-16 lg:pb-20">
        <Container>
          <Breadcrumbs path={path} />
          <Eyebrow className="mb-6">{eyebrow}</Eyebrow>
          <h1 className="text-5xl lg:text-7xl font-display tracking-tight leading-[0.95] max-w-4xl">
            {title}
          </h1>
          <p className="mt-8 text-lg lg:text-xl text-muted-foreground leading-relaxed max-w-2xl">
            {lede}
          </p>
        </Container>
      </Section>

      <Section spacing="tight" className="border-t border-foreground/10">
        <Container>
          {/*
            A one pixel gap over a tinted background draws the grid rules, so
            the cards read as one table rather than as boxes that happen to be
            near each other. It is the same device the process grid uses.
          */}
          <div
            className={`grid gap-px bg-foreground/10 border border-foreground/10 ${
              groups.length > 2 ? "md:grid-cols-3" : "md:grid-cols-2"
            }`}
          >
            {groups.map((group) => (
              <div
                key={group.href}
                className="bg-background p-8 lg:p-10 flex flex-col"
              >
                <Link href={group.href} className="group/card">
                  <h2 className="text-3xl font-display tracking-tight inline-flex items-center gap-2">
                    {group.name}
                    <ArrowRight
                      aria-hidden
                      className="w-5 h-5 text-muted-foreground opacity-0 -translate-x-1 transition-all group-hover/card:opacity-100 group-hover/card:translate-x-0"
                    />
                  </h2>
                </Link>

                <p className="mt-4 text-muted-foreground leading-relaxed">
                  {group.blurb}
                </p>

                {group.children && (
                  <ul className="mt-8 flex flex-col border-t border-foreground/10">
                    {group.children.map((child) => (
                      <li key={child.href}>
                        <Link
                          href={child.href}
                          className="group/row block py-5 border-b border-foreground/10"
                        >
                          <span className="flex items-center justify-between gap-4">
                            <span className="font-medium">{child.name}</span>
                            <ArrowRight
                              aria-hidden
                              className="w-4 h-4 shrink-0 text-muted-foreground opacity-0 -translate-x-1 transition-all group-hover/row:opacity-100 group-hover/row:translate-x-0"
                            />
                          </span>
                          <span className="mt-1 block text-sm text-muted-foreground leading-relaxed">
                            {child.blurb}
                          </span>
                        </Link>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            ))}
          </div>
        </Container>
      </Section>
    </>
  );
}
