"use client";

import { useEffect, useRef, useState } from "react";
import Script from "next/script";
import { ArrowRight, Check } from "lucide-react";

/**
 * The form every call to action on the site leads to.
 *
 * Client component because it holds submission state. It posts JSON to
 * /api/contact, which has to be a route on this origin: proxy.ts sets
 * `form-action 'self'` and a locked `connect-src`, so a third party embed is
 * blocked before it leaves the page.
 *
 * !! IT NEVER CLAIMS TO HAVE SENT SOMETHING IT DID NOT !!
 *
 * With no webhook configured the route answers 503 and the message it returns
 * is shown as written. A form that thanks somebody and quietly drops the
 * message is the worst failure available on this page.
 *
 * Five fields, three required. docs/positioning.md says this buyer fears open
 * ended scoping and wants a first step small enough to say yes to without a
 * board, and a long form is the opposite of a small first step.
 *
 * Cloudflare Turnstile, added 24 August 2026, sits beside the honeypot as the
 * spam check a honeypot alone does not cover. It renders explicitly (render=
 * explicit, then window.turnstile.render) rather than auto-scanning the page,
 * because React mounts this form after the script has had a chance to load
 * and an auto-scan can miss that. The widget's own script tag carries the
 * page's CSP nonce — see proxy.ts — so no script-src change was needed for it.
 *
 * With NEXT_PUBLIC_TURNSTILE_SITE_KEY unset, none of this renders and the
 * form behaves exactly as it did before: same pattern as the webhook itself.
 */

const TURNSTILE_SITE_KEY = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY;

declare global {
  interface Window {
    turnstile?: {
      render: (container: HTMLElement, options: Record<string, unknown>) => string;
      reset: (widgetId?: string) => void;
      remove: (widgetId: string) => void;
    };
  }
}

type Errors = Record<string, string>;

export function ContactForm({ nonce }: { nonce?: string }) {
  const [status, setStatus] = useState<"idle" | "sending" | "sent">("idle");
  const [errors, setErrors] = useState<Errors>({});
  const [failure, setFailure] = useState("");
  // No site key: nothing to wait for, so the button is never held up by it.
  const [turnstileReady, setTurnstileReady] = useState(!TURNSTILE_SITE_KEY);

  const widgetContainerRef = useRef<HTMLDivElement>(null);
  const widgetIdRef = useRef<string | undefined>(undefined);

  function renderTurnstile() {
    if (!TURNSTILE_SITE_KEY || !window.turnstile || !widgetContainerRef.current) return;
    // Guards a second render: Script's onLoad and the mount effect below can
    // both reach here if the script was already cached from an earlier page.
    if (widgetIdRef.current) return;
    widgetIdRef.current = window.turnstile.render(widgetContainerRef.current, {
      sitekey: TURNSTILE_SITE_KEY,
      appearance: "interaction-only",
      theme: "auto",
      callback: () => setTurnstileReady(true),
      "expired-callback": () => setTurnstileReady(false),
      "error-callback": () => setTurnstileReady(false),
    });
  }

  useEffect(() => {
    // Covers the case where the script tag is already loaded (a client side
    // navigation back to this page), so Script's onLoad will not fire again.
    if (TURNSTILE_SITE_KEY && window.turnstile) renderTurnstile();
    return () => {
      if (widgetIdRef.current && window.turnstile) {
        window.turnstile.remove(widgetIdRef.current);
        widgetIdRef.current = undefined;
      }
    };
  }, []);

  function resetTurnstile() {
    // A token is single use. If the submit it was attached to failed, the
    // token is spent either way, so the widget has to reissue one before
    // another attempt can pass verification.
    if (widgetIdRef.current && window.turnstile) {
      window.turnstile.reset(widgetIdRef.current);
      setTurnstileReady(false);
    }
  }

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus("sending");
    setErrors({});
    setFailure("");

    const data = Object.fromEntries(new FormData(event.currentTarget));

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify(data),
      });

      const result = await response.json().catch(() => ({}));

      if (response.ok) {
        setStatus("sent");
        return;
      }

      setStatus("idle");
      resetTurnstile();
      if (result.errors) setErrors(result.errors as Errors);
      // The route's own wording, shown as written. It is more honest about
      // what happened than anything this component could guess.
      if (result.error) setFailure(String(result.error));
    } catch {
      setStatus("idle");
      resetTurnstile();
      setFailure("That did not send. Please try again.");
    }
  }

  if (status === "sent") {
    return (
      <div className="border border-foreground/15 p-8 lg:p-10">
        <span className="flex h-10 w-10 items-center justify-center border border-foreground/15">
          <Check className="h-5 w-5" aria-hidden />
        </span>
        {/*
          aria-live so somebody who cannot see the panel appear is told the
          form succeeded. Without it the submit button simply vanishes.
        */}
        <p aria-live="polite" className="mt-6 font-display text-2xl tracking-tight">
          That is with us.
        </p>
        <p className="mt-3 text-muted-foreground leading-relaxed">
          Somebody will read it and reply within one working day. The reply is a
          question or a time to talk, not a proposal.
        </p>
      </div>
    );
  }

  return (
    <form
      onSubmit={onSubmit}
      noValidate
      className="border border-foreground/15 p-6 sm:p-8 lg:p-10"
    >
      {TURNSTILE_SITE_KEY && (
        <Script
          src="https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit"
          strategy="afterInteractive"
          nonce={nonce}
          onLoad={renderTurnstile}
        />
      )}

      <div className="grid gap-5 sm:grid-cols-2">
        <Field
          name="name"
          label="Your name"
          required
          autoComplete="name"
          error={errors.name}
        />
        <Field
          name="email"
          label="Work email"
          type="email"
          required
          autoComplete="email"
          error={errors.email}
        />
        <Field
          name="company"
          label="Company"
          autoComplete="organization"
          error={errors.company}
        />
        <Field
          name="phone"
          label="Phone"
          type="tel"
          autoComplete="tel"
          error={errors.phone}
        />
      </div>

      <div className="mt-5">
        <Field
          name="message"
          label="What is taking the longest?"
          required
          textarea
          error={errors.message}
        />
      </div>

      {/*
        The honeypot. Hidden from people, and left blank by them. Bots fill it
        because they cannot tell it is hidden, and the route treats anything in
        it as spam.

        Hidden with a class rather than type="hidden", because a bot reads the
        type attribute. tabIndex and aria-hidden keep it away from a keyboard
        and a screen reader, which is what "hidden from people" has to mean.
      */}
      <div className="absolute left-[-9999px]" aria-hidden>
        <label htmlFor="website">Leave this empty</label>
        <input id="website" name="website" tabIndex={-1} autoComplete="off" />
      </div>

      {/*
        Turnstile injects its own "cf-turnstile-response" hidden input here
        once rendered, inside the <form>, so the existing FormData collection
        in onSubmit already picks it up without any change to it.
      */}
      {TURNSTILE_SITE_KEY && <div ref={widgetContainerRef} className="mt-6" />}

      {failure && (
        <p
          role="alert"
          className="mt-6 border-l-2 border-brand-red pl-4 text-sm text-muted-foreground leading-relaxed"
        >
          {failure}
        </p>
      )}

      <button
        type="submit"
        disabled={status === "sending" || !turnstileReady}
        className="group/send mt-8 inline-flex h-14 items-center gap-2 rounded-full bg-primary px-8 text-base text-primary-foreground transition-colors hover:bg-primary/90 disabled:opacity-60"
      >
        {status === "sending" ? "Sending" : "Send this"}
        <ArrowRight
          aria-hidden
          className="h-4 w-4 transition-transform group-hover/send:translate-x-1"
        />
      </button>

      <p className="mt-5 text-xs text-muted-foreground leading-relaxed">
        We use this to reply to you and nothing else. No list, no sequence.
      </p>
    </form>
  );
}

/**
 * One labelled field.
 *
 * The label is a real <label> tied by htmlFor rather than a placeholder doing
 * the job. A placeholder disappears the moment somebody types, which leaves
 * anybody checking their own answers looking at an unlabelled box, and screen
 * readers treat it as a hint rather than a name.
 *
 * aria-invalid and aria-describedby wire the error message to the field, so it
 * is announced when focus lands there rather than only being visible.
 */
function Field({
  name,
  label,
  type = "text",
  required = false,
  textarea = false,
  autoComplete,
  error,
}: {
  name: string;
  label: string;
  type?: string;
  required?: boolean;
  textarea?: boolean;
  autoComplete?: string;
  error?: string;
}) {
  const errorId = `${name}-error`;
  const shared =
    "mt-2 w-full border bg-transparent px-4 py-3 text-base outline-none transition-colors focus:border-foreground/50 " +
    (error ? "border-brand-red" : "border-foreground/15");

  return (
    <div className={textarea ? "" : "min-w-0"}>
      <label htmlFor={name} className="font-mono text-xs uppercase tracking-widest text-muted-foreground">
        {label}
        {!required && <span className="ml-2 normal-case tracking-normal">optional</span>}
      </label>

      {textarea ? (
        <textarea
          id={name}
          name={name}
          rows={5}
          required={required}
          aria-invalid={Boolean(error)}
          aria-describedby={error ? errorId : undefined}
          className={`${shared} resize-y`}
        />
      ) : (
        <input
          id={name}
          name={name}
          type={type}
          required={required}
          autoComplete={autoComplete}
          aria-invalid={Boolean(error)}
          aria-describedby={error ? errorId : undefined}
          className={shared}
        />
      )}

      {error && (
        <p id={errorId} className="mt-2 text-sm text-brand-red">
          {error}
        </p>
      )}
    </div>
  );
}
