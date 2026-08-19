import { HeroSection } from "@/components/landing/hero-section";
import { FeaturesSection } from "@/components/landing/features-section";
import { AudiencesSection } from "@/components/landing/audiences-section";
import { TestimonialsSection } from "@/components/landing/testimonials-section";
import { MeetingsSection } from "@/components/landing/meetings-section";
import { CtaSection } from "@/components/landing/cta-section";

/**
 * The home page carries the pitch, not the whole site.
 *
 * Until 19 August 2026 this file held all twelve sections and the menu scrolled
 * between them. What it says now is the short version: what we do, who we do it
 * for, that other people vouch for it, that we are real people, and what the
 * first step is. Anyone who wants the detail follows the menu.
 *
 * Navigation and the footer live in app/layout.tsx, so they survive a route
 * change rather than remounting under every click.
 */
export default function Home() {
  return (
    <main>
      <HeroSection />
      <FeaturesSection />
      <AudiencesSection />
      <TestimonialsSection />
      <MeetingsSection />
      <CtaSection />
    </main>
  );
}
