import { query } from './db'
import nodemailer from 'nodemailer'
import { nowIST } from './timezone'

/**
 * =============================================================================
 * TRIAL CREDENTIALS SERVICE
 * =============================================================================
 *
 * Manages trial signup flow:
 * - Check if user already registered
 * - Fetch role-based credentials from PostgreSQL
 * - Send credentials email (one-time only)
 *
 * =============================================================================
 */

interface TrialCredentials {
  role: string
  username: string
  password: string
  team_link: string
  app_name: string
}

interface TrialUser {
  id: number
  email: string
  name: string
  role: string
  created_at: Date
  expires_at: Date
}

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || 'smtp.gmail.com',
  port: parseInt(process.env.SMTP_PORT || '587'),
  secure: process.env.SMTP_PORT === '465',
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
})

const FROM_EMAIL = process.env.SMTP_FROM || process.env.SMTP_USER || 'noreply@zoxima.com'

/**
 * Check if user already registered for trial
 * Returns: { registered: false } | { registered: true, expired: boolean }
 */
export async function checkTrialStatus(email: string): Promise<{
  registered: boolean
  expired?: boolean
}> {
  const rows = await query<TrialUser>(
    'SELECT * FROM trial_users WHERE email = $1',
    [email]
  )

  if (rows.length === 0) {
    return { registered: false }
  }

  const user = rows[0]
  const expired = nowIST() > new Date(user.expires_at)
  return { registered: true, expired }
}

/**
 * Fetch credentials from trial_credentials table by role
 */
export async function getCredentialsByRole(role: string): Promise<TrialCredentials | null> {
  const rows = await query<TrialCredentials>(
    'SELECT * FROM trial_credentials WHERE role = $1',
    [role]
  )
  return rows.length > 0 ? rows[0] : null
}

/**
 * Register trial user
 */
export async function createTrialUser(email: string, name: string, role: string): Promise<void> {
  await query(
    `INSERT INTO trial_users (email, name, role, expires_at)
         VALUES ($1, $2, $3, NOW() + INTERVAL '15 days')
         ON CONFLICT (email) DO NOTHING`,
    [email, name, role]
  )
}

/**
 * Send credentials email to the user
 */
export async function sendTrialCredentialsEmail(
  email: string,
  name: string,
  credentials: TrialCredentials
): Promise<boolean> {
  try {
    await transporter.sendMail({
      from: FROM_EMAIL,
      to: email,
      subject: `Your SalesBuddy Free Trial Credentials`,
      html: `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="margin:0; padding:0; background-color:#f8fafc; font-family:-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;">
  <div style="max-width:520px; margin:40px auto; background:#ffffff; border-radius:16px; overflow:hidden; box-shadow:0 4px 24px rgba(0,0,0,0.08);">
    
    <!-- Header -->
    <div style="background:linear-gradient(135deg, #7c3aed 0%, #6d28d9 100%); padding:32px 32px 24px;">
      <h1 style="margin:0; color:#ffffff; font-size:22px; font-weight:700;">🎉 Welcome to SalesBuddy AI</h1>
      <p style="margin:8px 0 0; color:rgba(255,255,255,0.85); font-size:14px;">Your Free Trial is Ready!</p>
    </div>
    
    <!-- Body -->
    <div style="padding:32px;">
      <p style="margin:0 0 8px; color:#334155; font-size:16px;">Hi ${name},</p>
      <p style="margin:0 0 24px; color:#64748b; font-size:14px; line-height:1.6;">
        Your <strong>15-day free trial</strong> has started! Here are your Microsoft Teams credentials to access SalesBuddy AI as a <strong>${credentials.role}</strong>.
      </p>
      
      <!-- Credentials Box -->
      <div style="background:#f8fafc; border:1px solid #e2e8f0; border-radius:12px; padding:24px; margin:0 0 24px;">
        <table style="width:100%; border-collapse:collapse;">
          <tr>
            <td style="padding:8px 0; color:#64748b; font-size:13px; font-weight:600; width:100px;">App Name</td>
            <td style="padding:8px 0; color:#1e293b; font-size:14px; font-weight:700;">${credentials.app_name}</td>
          </tr>
          <tr>
            <td style="padding:8px 0; color:#64748b; font-size:13px; font-weight:600;">Username</td>
            <td style="padding:8px 0; color:#1e293b; font-size:14px; font-family:'Courier New', monospace;">${credentials.username}</td>
          </tr>
          <tr>
            <td style="padding:8px 0; color:#64748b; font-size:13px; font-weight:600;">Password</td>
            <td style="padding:8px 0; color:#1e293b; font-size:14px; font-family:'Courier New', monospace;">${credentials.password}</td>
          </tr>
          <tr>
            <td style="padding:8px 0; color:#64748b; font-size:13px; font-weight:600;">Role</td>
            <td style="padding:8px 0; color:#1e293b; font-size:14px;">${credentials.role}</td>
          </tr>
        </table>
      </div>

      <!-- Team Link Button -->
      <div style="text-align:center; margin:0 0 24px;">
        <a href="${credentials.team_link}" style="display:inline-block; padding:14px 32px; background:linear-gradient(135deg, #7c3aed, #6d28d9); color:#ffffff; font-weight:600; font-size:14px; text-decoration:none; border-radius:10px;">
          Open in Microsoft Teams →
        </a>
      </div>

      <div style="background:#fefce8; border:1px solid #fde68a; border-radius:8px; padding:12px 16px; margin:0 0 16px;">
        <p style="margin:0; color:#92400e; font-size:13px;">
          ⚠️ This trial is valid for <strong>15 days</strong>. These credentials are for your use only.
        </p>
      </div>
      
      <p style="margin:0; color:#94a3b8; font-size:13px;">
        Need help? Reply to this email or visit our <a href="https://zoxima.com/contact" style="color:#7c3aed;">contact page</a>.
      </p>
    </div>
    
    <!-- Footer -->
    <div style="padding:16px 32px; background:#f8fafc; border-top:1px solid #e2e8f0;">
      <p style="margin:0; color:#94a3b8; font-size:12px; text-align:center;">
        © ${new Date().getFullYear()} Zoxima Technologies · SalesBuddy AI
      </p>
    </div>
  </div>
</body>
</html>
            `.trim(),
    })

    return true
  } catch (err) {
    console.error('Failed to send trial credentials email:', err)
    return false
  }
}
