import nodemailer from 'nodemailer'

/**
 * =============================================================================
 * EMAIL SERVICE (Nodemailer)
 * =============================================================================
 *
 * Sends OTP verification emails using Nodemailer with SMTP.
 *
 * Supports any SMTP provider: Gmail, Outlook, custom SMTP, etc.
 *
 * Required env vars:
 *   SMTP_HOST     (e.g. smtp.gmail.com)
 *   SMTP_PORT     (e.g. 587)
 *   SMTP_USER     (e.g. your-email@gmail.com)
 *   SMTP_PASS     (e.g. Gmail App Password)
 *   SMTP_FROM     (e.g. "SalesBuddy <your-email@gmail.com>")
 *
 * =============================================================================
 */

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || 'smtp.gmail.com',
  port: parseInt(process.env.SMTP_PORT || '587'),
  secure: process.env.SMTP_PORT === '465', // true for 465, false for 587
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
})

const FROM_EMAIL = process.env.SMTP_FROM || process.env.SMTP_USER || 'noreply@zoxima.com'

/**
 * Send a 6-digit OTP code to the user's email
 */
export async function sendOtpEmail(email: string, code: string): Promise<boolean> {
  try {
    await transporter.sendMail({
      from: FROM_EMAIL,
      to: email,
      subject: `${code} is your SalesBuddy verification code`,
      html: `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="margin:0; padding:0; background-color:#f8fafc; font-family:-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;">
  <div style="max-width:480px; margin:40px auto; background:#ffffff; border-radius:16px; overflow:hidden; box-shadow:0 4px 24px rgba(0,0,0,0.08);">
    
    <!-- Header -->
    <div style="background:linear-gradient(135deg, #6366f1 0%, #4f46e5 100%); padding:32px 32px 24px;">
      <h1 style="margin:0; color:#ffffff; font-size:22px; font-weight:700;">SalesBuddy AI</h1>
      <p style="margin:8px 0 0; color:rgba(255,255,255,0.85); font-size:14px;">Email Verification</p>
    </div>
    
    <!-- Body -->
    <div style="padding:32px;">
      <p style="margin:0 0 8px; color:#334155; font-size:16px;">Hi there,</p>
      <p style="margin:0 0 24px; color:#64748b; font-size:14px; line-height:1.6;">
        Use the verification code below to complete your sign-in. This code expires in <strong>10 minutes</strong>.
      </p>
      
      <!-- OTP Code -->
      <div style="background:#f1f5f9; border-radius:12px; padding:20px; text-align:center; margin:0 0 24px;">
        <span style="font-size:36px; font-weight:700; letter-spacing:8px; color:#1e293b; font-family:'Courier New', monospace;">
          ${code}
        </span>
      </div>
      
      <p style="margin:0 0 4px; color:#94a3b8; font-size:13px;">
        If you didn't request this code, you can safely ignore this email.
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
    console.error('Failed to send OTP email:', err)
    return false
  }
}

/**
 * Send demo expired notification email
 */
export async function sendDemoExpiredEmail(email: string): Promise<boolean> {
  try {
    await transporter.sendMail({
      from: FROM_EMAIL,
      to: email,
      subject: 'Your SalesBuddy Instant Demo Has Expired',
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
    <div style="background:linear-gradient(135deg, #ef4444 0%, #dc2626 100%); padding:32px 32px 24px;">
      <h1 style="margin:0; color:#ffffff; font-size:22px; font-weight:700;">SalesBuddy AI</h1>
      <p style="margin:8px 0 0; color:rgba(255,255,255,0.85); font-size:14px;">Demo Session Expired</p>
    </div>
    
    <!-- Body -->
    <div style="padding:32px;">
      <p style="margin:0 0 8px; color:#334155; font-size:16px;">Hi there,</p>
      <p style="margin:0 0 24px; color:#64748b; font-size:14px; line-height:1.6;">
        Your <strong>SalesBuddy AI instant demo</strong> session has expired. We hope you enjoyed exploring how SalesBuddy can transform your sales workflow!
      </p>
      
      <!-- What's Next Box -->
      <div style="background:#f0fdf4; border:1px solid #bbf7d0; border-radius:12px; padding:24px; margin:0 0 24px;">
        <h3 style="margin:0 0 12px; color:#166534; font-size:15px; font-weight:700;">🚀 What's Next?</h3>
        <ul style="margin:0; padding:0 0 0 20px; color:#15803d; font-size:14px; line-height:1.8;">
          <li><strong>Start a Free Trial</strong> — Try SalesBuddy with your own data for 7 hours</li>
          <li><strong>Talk to Sales</strong> — Get a personalized demo for your team</li>
        </ul>
      </div>

      <!-- CTA Buttons -->
      <div style="text-align:center; margin:0 0 24px;">
        <a href="https://salesbuddy.zoxima.com/signup/trial" style="display:inline-block; padding:14px 32px; background:linear-gradient(135deg, #6366f1, #4f46e5); color:#ffffff; font-weight:600; font-size:14px; text-decoration:none; border-radius:10px; margin:0 8px 8px 0;">
          Start Free Trial →
        </a>
        <a href="https://salesbuddy.zoxima.com/contact" style="display:inline-block; padding:14px 32px; background:#ffffff; color:#4f46e5; font-weight:600; font-size:14px; text-decoration:none; border-radius:10px; border:2px solid #4f46e5;">
          Contact Sales
        </a>
      </div>
      
      <p style="margin:0; color:#94a3b8; font-size:13px;">
        Questions? Reply to this email or visit our <a href="https://salesbuddy.zoxima.com/contact" style="color:#6366f1;">contact page</a>.
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
    console.error('Failed to send demo expired email:', err)
    return false
  }
}

/**
 * Send trial expired notification email
 */
export async function sendTrialExpiredEmail(email: string, name: string): Promise<boolean> {
  try {
    await transporter.sendMail({
      from: FROM_EMAIL,
      to: email,
      subject: 'Your SalesBuddy Free Trial Has Expired',
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
    <div style="background:linear-gradient(135deg, #f59e0b 0%, #d97706 100%); padding:32px 32px 24px;">
      <h1 style="margin:0; color:#ffffff; font-size:22px; font-weight:700;">SalesBuddy AI</h1>
      <p style="margin:8px 0 0; color:rgba(255,255,255,0.85); font-size:14px;">Free Trial Expired</p>
    </div>
    
    <!-- Body -->
    <div style="padding:32px;">
      <p style="margin:0 0 8px; color:#334155; font-size:16px;">Hi ${name},</p>
      <p style="margin:0 0 24px; color:#64748b; font-size:14px; line-height:1.6;">
        Your <strong>SalesBuddy AI free trial</strong> has ended. We hope you experienced the power of AI-assisted sales in Microsoft Teams!
      </p>
      
      <!-- Summary Box -->
      <div style="background:#fefce8; border:1px solid #fde68a; border-radius:12px; padding:24px; margin:0 0 24px;">
        <h3 style="margin:0 0 12px; color:#92400e; font-size:15px; font-weight:700;">⏰ Your Trial Has Ended</h3>
        <p style="margin:0; color:#a16207; font-size:14px; line-height:1.6;">
          Your Microsoft Teams credentials are no longer active. To continue using SalesBuddy AI, please upgrade to a paid plan or contact our sales team.
        </p>
      </div>

      <!-- Benefits Reminder -->
      <div style="background:#eff6ff; border:1px solid #bfdbfe; border-radius:12px; padding:24px; margin:0 0 24px;">
        <h3 style="margin:0 0 12px; color:#1e40af; font-size:15px; font-weight:700;">💡 What You'll Get with a Full License</h3>
        <ul style="margin:0; padding:0 0 0 20px; color:#1d4ed8; font-size:14px; line-height:1.8;">
          <li>Unlimited access to SalesBuddy AI in Teams</li>
          <li>Full CRM integration (Salesforce & more)</li>
          <li>Priority support & onboarding</li>
          <li>Custom configurations for your team</li>
        </ul>
      </div>

      <!-- CTA Button -->
      <div style="text-align:center; margin:0 0 24px;">
        <a href="https://salesbuddy.zoxima.com/contact" style="display:inline-block; padding:14px 40px; background:linear-gradient(135deg, #7c3aed, #6d28d9); color:#ffffff; font-weight:600; font-size:14px; text-decoration:none; border-radius:10px;">
          Talk to Sales →
        </a>
      </div>
      
      <p style="margin:0; color:#94a3b8; font-size:13px;">
        Questions? Reply to this email or visit our <a href="https://salesbuddy.zoxima.com/contact" style="color:#7c3aed;">contact page</a>.
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
    console.error('Failed to send trial expired email:', err)
    return false
  }
}
