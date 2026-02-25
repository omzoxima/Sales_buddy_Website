/**
 * =============================================================================
 * TIMEZONE UTILITIES — Asia/Kolkata (IST, UTC+5:30)
 * =============================================================================
 *
 * All timestamps in the app should use IST.
 * Import `nowIST()` wherever you need the current time.
 *
 * =============================================================================
 */

export const IST_TIMEZONE = 'Asia/Kolkata'

/**
 * Returns the current date/time adjusted to Asia/Kolkata (IST).
 *
 * JavaScript `Date` objects are always in UTC internally, so we shift
 * the UTC time by the IST offset (+5:30) to produce a Date whose
 * `.toISOString()` / `.getTime()` reflects IST.
 */
export function nowIST(): Date {
    // IST is UTC + 5 hours 30 minutes
    const now = new Date()
    const istOffsetMs = (5 * 60 + 30) * 60 * 1000
    return new Date(now.getTime() + istOffsetMs)
}

/**
 * Convert any Date to an IST-formatted string (human-readable).
 */
export function toISTString(date: Date): string {
    return date.toLocaleString('en-IN', { timeZone: IST_TIMEZONE })
}
