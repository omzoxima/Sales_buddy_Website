import { Pool } from 'pg'

/**
 * =============================================================================
 * POSTGRES CONNECTION (SAFE FOR NEXT.JS DEV + PROD)
 * =============================================================================
 */

const globalForPg = globalThis as unknown as {
  pgPool: Pool | undefined
}

function getPool(): Pool {
  if (!globalForPg.pgPool) {
    globalForPg.pgPool = new Pool({
      host: process.env.POSTGRES_HOST,
      port: parseInt(process.env.POSTGRES_PORT || '5432'),
      database: process.env.POSTGRES_DATABASE,
      user: process.env.POSTGRES_USER,
      password: process.env.POSTGRES_PASSWORD,
      ssl: {
        rejectUnauthorized: false, // Needed for Azure / cloud PG
      },

      // Set session timezone to IST so NOW() returns Kolkata time
      options: '-c timezone=Asia/Kolkata',

      // VERY IMPORTANT — keep low in dev
      max: 3,

      idleTimeoutMillis: 30000,
      connectionTimeoutMillis: 10000,
    })
  }

  return globalForPg.pgPool
}

/**
 * =============================================================================
 * SIMPLE QUERY FUNCTION (SAFE)
 * =============================================================================
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
 * =============================================================================
 * OPTIONAL: USE ONLY FOR TRANSACTIONS
 * (Make sure to RELEASE client after use)
 * =============================================================================
 */
export async function getClient() {
  const pool = getPool()
  return pool.connect()
}
