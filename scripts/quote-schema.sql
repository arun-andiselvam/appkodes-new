-- Conversations with the quote assistant.
--
-- Applied by scripts/db-migrate.mjs, which is safe to run repeatedly. Every
-- statement here has to stay idempotent for that to hold.
--
-- !! THIS TABLE HOLDS PERSONAL DATA !!
--
-- Names, email addresses, and whatever somebody typed about their business
-- while deciding whether to trust us. Three things follow from that, and none
-- of them are optional:
--
--   * The admin view is behind a password and is never indexed.
--   * Nothing here is read by any public route. Writes go one way.
--   * There is still no privacy policy on this site. content/footer.ts has
--     said Privacy and Terms belong in the footer since before this table
--     existed; storing conversation text is what turns that from untidy into
--     something worth fixing.
--
-- No IP address is stored. It would be the obvious thing to add and it buys
-- almost nothing here: the rate limit already works from it in memory, and
-- keeping it turns a lead record into a tracking record.

CREATE TABLE IF NOT EXISTS quote_conversations (
  -- Generated in the browser when the modal opens, so the scripted answers and
  -- the chat turns from one visit land on the same row. Not a secret and not
  -- trusted for anything: worst case somebody posts a colliding id and muddles
  -- their own record.
  id              uuid PRIMARY KEY,

  started_at      timestamptz NOT NULL DEFAULT now(),
  updated_at      timestamptz NOT NULL DEFAULT now(),

  -- Which button on which page opened it. Matches QuotePlacement in
  -- lib/analytics.ts, kept as text rather than an enum so a new placement is
  -- not a migration.
  placement       text,

  -- The scripted answers, newest write wins: [{field,label,value}, ...]
  answers         jsonb NOT NULL DEFAULT '[]'::jsonb,

  -- The chat, appended turn by turn: [{role,content,flag}, ...]
  transcript      jsonb NOT NULL DEFAULT '[]'::jsonb,

  brief           text,
  attachment_name text,
  attachment_bytes integer,

  -- Null until the enquiry is actually sent. A row with a null email is
  -- somebody who walked away, which is the set worth reading.
  name            text,
  email           text,
  submitted_at    timestamptz,

  -- Rolling counts, so the list can be sorted without unpacking jsonb.
  turns           integer NOT NULL DEFAULT 0,
  off_topic       integer NOT NULL DEFAULT 0
);

-- The list view sorts by most recent, and the admin filters on whether an
-- enquiry was ever sent.
CREATE INDEX IF NOT EXISTS quote_conversations_updated_idx
  ON quote_conversations (updated_at DESC);

CREATE INDEX IF NOT EXISTS quote_conversations_submitted_idx
  ON quote_conversations (submitted_at DESC NULLS LAST);


-- ===========================================================================
-- The conversational assistant. Added 27 August 2026.
-- ===========================================================================
--
-- The columns above describe a visitor who tapped through a scripted form. The
-- ones below describe a visitor who had a conversation, and the difference is
-- not cosmetic: the scripted flow could be held in the browser and posted at
-- the end, because nothing it collected was worth lying about. This one
-- collects a verified email address, uploaded documents and a promise to send
-- a priced estimate, so where it has got to has to be a fact the server owns.
--
-- !! THE PHASE LIVES HERE BECAUSE THE BROWSER MUST NOT BE ABLE TO SET IT !!
--
-- The old chat route is stateless and trusts the transcript the browser posts
-- back, which is fine when the worst outcome is somebody buying themselves an
-- extra turn. It is not fine now. A client that could put itself into the
-- verified phase would skip the OTP entirely, and the whole point of the OTP
-- is that the address on the estimate is one somebody can actually receive.

ALTER TABLE quote_conversations
  -- Where this conversation has got to. See PHASES in lib/quote-session.ts;
  -- text rather than an enum so adding a step is not a migration, matching the
  -- reasoning on `placement` above.
  ADD COLUMN IF NOT EXISTS phase text NOT NULL DEFAULT 'greeting',

  -- 'student' or 'lead', once the assistant has worked out which. Null while
  -- it still does not know, which is a real state and not a missing value:
  -- the opening question exists to resolve it.
  ADD COLUMN IF NOT EXISTS visitor_kind text,

  -- Which service they picked, or 'other'. Free text, because the "something
  -- else" branch means the interesting answers are the ones not on the list.
  ADD COLUMN IF NOT EXISTS service text,

  -- The address the OTP was actually confirmed against.
  --
  -- !! DELIBERATELY NOT THE `email` COLUMN ABOVE !!
  --
  -- That one is whatever somebody typed into the scripted form's last step and
  -- nobody ever checked. Storing a verified address in the same column would
  -- make the two indistinguishable a week later, and the estimate job decides
  -- who to email from this one. An address is in here only if a code sent to
  -- it came back.
  ADD COLUMN IF NOT EXISTS verified_email text,
  ADD COLUMN IF NOT EXISTS verified_at timestamptz,

  -- Their WhatsApp number, if they gave one.
  --
  -- Asked alongside the email verification and explicitly optional: the line
  -- offered is that it speeds the process up, which is true - a question about
  -- an ambiguous requirement answered in an hour on WhatsApp beats one that
  -- waits a day for an email reply. Refusing it must never block anything, so
  -- nothing downstream is allowed to require this column.
  ADD COLUMN IF NOT EXISTS whatsapp text,

  -- Asked after the brief and the files, in that order, on the same reasoning
  -- the scripted flow gives for putting the brief before the budget: somebody
  -- who has described their problem answers the money question, and somebody
  -- asked cold closes the tab.
  ADD COLUMN IF NOT EXISTS budget text,
  ADD COLUMN IF NOT EXISTS timeline text;

-- Finding the conversations that are mid-flow, for the admin and for anything
-- that ever wants to chase an abandoned one.
CREATE INDEX IF NOT EXISTS quote_conversations_phase_idx
  ON quote_conversations (phase, updated_at DESC);


-- ---------------------------------------------------------------- the OTP --
--
-- One row per code sent. Rows are kept after use rather than deleted, because
-- "this address was verified at this time" is the evidence behind every
-- estimate that goes out, and a resend history is what tells you whether a
-- flow is failing people or being probed.
--
-- !! THE CODE IS STORED AS A HASH, NOT AS THE CODE !!
--
-- A six digit number in a table anybody with a database connection can read is
-- not a verification of anything. It is hashed with a server-side pepper (see
-- lib/quote-otp.ts), so the table alone does not let somebody verify an
-- address they do not own.

CREATE TABLE IF NOT EXISTS quote_otps (
  id              uuid PRIMARY KEY,
  conversation_id uuid NOT NULL REFERENCES quote_conversations (id) ON DELETE CASCADE,

  -- Lowercased and trimmed before it lands here, so a resend to "Bob@x.com"
  -- and one to "bob@x.com" are the same address rather than two.
  email           text NOT NULL,

  code_hash       text NOT NULL,

  sent_at         timestamptz NOT NULL DEFAULT now(),
  expires_at      timestamptz NOT NULL,

  -- Wrong guesses against this code. The verify route refuses past a ceiling,
  -- which is what stops somebody walking a six digit space.
  attempts        integer NOT NULL DEFAULT 0,

  -- Set when the right code arrives. A consumed code is dead: replaying it
  -- must not re-verify anything.
  consumed_at     timestamptz
);

-- The verify route always wants the newest unconsumed code for a conversation.
CREATE INDEX IF NOT EXISTS quote_otps_conversation_idx
  ON quote_otps (conversation_id, sent_at DESC);

-- The resend cooldown counts recent sends to one address, across conversations
-- so a new conversation id is not a way around it.
CREATE INDEX IF NOT EXISTS quote_otps_email_idx
  ON quote_otps (email, sent_at DESC);


-- ------------------------------------------------------------ the uploads --
--
-- Metadata only. The bytes are on disk, under QUOTE_UPLOAD_DIR, because this
-- database is dumped and a few requirement documents per lead would make every
-- backup carry them. See lib/quote-uploads.ts for the storage rules.
--
-- !! stored_path IS WRITTEN BY THE SERVER AND NEVER BY A REQUEST !!
--
-- It is built from this row's own id, not from the name the browser sent. A
-- filename is attacker-controlled text and treating one as a path is how a
-- directory traversal happens; `filename` below is kept only to show a person
-- what they uploaded.

CREATE TABLE IF NOT EXISTS quote_files (
  id              uuid PRIMARY KEY,
  conversation_id uuid NOT NULL REFERENCES quote_conversations (id) ON DELETE CASCADE,

  -- What the visitor called it. Display only. Never joined onto a path.
  filename        text NOT NULL,
  mime            text,
  bytes           integer NOT NULL,

  -- Relative to QUOTE_UPLOAD_DIR, so moving the volume does not invalidate
  -- every row.
  stored_path     text NOT NULL,

  -- Text pulled out of the document for the estimate prompt, where that is
  -- possible. Null for a format nothing here can read - an image, say - which
  -- the estimate job is told about rather than left to guess at.
  extracted_text  text,

  uploaded_at     timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS quote_files_conversation_idx
  ON quote_files (conversation_id, uploaded_at);


-- ----------------------------------------------------------- the estimate --
--
-- One row per estimate the assistant promised. It is a job queue and an audit
-- trail in one table, which is the right size for this: there is no queue on
-- this droplet, the work is a single model call per lead, and a table that
-- something polls is less machinery than a broker for a workload measured in
-- leads per day.
--
-- !! NOTHING REACHES THE VISITOR WITHOUT approved_at BEING SET BY A PERSON !!
--
-- Decided with the client on 27 August 2026. Every piece of copy on this site
-- refuses to state a price - content/quote-flow.ts says so in capitals, and
-- contactFaqs says nobody can price work they have not looked at. An estimate
-- generated by a model and emailed unread would be that discipline abandoned
-- by accident. So the job writes, a person reads, and only then does it send.
-- The visitor was told it would take some time, which is what buys the room
-- for that.

CREATE TABLE IF NOT EXISTS quote_estimates (
  id              uuid PRIMARY KEY,
  conversation_id uuid NOT NULL REFERENCES quote_conversations (id) ON DELETE CASCADE,

  -- queued   - the visitor finished; nothing has run yet.
  -- running  - a worker has claimed it.
  -- ready    - the model returned and the PDF is written. Waiting on a person.
  -- approved - a person pressed approve. The sender will pick it up.
  -- sent     - it reached the visitor.
  -- failed   - it did not work, `error` says what happened, `attempts` says
  --            how many times. Failure is visible in the admin rather than
  --            silent, because a lead who was promised an estimate and got
  --            nothing is worse than one who was never promised it.
  status          text NOT NULL DEFAULT 'queued',

  -- Which model wrote it, recorded per row. QUOTE_ESTIMATE_MODEL can change
  -- between one estimate and the next, and comparing two of them later is
  -- impossible if the row does not say what produced it.
  model           text,

  -- The estimate as structured data: phases, effort, cost, assumptions,
  -- exclusions. The PDF is rendered from this, so a person can correct a
  -- number in the admin without the document and the record disagreeing.
  content         jsonb,

  -- Relative to QUOTE_UPLOAD_DIR, same rule as quote_files.
  pdf_path        text,

  attempts        integer NOT NULL DEFAULT 0,
  error           text,

  created_at      timestamptz NOT NULL DEFAULT now(),
  updated_at      timestamptz NOT NULL DEFAULT now(),
  approved_at     timestamptz,
  sent_at         timestamptz
);

-- The worker claims the oldest queued row; the admin lists what is waiting.
CREATE INDEX IF NOT EXISTS quote_estimates_status_idx
  ON quote_estimates (status, created_at);

CREATE INDEX IF NOT EXISTS quote_estimates_conversation_idx
  ON quote_estimates (conversation_id, created_at DESC);
