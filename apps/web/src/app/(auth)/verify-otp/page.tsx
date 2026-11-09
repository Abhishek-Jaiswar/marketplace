import { VerifyEmailForm } from "../../../components/auth/forms"

export default async function VerifyEmailPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>
}) {
  const { email } = await searchParams
  return <VerifyEmailForm email={typeof email === "string" ? email : ""} />
}
