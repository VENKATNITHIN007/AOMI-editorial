/** @file Email templates for AOMI
 * Contains HTML and plain text templates for various email types
 */

export interface EmailTemplate {
  subject: string;
  html: string;
  text: string;
}

/**
 * Generates email verification template
 */
export const getVerificationEmailTemplate = (
  token: string,
  baseUrl: string
): EmailTemplate => {
  const verificationUrl = `${baseUrl}/verify-email?token=${token}`;

  const subject = "Verify your AOMI account";

  const html = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Verify your AOMI account</title>
  <style>
    body {
      margin: 0;
      padding: 0;
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
      background-color: #ffffff;
      color: #1a1a1a;
    }
    .container {
      max-width: 600px;
      margin: 0 auto;
      padding: 60px 20px;
    }
    .logo {
      text-align: center;
      margin-bottom: 48px;
    }
    .logo-text {
      font-size: 24px;
      font-weight: 900;
      color: #000000;
      letter-spacing: 0.3em;
      text-transform: uppercase;
    }
    h1 {
      font-size: 32px;
      font-weight: 300;
      color: #000000;
      margin: 0 0 24px 0;
      text-align: center;
      font-style: italic;
    }
    p {
      font-size: 16px;
      line-height: 1.8;
      color: #666666;
      margin: 0 0 32px 0;
      text-align: center;
      letter-spacing: 0.02em;
    }
    .button-container {
      text-align: center;
      margin: 48px 0;
    }
    .button {
      display: inline-block;
      background-color: #000000;
      color: #ffffff !important;
      text-decoration: none;
      padding: 20px 40px;
      font-size: 11px;
      font-weight: 900;
      text-transform: uppercase;
      letter-spacing: 0.4em;
    }
    .footer {
      text-align: center;
      margin-top: 80px;
      padding-top: 32px;
      border-top: 1px solid #f0f0f0;
    }
    .footer p {
      font-size: 10px;
      color: #999999;
      text-transform: uppercase;
      letter-spacing: 0.2em;
      margin: 0;
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="logo">
      <span class="logo-text">ΛOMI</span>
    </div>
    
    <h1>Welcome to the Studio.</h1>
    
    <p>Thanks for joining AOMI. We're an elite community of visual storytellers. Please verify your email to launch your professional studio.</p>
    
    <div class="button-container">
      <a href="${verificationUrl}" class="button">Verify Account</a>
    </div>
    
    <div class="footer">
      <p>© ${new Date().getFullYear()} AOMI Editorial. All rights reserved.</p>
      <p style="margin-top: 12px;">The premier platform for professional photographers.</p>
    </div>
  </div>
</body>
</html>
  `.trim();

  const text = `
Verify your AOMI account

Welcome to AOMI. Please verify your email address to complete your registration:

${verificationUrl}

This verification link will expire in 24 hours.

If you didn't create an account with AOMI, you can safely ignore this email.

© ${new Date().getFullYear()} AOMI Editorial. All rights reserved.
  `.trim();

  return { subject, html, text };
};

/**
 * Generates password reset template
 */
export const getPasswordResetTemplate = (
  token: string,
  baseUrl: string
): EmailTemplate => {
  const resetUrl = `${baseUrl}/reset-password?token=${token}`;

  const subject = "Reset your AOMI password";

  const html = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Reset your AOMI password</title>
  <style>
    body {
      margin: 0;
      padding: 0;
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
      background-color: #ffffff;
      color: #1a1a1a;
    }
    .container {
      max-width: 600px;
      margin: 0 auto;
      padding: 60px 20px;
    }
    .logo {
      text-align: center;
      margin-bottom: 48px;
    }
    .logo-text {
      font-size: 24px;
      font-weight: 900;
      color: #000000;
      letter-spacing: 0.3em;
      text-transform: uppercase;
    }
    h1 {
      font-size: 32px;
      font-weight: 300;
      color: #000000;
      margin: 0 0 24px 0;
      text-align: center;
      font-style: italic;
    }
    p {
      font-size: 16px;
      line-height: 1.8;
      color: #666666;
      margin: 0 0 32px 0;
      text-align: center;
      letter-spacing: 0.02em;
    }
    .button-container {
      text-align: center;
      margin: 48px 0;
    }
    .button {
      display: inline-block;
      background-color: #000000;
      color: #ffffff !important;
      text-decoration: none;
      padding: 20px 40px;
      font-size: 11px;
      font-weight: 900;
      text-transform: uppercase;
      letter-spacing: 0.4em;
    }
    .footer {
      text-align: center;
      margin-top: 80px;
      padding-top: 32px;
      border-top: 1px solid #f0f0f0;
    }
    .footer p {
      font-size: 10px;
      color: #999999;
      text-transform: uppercase;
      letter-spacing: 0.2em;
      margin: 0;
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="logo">
      <span class="logo-text">ΛOMI</span>
    </div>
    
    <h1>Reset Security.</h1>
    
    <p>We received a request to reset your AOMI password. Click the button below to establish a new credential.</p>
    
    <div class="button-container">
      <a href="${resetUrl}" class="button">Reset Password</a>
    </div>
    
    <div class="footer">
      <p>© ${new Date().getFullYear()} AOMI Editorial. All rights reserved.</p>
      <p style="margin-top: 12px;">Securing your professional creative space.</p>
    </div>
  </div>
</body>
</html>
  `.trim();

  const text = `
Reset your AOMI password

We received a request to reset your AOMI password. Visit the link below to create a new password:

${resetUrl}

This reset link will expire in 1 hour.

If you didn't request a password reset, please ignore this email.

© ${new Date().getFullYear()} AOMI Editorial. All rights reserved.
  `.trim();

  return { subject, html, text };
};
