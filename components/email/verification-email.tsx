// app/components/email/verification-email.tsx (for reference)
export function VerificationEmailTemplate({ name, verificationLink }: { name: string; verificationLink: string }) {
  return `
    <!DOCTYPE html>
    <html>
      <body>
        <h1>Verify Your Email</h1>
        <p>Hello ${name},</p>
        <p>Please verify your email address by clicking the link below:</p>
        <a href="${verificationLink}">Verify Email</a>
        <p>This link will expire in 24 hours.</p>
      </body>
    </html>
  `;
}