// lib/email.ts
import nodemailer from "nodemailer";

interface EmailOptions {
  email: string;
  subject: string;
  text: string;
  html?: string;
}

// Create a reusable transporter
const createTransporter = () => {
  // Use your Gmail credentials
  const smtpUser = process.env.SMTP_USER || "ah770643@gmail.com";
  const smtpPass = process.env.SMTP_PASS || "tzhixkiirkcpahrq";

  return nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: smtpUser,
      pass: smtpPass,
    },
    pool: true,
    maxConnections: 5,
    maxMessages: 10,
  });
};

// Main sendEmail function
export const sendEmail = async (options: EmailOptions): Promise<void> => {
  const transporter = createTransporter();
  const smtpUser = process.env.SMTP_USER || "ah770643@gmail.com";
  
  const mailOptions = {
    from: `"${process.env.EMAIL_FROM_NAME || "Your App"}" <${smtpUser}>`,
    to: options.email,
    subject: options.subject,
    text: options.text,
    html: options.html || options.text,
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log(`✅ Email sent to ${options.email}:`, info.messageId);
  } catch (error) {
    console.error(`❌ Failed to send email to ${options.email}:`, error);
    throw error;
  }
};

// Specific email template for verification
export const sendVerificationEmail = async (email: string, name: string, token: string) => {
  const baseUrl = process.env.NEXTAUTH_URL || 'http://localhost:3000';
  
  // IMPORTANT: Link directly to the API endpoint
  const verificationUrl = `${baseUrl}/api/auth/verify-email?token=${token}`;
  
  console.log(`📧 Sending verification email to ${email}`);
  console.log(`   Verification URL: ${verificationUrl}`);
  
  await sendEmail({
    email,
    subject: 'Verify your email address',
    text: `Please verify your email by clicking: ${verificationUrl}`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <h2>Welcome to Our Platform!</h2>
        <p>Hello ${name},</p>
        <p>Thank you for registering. Please verify your email address by clicking the button below:</p>
        <div style="text-align: center; margin: 30px 0;">
          <a href="${verificationUrl}" 
             style="background-color: #3b82f6; color: white; padding: 12px 24px; 
                    text-decoration: none; border-radius: 6px; font-weight: bold; 
                    display: inline-block;">
            Verify Email Address
          </a>
        </div>
        <p>Or copy and paste this link in your browser:</p>
        <p style="word-break: break-all; color: #666; background: #f3f4f6; padding: 10px; border-radius: 4px;">
          ${verificationUrl}
        </p>
        <p>This link will expire in 24 hours.</p>
        <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 30px 0;">
        <p style="font-size: 12px; color: #666;">
          If you didn't create an account, you can safely ignore this email.
        </p>
      </div>
    `,
  });
};

// Password reset email template
export const sendPasswordResetEmail = async (email: string, name: string, token: string) => {
  const baseUrl = process.env.NEXTAUTH_URL || 'http://localhost:3000';
  const resetUrl = `${baseUrl}/auth/reset-password?token=${token}`;
  
  await sendEmail({
    email,
    subject: 'Reset your password',
    text: `Reset your password by clicking: ${resetUrl}`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <h2>Password Reset Request</h2>
        <p>Hello ${name},</p>
        <p>We received a request to reset your password. Click the button below to set a new password:</p>
        <div style="text-align: center; margin: 30px 0;">
          <a href="${resetUrl}" 
             style="background-color: #3b82f6; color: white; padding: 12px 24px; 
                    text-decoration: none; border-radius: 6px; font-weight: bold; 
                    display: inline-block;">
            Reset Password
          </a>
        </div>
        <p>Or copy and paste this link in your browser:</p>
        <p style="word-break: break-all; color: #666; background: #f3f4f6; padding: 10px; border-radius: 4px;">
          ${resetUrl}
        </p>
        <p>This link will expire in 1 hour.</p>
        <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 30px 0;">
        <p style="font-size: 12px; color: #666;">
          If you didn't request a password reset, you can safely ignore this email.
        </p>
      </div>
    `,
  });
};

// Welcome email after verification
export const sendWelcomeEmail = async (email: string, name: string) => {
  await sendEmail({
    email,
    subject: 'Welcome to Our Platform!',
    text: `Welcome ${name}! Your account is now verified and ready to use.`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <h2>Welcome to Our Platform!</h2>
        <p>Hello ${name},</p>
        <p>Congratulations! Your email has been verified and your account is now fully activated.</p>
        <p>You can now login and start using all the features of our platform.</p>
        <div style="background-color: #f3f4f6; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <h3 style="margin-top: 0;">Next Steps:</h3>
          <ul>
            <li>Complete your profile</li>
            <li>Explore the dashboard</li>
            <li>Set up your preferences</li>
            <li>Invite team members</li>
          </ul>
        </div>
        <p>If you have any questions, feel free to contact our support team.</p>
        <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 30px 0;">
        <p style="font-size: 12px; color: #666;">
          Thank you for joining us!
        </p>
      </div>
    `,
  });
};