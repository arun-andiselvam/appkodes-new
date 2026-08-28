#!/usr/bin/env node
/**
 * Applies scripts/quote-schema.sql.
 *
 * Run it with `pnpm db:migrate`, locally and on the server, before the first
 * deploy that includes the archive. It is safe to run again: every statement
 * in the schema file is CREATE ... IF NOT EXISTS, so a second run is a no-op
 * rather than an error.
 *
 * Deliberately not a migration framework. There is one table and one file, and
 * a dependency that manages version tables would be more machinery than the
 * problem has.
 *
 * Reads DATABASE_URL from the environment or from .env.local, so it behaves
 * the same way `next dev` does without needing a flag.
 */

import { readFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import path from "node:path";
import pg from "pg";

const here = path.dirname(fileURLToPath(import.meta.url));

/** Minimal .env.local reader, so this does not pull in a dotenv dependency. */
async function loadEnvLocal() {
  if (process.env.DATABASE_URL) return;
  try {
    const raw = await readFile(path.join(here, "..", ".env.local"), "utf8");
    for (const line of raw.split("\n")) {
      const match = /^\s*([A-Z0-9_]+)\s*=\s*(.*)$/.exec(line);
      if (!match) continue;
      const [, key, value] = match;
      if (!process.env[key]) {
        process.env[key] = value.trim().replace(/^["']|["']$/g, "");
      }
    }
  } catch {
    /* No .env.local is fine; the environment may already carry it. */
  }
}

await loadEnvLocal();

const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
  console.error(
    "DATABASE_URL is not set. Add it to .env.local, or export it, then run this again.",
  );
  process.exit(1);
}

const sql = await readFile(path.join(here, "quote-schema.sql"), "utf8");

const local =
  connectionString.includes("localhost") || connectionString.includes("127.0.0.1");

const client = new pg.Client({
  connectionString,
  ssl:
    process.env.DATABASE_SSL === "disable" || local
      ? undefined
      : { rejectUnauthorized: false },
});

try {
  await client.connect();
  await client.query(sql);

  const { rows } = await client.query(
    `SELECT count(*)::int AS n FROM quote_conversations`,
  );
  console.log(`Schema applied. quote_conversations holds ${rows[0].n} row(s).`);
} catch (cause) {
  console.error("Migration failed:", cause.message);
  process.exitCode = 1;
} finally {
  await client.end();
}
