import "server-only";

import { query, queryStrict } from "@/lib/db";
import type { Phase } from "@/lib/quote-session";

/**
 * Reading and writing a quote conversation's state.
 *
 * Separate from lib/db.ts on purpose. That file is the scripted flow's
 * archive: it writes a record of something that already happened, and it
 * swallows every error because losing the record must never cost the enquiry.
 * This file holds the state a live conversation is standing in, where a
 * dropped write is not a gap in an archive but a visitor asked to verify their
 * address twice. Everything here goes through queryStrict and throws.
 *
 * The two share the `quote_conversations` row, which is deliberate - one
 * visitor, one record, whichever route they came through.
 */

/* ------------------------------------------------------------- the session */

export type Session = {
  id: string;
  phase: Phase;
  visitorKind: string | null;
  service: string | null;
  /*
   * Not the same field the scripted flow's own name column was built for -
   * see the note on `name` in SessionPatch below.
   */
  name: string | null;
  verifiedEmail: string | null;
  verifiedAt: string | null;
  whatsapp: string | null;
  budget: string | null;
  timeline: string | null;
  placement: string | null;
  transcript: { role: string; content: string; flag?: string }[];
  turns: number;
  offTopic: number;
  startedAt: string;
};

type SessionRow = {
  id: string;
  phase: string;
  visitor_kind: string | null;
  service: string | null;
  name: string | null;
  verified_email: string | null;
  verified_at: string | null;
  whatsapp: string | null;
  budget: string | null;
  timeline: string | null;
  placement: string | null;
  transcript: { role: string; content: string; flag?: string }[] | null;
  turns: number;
  off_topic: number;
  started_at: string;
};

function toSession(row: SessionRow): Session {
  return {
    id: row.id,
    phase: row.phase as Phase,
    visitorKind: row.visitor_kind,
    service: row.service,
    name: row.name,
    verifiedEmail: row.verified_email,
    verifiedAt: row.verified_at,
    whatsapp: row.whatsapp,
    budget: row.budget,
    timeline: row.timeline,
    placement: row.placement,
    transcript: row.transcript ?? [],
    turns: row.turns,
    offTopic: row.off_topic,
    startedAt: row.started_at,
  };
}

const SESSION_COLUMNS = `
  id, phase, visitor_kind, service, name, verified_email, verified_at,
  whatsapp, budget, timeline, placement, transcript, turns, off_topic, started_at
`;

/**
 * Fetches the conversation, creating it on first contact.
 *
 * One statement rather than a select-then-insert, because two visitors' first
 * messages arriving together would otherwise race and one would lose its row.
 * `DO UPDATE SET placement = placement` looks like a no-op and is not: a plain
 * DO NOTHING returns no row on conflict, so an existing conversation would
 * come back empty and be treated as new.
 *
 * The phase defaults to 'greeting' from the schema. It is never passed in
 * here - a caller that could name the phase a session starts in is a caller
 * that could start one at 'discovery'.
 */
export async function openSession(id: string, placement?: string): Promise<Session> {
  const rows = await queryStrict<SessionRow>(
    `
    INSERT INTO quote_conversations (id, placement)
    VALUES ($1, $2)
    ON CONFLICT (id) DO UPDATE SET
      placement = COALESCE(quote_conversations.placement, EXCLUDED.placement)
    RETURNING ${SESSION_COLUMNS}
    `,
    [id, placement ?? null],
  );
  return toSession(rows[0]);
}

export async function getSession(id: string): Promise<Session | null> {
  const rows = await queryStrict<SessionRow>(
    `SELECT ${SESSION_COLUMNS} FROM quote_conversations WHERE id = $1`,
    [id],
  );
  return rows[0] ? toSession(rows[0]) : null;
}

/**
 * What a turn is allowed to change about a session.
 *
 * Note what is not here: `verifiedEmail` and `verifiedAt`. They are set by
 * markVerified below and by nothing else, so no amount of getting this call
 * wrong can verify somebody. Same reasoning as SERVER_ONLY in
 * lib/quote-session.ts - the important rules are enforced in more than one
 * place, because the one place is always the one somebody edits.
 */
export type SessionPatch = {
  phase?: Phase;
  visitorKind?: string | null;
  service?: string | null;
  /*
   * The `name` column already existed on this table for the scripted flow's
   * own submission - see scripts/quote-schema.sql. Reused here rather than
   * added twice: one visitor, one name, whichever route asked for it. Set
   * from app/api/quote/otp/route.ts, collected alongside the email a visitor
   * verifies - see the note on the name field in components/quote/chatbot.tsx
   * for why it lives there rather than being asked for separately.
   */
  name?: string | null;
  whatsapp?: string | null;
  budget?: string | null;
  timeline?: string | null;
};

/**
 * Writes a patch, leaving anything not mentioned alone.
 *
 * COALESCE on every column so an absent key means "unchanged" rather than
 * "null it". A visitor who mentions a budget and then talks about something
 * else for three turns should not have the budget wiped by the next write
 * that happens not to include one.
 */
export async function patchSession(id: string, patch: SessionPatch): Promise<Session> {
  const rows = await queryStrict<SessionRow>(
    `
    UPDATE quote_conversations SET
      phase        = COALESCE($2, phase),
      visitor_kind = COALESCE($3, visitor_kind),
      service      = COALESCE($4, service),
      whatsapp     = COALESCE($5, whatsapp),
      budget       = COALESCE($6, budget),
      timeline     = COALESCE($7, timeline),
      name         = COALESCE($8, name),
      updated_at   = now()
    WHERE id = $1
    RETURNING ${SESSION_COLUMNS}
    `,
    [
      id,
      patch.phase ?? null,
      patch.visitorKind ?? null,
      patch.service ?? null,
      patch.whatsapp ?? null,
      patch.budget ?? null,
      patch.timeline ?? null,
      patch.name ?? null,
    ],
  );
  return toSession(rows[0]);
}

/**
 * Appends a pair of turns and keeps the rolling counts in step.
 *
 * !! APPENDED SERVER SIDE, NOT REWRITTEN FROM WHAT THE BROWSER POSTED !!
 *
 * lib/db.ts rewrites the whole transcript each turn and explains why: the
 * browser held the authoritative copy. It no longer does. The server decides
 * what phase this conversation is in, so it has to hold the history that
 * phase was derived from, or a visitor could edit their own past.
 *
 * jsonb || jsonb concatenates, so this is one statement with no read-modify-
 * write and nothing to race.
 */
export async function appendTurns(
  id: string,
  turns: { role: string; content: string; flag?: string }[],
): Promise<void> {
  const offTopic = turns.filter((t) => t.role === "assistant" && t.flag === "OFF").length;
  const asked = turns.filter((t) => t.role === "user").length;

  await queryStrict(
    `
    UPDATE quote_conversations SET
      transcript = transcript || $2::jsonb,
      turns      = turns + $3,
      off_topic  = off_topic + $4,
      updated_at = now()
    WHERE id = $1
    `,
    [id, JSON.stringify(turns), asked, offTopic],
  );
}

/**
 * Records that an address was proved.
 *
 * The only function in this codebase that writes verified_email. Called from
 * app/api/quote/verify and from nowhere else. It moves the phase to
 * 'discovery' in the same statement rather than leaving that to the caller,
 * because a row that is verified but still sitting in 'verify' would put the
 * assistant back to asking for an address it already has.
 *
 * The WHERE clause requires the conversation to actually be in 'verify'. A
 * replayed request against an already-verified conversation updates nothing
 * and returns no row, which is what the caller checks.
 */
export async function markVerified(id: string, email: string): Promise<Session | null> {
  const rows = await queryStrict<SessionRow>(
    `
    UPDATE quote_conversations SET
      verified_email = $2,
      verified_at    = now(),
      phase          = 'discovery',
      updated_at     = now()
    WHERE id = $1 AND phase = 'verify'
    RETURNING ${SESSION_COLUMNS}
    `,
    [id, email],
  );
  return rows[0] ? toSession(rows[0]) : null;
}

/* ----------------------------------------------------------------- the OTP */

export type OtpRow = {
  id: string;
  conversation_id: string;
  email: string;
  code_hash: string;
  sent_at: string;
  expires_at: string;
  attempts: number;
  consumed_at: string | null;
};

export async function insertOtp(input: {
  id: string;
  conversationId: string;
  email: string;
  codeHash: string;
  expiresAt: Date;
}): Promise<void> {
  await queryStrict(
    `
    INSERT INTO quote_otps (id, conversation_id, email, code_hash, expires_at)
    VALUES ($1, $2, $3, $4, $5)
    `,
    [input.id, input.conversationId, input.email, input.codeHash, input.expiresAt],
  );
}

/** The newest code for this conversation, used or not. */
export async function latestOtp(conversationId: string): Promise<OtpRow | null> {
  const rows = await queryStrict<OtpRow>(
    `
    SELECT * FROM quote_otps
    WHERE conversation_id = $1
    ORDER BY sent_at DESC
    LIMIT 1
    `,
    [conversationId],
  );
  return rows[0] ?? null;
}

/**
 * Counts codes sent to an address recently.
 *
 * Keyed on the address rather than the conversation, so opening a fresh
 * conversation is not a way around the cooldown. Somebody who genuinely needs
 * another code waits a minute; somebody using this site to post codes at a
 * stranger's inbox hits a wall whatever id they mint.
 */
export async function recentSendsTo(email: string, withinSeconds: number): Promise<number> {
  const rows = await queryStrict<{ n: number }>(
    `
    SELECT count(*)::int AS n FROM quote_otps
    WHERE email = $1 AND sent_at > now() - ($2 || ' seconds')::interval
    `,
    [email, String(withinSeconds)],
  );
  return rows[0]?.n ?? 0;
}

/** Records a wrong guess and returns the new total. */
export async function bumpOtpAttempts(id: string): Promise<number> {
  const rows = await queryStrict<{ attempts: number }>(
    `UPDATE quote_otps SET attempts = attempts + 1 WHERE id = $1 RETURNING attempts`,
    [id],
  );
  return rows[0]?.attempts ?? 0;
}

/**
 * Burns the code.
 *
 * `AND consumed_at IS NULL` makes this the atomic step: two requests carrying
 * the same correct code race here, one updates a row and one updates nothing,
 * and only the winner is told it verified anything.
 */
export async function consumeOtp(id: string): Promise<boolean> {
  const rows = await queryStrict<{ id: string }>(
    `
    UPDATE quote_otps SET consumed_at = now()
    WHERE id = $1 AND consumed_at IS NULL
    RETURNING id
    `,
    [id],
  );
  return rows.length > 0;
}

/* --------------------------------------------------------------- the files */

export type FileRow = {
  id: string;
  conversation_id: string;
  filename: string;
  mime: string | null;
  bytes: number;
  stored_path: string;
  extracted_text: string | null;
  uploaded_at: string;
};

export async function insertFile(input: {
  id: string;
  conversationId: string;
  filename: string;
  mime: string | null;
  bytes: number;
  storedPath: string;
  extractedText: string | null;
}): Promise<void> {
  await queryStrict(
    `
    INSERT INTO quote_files
      (id, conversation_id, filename, mime, bytes, stored_path, extracted_text)
    VALUES ($1, $2, $3, $4, $5, $6, $7)
    `,
    [
      input.id,
      input.conversationId,
      input.filename,
      input.mime,
      input.bytes,
      input.storedPath,
      input.extractedText,
    ],
  );
}

export async function listFiles(conversationId: string): Promise<FileRow[]> {
  return queryStrict<FileRow>(
    `SELECT * FROM quote_files WHERE conversation_id = $1 ORDER BY uploaded_at`,
    [conversationId],
  );
}

export async function countFiles(conversationId: string): Promise<number> {
  const rows = await queryStrict<{ n: number }>(
    `SELECT count(*)::int AS n FROM quote_files WHERE conversation_id = $1`,
    [conversationId],
  );
  return rows[0]?.n ?? 0;
}

/* ------------------------------------------------------------ the estimate */

export type EstimateStatus =
  | "queued"
  | "running"
  | "ready"
  | "approved"
  | "sent"
  | "failed";

export type EstimateRow = {
  id: string;
  conversation_id: string;
  status: EstimateStatus;
  model: string | null;
  content: unknown;
  pdf_path: string | null;
  attempts: number;
  error: string | null;
  created_at: string;
  updated_at: string;
  approved_at: string | null;
  sent_at: string | null;
};

/**
 * Queues an estimate, and moves the conversation to 'queued' with it.
 *
 * !! ONE TRANSACTION, BECAUSE HALF OF THIS IS A LIE TO A VISITOR !!
 *
 * The assistant has just told somebody their estimate is being worked up. If
 * the estimate row is written and the phase is not, the conversation carries
 * on asking for a timeline it already has. If the phase is written and the row
 * is not, nothing ever generates the estimate that was promised. Neither is
 * allowed to happen alone.
 *
 * ON CONFLICT is not needed - the id is fresh - but the WHERE on the phase
 * update is: a double-posted final turn must not queue two estimates for the
 * same conversation, and only the first will find the phase still at
 * 'timeline'.
 */
export async function queueEstimate(input: {
  id: string;
  conversationId: string;
}): Promise<boolean> {
  const rows = await queryStrict<{ id: string }>(
    `
    WITH moved AS (
      UPDATE quote_conversations SET phase = 'queued', updated_at = now()
      WHERE id = $2 AND phase = 'timeline'
      RETURNING id
    )
    INSERT INTO quote_estimates (id, conversation_id)
    SELECT $1, id FROM moved
    RETURNING id
    `,
    [input.id, input.conversationId],
  );
  return rows.length > 0;
}

/**
 * Claims the oldest unstarted estimate for this worker.
 *
 * FOR UPDATE SKIP LOCKED is what makes it safe to run more than one worker, or
 * to have a worker still running when the next one is triggered. Without it
 * two workers read the same queued row and the visitor gets two estimates.
 */
export async function claimEstimate(): Promise<EstimateRow | null> {
  const rows = await queryStrict<EstimateRow>(
    `
    UPDATE quote_estimates SET
      status     = 'running',
      attempts   = attempts + 1,
      updated_at = now()
    WHERE id = (
      SELECT id FROM quote_estimates
      WHERE status = 'queued'
      ORDER BY created_at
      FOR UPDATE SKIP LOCKED
      LIMIT 1
    )
    RETURNING *
    `,
  );
  return rows[0] ?? null;
}

export async function finishEstimate(input: {
  id: string;
  model: string;
  content: unknown;
  pdfPath: string;
}): Promise<void> {
  await queryStrict(
    `
    UPDATE quote_estimates SET
      status = 'ready', model = $2, content = $3::jsonb, pdf_path = $4,
      error = NULL, updated_at = now()
    WHERE id = $1
    `,
    [input.id, input.model, JSON.stringify(input.content), input.pdfPath],
  );
}

/**
 * Marks an attempt as failed.
 *
 * Back to 'queued' while there are retries left, so the next worker pass picks
 * it up, and to 'failed' once they are gone. A failed row stays visible in the
 * admin rather than disappearing: somebody was promised an estimate, and the
 * only thing worse than a late one is one nobody knows never happened.
 */
export async function failEstimate(id: string, error: string, maxAttempts: number): Promise<void> {
  await queryStrict(
    `
    UPDATE quote_estimates SET
      status     = CASE WHEN attempts >= $3 THEN 'failed' ELSE 'queued' END,
      error      = $2,
      updated_at = now()
    WHERE id = $1
    `,
    [id, error.slice(0, 2000), maxAttempts],
  );
}

export async function getEstimate(id: string): Promise<EstimateRow | null> {
  const rows = await queryStrict<EstimateRow>(
    `SELECT * FROM quote_estimates WHERE id = $1`,
    [id],
  );
  return rows[0] ?? null;
}

/** The admin queue. Newest first, whatever the status. */
export async function listEstimates(limit = 100): Promise<EstimateRow[] | null> {
  return query<EstimateRow>(
    `SELECT * FROM quote_estimates ORDER BY created_at DESC LIMIT $1`,
    [Math.min(limit, 500)],
  );
}

/**
 * A person has read it and pressed approve.
 *
 * Only a 'ready' row can be approved, so approving something that is still
 * running - or approving the same estimate twice from two open tabs - moves
 * nothing and sends nothing.
 */
export async function approveEstimate(id: string): Promise<EstimateRow | null> {
  const rows = await queryStrict<EstimateRow>(
    `
    UPDATE quote_estimates SET status = 'approved', approved_at = now(), updated_at = now()
    WHERE id = $1 AND status = 'ready'
    RETURNING *
    `,
    [id],
  );
  return rows[0] ?? null;
}

export async function markEstimateSent(id: string): Promise<void> {
  await queryStrict(
    `UPDATE quote_estimates SET status = 'sent', sent_at = now(), updated_at = now() WHERE id = $1`,
    [id],
  );
}
