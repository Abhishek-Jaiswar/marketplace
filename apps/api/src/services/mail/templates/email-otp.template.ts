export function verifyEmailOtpTemplate(otp: string): string {
  return `Dear Customer,

Welcome to CBS Marketplace!

We received a request to register a new account under this email address. To complete the registration process and verify your identity, please use the following One-Time Password (OTP):

--------------------------------------------------
Verification Code: ${otp}
--------------------------------------------------

Important security information:
- This OTP is valid for exactly 10 minutes from the time it was requested.
- For your security, never share this code with anyone. CBS Marketplace staff or support will never ask you for your OTP.
- If the verification is not completed within this timeframe, the registration request will expire and you will need to restart the process.

If you did not request this registration, please ignore this email. No account has been created yet. If you have concerns about the security of your identity, please contact our Security Operations Center at security@cbsmarketplace.com.

Best regards,
The CBS Marketplace Identity & Access Management Team

--------------------------------------------------
This is an automated system email. Please do not reply to this message.
© 2026 CBS Marketplace Ltd. All rights reserved.
100 Enterprise Parkway, Suite 500, Tech City.
`
}
