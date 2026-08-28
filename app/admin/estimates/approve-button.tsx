"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

/**
 * The button that sends a priced estimate to a real client.
 *
 * !! IT ASKS FIRST, AND THE CONFIRMATION NAMES THE ADDRESS. !!
 *
 * This is the least reversible action in the whole system: once Resend accepts
 * it, a figure written by a model is in a buyer's inbox with this company's
 * name on it. A misplaced click on a list of six estimates is a real way for
 * that to happen to the wrong one, so the confirm spells out who it goes to.
 *
 * A client component purely because it needs a click handler and a pending
 * state. Everything it acts on came from the server page around it.
 */
export function ApproveButton({
  id,
  reference,
  email,
}: {
  id: string;
  reference: string;
  email: string;
}) {
  const router = useRouter();
  const [state, setState] = useState<"idle" | "sending" | "sent">("idle");
  const [error, setError] = useState("");

  async function approve() {
    if (
      !window.confirm(
        `Send estimate ${reference} to ${email}?\n\nThis emails the PDF to the client. It cannot be unsent.`,
      )
    ) {
      return;
    }

    setState("sending");
    setError("");

    try {
      const response = await fetch(`/api/admin/estimates/${id}`, {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ action: "approve" }),
      });

      const payload = (await response.json()) as { message?: string };

      if (!response.ok) {
        setState("idle");
        setError(payload.message ?? "That did not send.");
        return;
      }

      setState("sent");
      /*
       * Refresh rather than mutate local state: the row's status, its sent
       * timestamp and the queue counts at the top of the page all changed, and
       * the server is the thing that knows what they are now.
       */
      router.refresh();
    } catch {
      setState("idle");
      setError("Could not reach the server.");
    }
  }

  if (state === "sent") {
    return (
      <span className="font-mono text-xs uppercase tracking-widest text-primary">
        Sent
      </span>
    );
  }

  return (
    <span className="flex flex-wrap items-center gap-3">
      <button
        type="button"
        onClick={approve}
        disabled={state === "sending"}
        className="border border-primary px-4 py-2 font-mono text-xs uppercase tracking-widest text-primary transition-colors hover:bg-primary hover:text-background disabled:opacity-50"
      >
        {state === "sending" ? "Sending…" : "Approve and send"}
      </button>
      {error && <span className="text-xs text-brand-red">{error}</span>}
    </span>
  );
}
