"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";

/**
 * Correcting the budget or the deadline, and asking Sonnet to try again.
 *
 * !! FOR THE "YOU DECIDE" / "AS SOON AS POSSIBLE" PROBLEM !!
 *
 * writeEstimate in lib/quote-estimate.ts reads session.budget and
 * session.timeline straight off the conversation row - whatever the visitor
 * actually typed, however unhelpful. This is where somebody who knows the
 * account puts a real figure in first. Either field left blank keeps
 * whatever the session already has - see the COALESCE note on patchSession
 * and the same reasoning in handleRegenerate.
 *
 * A client component for the same reason ApproveButton next to this file is
 * one: a click handler, a pending state, and a call to a route the server
 * page around it does not otherwise reach for.
 */
export function RegeneratePanel({
  id,
  initialBudget,
  initialTimeline,
}: {
  id: string;
  initialBudget: string;
  initialTimeline: string;
}) {
  const router = useRouter();
  const [budget, setBudget] = useState(initialBudget);
  const [timeline, setTimeline] = useState(initialTimeline);
  const [state, setState] = useState<"idle" | "running" | "done">("idle");
  const [error, setError] = useState("");
  const [open, setOpen] = useState(false);

  async function submit(event: FormEvent) {
    event.preventDefault();
    setState("running");
    setError("");

    try {
      const response = await fetch(`/api/admin/estimates/${id}`, {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ action: "regenerate", budget, timeline }),
      });

      const payload = (await response.json()) as { message?: string };

      if (!response.ok) {
        setState("idle");
        setError(payload.message ?? "That did not regenerate.");
        return;
      }

      setState("done");
      setOpen(false);
      /* The new content, cost and reviewer notes all live server-side. */
      router.refresh();
    } catch {
      setState("idle");
      setError("Could not reach the server.");
    }
  }

  if (!open) {
    return (
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="border border-foreground/20 px-4 py-2 font-mono text-xs uppercase tracking-widest text-muted-foreground transition-colors hover:border-foreground/40 hover:text-foreground"
      >
        Correct and regenerate
      </button>
    );
  }

  return (
    <form
      onSubmit={submit}
      className="w-full space-y-3 border border-foreground/15 bg-foreground/[0.015] p-4"
    >
      <p className="font-mono text-xs uppercase tracking-widest text-muted-foreground">
        Correct and regenerate
      </p>
      <p className="text-xs leading-relaxed text-muted-foreground">
        Leave either field blank to keep what the visitor said. This asks
        Sonnet to rewrite the whole estimate from the conversation again, so
        it takes a minute — the row goes back to &ldquo;running&rdquo; while it does.
      </p>

      <label className="block">
        <span className="mb-1 block font-mono text-[11px] uppercase tracking-widest text-muted-foreground">
          Budget
        </span>
        <input
          type="text"
          value={budget}
          onChange={(event) => setBudget(event.target.value)}
          placeholder={initialBudget || "not stated"}
          className="w-full border border-foreground/20 bg-transparent px-3 py-2 text-sm outline-none focus:border-primary"
        />
      </label>

      <label className="block">
        <span className="mb-1 block font-mono text-[11px] uppercase tracking-widest text-muted-foreground">
          Deadline
        </span>
        <input
          type="text"
          value={timeline}
          onChange={(event) => setTimeline(event.target.value)}
          placeholder={initialTimeline || "not stated"}
          className="w-full border border-foreground/20 bg-transparent px-3 py-2 text-sm outline-none focus:border-primary"
        />
      </label>

      <div className="flex flex-wrap items-center gap-3 pt-1">
        <button
          type="submit"
          disabled={state === "running"}
          className="border border-primary px-4 py-2 font-mono text-xs uppercase tracking-widest text-primary transition-colors hover:bg-primary hover:text-background disabled:opacity-50"
        >
          {state === "running" ? "Regenerating…" : "Regenerate quote"}
        </button>
        <button
          type="button"
          onClick={() => setOpen(false)}
          disabled={state === "running"}
          className="font-mono text-xs uppercase tracking-widest text-muted-foreground transition-colors hover:text-foreground disabled:opacity-50"
        >
          Cancel
        </button>
        {error && <span className="text-xs text-brand-red">{error}</span>}
      </div>
    </form>
  );
}
