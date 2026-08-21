import Link from "next/link";
import { Section } from "@/components/primitives/section";
import { Container } from "@/components/primitives/container";
import { Eyebrow } from "@/components/primitives/eyebrow";
import { SectionTitle } from "@/components/primitives/section-title";
import { mainNav } from "@/content/navigation";

/**
 * The 404.
 *
 * Next ships a bare white page with a system font, which is what visitors saw
 * until now. This one keeps the header and footer, so a wrong URL leaves you
 * inside the site rather than outside it, and offers the menu again in case
 * the link that brought you here was the one that was wrong.
 */
export default function NotFound() {
  return (
    <main>
      <Section className="min-h-[60vh] flex items-center">
        <Container>
          <Eyebrow className="mb-6">404</Eyebrow>
          <SectionTitle className="mb-6">
            That page is not here.
            <br />
            <span className="text-muted-foreground">These ones are.</span>
          </SectionTitle>

          <p className="text-lg text-muted-foreground leading-relaxed max-w-xl mb-10">
            The address may have changed, or it may never have existed. Either
            way, nothing is broken on your end.
          </p>

          <nav className="flex flex-wrap gap-x-8 gap-y-3">
            {[{ name: "Home", href: "/" }, ...mainNav].map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-sm text-foreground/70 hover:text-foreground transition-colors relative group"
              >
                {link.name}
                <span className="absolute -bottom-1 left-0 h-px w-0 bg-foreground transition-all duration-300 group-hover:w-full" />
              </Link>
            ))}
          </nav>
        </Container>
      </Section>
    </main>
  );
}
