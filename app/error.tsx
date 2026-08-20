"use client";

import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Section } from "@/components/primitives/section";
import { Container } from "@/components/primitives/container";
import { Eyebrow } from "@/components/primitives/eyebrow";
import { SectionTitle } from "@/components/primitives/section-title";

/**
 * The error boundary for every route under the root layout.
 *
 * Client component by requirement: `reset` re-renders the segment in place,
 * which is worth offering before a full reload. The error itself is not shown.
 * A stack trace tells a visitor nothing and tells everyone else too much.
 */
export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // The digest is what ties this page to the server log entry.
    console.error(error);
  }, [error]);

  return (
    <main>
      <Section className="min-h-[60vh] flex items-center">
        <Container>
          <Eyebrow className="mb-6">Something went wrong</Eyebrow>
          <SectionTitle className="mb-6">
            This page did not load.
            <br />
            <span className="text-muted-foreground">Try it again.</span>
          </SectionTitle>

          <p className="text-lg text-muted-foreground leading-relaxed max-w-xl mb-10">
            The fault is ours, not yours. We have a record of it.
            {error.digest ? ` Reference ${error.digest}.` : ""}
          </p>

          <Button
            onClick={reset}
            size="lg"
            className="bg-primary hover:bg-primary/90 text-primary-foreground px-8 h-14 text-base rounded-full"
          >
            Try again
          </Button>
        </Container>
      </Section>
    </main>
  );
}
