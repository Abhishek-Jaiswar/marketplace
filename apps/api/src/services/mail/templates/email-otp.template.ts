export function verifyEmailOtpTemplate(otp: string): string {
  return `Hi,

Your verification code for CBS Marketplace is:

${otp}

This code will expire in 10 minutes.

If you didn't request this code, you can safely ignore this email.

Thanks,
CBS Marketplace`
}

