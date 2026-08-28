import "server-only";

import { readFileSync } from "node:fs";
import path from "node:path";
import PDFDocument from "pdfkit";

import { channels, founderContact } from "@/content/contact";
import { site } from "@/content/site";
import type { Estimate } from "@/lib/quote-estimate-schema";

/**
 * Renders an estimate to a PDF.
 *
 * !! THIS DOCUMENT IS THE ONLY THING MOST RECIPIENTS WILL EVER READ. !!
 *
 * The conversation is gone the moment they close the window. What arrives in
 * their inbox is this file, and it is being read by somebody deciding whether
 * to spend a large sum with a company they have never met. So it is laid out
 * like a document rather than a data dump: one column, generous margins, real
 * hierarchy, and every number given its basis.
 *
 * Rendered from the stored `content` jsonb rather than from the model's raw
 * reply, which is what lets a person correct a figure in the admin and have
 * the PDF and the record still agree.
 *
 * pdfkit is named in serverExternalPackages in next.config.mjs. Read the note
 * there before touching this file - bundled, it throws ENOENT on the first
 * font call, and only in production.
 */

/**
 * The palette.
 *
 * !! THESE ARE THE ACTUAL BRAND COLOURS, NOT A PLACEHOLDER SET. !!
 *
 * Read from app/brand.css's light-theme values on 27 August 2026, on the
 * client's instruction that this document use the real brand rather than a
 * generic accent - a PDF is a fixed document with no dark mode to speak of,
 * so it takes the light-theme figures rather than either theme's variable.
 * If the brand ever moves, change it there and copy the new hex across; a
 * document already sent is not going to re-render itself.
 */
const INK = "#111827";
const MUTED = "#6b7280";
const RULE = "#e5e7eb";
/** app/brand.css --brand-blue, light theme. */
const ACCENT = "#146f90";
/** app/brand.css --brand-blue-strong, light theme. For the cost figure. */
const ACCENT_STRONG = "#0f556f";

const PAGE_MARGIN = 56;

/**
 * The company details on every estimate.
 *
 * Pulled from content/contact.ts and content/site.ts rather than typed here a
 * second time - the office address and the project line are one fact each,
 * defined once, and this document reads them rather than repeating them.
 * "Project enquiries" rather than "College and student enquiries" because
 * this document only ever goes to somebody who has been through the quote
 * conversation as a lead.
 */
const emailChannel = channels.find((channel) => channel.label === "Email");
const phoneChannel = channels.find((channel) => channel.label === "Project enquiries");
const officeChannel = channels.find((channel) => channel.label === "Office");

/**
 * The wordmark, read once at module load rather than per document.
 *
 * public/hitasoft-logo-c.png, not the .webp beside it - pdfkit's image
 * support is PNG and JPEG only, and this is the same PNG already kept around
 * for exactly the contexts a WebP cannot reach. It is black-and-red on a
 * transparent ground, which is why it sits directly on the page's white
 * rather than needing a badge behind it the way the black-only chat avatar
 * did - the colour is already the brand colour, not a shape that needs
 * recolouring.
 *
 * Read with readFileSync at module scope, once per server process, rather
 * than inside renderEstimatePdf: the file never changes while the process is
 * running, and re-reading it from disk on every estimate would be a syscall
 * this function has no reason to make.
 */
const LOGO = readFileSync(path.join(process.cwd(), "public", "hitasoft-logo-c.png"));
const LOGO_WIDTH = 120;
/** The source is 831×216; this keeps that ratio at LOGO_WIDTH. */
const LOGO_HEIGHT = Math.round(LOGO_WIDTH * (216 / 831));

/**
 * Builds the document and resolves with the finished bytes.
 *
 * Buffered rather than streamed to disk, because the caller writes it through
 * lib/quote-uploads.ts alongside everything else and a half-written PDF on
 * disk after a crash would be worse than none.
 */
export function renderEstimatePdf(estimate: Estimate, meta: {
  reference: string;
  preparedFor: string;
  date: string;
}): Promise<Buffer> {
  return new Promise((resolve, reject) => {
    const doc = new PDFDocument({
      size: "A4",
      margin: PAGE_MARGIN,
      info: {
        Title: `Project estimate — ${meta.reference}`,
        Author: "Hitasoft",
        Subject: estimate.summary.slice(0, 200),
      },
    });

    const chunks: Buffer[] = [];
    doc.on("data", (chunk: Buffer) => chunks.push(chunk));
    doc.on("end", () => resolve(Buffer.concat(chunks)));
    doc.on("error", reject);

    const width = doc.page.width - PAGE_MARGIN * 2;

    /* ------------------------------------------------------------- header */

    /*
     * The real wordmark, not a "Hitasoft" set in Helvetica-Bold.
     *
     * public/hitasoft-logo-c.png is the same file the site already uses
     * anywhere it needs the mark on a light ground - see the note where
     * LOGO_FILE is read below. Placed at an explicit x/y, which is how
     * pdfkit is told "draw here and do not move the cursor" - the two lines
     * underneath are positioned by hand rather than by whatever y the image
     * call happened to leave behind.
     */
    doc.image(LOGO, PAGE_MARGIN, PAGE_MARGIN, { width: LOGO_WIDTH });
    doc.x = PAGE_MARGIN;
    doc.y = PAGE_MARGIN + LOGO_HEIGHT + 10;

    doc
      .font("Helvetica")
      .fontSize(9)
      .fillColor(MUTED)
      .text(
        [
          "Madurai, Tamil Nadu, India",
          emailChannel?.value,
          phoneChannel?.value,
        ]
          .filter(Boolean)
          .join("  ·  "),
      );

    doc.moveDown(1.4);

    doc.font("Helvetica-Bold").fontSize(22).fillColor(INK).text("Project estimate");

    doc.moveDown(0.4);

    doc
      .font("Helvetica")
      .fontSize(9.5)
      .fillColor(MUTED)
      .text(`Prepared for ${meta.preparedFor}`)
      .text(`Reference ${meta.reference}  ·  ${meta.date}`);

    doc.moveDown(1);
    rule(doc, width);
    doc.moveDown(1);

    /* ------------------------------------------------------------ summary */

    section(doc, "What we understand you need");
    body(doc, estimate.summary);

    /* -------------------------------------------------------------- scope */

    if (estimate.scope.length) {
      section(doc, "What is included");
      for (const item of estimate.scope) {
        doc.moveDown(0.45);
        doc.font("Helvetica-Bold").fontSize(10.5).fillColor(INK).text(item.title);
        doc.font("Helvetica").fontSize(10).fillColor(MUTED).text(item.detail, {
          width,
          lineGap: 2,
        });
      }
      doc.moveDown(0.4);
    }

    /* ------------------------------------------------------------- phases */

    if (estimate.phases.length) {
      section(doc, "How the work breaks down");

      for (const phase of estimate.phases) {
        /*
         * Keep a phase on one page.
         *
         * A block split across a page break reads as two half-thoughts, and
         * this is the part of the document a reader scans hardest. 90pt is
         * roughly the tallest a phase block gets.
         */
        if (doc.y > doc.page.height - PAGE_MARGIN - 90) doc.addPage();

        doc.moveDown(0.5);
        doc.font("Helvetica-Bold").fontSize(10.5).fillColor(INK).text(phase.name);

        doc
          .font("Helvetica")
          .fontSize(9)
          .fillColor(ACCENT)
          .text(`${phase.duration}  ·  ${phase.effort}`);

        doc.font("Helvetica").fontSize(10).fillColor(MUTED).text(phase.detail, {
          width,
          lineGap: 2,
        });
      }
      doc.moveDown(0.6);
    }

    /* --------------------------------------------------------------- cost */

    if (doc.y > doc.page.height - PAGE_MARGIN - 140) doc.addPage();

    section(doc, "Cost");

    doc.moveDown(0.3);
    doc
      .font("Helvetica-Bold")
      .fontSize(18)
      .fillColor(ACCENT_STRONG)
      /*
       * $, not the currency code. ESTIMATE_SCHEMA constrains `cost.currency`
       * to the literal "USD" - see the note on this in lib/quote-estimate.ts
       * for why every estimate this company sends is priced in dollars - so
       * the symbol is written directly rather than built from a value that
       * cannot actually vary. currencySymbol() is still the fallback if that
       * ever changes, so this line does not have to be found and edited too.
       */
      .text(`${currencySymbol(estimate.cost.currency)}${estimate.cost.low} — ${currencySymbol(estimate.cost.currency)}${estimate.cost.high}`);

    doc.moveDown(0.3);
    body(doc, estimate.cost.basis);

    /* ----------------------------------------------------------- timeline */

    section(doc, "Timeline");
    doc
      .font("Helvetica-Bold")
      .fontSize(11)
      .fillColor(INK)
      .text(estimate.timeline.total);
    doc.moveDown(0.2);
    body(doc, estimate.timeline.note);

    /* -------------------------------------------------- the careful parts */

    list(doc, "What we have assumed", estimate.assumptions, width);
    list(doc, "What this does not cover", estimate.exclusions, width);

    if (estimate.risks.length) {
      if (doc.y > doc.page.height - PAGE_MARGIN - 120) doc.addPage();
      section(doc, "What could move these numbers");
      for (const risk of estimate.risks) {
        doc.moveDown(0.4);
        doc.font("Helvetica-Bold").fontSize(10).fillColor(INK).text(risk.risk);
        doc
          .font("Helvetica")
          .fontSize(10)
          .fillColor(MUTED)
          .text(risk.mitigation, { width, lineGap: 2 });
      }
      doc.moveDown(0.4);
    }

    list(doc, "What we still need to confirm", estimate.questions, width);

    /* ------------------------------------------------------------- footer */

    if (doc.y > doc.page.height - PAGE_MARGIN - 140) doc.addPage();

    doc.moveDown(1);
    rule(doc, width);
    doc.moveDown(0.8);

    /*
     * !! THIS PARAGRAPH IS NOT BOILERPLATE AND MUST NOT BE TRIMMED. !!
     *
     * Everything above is a number produced from one conversation. The site's
     * own copy says nobody can price work they have not looked at, and this is
     * what keeps this document honest about which of the two it is. A range
     * sent without it reads as a quote, and somebody will hold us to it.
     */
    doc
      .font("Helvetica")
      .fontSize(8.5)
      .fillColor(MUTED)
      .text(
        "This is an estimate, not a fixed quote. It is based on the conversation and documents provided so far, and the figures above will move as the requirement is examined properly. Nothing here is a contractual commitment. The next step is a conversation with the person who would run the work — reply to this email and we will arrange one.",
        { width, lineGap: 2, align: "left" },
      );

    doc.moveDown(0.6);

    /*
     * !! ALSO NOT BOILERPLATE. ON THE CLIENT'S INSTRUCTION OF 28 AUGUST 2026. !!
     *
     * The paragraph above says this is an estimate, not a quote. This one
     * says something adjacent but different: the number was drafted by a
     * model. A person at Hitasoft has read it before it reached this inbox -
     * that is the entire reason app/admin/estimates exists - but "reviewed"
     * is not "guaranteed correct", and a document that only says the former
     * lets a reader assume the latter. founderContact is read from
     * content/contact.ts rather than retyped so this line and the "talk to
     * the founder" one QuoteBot itself can offer never drift apart.
     */
    doc
      .font("Helvetica")
      .fontSize(8.5)
      .fillColor(MUTED)
      .text(
        `This estimate was drafted with AI assistance and reviewed before sending — it can still be wrong. For a detailed discussion, contact our founder & CEO directly: ${founderContact.email}, ${founderContact.phone}.`,
        { width, lineGap: 2, align: "left" },
      );

    doc.moveDown(0.7);

    /*
     * The full company details, once, at the very bottom.
     *
     * The header above is deliberately short - a locality, an email, a phone
     * number, enough to place the document. This is the complete registered
     * address, read from content/contact.ts rather than retyped, because a
     * formal document's letterhead carries the short form and its footer
     * carries the whole one - the same convention an invoice or a letter uses.
     */
    doc
      .font("Helvetica")
      .fontSize(8)
      .fillColor(MUTED)
      .text(
        [site.name, officeChannel?.value, emailChannel?.value, phoneChannel?.value]
          .filter(Boolean)
          .join("  ·  "),
        { width, lineGap: 2 },
      );

    doc.end();
  });
}

/* ----------------------------------------------------------------- helpers */

/**
 * "$" for the currency this company actually prices in, or the code itself
 * for anything else - which the schema does not currently allow, but a
 * renderer should still produce a legible document rather than a wrong symbol
 * if that constraint is ever loosened.
 *
 * Exported so app/admin/estimates/page.tsx renders the same figure the same
 * way rather than keeping a second copy of this one-line rule in step.
 */
export function currencySymbol(currency: string) {
  return currency === "USD" ? "$" : `${currency} `;
}

function rule(doc: PDFKit.PDFDocument, width: number) {
  doc
    .strokeColor(RULE)
    .lineWidth(1)
    .moveTo(PAGE_MARGIN, doc.y)
    .lineTo(PAGE_MARGIN + width, doc.y)
    .stroke();
}

function section(doc: PDFKit.PDFDocument, title: string) {
  doc.moveDown(1);
  doc
    .font("Helvetica-Bold")
    .fontSize(8.5)
    .fillColor(ACCENT)
    .text(title.toUpperCase(), { characterSpacing: 0.8 });
  doc.moveDown(0.45);
}

function body(doc: PDFKit.PDFDocument, text: string) {
  doc
    .font("Helvetica")
    .fontSize(10.5)
    .fillColor(INK)
    .text(text, {
      width: doc.page.width - PAGE_MARGIN * 2,
      lineGap: 2.5,
    });
}

/**
 * A bulleted list, or nothing at all for an empty one.
 *
 * The empty check matters: a heading reading "What we have assumed" with
 * nothing under it looks like the document failed to generate, which is a bad
 * look on the one artefact the recipient judges us by.
 */
function list(
  doc: PDFKit.PDFDocument,
  title: string,
  items: string[],
  width: number,
) {
  if (!items.length) return;

  if (doc.y > doc.page.height - PAGE_MARGIN - 100) doc.addPage();

  section(doc, title);
  doc.font("Helvetica").fontSize(10).fillColor(MUTED);

  for (const item of items) {
    /*
     * The bullet is an en dash in the text rather than pdfkit's own list
     * rendering: its `listType` indent wraps the second line under the bullet
     * instead of under the text, which looks like a mistake on every item long
     * enough to wrap - and in this document most of them are.
     */
    doc.text(`–  ${item}`, {
      width: width - 12,
      indent: 12,
      lineGap: 2,
      continued: false,
    });
    doc.moveDown(0.25);
  }
}
