export function resetPasswordOtpTemplate(otp: string): string {
  return `Dear Customer,

A request has been received to reset the password for your CBS Marketplace account. To verify your request and proceed with password modification, please use the following One-Time Password (OTP):

--------------------------------------------------
Password Reset Code: ${otp}
--------------------------------------------------

Important security information:
- This OTP is valid for exactly 10 minutes from the time it was requested.
- For your security, never share this code with anyone. CBS Marketplace staff or support will never ask you for your OTP.
- If this transaction is not completed within 10 minutes, the OTP will expire and you must submit a new password reset request.

If you did not initiate this request, someone else may be attempting to access your account. We recommend that you verify your account status and change your password if necessary. If you suspect unauthorized access, please report it to our Security Operations Center immediately at security@cbsmarketplace.com.

Best regards,
The CBS Marketplace Information Security Team

--------------------------------------------------
This is an automated system email. Please do not reply to this message.
© 2026 CBS Marketplace Ltd. All rights reserved.
100 Enterprise Parkway, Suite 500, Tech City.
`
}
