"use client";

import {
  forwardRef,
  useCallback,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
  type FormEvent,
} from "react";
import Image from "next/image";
import { Paperclip, Phone, Send, X } from "lucide-react";

import { budgetOptions, greeting, serviceOptions } from "@/content/quote-chat";
import { track, type QuotePlacement } from "@/lib/analytics";
import { DirectLine } from "@/components/quote/direct-line";

/**
 * QuoteBot.
 *
 * !! THE GREETING IS RENDERED, NOT FETCHED. !!
 *
 * It is the same words for every visitor, so generating it would mean paying a
 * model to retype a constant and making somebody watch it stream in to find
 * out what they have opened. It comes from content/quote-chat.ts and is on
 * screen in the same frame the window is.
 *
 * !! THE PHASE COMES FROM THE SERVER AND IS NEVER DECIDED HERE. !!
 *
 * Every reply carries an x-quote-phase header, and that is the only thing that
 * moves `phase` below. This component chooses which affordance to show - the
 * service buttons, the email box, the uploader - but it cannot decide that
 * somebody is verified, and nothing it sends would make the server believe it.
 * lib/quote-session.ts holds the rules. Treat the state here as a mirror of
 * the server's, never as a source of truth.
 */

type Message = {
  role: "user" | "assistant";
  content: string;
  /* Set while an assistant message is still streaming in. */
  pending?: boolean;
};

type Phase =
  | "greeting"
  | "student"
  | "service"
  | "requirement"
  | "verify"
  | "discovery"
  | "files"
  | "wrap"
  | "budget"
  | "timeline"
  | "queued"
  | "closed";

/** Phases where the conversation is over and the composer is put away. */
const FINISHED = new Set<Phase>(["student", "queued", "closed"]);

/**
 * Phases reachable only once the visitor has been sorted into "has a
 * project", never "student".
 *
 * !! "VERIFIED" IN THE PAPERCLIP'S RULE MEANS THIS, NOT THE OTP !!
 *
 * A real mix-up on 28 August 2026: an earlier version of this file gated the
 * paperclip on `verifiedEmail`, reading "only after the visitor is verified"
 * as "only after their email is verified". What was actually meant is
 * simpler and earlier - once the conversation has sorted a visitor into a
 * project lead rather than a student, at all, the pin belongs in the
 * composer. Whether their email is verified yet decides what happens when
 * they press it, not whether it is there to press - see handlePaperclipClick.
 *
 * Every phase after `service` sits behind exactly one thing: the model
 * tagging KIND:lead on the way out of `greeting`. `student` and `greeting`
 * are the only phases that are not this, so listing everything else here
 * is the same set either way - this is the more legible of the two.
 */
const LEAD_PHASES = new Set<Phase>([
  "service",
  "requirement",
  "verify",
  "discovery",
  "files",
  "wrap",
  "budget",
  "timeline",
  "queued",
]);

type UploadedFile = { id: string; name: string; size: string };

/**
 * What the parent can ask this component to do, rather than reaching straight
 * for `onClose`.
 *
 * !! THE PARENT'S ESCAPE/BACKDROP HANDLER GOES THROUGH THIS, NOT ONCLOSE DIRECT !!
 *
 * components/quote/modal.tsx renders the Dialog that actually owns Escape and
 * a backdrop press, so the guard below has to be reachable from there too, not
 * only from the X this component draws itself. `onClose` stays the real,
 * unconditional close - the thing that unmounts this component - and nothing
 * outside `requestClose` is allowed to call it while there is a conversation
 * worth losing.
 */
export type ChatbotHandle = {
  requestClose: () => void;
};

export const Chatbot = forwardRef<
  ChatbotHandle,
  {
    conversationId: string;
    placement: QuotePlacement;
    onClose: () => void;
  }
>(function Chatbot({ conversationId, placement, onClose }, ref) {
  const [messages, setMessages] = useState<Message[]>([
    ...greeting.message.map((content) => ({ role: "assistant" as const, content })),
  ]);
  const [phase, setPhase] = useState<Phase>("greeting");
  const [input, setInput] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  /*
   * Whether they have already said they do not know their budget, so the
   * same six buttons never get put back in front of them - see the render
   * below, on the client's instruction of 28 August 2026.
   */
  const [budgetUnsure, setBudgetUnsure] = useState(false);

  /*
   * The verification sub-state. See VerifyPanel below.
   *
   * `verifyPanelOpen` is separate from the phase - reaching `verify` shows a
   * single button rather than the form itself, on the client's instruction of
   * 28 August 2026, so the form only appears once somebody has actually asked
   * for it rather than landing in front of them the instant the phase moves.
   */
  const [verifyPanelOpen, setVerifyPanelOpen] = useState(false);
  const [codeSent, setCodeSent] = useState(false);
  const [verifiedEmail, setVerifiedEmail] = useState("");

  const [files, setFiles] = useState<UploadedFile[]>([]);
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState("");

  /*
   * Whether the founder's direct contact card has been asked for.
   *
   * Its own boolean rather than a phase, because unlike everything else in
   * this file it is not something the conversation reaches - it is a door a
   * visitor opens themselves, on demand, from wherever they happen to be
   * once they are a lead. Sits alongside `isLead` below (same gate as the
   * paperclip: sorted as a project, not a student) but is not reset by phase
   * changes, so once shown it stays in the transcript rather than
   * disappearing the moment the conversation moves on.
   */
  const [talkToCeoOpen, setTalkToCeoOpen] = useState(false);

  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  /*
   * Mirrors `phase`, purely so applyPhase can compare against the current
   * value without doing it inside a setState updater - see the note there.
   * Always kept in step with `phase` by applyPhase, and read nowhere else.
   */
  const phaseRef = useRef<Phase>("greeting");

  /*
   * Follow the conversation as it grows.
   *
   * Depends on the message array AND on the last message's length, so it also
   * fires while a reply streams in rather than only when one is added. It also
   * has to depend on `phase` and `busy`: the choice buttons (greeting/service/
   * budget/verify) render below the last message, gated on those two, not on
   * anything that changes `messages` - a reply can finish streaming, the
   * buttons can appear, and without this the scroll position never moves to
   * show them. Seen on 28 August 2026: the budget buttons landed below the
   * fold, sitting over the composer, with nothing to bring them into view.
   */
  const lastLength = messages[messages.length - 1]?.content.length ?? 0;
  useEffect(() => {
    scrollRef.current?.scrollTo({
      top: scrollRef.current.scrollHeight,
      behavior: "smooth",
    });
  }, [messages.length, lastLength, phase, busy, verifyPanelOpen]);

  /**
   * Moves the phase, and tracks it moving.
   *
   * The server's own header is the only thing that may call this - see the
   * module comment on why nothing client side may decide the phase itself.
   * What this adds is purely a GA event: one signal every time the funnel
   * actually advances, which is the one thing missing from this assistant's
   * analytics. The old scripted flow had `quote_step` doing this same job for
   * every tap through its question graph; this is that event's equivalent for
   * a conversation that does not have discrete steps to count, only phases.
   *
   * Reads the CURRENT phase from inside the setState updater rather than from
   * the `phase` closed over by whichever callback called this - `send` below
   * is a stable useCallback that does not depend on `phase`, so a value read
   * from its own closure could be one turn stale. The updater form is always
   * live.
   *
   * `quote_closed` fires alongside `quote_phase` rather than instead of it,
   * on the client's instruction of 28 August 2026. `closed` is reachable only
   * one way - the second off-topic strike, see canMove in
   * lib/quote-session.ts - so `quote_phase` already carries this fact as one
   * value among many. Its own event exists so it is a single filter in GA
   * rather than a fact somebody has to know about the state machine to find:
   * exclude `quote_closed` sessions and what is left is genuine drop-off,
   * with the noise of a closed-for-abuse conversation not mixed into it.
   */
  const applyPhase = useCallback(
    (next: Phase) => {
      /*
       * !! THE COMPARISON READS phaseRef, NOT THE FUNCTIONAL setState FORM !!
       *
       * The first version of this compared inside `setPhase((current) =>
       * ...)`, with track() called from there. React's dev-mode StrictMode
       * double-invokes exactly that kind of updater on purpose, to catch
       * side effects that do not belong in one - and a tracking call is
       * exactly that. It genuinely double-fired every quote_phase event,
       * confirmed in the browser console on 28 August 2026. Production does
       * not double-invoke, so it would have looked correct in exactly the
       * environment where nobody was checking the numbers.
       *
       * A ref sidesteps the whole question: mutating it is not a purity
       * violation to anything, so the comparison and the track() call happen
       * exactly once, synchronously, in the callback that actually triggered
       * the move - not inside a function React reserves the right to call
       * more than once.
       */
      const current = phaseRef.current;
      if (next !== current) {
        track("quote_phase", { from: current, to: next, placement });
        if (next === "closed") track("quote_closed", { from: current, placement });
      }
      phaseRef.current = next;
      setPhase(next);
    },
    [placement],
  );

  /**
   * Sends a message and streams the reply into the last bubble.
   *
   * The transcript is NOT posted - the server holds it. All that goes up is
   * one message and the conversation id, which is what lets the phase be a
   * fact rather than a claim.
   */
  const send = useCallback(
    async (text: string) => {
      const trimmed = text.trim();
      if (!trimmed || busy) return;

      setBusy(true);
      setError("");
      setInput("");
      setMessages((current) => [
        ...current,
        { role: "user", content: trimmed },
        { role: "assistant", content: "", pending: true },
      ]);

      try {
        const response = await fetch("/api/quote/chat", {
          method: "POST",
          headers: { "content-type": "application/json" },
          body: JSON.stringify({ conversationId, message: trimmed, placement }),
        });

        const nextPhase = response.headers.get("x-quote-phase") as Phase | null;

        if (!response.ok || !response.body) {
          const payload = (await response.json().catch(() => ({}))) as {
            message?: string;
            error?: string;
          };
          const reason =
            payload.message ?? payload.error ?? "That did not work. Try again.";

          /*
           * The failed reply bubble is replaced by the reason rather than left
           * empty. An empty bubble reads as the assistant ignoring somebody.
           */
          setMessages((current) => [
            ...current.slice(0, -1),
            { role: "assistant", content: reason },
          ]);
          if (nextPhase) applyPhase(nextPhase);
          return;
        }

        if (nextPhase) applyPhase(nextPhase);
        if (response.headers.get("x-quote-queued") === "1") {
          track("quote_submit", { placement });
        }

        const reader = response.body.getReader();
        const decoder = new TextDecoder();

        for (;;) {
          const { done, value } = await reader.read();
          if (done) break;
          const chunk = decoder.decode(value, { stream: true });

          setMessages((current) => {
            const copy = [...current];
            const last = copy[copy.length - 1];
            copy[copy.length - 1] = {
              ...last,
              content: last.content + chunk,
              pending: true,
            };
            return copy;
          });
        }

        setMessages((current) => {
          const copy = [...current];
          copy[copy.length - 1] = { ...copy[copy.length - 1], pending: false };
          return copy;
        });
      } catch {
        setMessages((current) => [
          ...current.slice(0, -1),
          {
            role: "assistant",
            content: "I lost the connection there. Try that again.",
          },
        ]);
      } finally {
        setBusy(false);
        inputRef.current?.focus();
      }
    },
    [applyPhase, busy, conversationId, placement],
  );

  /**
   * The paperclip, one file per request.
   *
   * app/api/quote/route.ts documents why: this project buffers request bodies
   * behind proxy.ts and TRUNCATES anything over 10MB rather than rejecting it,
   * so several files in one POST would sail past that and arrive corrupt. A
   * multi-select posts them in sequence instead.
   */
  const uploadFiles = useCallback(
    async (list: FileList) => {
      setUploading(true);
      setUploadError("");

      for (const file of Array.from(list)) {
        const form = new FormData();
        form.append("conversationId", conversationId);
        form.append("file", file);

        try {
          const response = await fetch("/api/quote/upload", {
            method: "POST",
            body: form,
          });
          const payload = (await response.json()) as {
            message?: string;
            file?: UploadedFile;
          };

          if (!response.ok || !payload.file) {
            setUploadError(payload.message ?? `${file.name} did not upload.`);
            continue;
          }
          setFiles((current) => [...current, payload.file as UploadedFile]);
        } catch {
          setUploadError("Could not reach the server.");
        }
      }

      setUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    },
    [conversationId],
  );

  /**
   * The paperclip. Visible to any lead - see LEAD_PHASES above for what
   * "visible" is actually gated on - but what a click DOES still depends on
   * whether the email is verified, because that is the real prerequisite for
   * a file going anywhere useful.
   *
   * Verified: opens the file picker, same as it always has.
   *
   * Not verified, and the conversation has already reached the point of
   * asking for an address: the "Verify email address" button is sitting a
   * few messages up, easy to miss if somebody was mid-thought when they
   * reached for the pin instead. Opening the panel directly is the shorter
   * path to the same place.
   *
   * Not verified, and the conversation has not reached that point yet: a
   * real turn is sent, in the visitor's own voice, asking to attach
   * something and to get verified so it is worth doing. The reply is
   * written by the model against its own `verify` objective - the same
   * three points every other route into verification already carries,
   * including that the finished quotation is what gets sent to that address
   * once it is confirmed - rather than a second, hand-written copy of that
   * explanation living here and drifting out of step with the first one.
   */
  function handlePaperclipClick() {
    if (verifiedEmail) {
      fileInputRef.current?.click();
      return;
    }

    if (phase === "verify") {
      setVerifyPanelOpen(true);
      return;
    }

    if (!busy) {
      void send(
        "I'd like to attach a document for you to look at - can we get my email verified now?",
      );
    }
  }

  function submit(event: FormEvent) {
    event.preventDefault();
    /*
     * Typing "I have no idea" rather than tapping it does the same thing the
     * button's own onPick does - see the budget render below. An exact,
     * case-insensitive match against the button's own label, nothing fuzzier
     * than that: this only has to catch someone typing the words already on
     * screen, not guess at every way of saying "I don't know".
     */
    if (
      phase === "budget" &&
      input.trim().toLowerCase() ===
        budgetOptions.find((option) => option.value === "unsure")?.label.toLowerCase()
    ) {
      setBudgetUnsure(true);
    }
    void send(input);
  }

  const finished = FINISHED.has(phase);
  const isLead = LEAD_PHASES.has(phase);

  /*
   * Whether closing right now would throw away a real conversation.
   *
   * `messages` opens with the canned greeting, so its length alone is never
   * zero - the visitor's own first reply is what actually means something was
   * said. Once the conversation has reached a FINISHED phase there is nothing
   * left to lose by closing: the student got their handoff, or the estimate is
   * already queued and running without this window open.
   */
  const hasProgress = messages.some((message) => message.role === "user") && !finished;

  const [confirmClose, setConfirmClose] = useState(false);

  /**
   * The guarded close, on the client's instruction of 28 August 2026.
   *
   * Both the X below and modal.tsx's Escape/backdrop handler call this rather
   * than `onClose` directly - see the ChatbotHandle comment above. A second
   * call while the guard is already up backs out of it rather than closing,
   * the same "undo the last thing" behaviour the old scripted flow's close
   * guard uses for Escape.
   */
  const requestClose = useCallback(() => {
    if (confirmClose) {
      setConfirmClose(false);
      return;
    }
    if (!hasProgress) {
      onClose();
      return;
    }
    track("quote_abandon", { placement, phase, in_chat: true });
    setConfirmClose(true);
  }, [confirmClose, hasProgress, onClose, phase, placement]);

  useImperativeHandle(ref, () => ({ requestClose }), [requestClose]);

  return (
    <div className="relative flex h-full flex-col">
      {/*
        The close guard.

        Drawn over the whole window rather than replacing it, so the
        conversation about to be discarded is still visible behind the
        question - matching the overlay components/quote/modal.tsx already
        uses for the scripted flow's own close guard.
      */}
      {confirmClose && (
        <div className="absolute inset-0 z-10 flex items-center justify-center bg-background/85 p-6 backdrop-blur-[2px]">
          <div className="w-full max-w-sm border border-foreground/15 bg-background p-5 shadow-lg">
            <h2 className="font-display text-lg tracking-tight">End this conversation?</h2>
            <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
              What you have told QuoteBot so far is already saved, but this window will not
              remember it - you would start over from the beginning if you come back.
            </p>
            <div className="mt-5 flex flex-col gap-2 sm:flex-row">
              <button
                type="button"
                autoFocus
                onClick={() => setConfirmClose(false)}
                className="h-11 flex-1 rounded-full bg-primary px-5 text-sm text-primary-foreground transition-colors hover:bg-primary/90"
              >
                Keep talking
              </button>
              <button
                type="button"
                onClick={onClose}
                className="h-11 flex-1 rounded-full border border-foreground/20 px-5 text-sm transition-colors hover:bg-foreground/5"
              >
                Close anyway
              </button>
            </div>
          </div>
        </div>
      )}

      {/* -------------------------------------------------------- header */}
      <div className="flex shrink-0 items-center justify-between gap-4 border-b border-foreground/10 px-5 py-4">
        <div className="flex items-center gap-3">
          {/*
            The avatar.

            !! THE SOURCE FILE IS BLACK-ON-TRANSPARENT. IT IS RECOLOURED, NOT USED RAW. !!

            Supplied as public/quotebot-icon.png on 27 August 2026. A solid
            black glyph sitting directly in the header reads as unfinished -
            it vanishes into a dark theme and looks like a placeholder in a
            light one. `brightness-0 invert` turns every opaque black pixel
            white without touching the transparency, which is what lets a
            single source file drop cleanly onto a solid badge in either
            theme. The badge itself is bg-primary - the same brand blue every
            button on this site already uses - rather than the flat black the
            file ships as, on the client's instruction the same day.

            Sized up from h-8 to h-11 on 28 August 2026, matching a reference
            design's larger, more present avatar - this header stays a
            compact bar rather than that reference's full hero treatment
            (there is a real conversation scrolling under it for the whole
            time this is open, not a one-time launcher screen), but the
            avatar itself earns the extra weight.
          */}
          <span
            aria-hidden
            className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-primary"
          >
            <Image
              src="/quotebot-icon.png"
              alt=""
              width={64}
              height={64}
              className="h-6 w-6 brightness-0 invert"
            />
          </span>
          <div>
            <p className="font-display text-base tracking-tight">{greeting.title}</p>
            <p className="text-xs text-muted-foreground">
              {busy ? "Typing…" : greeting.subtitle}
            </p>
          </div>
        </div>
        <button
          type="button"
          onClick={requestClose}
          aria-label="Close"
          className="-mr-1 p-1 text-muted-foreground transition-colors hover:text-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-foreground/30"
        >
          <X aria-hidden className="h-4 w-4" />
        </button>
      </div>

      {/* ------------------------------------------------------ messages */}
      <div ref={scrollRef} className="min-h-0 flex-1 space-y-4 overflow-y-auto px-5 py-5">
        {messages.map((message, index) => (
          <div
            key={index}
            className={message.role === "user" ? "flex justify-end" : "flex"}
          >
            <div
              className={
                message.role === "user"
                  ? "max-w-[85%] rounded-lg rounded-br-sm bg-primary px-3.5 py-2.5 text-sm leading-relaxed text-background"
                  : "max-w-[92%] whitespace-pre-wrap text-sm leading-relaxed text-foreground"
              }
            >
              {message.role === "assistant" ? linkify(message.content, index) : message.content}
              {message.pending && !message.content && (
                <span className="inline-flex gap-1" aria-label="Thinking">
                  <Dot delay="0ms" />
                  <Dot delay="150ms" />
                  <Dot delay="300ms" />
                </span>
              )}
            </div>
          </div>
        ))}

        {/*
          The founder's contact card, once asked for. Not one of the
          phase-conditional affordances below - see the note on
          `talkToCeoOpen` above - so it renders here, right after the
          transcript and ahead of them, and stays up regardless of where the
          conversation goes next. Reuses DirectLine rather than restating its
          WhatsApp/call markup, same founderContact this window's transcript,
          emails and PDFs already point everyone to.
        */}
        {talkToCeoOpen && <DirectLine />}

        {/*
          The affordance for wherever the conversation is standing. Rendered
          under the messages rather than replacing them, so the reason it
          appeared is still on screen above it.
        */}
        {phase === "greeting" && !busy && (
          <Choices
            options={greeting.choices.map((choice) => ({
              value: choice.value,
              label: choice.label,
            }))}
            onPick={(_, label) => void send(label)}
          />
        )}

        {phase === "service" && !busy && (
          <Choices
            options={serviceOptions.map((option) => ({
              value: option.value,
              label: option.label,
            }))}
            onPick={(_, label) => void send(label)}
          />
        )}

        {/*
          The budget ranges - "we had this before", on the client's
          instruction of 28 August 2026: the same five USD bands and the same
          "I have no idea" the scripted flow already asks with, see
          budgetOptions in content/quote-chat.ts.

          !! NOT SHOWN AGAIN ONCE THEY HAVE PICKED "I have no idea" !!

          That used to render a second time under the follow-up question,
          on the theory that a range might still fit after all - overturned
          on the client's instruction of 28 August 2026: putting the same six
          buttons back in front of somebody who just told you they do not
          know reads as the bot not having heard them. The follow-up is a
          real question now, answered in their own words, not a second pass
          at the same buttons.
        */}
        {phase === "budget" && !busy && !budgetUnsure && (
          <Choices
            options={budgetOptions.map((option) => ({
              value: option.value,
              label: option.label,
            }))}
            onPick={(value, label) => {
              if (value === "unsure") setBudgetUnsure(true);
              void send(label);
            }}
          />
        )}

        {/*
          The button-first reveal.

          Reaching `verify` used to drop the whole form - email, WhatsApp,
          send button - straight into the thread the moment the phase moved,
          which read as a wall dropped in front of somebody mid-conversation.
          One button now stands in its place, in the same style as every
          other tappable choice in this window, and the form only opens once
          it is actually pressed - on the client's instruction of 28 August
          2026.
        */}
        {phase === "verify" && !verifyPanelOpen && (
          <div className="flex flex-wrap items-center gap-3 pt-1">
            <Choices
              options={[{ value: "verify", label: "Verify email address" }]}
              onPick={() => setVerifyPanelOpen(true)}
            />
            {/*
              What pressing the button actually unlocks, on the client's
              instruction of 28 August 2026 - the button alone reads as one
              more thing being asked of somebody, with no reason attached.
            */}
            <p className="max-w-[220px] text-[11px] leading-snug text-muted-foreground">
              Unlocks file uploads, and lets me email you the finished
              estimate.
            </p>
          </div>
        )}

        {phase === "verify" && verifyPanelOpen && (
          <VerifyPanel
            conversationId={conversationId}
            codeSent={codeSent}
            onSent={(email) => {
              setCodeSent(true);
              setMessages((current) => [
                ...current,
                {
                  role: "assistant",
                  content: `I have sent a six-digit code to ${email}. Enter it below — it is worth checking spam if it does not arrive in a minute.`,
                },
              ]);
            }}
            onVerified={(email, next) => {
              setVerifiedEmail(email);
              applyPhase(next);
              setMessages((current) => [
                ...current,
                {
                  role: "assistant",
                  content:
                    "That address is verified — thank you. Your estimate will go there once it is ready.",
                },
              ]);
              /* Nudge the assistant into the next question straight away. */
              void send("My email is verified. What else do you need to know?");
            }}
          />
        )}

        {phase === "queued" && (
          /*
           * !! NO MENTION OF A WAIT, AND NONE OF WHY. !!
           *
           * This used to say the estimate "is checked by somebody at Hitasoft
           * before it is sent, so it will not be instant" - true, and on the
           * client's instruction of 28 August 2026, not something a visitor
           * needs to know. The human-in-the-loop approval step in
           * app/api/admin/estimates is a fact about how this company works,
           * not a promise made to whoever is standing here, and setting a
           * "this will take a while" expectation is exactly what naming it
           * did. "Once it is ready" is still the honest word for when - it
           * says nothing has arrived yet without saying why.
           */
          <p className="rounded-md border border-primary/30 bg-primary/[0.04] px-4 py-3 text-xs leading-relaxed text-muted-foreground">
            Your estimate is on its way. It arrives as a PDF
            {verifiedEmail ? ` at ${verifiedEmail}` : ""} once it is ready. You can
            close this window.
          </p>
        )}
      </div>

      {/* ------------------------------------------------------ composer */}
      {!finished && (
        <form
          onSubmit={submit}
          className="shrink-0 border-t border-foreground/10 px-4 py-3"
        >
          {error && <p className="mb-2 text-xs text-brand-red">{error}</p>}
          {uploadError && <p className="mb-2 text-xs text-brand-red">{uploadError}</p>}

          {/*
            What is attached, docked above the input rather than left to
            scroll away with the transcript - it is the thing a visitor is
            most likely to want to check right before they hit send.
          */}
          {files.length > 0 && (
            <ul className="mb-2 space-y-1">
              {files.map((file) => (
                <li
                  key={file.id}
                  className="flex items-center gap-2 text-xs text-muted-foreground"
                >
                  <Paperclip aria-hidden className="h-3 w-3 shrink-0" />
                  <span className="truncate">{file.name}</span>
                  <span className="shrink-0 opacity-60">{file.size}</span>
                </li>
              ))}
            </ul>
          )}

          {/*
            One bordered shell, two rows - on the client's instruction of
            28 August 2026, matching a reference design's composer: the
            textarea gets a full-width line to itself, and the pin and send
            live on their own row underneath rather than squeezed beside it.
            The shell's own border and rounding replace what each control
            used to carry separately (see the 28 August note this replaced,
            still true of why the textarea's line-height is set explicitly
            - leading-5, 20px - rather than left to leading-relaxed).
          */}
          <div className="flex flex-col gap-1.5 rounded-2xl border border-foreground/15 bg-background p-2 transition-colors focus-within:border-foreground/30">
            <textarea
              ref={inputRef}
              value={input}
              onChange={(event) => setInput(event.target.value)}
              onKeyDown={(event) => {
                /* Enter sends, shift-enter is a new line. */
                if (event.key === "Enter" && !event.shiftKey) {
                  event.preventDefault();
                  void send(input);
                }
              }}
              rows={1}
              maxLength={2000}
              /*
               * !! NEVER disabled WHILE BUSY. THIS IS THE FOCUS FIX. !!
               *
               * It used to be `disabled={busy}`, and a disabled form control
               * cannot hold focus - the browser blurs it the instant the
               * attribute is set, which happened on every single send, for
               * however long the reply took to stream in. That is what the
               * client meant by focus "going somewhere in between": there is
               * nowhere it could have stayed. `send()` already guards against
               * a duplicate submit while busy (`if (!trimmed || busy) return`
               * above), so nothing needs this element disabled to stay safe -
               * only left alone, so the caret never leaves it.
               */
              placeholder={
                phase === "verify"
                  ? "Or ask me anything first…"
                  : "Type your reply…"
              }
              className="max-h-32 min-h-[24px] w-full resize-none bg-transparent px-1 py-0 text-sm leading-5 placeholder:text-muted-foreground/70 focus:outline-none"
            />

            {/* The pin and send, on their own row under the text. */}
            <div className="flex items-center gap-2">
              {/*
                The pin. Any lead, the moment they are sorted as one - never a
                student. See LEAD_PHASES above for exactly what that means and
                the mix-up it corrects, and handlePaperclipClick for what a
                click actually does before the address behind it is verified.
                Labelled now rather than icon-only, matching the reference.
              */}
              {isLead && (
                <button
                  type="button"
                  onClick={handlePaperclipClick}
                  disabled={uploading}
                  className="flex items-center gap-1.5 rounded-full border border-foreground/15 px-3 py-1.5 text-xs text-muted-foreground transition-colors hover:border-foreground/30 hover:text-foreground disabled:opacity-50"
                >
                  <Paperclip aria-hidden className="h-3.5 w-3.5" />
                  Upload
                </button>
              )}

              {/*
                Same gate as the pin above - any lead, the moment they are
                sorted as one, not gated on email verification. Filled green
                rather than outlined like every other control in this row,
                deliberately: this is the one button that hands somebody a
                real phone number, and it should not read as one more form
                field among the others.
              */}
              {isLead && (
                <button
                  type="button"
                  onClick={() => {
                    track("quote_talk_to_ceo", { placement });
                    setTalkToCeoOpen(true);
                  }}
                  className="flex items-center gap-1.5 rounded-full bg-emerald-600 px-3 py-1.5 text-xs font-medium text-white transition-colors hover:bg-emerald-700"
                >
                  <Phone aria-hidden className="h-3.5 w-3.5" />
                  Talk to the CEO
                </button>
              )}

              <button
                type="submit"
                /*
                 * Not `busy ||` here either, for the same reason as the
                 * textarea above - disabling this while it might be holding
                 * focus (a click, rather than Enter, is how this button gets
                 * pressed) blurs it mid-stream. `send()`'s own busy guard
                 * makes a click that lands while a reply is still coming a
                 * safe no-op rather than a second request.
                 */
                disabled={!input.trim()}
                aria-label="Send"
                className={`ml-auto flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-primary text-background transition-opacity disabled:opacity-30 ${busy ? "opacity-60" : ""}`}
              >
                <Send aria-hidden className="h-4 w-4" />
              </button>
            </div>
          </div>

          <input
            ref={fileInputRef}
            type="file"
            multiple
            hidden
            onChange={(event) => {
              if (event.target.files?.length) void uploadFiles(event.target.files);
            }}
          />
        </form>
      )}
    </div>
  );
});

/* --------------------------------------------------------------- pieces */

/**
 * Turns a bare https:// URL sitting in assistant text into a real, tappable
 * link.
 *
 * !! THE MODEL NEVER WRITES MARKDOWN. THIS IS NOT THAT. !!
 *
 * lib/quote-chat-prompt.ts forbids bracketed links and every other kind of
 * formatting in what the model writes, and that rule is unchanged - its reply
 * is still plain text, always. This runs client side, after the fact, purely
 * to decide how the browser presents a URL that plain text already contains.
 * The one place this matters today is the founder's WhatsApp link, handed
 * over on request in lib/quote-chat-prompt.ts - a wa.me address typed out as
 * a string of characters is not something a visitor can tap, and "make it
 * like a whatsapp link" only means anything if it actually is one.
 *
 * A wa.me link is shown as "Message on WhatsApp" rather than the URL itself,
 * because the real address carries a URL-encoded prefilled message and reads
 * as noise. Anything else that starts http(s):// is shown as its own text,
 * unedited - this only exists to make a URL clickable, never to relabel one
 * arbitrarily.
 */
function linkify(text: string, keyPrefix: number) {
  const parts = text.split(/(https?:\/\/\S+)/g);
  if (parts.length === 1) return text;

  return parts.map((part, i) => {
    if (!/^https?:\/\//.test(part)) return part;

    const label = part.includes("wa.me") ? "Message on WhatsApp" : part;

    return (
      <a
        key={`${keyPrefix}-link-${i}`}
        href={part}
        target="_blank"
        rel="noreferrer"
        className="font-medium underline decoration-current/40 underline-offset-2 hover:decoration-current"
      >
        {label}
      </a>
    );
  });
}

function Dot({ delay }: { delay: string }) {
  return (
    <span
      className="inline-block h-1.5 w-1.5 animate-bounce rounded-full bg-muted-foreground/60"
      style={{ animationDelay: delay }}
    />
  );
}

/**
 * Tappable answers.
 *
 * The label is sent as the message rather than the value, because the label is
 * what the visitor believes they said, and the transcript a person reads later
 * should match what was on screen. The server reads the machine value off the
 * model's control line instead.
 */
function Choices({
  options,
  onPick,
}: {
  options: { value: string; label: string }[];
  onPick: (value: string, label: string) => void;
}) {
  return (
    <div className="flex flex-wrap gap-2 pt-1">
      {options.map((option) => (
        <button
          key={option.value}
          type="button"
          onClick={() => onPick(option.value, option.label)}
          className="border border-foreground/20 px-3 py-1.5 text-xs transition-colors hover:border-primary hover:text-primary"
        >
          {option.label}
        </button>
      ))}
    </div>
  );
}

/**
 * The name, the email and the code.
 *
 * Two steps in one panel, because they are one thought from the visitor's side
 * and splitting them across screens loses people. Name and WhatsApp both sit
 * with the address rather than getting a screen of their own - name because
 * it is required and there is nowhere better for a single required field to
 * live than next to the other required one, WhatsApp because it is not
 * required and is marked optional on the label itself. See the note on
 * verificationPoints in content/quote-chat.ts for why WhatsApp must never
 * read as a second requirement - that reasoning does not extend to the name,
 * which is asked for plainly.
 */
function VerifyPanel({
  conversationId,
  codeSent,
  onSent,
  onVerified,
}: {
  conversationId: string;
  codeSent: boolean;
  onSent: (email: string) => void;
  onVerified: (email: string, phase: Phase) => void;
}) {
  /*
   * !! REQUIRED. THE ESTIMATE IS ADDRESSED TO IT. !!
   *
   * Added on the client's instruction of 28 August 2026, collected in the
   * same box as the address rather than as a separate step - one exchange,
   * not two. app/api/quote/otp/route.ts enforces this server side as well;
   * this only stops somebody submitting a blank field, it is not the actual
   * guarantee.
   */
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [whatsapp, setWhatsapp] = useState("");
  const [code, setCode] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  async function sendCode() {
    setBusy(true);
    setError("");
    try {
      const response = await fetch("/api/quote/otp", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ conversationId, name, email, whatsapp }),
      });
      const payload = (await response.json()) as { message?: string; email?: string };

      if (!response.ok) {
        setError(payload.message ?? "That did not send.");
        return;
      }
      onSent(payload.email ?? email);
    } catch {
      setError("Could not reach the server.");
    } finally {
      setBusy(false);
    }
  }

  async function verify() {
    setBusy(true);
    setError("");
    try {
      const response = await fetch("/api/quote/otp/verify", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ conversationId, code }),
      });
      const payload = (await response.json()) as {
        message?: string;
        email?: string;
        phase?: Phase;
        error?: string;
      };

      /*
       * The result, not just whether it worked.
       *
       * app/api/quote/otp/verify/route.ts names a specific reason on every
       * failure - wrong_code, expired, too_many_attempts, used, no_code - and
       * that string is passed straight through as the GA event's own result
       * rather than being collapsed into one generic "failed". "Tried and got
       * the digits wrong" and "never got a code to try" are different
       * problems with different fixes, and only the real reason tells the two
       * apart.
       */
      track("quote_verify_result", { result: response.ok ? "ok" : (payload.error ?? "unknown") });

      if (!response.ok) {
        setError(payload.message ?? "That code did not work.");
        return;
      }
      onVerified(payload.email ?? "", payload.phase ?? "discovery");
    } catch {
      track("quote_verify_result", { result: "network_error" });
      setError("Could not reach the server.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="space-y-2.5 rounded-md border border-foreground/15 p-3.5">
      {!codeSent ? (
        <>
          <input
            type="text"
            value={name}
            onChange={(event) => setName(event.target.value)}
            placeholder="Your name"
            autoComplete="name"
            className="w-full border border-foreground/15 bg-transparent px-3 py-2 text-sm placeholder:text-muted-foreground/70 focus:border-foreground/30 focus:outline-none"
          />
          <input
            type="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            placeholder="you@company.com"
            autoComplete="email"
            className="w-full border border-foreground/15 bg-transparent px-3 py-2 text-sm placeholder:text-muted-foreground/70 focus:border-foreground/30 focus:outline-none"
          />
          <input
            type="tel"
            value={whatsapp}
            onChange={(event) => setWhatsapp(event.target.value)}
            placeholder="WhatsApp number (optional)"
            autoComplete="tel"
            className="w-full border border-foreground/15 bg-transparent px-3 py-2 text-sm placeholder:text-muted-foreground/70 focus:border-foreground/30 focus:outline-none"
          />
          <button
            type="button"
            onClick={() => void sendCode()}
            disabled={busy || !name.trim() || !email.includes("@")}
            className="w-full bg-primary px-3 py-2 text-xs uppercase tracking-widest text-background transition-opacity disabled:opacity-40"
          >
            {busy ? "Sending…" : "Send me the code"}
          </button>
        </>
      ) : (
        <>
          <input
            /*
             * inputMode numeric rather than type="number": a number input on a
             * phone brings up a spinner and strips leading zeros, and 000123 is
             * a perfectly good code.
             */
            inputMode="numeric"
            autoComplete="one-time-code"
            value={code}
            onChange={(event) => setCode(event.target.value.replace(/\D/g, "").slice(0, 6))}
            placeholder="6-digit code"
            className="w-full border border-foreground/15 bg-transparent px-3 py-2 text-center font-mono text-lg tracking-[0.4em] placeholder:font-sans placeholder:text-sm placeholder:tracking-normal placeholder:text-muted-foreground/70 focus:border-foreground/30 focus:outline-none"
          />
          <button
            type="button"
            onClick={() => void verify()}
            disabled={busy || code.length !== 6}
            className="w-full bg-primary px-3 py-2 text-xs uppercase tracking-widest text-background transition-opacity disabled:opacity-40"
          >
            {busy ? "Checking…" : "Verify"}
          </button>
          <button
            type="button"
            onClick={() => void sendCode()}
            disabled={busy}
            className="w-full text-[11px] text-muted-foreground underline decoration-foreground/20 underline-offset-4"
          >
            Send it again
          </button>
        </>
      )}

      {error && <p className="text-xs text-brand-red">{error}</p>}
    </div>
  );
}

