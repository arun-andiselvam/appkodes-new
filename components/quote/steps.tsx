"use client";

import { useRef, type ChangeEvent } from "react";
import { ArrowRight, Paperclip, X } from "lucide-react";
import {
  ATTACHMENT,
  quoteChrome,
  type QuoteOption,
  type QuoteStep,
} from "@/content/quote-flow";
import { QuoteTurnstile } from "@/components/quote/turnstile";

/**
 * The three kinds of step, rendered.
 *
 * These hold no state and no flow logic. The modal owns both, and hands each
 * of these exactly what it needs to draw and one callback to report what
 * happened. Which step comes next is a property of the script in
 * content/quote-flow.ts, and nothing in this file knows it.
 *
 * Controls are square, and the one that submits is a pill. That is not a
 * choice made here - it is what components/sections/contact-form.tsx already
 * does, and this modal is the same form asked one question at a time.
 */

/** How much has to be written before the brief counts as a brief. */
export const BRIEF_MIN_CHARS = 30;

/* ------------------------------------------------------------------ shared */

function StepHead({ step }: { step: QuoteStep }) {
  return (
    <div className="space-y-2">
      <h2 className="font-display text-xl leading-tight tracking-tight lg:text-2xl">
        {step.ask}
      </h2>
      {step.hint && (
        <p className="text-sm leading-relaxed text-muted-foreground">{step.hint}</p>
      )}
    </div>
  );
}

/*
 * The stagger. Each option arrives 40ms after the one above it, which reads as
 * a list being dealt rather than a block appearing.
 *
 * Returns nothing at all when the visitor has asked for reduced motion, so the
 * options are simply there. hooks/use-reduced-motion.ts reads the preference
 * correctly on the first client render, so there is no frame where this
 * animates before being told not to.
 */
function stagger(index: number, reduceMotion: boolean) {
  if (reduceMotion) return undefined;
  return { animationDelay: `${index * 40}ms`, animationFillMode: "backwards" as const };
}

function motionClass(reduceMotion: boolean) {
  return reduceMotion
    ? ""
    : "animate-in fade-in slide-in-from-bottom-2 duration-300";
}

/* ------------------------------------------------------------------ choice */

export function ChoiceStep({
  step,
  onPick,
  reduceMotion,
}: {
  step: Extract<QuoteStep, { kind: "choice" }>;
  onPick: (option: QuoteOption) => void;
  reduceMotion: boolean;
}) {
  return (
    <div className="space-y-5">
      <StepHead step={step} />

      <div className="space-y-2">
        {step.options.map((option, index) => (
          <button
            key={option.value}
            type="button"
            onClick={() => onPick(option)}
            style={stagger(index, reduceMotion)}
            className={`group flex w-full items-center justify-between gap-3 border border-foreground/15 px-4 py-3 text-left text-[15px] leading-snug transition-colors hover:border-foreground/40 hover:bg-foreground/[0.03] focus-visible:border-foreground/50 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-foreground/30 ${motionClass(reduceMotion)}`}
          >
            {option.label}
            <ArrowRight
              aria-hidden
              className="h-4 w-4 shrink-0 text-muted-foreground transition-transform group-hover:translate-x-0.5"
            />
          </button>
        ))}
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------- brief */

function formatBytes(bytes: number) {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${Math.round(bytes / 1024)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

/**
 * The one step that asks for real effort, answerable two ways.
 *
 * Typing and attaching are both first class. Somebody who has already written
 * a spec should not have to summarise it into a textarea to talk to us, and
 * somebody with the problem in their head and nothing on paper should not be
 * made to feel underprepared.
 *
 * Either one alone gets them through. See BRIEF_MIN_CHARS for the typed bar.
 */
export function BriefStep({
  step,
  text,
  onTextChange,
  file,
  onFileChange,
  fileError,
  onContinue,
  reduceMotion,
}: {
  step: Extract<QuoteStep, { kind: "brief" }>;
  text: string;
  onTextChange: (value: string) => void;
  file: File | null;
  onFileChange: (file: File | null) => void;
  fileError: string;
  onContinue: () => void;
  reduceMotion: boolean;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const ready = text.trim().length >= BRIEF_MIN_CHARS || file !== null;

  function handleFile(event: ChangeEvent<HTMLInputElement>) {
    onFileChange(event.target.files?.[0] ?? null);
    /*
     * Clearing the input's own value is what makes "remove, then attach the
     * same file again" work. Without it the change event never fires the
     * second time, because the value has not changed.
     */
    event.target.value = "";
  }

  return (
    <div className={`space-y-5 ${motionClass(reduceMotion)}`}>
      <StepHead step={step} />

      <div>
        <label htmlFor="quote-brief" className="sr-only">
          {step.ask}
        </label>
        <textarea
          id="quote-brief"
          rows={5}
          value={text}
          onChange={(event) => onTextChange(event.target.value)}
          placeholder={step.placeholder}
          className="w-full resize-y border border-foreground/15 bg-transparent px-4 py-3 text-[15px] leading-relaxed outline-none transition-colors placeholder:text-muted-foreground/60 focus:border-foreground/50"
        />
      </div>

      {/* -------------------------------------------------- attachment */}
      <div className="space-y-2">
        <input
          ref={inputRef}
          type="file"
          accept={ATTACHMENT.accept}
          onChange={handleFile}
          className="sr-only"
          id="quote-attachment"
        />

        {file ? (
          <div className="flex items-center justify-between gap-3 border border-foreground/15 bg-foreground/[0.02] px-4 py-3">
            <div className="flex min-w-0 items-center gap-2.5">
              <Paperclip aria-hidden className="h-4 w-4 shrink-0 text-muted-foreground" />
              <span className="truncate text-sm">{file.name}</span>
              <span className="shrink-0 font-mono text-xs text-muted-foreground">
                {formatBytes(file.size)}
              </span>
            </div>
            <button
              type="button"
              onClick={() => onFileChange(null)}
              className="shrink-0 text-muted-foreground transition-colors hover:text-foreground"
              aria-label={`${quoteChrome.attachRemove} ${file.name}`}
            >
              <X aria-hidden className="h-4 w-4" />
            </button>
          </div>
        ) : (
          <button
            type="button"
            onClick={() => inputRef.current?.click()}
            className="flex w-full items-center gap-2.5 border border-dashed border-foreground/20 px-4 py-3 text-left text-sm text-muted-foreground transition-colors hover:border-foreground/40 hover:text-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-foreground/30"
          >
            <Paperclip aria-hidden className="h-4 w-4 shrink-0" />
            {quoteChrome.attach}
            <span className="ml-auto shrink-0 font-mono text-xs">
              {quoteChrome.attachHint}
            </span>
          </button>
        )}

        {fileError && (
          <p role="alert" className="text-sm text-brand-red">
            {fileError}
          </p>
        )}
      </div>

      <button
        type="button"
        onClick={onContinue}
        disabled={!ready}
        className="group/next inline-flex h-12 w-full items-center justify-center gap-2 rounded-full bg-primary px-6 text-[15px] text-primary-foreground transition-colors hover:bg-primary/90 disabled:opacity-40"
      >
        {quoteChrome.continue}
        <ArrowRight
          aria-hidden
          className="h-4 w-4 transition-transform group-hover/next:translate-x-1"
        />
      </button>
    </div>
  );
}

/* ----------------------------------------------------------------- details */

/**
 * The recap, then two fields.
 *
 * The recap is not decoration. It is the last chance to catch a wrong answer,
 * and it is what makes the exchange feel like it produced something rather
 * than merely collected something. Every row is also removable from the trail
 * above, which is the difference between a conversation and a wizard.
 */
export function DetailsStep({
  step,
  recap,
  name,
  email,
  onNameChange,
  onEmailChange,
  onSubmit,
  onTurnstileToken,
  onTurnstileReady,
  turnstileReady,
  status,
  failure,
  reduceMotion,
}: {
  step: Extract<QuoteStep, { kind: "details" }>;
  recap: Array<{ field: string; label: string }>;
  name: string;
  email: string;
  onNameChange: (value: string) => void;
  onEmailChange: (value: string) => void;
  onSubmit: () => void;
  onTurnstileToken: (token: string) => void;
  onTurnstileReady: () => void;
  turnstileReady: boolean;
  status: "idle" | "sending";
  failure: string;
  reduceMotion: boolean;
}) {
  return (
    <form
      onSubmit={(event) => {
        event.preventDefault();
        onSubmit();
      }}
      className={`space-y-5 ${motionClass(reduceMotion)}`}
    >
      <StepHead step={step} />

      {recap.length > 0 && (
        <dl className="space-y-2 border border-foreground/10 bg-foreground/[0.02] px-4 py-3">
          {recap.map((row) => (
            <div key={row.field} className="flex justify-between gap-4 text-sm">
              <dt className="shrink-0 text-muted-foreground">{row.field}</dt>
              <dd className="min-w-0 text-right">{row.label}</dd>
            </div>
          ))}
        </dl>
      )}

      <div className="space-y-3">
        <div>
          <label htmlFor="quote-name" className="sr-only">
            {quoteChrome.namePlaceholder}
          </label>
          <input
            id="quote-name"
            name="name"
            required
            autoComplete="name"
            value={name}
            onChange={(event) => onNameChange(event.target.value)}
            placeholder={quoteChrome.namePlaceholder}
            className="w-full border border-foreground/15 bg-transparent px-4 py-3 text-[15px] outline-none transition-colors placeholder:text-muted-foreground/60 focus:border-foreground/50"
          />
        </div>
        <div>
          <label htmlFor="quote-email" className="sr-only">
            {quoteChrome.emailPlaceholder}
          </label>
          <input
            id="quote-email"
            name="email"
            type="email"
            required
            autoComplete="email"
            value={email}
            onChange={(event) => onEmailChange(event.target.value)}
            placeholder={quoteChrome.emailPlaceholder}
            className="w-full border border-foreground/15 bg-transparent px-4 py-3 text-[15px] outline-none transition-colors placeholder:text-muted-foreground/60 focus:border-foreground/50"
          />
        </div>
      </div>

      {/*
        The honeypot, copied in shape from the contact form: hidden with a
        class rather than type="hidden", because a bot reads the type
        attribute. tabIndex and aria-hidden keep it away from a keyboard and a
        screen reader, which is what "hidden from people" has to mean.
      */}
      <div className="absolute left-[-9999px]" aria-hidden>
        <label htmlFor="quote-website">Leave this empty</label>
        <input id="quote-website" name="website" tabIndex={-1} autoComplete="off" />
      </div>

      {/*
        The spam check the honeypot above does not cover. Renders nothing at
        all without a site key, and stays invisible in the normal case - it is
        in "interaction-only" mode, so a visitor who does not look like a
        script never sees it.
      */}
      <QuoteTurnstile onToken={onTurnstileToken} onReady={onTurnstileReady} />

      {failure && (
        <p
          role="alert"
          className="border-l-2 border-brand-red pl-4 text-sm leading-relaxed text-muted-foreground"
        >
          {failure}
        </p>
      )}

      <button
        type="submit"
        disabled={status === "sending" || !turnstileReady}
        className="group/send inline-flex h-12 w-full items-center justify-center gap-2 rounded-full bg-primary px-6 text-[15px] text-primary-foreground transition-colors hover:bg-primary/90 disabled:opacity-60"
      >
        {status === "sending" ? quoteChrome.submitting : quoteChrome.submit}
        <ArrowRight
          aria-hidden
          className="h-4 w-4 transition-transform group-hover/send:translate-x-1"
        />
      </button>

      <p className="text-xs leading-relaxed text-muted-foreground">
        We use this to reply to you and nothing else. No list, no sequence.
      </p>
    </form>
  );
}
