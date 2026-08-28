import "server-only";

import { Pool } from "pg";

/**
 * The Postgres connection, and everything that writes to it.
 *
 * !! UNSET DATABASE_URL IS NOT AN ERROR !!
 *
 * Same rule as every other integration on this site: no connection string
 * means the feature is absent, not that the site falls over. The assistant
 * works, enquiries still email, and nothing is recorded. That is what lets
 * somebody clone this repo and get a working site rather than a stack trace.
 *
 * !! A FAILED WRITE MUST NEVER COST A LEAD !!
 *
 * Recording a conversation is bookkeeping. Sending the enquiry is the business.
 * Every function below swallows its own errors after logging them, because a
 * visitor part way through an enquiry should not lose it to a database that
 * happens to be restarting. If the archive has a gap, that is the cheaper
 * failure by a wide margin.
 */

const connectionString = process.env.DATABASE_URL;

/**
 * One pool per process, created on first use.
 *
 * Next reloads modules freely in development, so this is stashed on
 * globalThis: without it, every hot reload opens another pool and Postgres
 * runs out of connections in about a minute.
 */
const globalForPool = globalThis as unknown as { quotePool?: Pool };

function pool() {
  if (!connectionString) return null;
  if (!globalForPool.quotePool) {
    globalForPool.quotePool = new Pool({
      connectionString,
      /* Small: this writes a row per turn, it is not a workload. */
      max: 4,
      idleTimeoutMillis: 30_000,
      /*
       * A slow connect must not hold up an answer that is already streaming.
       * Better to drop the record than to make somebody wait for it.
       */
      connectionTimeoutMillis: 4_000,
      /*
       * Managed Postgres usually terminates TLS with its own certificate.
       * DATABASE_SSL=disable turns this off for a local socket.
       */
      ssl:
        process.env.DATABASE_SSL === "disable"
          ? undefined
          : connectionString.includes("localhost") ||
              connectionString.includes("127.0.0.1")
            ? undefined
            : { rejectUnauthorized: false },
    });
  }
  return globalForPool.quotePool;
}

export function databaseConfigured() {
  return Boolean(connectionString);
}

/** Runs a query, or returns null if there is no database or it failed. */
export async function query<T>(
  text: string,
  values: unknown[] = [],
): Promise<T[] | null> {
  const client = pool();
  if (!client) return null;

  try {
    const result = await client.query(text, values);
    return result.rows as T[];
  } catch (cause) {
    console.error("[db] query failed:", cause);
    return null;
  }
}

/**
 * The same thing, except it throws.
 *
 * !! READ THE DOCTRINE AT THE TOP OF THIS FILE, THEN READ THIS EXCEPTION !!
 *
 * Everything above swallows its errors because recording a conversation is
 * bookkeeping and sending the enquiry is the business, and a visitor part way
 * through an enquiry should never lose it to a database that happens to be
 * restarting. That is still right for the archive.
 *
 * It became wrong the moment the assistant started keeping its state here.
 * A phase, a verified address, an uploaded file and a queued estimate are not
 * a record of what happened - they ARE what happened. Swallowing a failed
 * write to any of them produces the one outcome worse than an error message:
 * a visitor who verifies an address and is asked to verify it again, or who
 * is promised an estimate that was never queued and never arrives.
 *
 * So the conversational half of this file uses this, and fails loudly. The
 * routes catch it and tell somebody honestly that it did not work, which is
 * the same standard /api/quote already holds itself to when it refuses to
 * thank somebody for a message it could not deliver.
 *
 * An unconfigured database is still not an error anywhere else on this site,
 * but it is here: with no DATABASE_URL there is nowhere to keep a phase, so
 * the assistant cannot run at all. The route checks databaseConfigured() and
 * offers the scripted flow instead, exactly as it does with no API key.
 */
export async function queryStrict<T>(
  text: string,
  values: unknown[] = [],
): Promise<T[]> {
  const client = pool();
  if (!client) {
    throw new Error("DATABASE_URL is not set; the assistant needs somewhere to keep state.");
  }

  const result = await client.query(text, values);
  return result.rows as T[];
}

/* ------------------------------------------------------------------ writes */

type Answer = { field: string; label: string; value: string };
type Turn = { role: string; content: string; flag?: string };

/**
 * Records a chat turn, creating the conversation row if this is the first one.
 *
 * The whole transcript is written each time rather than appended, because the
 * browser holds the authoritative copy and posts it whole on every request
 * anyway. Rewriting a short jsonb column is cheaper than reading it back,
 * merging, and writing it again - and it means a dropped write repairs itself
 * on the next turn instead of leaving a permanent hole.
 */
export async function recordTurns(input: {
  id: string;
  placement?: string;
  transcript: Turn[];
}) {
  const offTopic = input.transcript.filter(
    (turn) => turn.role === "assistant" && turn.flag === "OFF",
  ).length;
  const turns = input.transcript.filter((turn) => turn.role === "user").length;

  await query(
    `
    INSERT INTO quote_conversations (id, placement, transcript, turns, off_topic)
    VALUES ($1, $2, $3::jsonb, $4, $5)
    ON CONFLICT (id) DO UPDATE SET
      transcript = EXCLUDED.transcript,
      turns      = EXCLUDED.turns,
      off_topic  = EXCLUDED.off_topic,
      placement  = COALESCE(quote_conversations.placement, EXCLUDED.placement),
      updated_at = now()
    `,
    [
      input.id,
      input.placement ?? null,
      JSON.stringify(input.transcript),
      turns,
      offTopic,
    ],
  );
}

/**
 * Records the enquiry itself.
 *
 * Fired from /api/quote once delivery has been attempted, so a row with a
 * submitted_at is one that actually reached the inbox.
 */
export async function recordSubmission(input: {
  id: string;
  placement?: string;
  answers: Answer[];
  brief: string;
  name: string;
  email: string;
  attachmentName?: string | null;
  attachmentBytes?: number | null;
}) {
  await query(
    `
    INSERT INTO quote_conversations
      (id, placement, answers, brief, name, email,
       attachment_name, attachment_bytes, submitted_at)
    VALUES ($1, $2, $3::jsonb, $4, $5, $6, $7, $8, now())
    ON CONFLICT (id) DO UPDATE SET
      answers          = EXCLUDED.answers,
      brief            = EXCLUDED.brief,
      name             = EXCLUDED.name,
      email            = EXCLUDED.email,
      attachment_name  = EXCLUDED.attachment_name,
      attachment_bytes = EXCLUDED.attachment_bytes,
      submitted_at     = now(),
      placement        = COALESCE(quote_conversations.placement, EXCLUDED.placement),
      updated_at       = now()
    `,
    [
      input.id,
      input.placement ?? null,
      JSON.stringify(input.answers),
      input.brief || null,
      input.name,
      input.email,
      input.attachmentName ?? null,
      input.attachmentBytes ?? null,
    ],
  );
}

/* ------------------------------------------------------------------- reads */

export type ConversationRow = {
  id: string;
  started_at: string;
  updated_at: string;
  placement: string | null;
  answers: Answer[];
  transcript: Turn[];
  brief: string | null;
  attachment_name: string | null;
  attachment_bytes: number | null;
  name: string | null;
  email: string | null;
  submitted_at: string | null;
  turns: number;
  off_topic: number;
};

/** The admin list. Nothing public reads this. */
export async function listConversations(limit = 100) {
  return query<ConversationRow>(
    `SELECT * FROM quote_conversations ORDER BY updated_at DESC LIMIT $1`,
    [Math.min(limit, 500)],
  );
}

export async function getConversation(id: string) {
  const rows = await query<ConversationRow>(
    `SELECT * FROM quote_conversations WHERE id = $1`,
    [id],
  );
  return rows?.[0] ?? null;
}
