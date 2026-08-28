"use client";

import { useEffect, useRef, useState, type ChangeEvent } from "react";
import { ArrowRight, ArrowUp, CornerDownLeft, Paperclip, Sparkles, X } from "lucide-react";
import { track } from "@/lib/analytics";
import { ATTACHMENT, quoteChrome } from "@/content/quote-flow";

/**
 * The assistant, and the only part of this modal that talks to a model.
 *
 * It is a detour with a return path, never a destination. Every answer ends by
 * pointing back at the questions, the turn counter is visible from the first
 * message so the ceiling is never a surprise, and the button back to the flow
 * is on screen the whole time. Somebody who wanted a chatbot gets one;
 * somebody who wanted a quote is never trapped in it.
 *
 * The transcript lives here and is posted whole on each turn, because the API
 * is stateless. The route counts the turns in it rather than trusting a number
 * from this file - see the header there for why.
 */

const MAX_TURNS = 6;

/**
 * Strips markdown the model was asked not to write.
 *
 * The system prompt forbids it in capitals, and the model mostly complies -
 * but "mostly" is not a rendering strategy. Replies are drawn as text, so a
 * stray pair of asterisks reaches the visitor as literal asterisks, which is
 * exactly what happened on 27 August 2026: a question came through as
 * "**What does your application do?**" and read like a bug, because it was.
 *
 * !! THIS UNWRAPS MARKERS, IT DOES NOT RENDER MARKDOWN !!
 *
 * Nothing here turns text into elements, and it must stay that way. Model
 * output is never treated as markup in this component - no
 * dangerouslySetInnerHTML, no markdown renderer - because the one thing worse
 * than visible asterisks is a reply that can inject markup into the page.
 */
function stripMarkdown(text: string) {
  return (
    text
      /*
       * **bold** and __bold__.
       *
       * [\s\S] rather than . with the s flag: this project's tsconfig targets
       * below es2018, where dotAll is not available, and bold can wrap a line
       * break.
       */
      .replace(/\*\*([\s\S]+?)\*\*/g, "$1")
      .replace(/__([\s\S]+?)__/g, "$1")
      /* *italic* and _italic_, only when they wrap something */
      .replace(/(^|\s)\*(\S[^*]*?\S|\S)\*(?=\s|$|[.,!?])/g, "$1$2")
      .replace(/(^|\s)_(\S[^_]*?\S|\S)_(?=\s|$|[.,!?])/g, "$1$2")
      /* `code` */
      .replace(/`([^`]+)`/g, "$1")
      /* Leading heading hashes and blockquote arrows. */
      .replace(/^[ \t]*#{1,6}[ \t]+/gm, "")
      .replace(/^[ \t]*>[ \t]?/gm, "")
      /* Bullet markers become a proper bullet rather than an asterisk. */
      .replace(/^[ \t]*[*+-][ \t]+/gm, "• ")
  );
}

/** Matches MAX_OFF_TOPIC on the route, which is the half that is enforced. */
const MAX_OFF_TOPIC = 2;

type Flag = "WORK" | "HR" | "OFF";

type Turn = { role: "user" | "assistant"; content: string; flag?: Flag };

export function AskStep({
  conversationId,
  placement,
  onTurn,
  file,
  onFileChange,
  fileError,
  onProceed,
  onLeave,
  onUnavailable,
  reduceMotion,
}: {
  /** Ties these turns to the same archive row as the scripted answers. */
  conversationId: string;
  placement: string;
  /** Fired per question asked, so the shell knows there is something to lose. */
  onTurn: () => void;
  /**
   * The attachment, owned by the shell.
   *
   * Deliberately the same file the brief step uses rather than a second one.
   * Somebody who attaches a spec here and then walks back into the questions
   * should not be asked for it again, and the submission has one place to look
   * for it either way.
   */
  file: File | null;
  onFileChange: (file: File | null) => void;
  fileError: string;
  /**
   * Straight to the quote, handing the conversation over as the brief.
   *
   * The transcript is passed as plain text rather than left behind. It is
   * already in Postgres, but the notification email reads from the submission
   * - without this the inbox would get "Told us in the chat" and no chat.
   */
  onProceed: (brief: string) => void;
  /** Back to the scripted questions. */
  onLeave: () => void;
  /** No key configured: the caller drops this branch entirely. */
  onUnavailable: () => void;
  reduceMotion: boolean;
}) {
  const [turns, setTurns] = useState<Turn[]>([]);
  const [draft, setDraft] = useState("");
  const [streaming, setStreaming] = useState(false);
  const [failure, setFailure] = useState("");
  /*
   * Set when the route says the conversation is over. Only the assistant
   * closes - onLeave below still works, so the quote questions are always one
   * press away. Nobody is ever shut out of contacting the company.
   */
  const [closed, setClosed] = useState("");

  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  function handleFile(event: ChangeEvent<HTMLInputElement>) {
    onFileChange(event.target.files?.[0] ?? null);
    /* Lets the same file be re-picked after removing it. */
    event.target.value = "";
  }

  const asked = turns.filter((turn) => turn.role === "user").length;
  const offTopic = turns.filter(
    (turn) => turn.role === "assistant" && turn.flag === "OFF",
  ).length;
  /* One strike is a warning, and the visitor should be able to see it coming. */
  const warned = offTopic === 1;
  const spent = asked >= MAX_TURNS || Boolean(closed);

  /* Keep the newest text in view as it arrives. */
  useEffect(() => {
    scrollRef.current?.scrollTo({
      top: scrollRef.current.scrollHeight,
      behavior: reduceMotion ? "auto" : "smooth",
    });
  }, [turns, reduceMotion]);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  async function send() {
    const question = draft.trim();
    if (!question || streaming || spent) return;

    const next: Turn[] = [...turns, { role: "user", content: question }];
    /* The empty assistant turn is the row the stream fills in. */
    setTurns([...next, { role: "assistant", content: "" }]);
    setDraft("");
    setStreaming(true);
    setFailure("");
    onTurn();

    try {
      const response = await fetch("/api/quote/ask", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ messages: next, conversationId, placement }),
      });

      if (!response.ok || !response.body) {
        const payload = (await response.json().catch(() => ({}))) as {
          error?: string;
          message?: string;
        };

        /*
         * No key on the server. Rather than showing an apology, tell the
         * caller so the whole branch disappears and the visitor is put back
         * on a path that works.
         */
        if (payload.error === "unconfigured") {
          onUnavailable();
          return;
        }

        /*
         * The warning was already given and this is the second strike. Drop
         * the empty assistant bubble, say it plainly once, and close the
         * input. The way out of this screen stays exactly where it was.
         */
        if (payload.error === "closed") {
          setTurns(next);
          setClosed(payload.message ?? "I am going to leave it there.");
          return;
        }

        setTurns(next);
        setFailure(payload.message ?? payload.error ?? "That did not work. Try again.");
        return;
      }

      /*
       * How the route classified this reply. Kept against the turn and posted
       * back on the next question - it is what lets a stateless route count
       * strikes across a conversation.
       */
      const flag = response.headers.get("x-quote-flag") as Flag | null;
      /*
       * The flag on the event is what makes the assistant's cost legible: a
       * month of mostly WORK is the feature earning its keep, and a month of
       * mostly OFF is a bill for entertaining people who were never buying.
       * Only the classification is sent, never what anybody typed.
       */
      track("quote_ask_message", { turn: asked + 1, flag: flag ?? "WORK" });
      if (flag) {
        setTurns((prior) => {
          const copy = [...prior];
          const tail = copy[copy.length - 1];
          if (tail?.role === "assistant") copy[copy.length - 1] = { ...tail, flag };
          return copy;
        });
      }

      const reader = response.body.getReader();
      const decoder = new TextDecoder();

      for (;;) {
        const { done, value } = await reader.read();
        if (done) break;
        const chunk = decoder.decode(value, { stream: true });
        setTurns((prior) => {
          const copy = [...prior];
          const tail = copy[copy.length - 1];
          if (tail?.role === "assistant") {
            copy[copy.length - 1] = { ...tail, content: tail.content + chunk };
          }
          return copy;
        });
      }
    } catch {
      setTurns(next);
      setFailure("That did not work. Check your connection and try again.");
    } finally {
      setStreaming(false);
    }
  }

  return (
    <div className="flex h-full flex-col gap-3">
      {/* ------------------------------------------------ transcript */}
      <div ref={scrollRef} className="min-h-0 flex-1 space-y-3 overflow-y-auto">
        {turns.length === 0 && (
          <div
            className={`space-y-2 ${
              reduceMotion ? "" : "animate-in fade-in slide-in-from-bottom-2 duration-300"
            }`}
          >
            <div className="flex items-center gap-2 text-primary">
              <Sparkles aria-hidden className="h-4 w-4" />
              <span className="font-mono text-xs uppercase tracking-widest">
                Ask anything
              </span>
            </div>
            <h2 className="font-display text-xl leading-tight tracking-tight">
              What would you like to know?
            </h2>
            <p className="text-sm leading-relaxed text-muted-foreground">
              I can only answer from what is on this site, and I will say so when
              I do not know. Then we can carry on where you left off.
            </p>
          </div>
        )}

        {turns.map((turn, index) =>
          turn.role === "user" ? (
            <p
              key={index}
              className="ml-auto max-w-[85%] rounded-sm bg-primary px-3 py-2 text-[14px] leading-relaxed text-primary-foreground"
            >
              {turn.content}
            </p>
          ) : (
            <div
              key={index}
              className="max-w-[92%] rounded-sm bg-foreground/[0.04] px-3 py-2 text-[14px] leading-relaxed"
            >
              {turn.content ? (
                /*
                 * Rendered as text, deliberately. Model output is never treated
                 * as markup here - there is no dangerouslySetInnerHTML and no
                 * markdown renderer, so nothing the model writes can become an
                 * element. Paragraph breaks are the one thing worth honouring.
                 */
                stripMarkdown(turn.content)
                  .split("\n\n")
                  .map((paragraph, part) => (
                  <span key={part} className={part > 0 ? "mt-2 block" : "block"}>
                    {paragraph}
                  </span>
                ))
              ) : (
                <span className="flex gap-1 py-1" aria-label="Thinking">
                  {[0, 1, 2].map((dot) => (
                    <span
                      key={dot}
                      className="h-1.5 w-1.5 animate-pulse rounded-full bg-foreground/40"
                      style={reduceMotion ? undefined : { animationDelay: `${dot * 150}ms` }}
                    />
                  ))}
                </span>
              )}
            </div>
          ),
        )}

        {failure && (
          <p role="alert" className="border-l-2 border-brand-red pl-3 text-sm text-muted-foreground">
            {failure}
          </p>
        )}
      </div>

      {/* ----------------------------------------------------- input */}
      <div className="shrink-0 space-y-2">
        <input
          ref={fileInputRef}
          type="file"
          accept={ATTACHMENT.accept}
          onChange={handleFile}
          className="sr-only"
          id="quote-ask-attachment"
        />

        {/*
          The attached document, and the way out to a quote.

          !! THIS IS THE FIX FOR A DEAD END !!

          The chat could answer anything and collect nothing. Somebody arriving
          with a written spec - the best qualified visitor this modal ever sees
          - could ask about it here and then had no way to hand it over without
          backing out to the questions and finding the brief step. Two modes,
          one of which took documents and could not talk, the other of which
          talked and could not take documents.

          Now the file lives on the shell, so it is the same attachment either
          route reaches, and the conversation itself counts as the brief.
        */}
        {file && (
          <div className="flex items-center justify-between gap-3 border border-foreground/15 bg-foreground/[0.02] px-3 py-2">
            <div className="flex min-w-0 items-center gap-2">
              <Paperclip aria-hidden className="h-3.5 w-3.5 shrink-0 text-primary" />
              <span className="truncate text-xs">{file.name}</span>
            </div>
            <button
              type="button"
              onClick={() => onFileChange(null)}
              aria-label={`${quoteChrome.attachRemove} ${file.name}`}
              className="shrink-0 text-muted-foreground transition-colors hover:text-foreground"
            >
              <X aria-hidden className="h-3.5 w-3.5" />
            </button>
          </div>
        )}

        {fileError && (
          <p role="alert" className="text-xs text-brand-red">
            {fileError}
          </p>
        )}

        {(file || turns.length > 0) && !spent && (
          <button
            type="button"
            onClick={() =>
              onProceed(
                turns
                  .map(
                    (turn) =>
                      `${turn.role === "user" ? "They asked" : "Quotebot said"}: ${turn.content}`,
                  )
                  .join("\n\n"),
              )
            }
            className="group/go inline-flex h-10 w-full items-center justify-center gap-2 rounded-full bg-primary px-5 text-sm text-primary-foreground transition-colors hover:bg-primary/90"
          >
            {file ? "Get a quote for this" : "Get my quote"}
            <ArrowRight
              aria-hidden
              className="h-4 w-4 transition-transform group-hover/go:translate-x-1"
            />
          </button>
        )}
        {spent ? (
          <p className="rounded-sm border border-foreground/10 bg-foreground/[0.02] px-3 py-2.5 text-sm leading-relaxed text-muted-foreground">
            {closed ||
              "That is about as far as I can usefully take it. The rest is a conversation for a person."}
          </p>
        ) : (
          <div className="flex items-end gap-2 border border-foreground/15 px-3 py-2 focus-within:border-foreground/50">
            <label htmlFor="quote-ask" className="sr-only">
              Ask a question
            </label>
            {/*
              The box is items-end so the controls stay put as the textarea
              grows. That leaves a bare 16px icon sitting low against a ~24px
              line box, which is what made it read as misaligned. Giving the
              button the textarea's own min-height and centring the icon inside
              it puts the two on the same optical line at one row, and keeps
              them anchored to the bottom at three.
            */}
            {!file && (
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                aria-label={quoteChrome.attach}
                title={quoteChrome.attach}
                className="flex h-6 w-6 shrink-0 items-center justify-center text-muted-foreground transition-colors hover:text-foreground"
              >
                <Paperclip aria-hidden className="h-4 w-4" />
              </button>
            )}
            <textarea
              ref={inputRef}
              id="quote-ask"
              rows={1}
              value={draft}
              maxLength={500}
              disabled={streaming}
              onChange={(event) => setDraft(event.target.value)}
              onKeyDown={(event) => {
                /* Enter sends, shift-enter breaks the line. */
                if (event.key === "Enter" && !event.shiftKey) {
                  event.preventDefault();
                  void send();
                }
              }}
              placeholder="Can you work with data that cannot leave our servers?"
              className="max-h-24 min-h-[24px] w-full resize-none bg-transparent text-[14px] leading-relaxed outline-none placeholder:text-muted-foreground/60 disabled:opacity-50"
            />
            <button
              type="button"
              onClick={() => void send()}
              disabled={streaming || draft.trim().length === 0}
              aria-label="Send"
              className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground transition-opacity disabled:opacity-30"
            >
              <ArrowUp aria-hidden className="h-4 w-4" />
            </button>
          </div>
        )}

        <div className="flex items-center justify-between gap-3">
          <button
            type="button"
            onClick={onLeave}
            className="inline-flex items-center gap-1.5 text-xs text-muted-foreground underline decoration-foreground/20 underline-offset-4 transition-colors hover:text-foreground hover:decoration-foreground"
          >
            <CornerDownLeft aria-hidden className="h-3 w-3" />
            {turns.length === 0 ? "Skip this and carry on" : "Carry on with the questions"}
          </button>
          {/*
            After a strike, the counter says what is actually about to run out.
            Nobody should have the conversation end on them without having been
            told, and the model has already said it in words above.
          */}
          <span className="shrink-0 font-mono text-[11px] text-muted-foreground">
            {warned ? `${offTopic} of ${MAX_OFF_TOPIC}` : `${asked} of ${MAX_TURNS}`}
          </span>
        </div>
      </div>
    </div>
  );
}
