import { Pool, PoolClient } from 'pg'

/**
 * =============================================================================
 * DATABASE CONNECTION HELPER
 * =============================================================================
 *
 * PostgreSQL connection pool using environment variables.
 * Uses a singleton pattern to reuse the pool across requests.
 *
 * Required env vars:
 *   POSTGRES_HOST, POSTGRES_PORT, POSTGRES_DATABASE,
 *   POSTGRES_USER, POSTGRES_PASSWORD
 *
 * =============================================================================
 */

let pool: Pool | null = null

function getPool(): Pool {
  if (!pool) {
    pool = new Pool({
      host: process.env.POSTGRES_HOST,
      port: parseInt(process.env.POSTGRES_PORT || '5432'),
      database: process.env.POSTGRES_DATABASE,
      user: process.env.POSTGRES_USER,
      password: process.env.POSTGRES_PASSWORD,
      ssl: {
        rejectUnauthorized: false, // Required for Azure PostgreSQL
      },
      max: 10,
      idleTimeoutMillis: 30000,
      connectionTimeoutMillis: 10000,
    })
  }
  return pool
}

/**
 * Execute a query with parameters
 */
export async function query<T = Record<string, unknown>>(
  text: string,
  params?: unknown[]
): Promise<T[]> {
  const pool = getPool()
  const result = await pool.query(text, params)
  return result.rows as T[]
}

/**
 * Get a client from the pool for transactions
 */
export async function getClient(): Promise<PoolClient> {
  const pool = getPool()
  return pool.connect()
}

/**
 * Initialize the database tables (run once)
 */
export async function initDatabase(): Promise<void> {
  await query(`
    CREATE TABLE IF NOT EXISTS demo_users (
      id              SERIAL PRIMARY KEY,
      email           VARCHAR(255) UNIQUE NOT NULL,
      created_at      TIMESTAMP DEFAULT NOW(),
      expires_at      TIMESTAMP NOT NULL,
      is_active       BOOLEAN DEFAULT TRUE,
      marketing_optin BOOLEAN DEFAULT FALSE
    )
  `)

  // Migration: add marketing_optin if table already exists without it
  await query(`
    ALTER TABLE demo_users ADD COLUMN IF NOT EXISTS marketing_optin BOOLEAN DEFAULT FALSE
  `)

  await query(`
    CREATE TABLE IF NOT EXISTS chat_messages (
      id          SERIAL PRIMARY KEY,
      user_email  VARCHAR(255) NOT NULL,
      role        VARCHAR(20) NOT NULL,
      content     TEXT NOT NULL,
      created_at  TIMESTAMP DEFAULT NOW()
    )
  `)

  // Create indexes if they don't exist
  await query(`
    CREATE INDEX IF NOT EXISTS idx_chat_messages_email
    ON chat_messages(user_email)
  `)

  await query(`
    CREATE INDEX IF NOT EXISTS idx_chat_messages_created
    ON chat_messages(created_at)
  `)

  await query(`
    CREATE TABLE IF NOT EXISTS feedback (
      id          SERIAL PRIMARY KEY,
      user_email  VARCHAR(255) NOT NULL,
      rating      INTEGER NOT NULL CHECK (rating BETWEEN 1 AND 5),
      comment     TEXT,
      created_at  TIMESTAMP DEFAULT NOW()
    )
  `)

  await query(`
    CREATE INDEX IF NOT EXISTS idx_feedback_email
    ON feedback(user_email)
  `)

  await query(`
    CREATE TABLE IF NOT EXISTS otp_codes (
      id         SERIAL PRIMARY KEY,
      email      VARCHAR(255) NOT NULL,
      code       VARCHAR(6) NOT NULL,
      expires_at TIMESTAMP NOT NULL,
      verified   BOOLEAN DEFAULT FALSE,
      created_at TIMESTAMP DEFAULT NOW()
    )
  `)

  await query(`
    CREATE INDEX IF NOT EXISTS idx_otp_codes_email
    ON otp_codes(email)
  `)
}
