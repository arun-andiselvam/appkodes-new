"use client";

import { MessageCircle, Phone } from "lucide-react";
import { founderContact } from "@/content/contact";
import { track } from "@/lib/analytics";

/**
 * The way out of the modal for somebody who would rather just talk.
 *
 * A short form is still a form, and a good share of buyers will not fill one
 * in however short it is. The ones who want a person on the other end are
 * often the serious ones, so making them work through the questions to earn a
 * phone number gets it exactly backwards.
 *
 * !! IT IS GATED, BECAUSE THIS IS SOMEBODY'S REAL MOBILE !!
 *
 * The modal renders this only after a couple of questions have been answered.
 * That is not a hoop for its own sake: it is the difference between a visitor
 * who has said what they are building and a drive-by who opened the modal by
 * accident. The assistant is under the same rule and will not hand the number
 * to an off-topic conversation or a student enquiry, both of which have
 * routes of their own.
 *
 * WhatsApp first, because it is asynchronous. Somebody weighing up a supplier
 * at eleven at night will send a message and will not ring a stranger, and the
 * message arrives with a line saying where it came from either way.
 *
 * No CSP change was needed for either link. proxy.ts sets default-src 'self',
 * which governs what the page loads rather than where it navigates, and a
 * plain anchor is a navigation.
 */
export function DirectLine({ className = "" }: { className?: string }) {
  const who = founderContact.name
    ? `${founderContact.name}, ${founderContact.role}`
    : founderContact.role;

  return (
    <div
      className={`border-t border-foreground/10 pt-4 ${className}`}
    >
      <p className="text-xs text-muted-foreground">
        Would rather talk it through? Go straight to {who}.
      </p>

      <div className="mt-2.5 flex flex-wrap gap-2">
        <a
          href={founderContact.whatsapp}
          target="_blank"
          rel="noopener noreferrer"
          onClick={() => track("quote_direct_line", { channel: "whatsapp" })}
          className="inline-flex items-center gap-2 border border-foreground/15 px-3 py-2 text-sm transition-colors hover:border-foreground/40 hover:bg-foreground/[0.03] focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-foreground/30"
        >
          <MessageCircle aria-hidden className="h-4 w-4 shrink-0 text-primary" />
          WhatsApp
        </a>

        <a
          href={founderContact.tel}
          onClick={() => track("quote_direct_line", { channel: "phone" })}
          className="inline-flex items-center gap-2 border border-foreground/15 px-3 py-2 text-sm transition-colors hover:border-foreground/40 hover:bg-foreground/[0.03] focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-foreground/30"
        >
          <Phone aria-hidden className="h-4 w-4 shrink-0 text-primary" />
          {/*
            The number is shown rather than hidden behind the word "Call".
            On a desktop, where tel: does nothing useful, the readable number
            is the whole point - somebody is going to pick up their phone and
            type it in.
          */}
          <span className="font-mono text-xs">{founderContact.phone}</span>
        </a>
      </div>
    </div>
  );
}
