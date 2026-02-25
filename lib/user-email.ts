/**
 * =============================================================================
 * USER EMAIL UTILITY
 * =============================================================================
 *
 * Uses localStorage to persist user email for identification.
 * All status (demo/trial/active/expired) comes from the database API.
 *
 * =============================================================================
 */

/**
 * Get the saved user email from localStorage
 */
export function getUserEmail(): string | null {
    if (typeof window === 'undefined') return null
    return localStorage.getItem('user_email')
}

/**
 * Save the user email to localStorage
 */
export function setUserEmail(email: string): void {
    if (typeof window === 'undefined') return
    localStorage.setItem('user_email', email)
}

/**
 * Remove the user email from localStorage
 */
export function clearUserEmail(): void {
    if (typeof window === 'undefined') return
    localStorage.removeItem('user_email')
}
