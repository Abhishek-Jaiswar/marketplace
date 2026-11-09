import { ResetPasswordForm } from "../../../components/auth/forms"

export default async function ResetPasswordPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>
}) {
  const { email } = await searchParams
  return <ResetPasswordForm email={typeof email === "string" ? email : ""} />
}
