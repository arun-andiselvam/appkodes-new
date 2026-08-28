"use client";

import { useCallback, useEffect, useRef, useState } from "react";
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
import { Chatbot, type ChatbotHandle } from "@/components/quote/chatbot";
import { DirectLine } from "@/components/quote/direct-line";
import { track, type QuotePlacement } from "@/lib/analytics";

/**
 * How many questions somebody answers before the founder's mobile appears.
 *
 * Two. Enough to separate a visitor who has said what they are building from
 * one who opened the modal by accident, and few enough that somebody who never
 * wanted to type is not made to work for it. See direct-line.tsx.
 */
const DIRECT_LINE_AFTER = 2;

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

export function QuoteModal({
  onClose,
  placement = "header",
}: {
  onClose: () => void;
  placement?: QuotePlacement;
}) {
  const reduceMotion = useReducedMotion();

  /*
   * One id for this visit, minted when the modal opens.
   *
   * It ties the scripted answers and the chat turns together in the archive,
   * which are written by two different routes. Generated here rather than on
   * the server because the chat starts before there is anything to submit, so
   * there is no earlier moment that both halves share.
   *
   * Not a secret and not trusted: the worst somebody can do by posting a
   * colliding id is muddle their own record. useState with an initialiser, so
   * it is minted once rather than on every render.
   */
  const [conversationId] = useState(() =>
    typeof crypto !== "undefined" && crypto.randomUUID
      ? crypto.randomUUID()
      : /* Older Safari. Only has to be unique, not unguessable. */
        `${Date.now().toString(16)}-${Math.random().toString(16).slice(2, 10)}`,
  );

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
  /* null while the availability check is in flight. See the effect below. */
  const [chatAvailable, setChatAvailable] = useState<boolean | null>(null);
  const [asking, setAsking] = useState(false);
  const [returnTo, setReturnTo] = useState(firstStepId);
  /* How many questions have been put to the assistant, for the close guard. */
  const [chatTurns, setChatTurns] = useState(0);
  /*
   * The conversational assistant owns its own close guard - see ChatbotHandle
   * in chatbot.tsx - because it is the one that knows whether anything has
   * actually been said. This is how Escape and a backdrop press, which Radix
   * routes through this Dialog rather than through Chatbot's own X button,
   * reach that same guard instead of closing past it.
   */
  const chatbotRef = useRef<ChatbotHandle>(null);

  /*
   * Whether closing would throw anything away.
   *
   * An untouched modal closes silently - asking somebody to confirm discarding
   * nothing is the kind of dialog people learn to click through without
   * reading, which is exactly how the guard stops working on the one occasion
   * it matters.
   */
  const hasProgress =
    history.length > 0 ||
    chatTurns > 0 ||
    briefText.trim().length > 0 ||
    briefFile !== null;

  const [confirmingClose, setConfirmingClose] = useState(false);

  /*
   * Opened. Fired from a mount effect rather than from the launcher's click,
   * so it counts the modal actually appearing - the chunk could still be in
   * flight, or fail to load, and a click that never became a modal should not
   * be counted as one that did.
   */
  useEffect(() => {
    track("quote_open", { placement });
  }, [placement]);

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

  /*
   * Is the conversational assistant reachable?
   *
   * It needs a model to think with AND a database to remember in - the route
   * checks both - because the phase it walks a visitor through has to be a
   * fact the server owns. Either one missing and this falls back to the
   * scripted flow below.
   *
   * `null` until the answer arrives, which is what stops the scripted steps
   * flashing up and being replaced a moment later.
   */
  useEffect(() => {
    const abort = new AbortController();
    fetch("/api/quote/chat", { signal: abort.signal })
      .then((response) => (response.ok ? response.json() : { available: false }))
      .then((payload: { available?: boolean }) =>
        setChatAvailable(Boolean(payload.available)),
      )
      .catch(() => {
        /*
         * Unreachable is unavailable, and the scripted path is whole. Aborting
         * on unmount lands here too, which is harmless - the component is
         * going away and nothing reads the state after it.
         */
        setChatAvailable(false);
      });
    return () => abort.abort();
  }, []);

  const step = quoteSteps[currentId];

  /**
   * Closing, with where they got to.
   *
   * !! THE ABANDON EVENT IS THE USEFUL ONE !!
   *
   * quote_submit counts the people who finished, which is the number that
   * feels good and explains nothing. This counts the ones who did not, and
   * says which question they were looking at when they left. If half of them
   * are standing on the brief, the brief is too much work; if half are on the
   * budget, the bands are wrong. Neither is visible from success alone.
   *
   * Not fired once the enquiry is away - closing a confirmation screen is not
   * abandoning anything.
   */
  function discard() {
    if (status !== "sent") {
      track("quote_abandon", {
        placement,
        step: currentId,
        stage: step.stage,
        answers: history.length,
        in_chat: asking,
      });
    }
    onClose();
  }

  /**
   * Closing, via a confirmation when there is something to lose.
   *
   * The X, the Escape key and a press on the backdrop all arrive here, because
   * the accidental close this exists to prevent is far more often a stray
   * click outside the panel than a deliberate press on the X.
   *
   * !! THE ANSWERS ARE GONE FROM THE SCREEN, NOT FROM THE ARCHIVE !!
   *
   * Anything already said to the assistant is in Postgres before this runs -
   * lib/db.ts writes each turn as it completes. So the wording promises
   * nothing about resuming, which the modal cannot do, and the enquiry that
   * was never sent is still readable in the admin view. Two different losses,
   * and only one of them is the visitor's.
   */
  function requestClose() {
    /*
     * Escape pressed while the guard is up backs out of the guard rather than
     * out of the modal. Escape means "undo the last thing", and the last thing
     * was opening this question - so it resolves the same way the primary
     * button does, which is the safe direction.
     */
    if (confirmingClose) {
      setConfirmingClose(false);
      return;
    }

    if (status === "sent" || !hasProgress) {
      discard();
      return;
    }
    setConfirmingClose(true);
  }

  /** Step somebody into the assistant, remembering where they were standing. */
  const enterAsk = useCallback(
    (from: string) => {
      /* Who actually wants the assistant, and from which question. */
      track("quote_ask_open", { placement, from });
      setReturnTo(from);
      setAsking(true);
      setFailure("");
    },
    [placement],
  );

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
    /*
     * One event per answer, carrying the stable `value` rather than the label.
     * Labels get rewritten; a report keyed on them silently splits into two
     * lines the week somebody improves the copy.
     */
    track("quote_step", {
      step: step.id,
      field: step.field,
      answer: option.value,
      stage: step.stage,
    });

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
    /*
     * Whether they typed, attached, or did both. The brief is the one step
     * that asks for real effort and the likeliest place to lose somebody, so
     * it is worth knowing which affordance is carrying it.
     */
    track("quote_brief", {
      typed: briefText.trim().length > 0,
      attached: briefFile !== null,
      chars: briefText.trim().length,
    });

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
    body.set("conversationId", conversationId);
    body.set("placement", placement);
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
        /*
         * Failures are tracked as carefully as successes. A silent 503 because
         * somebody rotated a key is invisible in a funnel that only counts
         * what worked, and this is the last step before a lead exists.
         */
        track("quote_submit_error", { status: response.status, placement });
        setFailure(payload.error ?? "That did not send. Please try again.");
        setStatus("idle");
        return;
      }

      track("quote_submit", {
        placement,
        answers: history.length,
        attached: briefFile !== null,
        /* Which button, on which page, produced a real enquiry. */
        goal: history.find((answer) => answer.stepId === "intent")?.value,
        budget: history.find((answer) => answer.field === "Budget")?.value,
      });

      setStatus("sent");
    } catch {
      track("quote_submit_error", { status: 0, placement });
      setFailure("That did not send. Check your connection and try again.");
      setStatus("idle");
    }
  }

  const stage = status === "sent" ? QUOTE_STAGES : step.stage;

  /* --------------------------------------------------------- the chatbot */

  /*
   * !! THE CONVERSATION IS THE FRONT DOOR NOW. THE SCRIPT IS THE FALLBACK. !!
   *
   * The client asked on 27 August 2026 for a real assistant that opens by
   * introducing itself, so QuoteBot renders instead of the question graph
   * whenever it is reachable. Everything below this branch - the steps, the
   * brief, the attachment, the details form - is still here and still works,
   * and it is what a visitor gets when ANTHROPIC_API_KEY or DATABASE_URL is
   * unset. Same rule as every other integration on this site: a missing key
   * means a feature is absent, never a wall somebody hits.
   *
   * Placed after every hook in this component, so the early return cannot
   * change how many run. `null` means the check has not come back yet and
   * renders an empty shell - a beat of nothing beats a flash of the scripted
   * flow being replaced under somebody's cursor.
   */
  if (chatAvailable !== false) {
    return (
      <Dialog
        open
        onOpenChange={(next) => {
          /*
           * Escape and a backdrop press land here rather than on Chatbot's own
           * X button, so they have to go through the same guard - see
           * ChatbotHandle. No ref yet (the availability check is still in
           * flight, so Chatbot has not mounted) means nothing has been said
           * either, and closing straight away is correct.
           */
          if (!next) {
            if (chatbotRef.current) chatbotRef.current.requestClose();
            else onClose();
          }
        }}
      >
        <DialogContent
          showCloseButton={false}
          /*
            A drawer stuck to the right edge, on the client's instruction of
            28 August 2026 - not the centred dialog this started as. Radix's
            own DialogContent (components/ui/dialog.tsx) positions and sizes
            centred by default; every positioning/sizing utility below exists
            to override one of those defaults, and relies on cn() there being
            twMerge rather than plain clsx so the later class wins instead of
            both fighting in the stylesheet. slide-in-from-right/slide-out-to-right
            come from tw-animate-css, already used for the fade/zoom classes
            Radix's own data-state attributes drive elsewhere in this file.

            !! FLOATING, NOT EDGE-TO-EDGE - ON THE CLIENT'S INSTRUCTION OF 28 AUGUST 2026 !!

            inset-4 alone gives the floating-card feel a reference design
            asked to be matched: 16px of page visible on every side, rounded
            corners all round rather than the flush sharp-cornered drawer
            this was a moment ago. top and bottom both being set is what
            defines the height - no separate h- utility needed for that.
            sm:left-auto is what turns "floating card near the right edge"
            into "docked to the right edge, fixed width" once there is room
            for it; below that breakpoint the card stays close to full
            width, inset on every side, which reads as a proper floating
            panel on a phone rather than a sliver.
          */
          className="fixed inset-4 flex w-auto max-w-full translate-x-0 translate-y-0 flex-col gap-0 overflow-hidden rounded-2xl border border-foreground/10 bg-background p-0 shadow-2xl data-[state=closed]:slide-out-to-right data-[state=open]:slide-in-from-right sm:left-auto sm:w-[440px]"
        >
          {/*
            Radix needs both of these for the dialog to be announced properly.
            QuoteBot draws its own visible header, so they are screen-reader
            only rather than duplicated on screen.
          */}
          <DialogTitle className="sr-only">{quoteChrome.title}</DialogTitle>
          <DialogDescription className="sr-only">
            {quoteChrome.description}
          </DialogDescription>

          {chatAvailable && (
            <Chatbot
              ref={chatbotRef}
              conversationId={conversationId}
              placement={placement}
              onClose={onClose}
            />
          )}
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog
      open
      /* Escape and the backdrop press both land here, same as the X. */
      onOpenChange={(next) => {
        if (!next) requestClose();
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
              onClick={requestClose}
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

        {/*
          The close guard.

          Drawn over the body rather than replacing it, so what is about to be
          discarded stays visible behind the question - somebody deciding
          whether to throw away four answers should be able to see the four
          answers.

          "Keep going" is the primary and comes first, because the safe choice
          should be the easy one and this dialog appears when somebody has
          probably mis-clicked.
        */}
        {confirmingClose && (
          <div className="absolute inset-0 z-10 flex items-center justify-center bg-background/85 p-6 backdrop-blur-[2px]">
            <div className="w-full max-w-sm border border-foreground/15 bg-background p-5 shadow-lg">
              <h2 className="font-display text-lg tracking-tight">
                Leave this here?
              </h2>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                Your answers will be cleared and the conversation will not be on
                screen if you come back.
              </p>
              <div className="mt-5 flex flex-col gap-2 sm:flex-row">
                <button
                  type="button"
                  autoFocus
                  onClick={() => setConfirmingClose(false)}
                  className="h-11 flex-1 rounded-full bg-primary px-5 text-sm text-primary-foreground transition-colors hover:bg-primary/90"
                >
                  Keep going
                </button>
                <button
                  type="button"
                  onClick={discard}
                  className="h-11 flex-1 rounded-full border border-foreground/20 px-5 text-sm transition-colors hover:bg-foreground/5"
                >
                  Discard
                </button>
              </div>
            </div>
          </div>
        )}

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
              conversationId={conversationId}
              placement={placement}
              onTurn={() => setChatTurns((n) => n + 1)}
              file={briefFile}
              onFileChange={chooseFile}
              fileError={fileError}
              /*
                Out of the chat and into the quote, skipping the brief step.
                Somebody who has just described their problem in their own
                words, or handed over a spec, has already written the brief -
                asking them to write it again in a textarea would be the modal
                not listening.
              */
              onProceed={(chatBrief) => {
                /* The conversation becomes the brief the notification carries. */
                if (chatBrief) setBriefText(chatBrief);
                track("quote_brief", {
                  typed: false,
                  attached: briefFile !== null,
                  chars: 0,
                  from_chat: true,
                });
                setHistory((prior) => [
                  ...prior,
                  {
                    stepId: "brief",
                    field: "The brief",
                    label: briefFile ? briefFile.name : "Told us in the chat",
                    value: "provided",
                  },
                ]);
                setAsking(false);
                setCurrentId("budget");
              }}
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

              {/*
                The direct line, once somebody has shown they are actually
                here about work. Deliberately last on the screen: it is the
                way out for a visitor who does not want a form, not a
                competitor to the question in front of them.
              */}
              {history.length >= DIRECT_LINE_AFTER && <DirectLine className="mt-2" />}
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
