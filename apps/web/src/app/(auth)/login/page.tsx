import { LoginForm } from "../../../components/auth/forms"

const notices: Record<string, string> = {
  verified: "Your email is verified. Sign in to continue.",
  reset: "Your password has been changed. Sign in with the new one.",
}

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>
}) {
  const params = await searchParams
  const key = Object.keys(notices).find((name) => params[name] === "true")
  return <LoginForm notice={key ? notices[key] : undefined} />
}
