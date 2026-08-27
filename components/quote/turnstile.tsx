"use client";

import { useEffect, useRef } from "react";

/**
 * Cloudflare Turnstile, for the quote modal.
 *
 * The contact form has its own copy of this, rendered with next/script and
 * handed the page's nonce by the server component above it. That route is not
 * open here: this modal is loaded on demand from a client component, so there
 * is no server render to take a nonce from.
 *
 * !! IT LOADS WITHOUT A NONCE, AND THAT IS FINE - HERE IS WHY !!
 *
 * proxy.ts sets script-src with a nonce and 'strict-dynamic'. strict-dynamic
 * trusts scripts inserted by an already trusted script, and the code doing the
 * inserting is the application bundle, which carries the nonce. So an
 * imperative appendChild loads. components/analytics/google-analytics.tsx
 * relies on exactly this for gtag.js and explains it at the same length.
 *
 * The nonce is read off an existing script and copied on anyway, for the same
 * reason that file gives: strict-dynamic is what makes it work today, and the
 * nonce is what makes it keep working if the policy is ever tightened.
 *
 * frame-src already allows challenges.cloudflare.com - added 24 August 2026
 * for the contact form - so the challenge iframe needs no CSP change.
 *
 * With NEXT_PUBLIC_TURNSTILE_SITE_KEY unset this renders nothing and reports
 * ready immediately, and the route skips verification to match. Same rule as
 * every other integration on this site: a missing key means a check is absent,
 * never a wall every submission fails.
 */

const SITE_KEY = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY;

const SCRIPT_SRC =
  "https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit";

type TurnstileApi = {
  render: (container: HTMLElement, options: Record<string, unknown>) => string;
  reset: (widgetId?: string) => void;
  remove: (widgetId: string) => void;
};

function api() {
  return (window as Window & { turnstile?: TurnstileApi }).turnstile;
}

/**
 * Loads the script once per page, however many times the modal is opened.
 *
 * The promise is cached at module scope rather than tracked per mount: closing
 * and reopening the modal should not fetch it again, and two of these mounting
 * at once should not race.
 */
let loader: Promise<void> | null = null;

function loadScript() {
  if (loader) return loader;

  loader = new Promise<void>((resolve, reject) => {
    if (api()) {
      resolve();
      return;
    }

    const script = document.createElement("script");
    script.src = SCRIPT_SRC;
    script.async = true;

    /*
     * Copied from a script already in the document. It has to be read from the
     * `nonce` property rather than getAttribute, because the DOM hides the
     * attribute after parse - the same trap google-analytics.tsx documents.
     */
    const nonce = document.querySelector<HTMLScriptElement>("script[src]")?.nonce;
    if (nonce) script.nonce = nonce;

    script.onload = () => resolve();
    script.onerror = () => reject(new Error("Turnstile script failed to load"));
    document.head.appendChild(script);
  });

  return loader;
}

export function QuoteTurnstile({
  onToken,
  onReady,
}: {
  /** Fires with the token, or with "" when it expires and must be redone. */
  onToken: (token: string) => void;
  /** Fires once the widget can no longer hold up a submission. */
  onReady: () => void;
}) {
  const containerRef = useRef<HTMLDivElement>(null);
  const widgetIdRef = useRef<string | undefined>(undefined);

  useEffect(() => {
    if (!SITE_KEY) {
      onReady();
      return;
    }

    let cancelled = false;

    loadScript()
      .then(() => {
        if (cancelled || !containerRef.current || widgetIdRef.current) return;
        const turnstile = api();
        if (!turnstile) {
          onReady();
          return;
        }

        widgetIdRef.current = turnstile.render(containerRef.current, {
          sitekey: SITE_KEY,
          /* Invisible unless the visitor looks like a script. */
          appearance: "interaction-only",
          theme: "auto",
          callback: (token: string) => {
            onToken(token);
            onReady();
          },
          "expired-callback": () => onToken(""),
          "error-callback": () => {
            /*
             * Cloudflare could not decide. Let the submission be attempted
             * anyway: the route still checks, and it refuses a submission with
             * no token. A visitor who gets an error they can retry is better
             * served than one left looking at a button that never enables and
             * says nothing about why.
             */
            onToken("");
            onReady();
          },
        });
      })
      .catch(() => {
        /* Blocked, offline, or an ad blocker ate it. Same reasoning. */
        if (!cancelled) onReady();
      });

    return () => {
      cancelled = true;
      const turnstile = api();
      if (widgetIdRef.current && turnstile) {
        turnstile.remove(widgetIdRef.current);
        widgetIdRef.current = undefined;
      }
    };
    /*
     * Mount only. The callbacks come from the modal and are stable enough in
     * practice, and re-running this would tear down and rebuild a widget the
     * visitor may already have solved.
     */
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (!SITE_KEY) return null;

  return <div ref={containerRef} />;
}
