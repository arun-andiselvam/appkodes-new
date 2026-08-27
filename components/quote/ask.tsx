"use client";

import { useEffect, useRef, useState } from "react";
import { ArrowUp, CornerDownLeft, Sparkles } from "lucide-react";

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

type Turn = { role: "user" | "assistant"; content: string };

export function AskStep({
  onLeave,
  onUnavailable,
  reduceMotion,
}: {
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

  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  const asked = turns.filter((turn) => turn.role === "user").length;
  const spent = asked >= MAX_TURNS;

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

    try {
      const response = await fetch("/api/quote/ask", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ messages: next }),
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

        setTurns(next);
        setFailure(payload.message ?? payload.error ?? "That did not work. Try again.");
        return;
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
                turn.content.split("\n\n").map((paragraph, part) => (
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
        {spent ? (
          <p className="rounded-sm border border-foreground/10 bg-foreground/[0.02] px-3 py-2.5 text-sm leading-relaxed text-muted-foreground">
            That is about as far as I can usefully take it. The rest is a
            conversation for a person.
          </p>
        ) : (
          <div className="flex items-end gap-2 border border-foreground/15 px-3 py-2 focus-within:border-foreground/50">
            <label htmlFor="quote-ask" className="sr-only">
              Ask a question
            </label>
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
              className="mb-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground transition-opacity disabled:opacity-30"
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
          <span className="shrink-0 font-mono text-[11px] text-muted-foreground">
            {asked} of {MAX_TURNS}
          </span>
        </div>
      </div>
    </div>
  );
}
