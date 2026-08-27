"use client";

import { useCallback, useEffect, useState } from "react";
import { Check, Sparkles, X } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from "@/components/ui/dialog";
import { useReducedMotion } from "@/hooks/use-reduced-motion";
import {
  ASK_STEP_ID,
  askInvite,
  ATTACHMENT,
  firstStepId,
  QUOTE_STAGES,
  quoteChrome,
  quoteSteps,
  type QuoteOption,
} from "@/content/quote-flow";
import { BriefStep, ChoiceStep, DetailsStep } from "@/components/quote/steps";
import { AskStep } from "@/components/quote/ask";

/**
 * The quote assistant.
 *
 * !! THIS FILE IS LOADED ON DEMAND. KEEP IT THAT WAY. !!
 *
 * It pulls in @radix-ui/react-dialog, which components/sections/video-modal.tsx
 * documents as the largest piece of application code on this site after the
 * framework. This control sits on every page rather than on the few that carry
 * a testimonial, so a static import of this module anywhere would put that
 * chunk into every initial bundle. components/quote/launcher.tsx is the only
 * thing that should reach for it, and it does so through dynamic().
 *
 * Radix earns its place here rather than being decoration: it holds the focus
 * trap, the escape key, the scroll lock and the backdrop press, and this is a
 * form somebody types into.
 *
 * The flow itself is data. `quoteSteps` in content/quote-flow.ts is a graph
 * whose edges are the `next` on each answer, so nothing in this file knows
 * which question follows which. Adding a branch is an edit to the content
 * file alone.
 */

type Answer = {
  /** The step that asked. Rewinding needs it. */
  stepId: string;
  /** Row label in the recap and the notification email. */
  field: string;
  /** What the visitor saw themselves choose. */
  label: string;
  /** What gets stored. Stable across copy changes. */
  value: string;
};

/** Chips hold a phrase, not a sentence. */
function shorten(label: string, max = 26) {
  return label.length <= max ? label : `${label.slice(0, max - 1).trimEnd()}…`;
}

export function QuoteModal({ onClose }: { onClose: () => void }) {
  const reduceMotion = useReducedMotion();

  const [history, setHistory] = useState<Answer[]>([]);
  const [currentId, setCurrentId] = useState(firstStepId);

  const [briefText, setBriefText] = useState("");
  const [briefFile, setBriefFile] = useState<File | null>(null);
  const [fileError, setFileError] = useState("");

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");

  const [status, setStatus] = useState<"idle" | "sending" | "sent">("idle");
  const [failure, setFailure] = useState("");

  /*
   * Turnstile's verdict, and whether it is still deciding.
   *
   * `ready` starts false and is set by the widget - on success, on failure, or
   * immediately when there is no site key. It only ever gates the button while
   * the check is genuinely in flight; a widget that errors reports ready
   * anyway, so nobody is left looking at a control that never enables. See
   * components/quote/turnstile.tsx.
   */
  const [turnstileToken, setTurnstileToken] = useState("");
  const [turnstileReady, setTurnstileReady] = useState(false);

  /*
   * The assistant, and where to put somebody back when they are done with it.
   *
   * Starts unavailable and is switched on only once the server confirms a key
   * is configured. That direction is deliberate: defaulting to available and
   * correcting downwards would mean offering a branch that sometimes
   * apologises, and the whole point of the fallback is that nobody meets a
   * broken path.
   */
  const [askAvailable, setAskAvailable] = useState(false);
  const [asking, setAsking] = useState(false);
  const [returnTo, setReturnTo] = useState(firstStepId);

  useEffect(() => {
    const abort = new AbortController();
    fetch("/api/quote/ask", { signal: abort.signal })
      .then((response) => (response.ok ? response.json() : { available: false }))
      .then((payload: { available?: boolean }) => setAskAvailable(Boolean(payload.available)))
      .catch(() => {
        /* Unreachable is the same as unavailable. The scripted path is whole. */
      });
    return () => abort.abort();
  }, []);

  const step = quoteSteps[currentId];

  /** Step somebody into the assistant, remembering where they were standing. */
  const enterAsk = useCallback((from: string) => {
    setReturnTo(from);
    setAsking(true);
    setFailure("");
  }, []);

  function pick(option: QuoteOption) {
    if (step.kind !== "choice") return;
    setHistory((prior) => [
      ...prior,
      { stepId: step.id, field: step.field, label: option.label, value: option.value },
    ]);

    /*
     * The assistant is not a step, so it is not somewhere `currentId` can
     * point. An answer aimed at it opens the detour instead - and when there
     * is no key, resolves to the brief, which is where the detour would have
     * handed them anyway.
     */
    if (option.next === ASK_STEP_ID) {
      if (askAvailable) enterAsk("brief");
      else setCurrentId("brief");
      return;
    }

    setCurrentId(option.next);
  }

  /*
   * Attachments are checked here for the visitor's benefit and again on the
   * route for everyone else's. This side exists so somebody who picks a 40MB
   * scan is told immediately rather than after a minute of upload, and it is
   * not a control - anything can post to the route, so the route repeats both
   * checks and treats this list as a convenience.
   */
  function chooseFile(next: File | null) {
    if (!next) {
      setBriefFile(null);
      setFileError("");
      return;
    }
    if (next.size > ATTACHMENT.maxBytes) {
      setBriefFile(null);
      setFileError("That file is over 8MB. Send a lighter copy, or describe it instead.");
      return;
    }
    /*
     * An empty `type` is normal rather than suspicious - some browsers report
     * nothing for .md and .rtf - so the extension in `accept` is what has
     * filtered it, and the route makes the final call.
     */
    if (next.type && !ATTACHMENT.allowedTypes.includes(next.type as never)) {
      setBriefFile(null);
      setFileError("That is not a document we can read. PDF, Word or plain text.");
      return;
    }
    setBriefFile(next);
    setFileError("");
  }

  function continueFromBrief() {
    if (step.kind !== "brief") return;
    /*
     * The recap needs one line, and the brief is five. Show whichever the
     * visitor actually gave, and prefer their words to the filename.
     */
    const label = briefText.trim()
      ? shorten(briefText.trim(), 40)
      : (briefFile?.name ?? "Attached");
    setHistory((prior) => [
      ...prior,
      { stepId: step.id, field: step.field, label, value: "provided" },
    ]);
    setCurrentId(step.next);
  }

  /**
   * Walk back to the step that asked the chip's question.
   *
   * Everything after it goes, because a later answer was given in the light of
   * this one - the context question depends on the intent, and keeping a stale
   * answer to a question that is no longer being asked is how a wizard ends up
   * submitting nonsense.
   */
  const rewind = useCallback((index: number) => {
    setHistory((prior) => {
      setCurrentId(prior[index].stepId);
      return prior.slice(0, index);
    });
    /* Changing an answer means leaving the detour, if that is where they were. */
    setAsking(false);
    setFailure("");
  }, []);

  async function submit() {
    setStatus("sending");
    setFailure("");

    const body = new FormData();
    body.set("answers", JSON.stringify(history));
    body.set("brief", briefText.trim());
    body.set("name", name);
    body.set("email", email);
    /*
     * The honeypot lives in the details form, which this does not read from -
     * state is the source of truth here. Read it off the DOM so a bot that
     * filled it in is still caught.
     */
    const honeypot = document.querySelector<HTMLInputElement>("#quote-website");
    body.set("website", honeypot?.value ?? "");
    body.set("cf-turnstile-response", turnstileToken);
    if (briefFile) body.set("attachment", briefFile);

    try {
      const response = await fetch("/api/quote", { method: "POST", body });
      const payload = (await response.json().catch(() => ({}))) as {
        error?: string;
      };

      if (!response.ok) {
        setFailure(payload.error ?? "That did not send. Please try again.");
        setStatus("idle");
        return;
      }

      setStatus("sent");
    } catch {
      setFailure("That did not send. Check your connection and try again.");
      setStatus("idle");
    }
  }

  const stage = status === "sent" ? QUOTE_STAGES : step.stage;

  return (
    <Dialog
      open
      onOpenChange={(next) => {
        if (!next) onClose();
      }}
    >
      <DialogContent
        showCloseButton={false}
        /*
         * flex rather than the primitive's grid, so the header stays put and
         * only the body scrolls. A fixed height keeps the dialog from resizing
         * between a four option step and a two field one, which otherwise
         * makes the whole thing jump under the pointer.
         *
         * On a phone it is a bottom sheet: the keyboard arrives at the last
         * step, and a centred dialog gets shoved off the top of the screen
         * when it does.
         */
        className="flex h-[600px] max-h-[calc(100dvh-2rem)] w-[calc(100vw-2rem)] flex-col gap-0 overflow-hidden border-foreground/10 bg-background p-0 sm:max-w-lg max-sm:bottom-0 max-sm:top-auto max-sm:h-[88dvh] max-sm:max-h-none max-sm:w-full max-sm:max-w-none max-sm:translate-y-0 max-sm:rounded-b-none"
      >
        {/* ---------------------------------------------------- header */}
        <div className="shrink-0 border-b border-foreground/10 px-5 pb-3 pt-4">
          <div className="flex items-center justify-between gap-4">
            <DialogTitle className="flex items-center gap-2 font-display text-sm tracking-tight">
              <span aria-hidden className="h-1.5 w-1.5 rounded-full bg-primary" />
              {quoteChrome.title}
            </DialogTitle>
            <button
              type="button"
              onClick={onClose}
              className="-mr-1 p-1 text-muted-foreground transition-colors hover:text-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-foreground/30"
              aria-label="Close"
            >
              <X aria-hidden className="h-4 w-4" />
            </button>
          </div>

          <DialogDescription className="sr-only">
            {quoteChrome.description}
          </DialogDescription>

          {/*
            The rail. Segments rather than a bar, because the visitor is
            counting questions rather than watching a percentage, and because
            docs/design-system.md asks for progress as a thin line with square
            ends rather than a rounded pill.
          */}
          <div className="mt-3 flex gap-1" aria-hidden>
            {Array.from({ length: QUOTE_STAGES }, (_, index) => (
              <span
                key={index}
                className={`h-[3px] flex-1 transition-colors duration-300 ${
                  index < stage ? "bg-primary" : "bg-foreground/10"
                }`}
              />
            ))}
          </div>
        </div>

        {/* ------------------------------------------------------ body */}
        <div
          /*
           * The assistant manages its own scrolling - the transcript moves
           * while the input stays put - so the shell must not also be a scroll
           * container while it is on screen, or there are two of them fighting.
           */
          className={`min-h-0 flex-1 px-5 py-5 ${asking ? "overflow-hidden" : "overflow-y-auto"}`}
        >
          {status === "sent" ? (
            <div className="flex h-full flex-col items-start justify-center gap-4">
              <span className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-primary">
                <Check aria-hidden className="h-5 w-5" />
              </span>
              <h2 className="font-display text-2xl tracking-tight">
                {quoteChrome.sentTitle}
              </h2>
              <p className="text-[15px] leading-relaxed text-muted-foreground">
                {quoteChrome.sentBody}
              </p>
              <button
                type="button"
                onClick={onClose}
                className="mt-2 inline-flex h-11 items-center rounded-full border border-foreground/20 px-6 text-sm transition-colors hover:bg-foreground/5"
              >
                {quoteChrome.sentClose}
              </button>
            </div>
          ) : asking ? (
            <AskStep
              onLeave={() => {
                setAsking(false);
                setCurrentId(returnTo);
              }}
              /*
               * The server says there is no key after all - the check on open
               * raced a config change, or the key was rejected. Drop the
               * branch for the rest of this conversation and put them on the
               * scripted path rather than showing an apology.
               */
              onUnavailable={() => {
                setAskAvailable(false);
                setAsking(false);
                setCurrentId(returnTo);
              }}
              reduceMotion={reduceMotion}
            />
          ) : (
            <div className="space-y-4">
              {/*
                The trail. Answered steps collapse to chips that walk the flow
                back when pressed, which is the difference between a
                conversation you can correct and a wizard you have to restart.
              */}
              {history.length > 0 && (
                <div className="flex flex-wrap gap-1.5">
                  {history.map((answer, index) => (
                    <button
                      key={`${answer.stepId}-${index}`}
                      type="button"
                      onClick={() => rewind(index)}
                      title={`${answer.field}: ${answer.label}`}
                      className="group inline-flex items-center gap-1.5 rounded-sm bg-primary/[0.08] px-2 py-1 text-xs text-primary transition-colors hover:bg-primary/15 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-primary/40"
                    >
                      {shorten(answer.label)}
                      <X
                        aria-hidden
                        className="h-3 w-3 opacity-50 transition-opacity group-hover:opacity-100"
                      />
                      <span className="sr-only">. Change this answer.</span>
                    </button>
                  ))}
                </div>
              )}

              {step.kind === "choice" && (
                <ChoiceStep
                  key={step.id}
                  step={step}
                  onPick={pick}
                  reduceMotion={reduceMotion}
                />
              )}

              {step.kind === "brief" && (
                <BriefStep
                  step={step}
                  text={briefText}
                  onTextChange={setBriefText}
                  file={briefFile}
                  onFileChange={chooseFile}
                  fileError={fileError}
                  onContinue={continueFromBrief}
                  reduceMotion={reduceMotion}
                />
              )}

              {step.kind === "details" && (
                <DetailsStep
                  step={step}
                  recap={history.map(({ field, label }) => ({ field, label }))}
                  name={name}
                  email={email}
                  onNameChange={setName}
                  onEmailChange={setEmail}
                  onSubmit={submit}
                  onTurnstileToken={setTurnstileToken}
                  onTurnstileReady={() => setTurnstileReady(true)}
                  turnstileReady={turnstileReady}
                  status={status}
                  failure={failure}
                  reduceMotion={reduceMotion}
                />
              )}

              {/*
                The assistant, offered from every question rather than only
                from the one option that opens it.

                Hidden until the server has confirmed a key is configured, so
                it is never a control that leads somewhere apologetic. Quiet on
                purpose: most people want the three taps, and a loud "Chat with
                AI!" would pull them off the path that produces a usable lead.
              */}
              {askAvailable && (
                <button
                  type="button"
                  onClick={() => enterAsk(currentId)}
                  className="inline-flex items-center gap-1.5 pt-1 text-xs text-muted-foreground underline decoration-foreground/20 underline-offset-4 transition-colors hover:text-foreground hover:decoration-foreground"
                >
                  <Sparkles aria-hidden className="h-3 w-3" />
                  {askInvite}
                </button>
              )}
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
