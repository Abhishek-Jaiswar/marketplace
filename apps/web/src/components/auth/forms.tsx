"use client"

import { useState, type FormEvent, type ReactNode } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import {
  getApiErrorMessage,
  useForgotPasswordMutation,
  useLoginMutation,
  useRegisterMutation,
  useResendOtpMutation,
  useResetPasswordMutation,
  useVerifyOtpMutation,
} from "@workspace/store"
import { Button } from "@workspace/ui/components/button"
import { Field } from "@workspace/ui/components/field"
import { Input } from "@workspace/ui/components/input"
import { brand } from "@workspace/ui/lib/brand"

const MIN_PASSWORD_LENGTH = 8

const withEmail = (path: string, email: string) =>
  `${path}?email=${encodeURIComponent(email)}`

function FormShell({
  title,
  description,
  notice,
  error,
  footer,
  onSubmit,
  children,
}: {
  title: string
  description?: ReactNode
  notice?: string | undefined
  error?: string | undefined
  footer?: ReactNode
  onSubmit: (event: FormEvent<HTMLFormElement>) => void
  children: ReactNode
}) {
  return (
    <>
      <h1 className="text-xl font-semibold">{title}</h1>
      {description ? (
        <p className="mt-1 text-muted-foreground">{description}</p>
      ) : null}
      {notice ? <p className="mt-4 text-success">{notice}</p> : null}
      {error ? (
        <p role="alert" className="mt-4 text-destructive">
          {error}
        </p>
      ) : null}
      <form onSubmit={onSubmit} className="mt-6 flex flex-col gap-4">
        {children}
      </form>
      {footer ? <div className="mt-6">{footer}</div> : null}
    </>
  )
}

function Submit({
  isLoading,
  children,
}: {
  isLoading: boolean
  children: ReactNode
}) {
  return (
    <Button type="submit" variant="action" size="lg" disabled={isLoading}>
      {children}
    </Button>
  )
}

export function LoginForm({ notice }: { notice?: string | undefined }) {
  const router = useRouter()
  const [login, { isLoading }] = useLoginMutation()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState<string>()

  const submit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setError(undefined)
    try {
      await login({ email: email.trim(), password }).unwrap()
      router.push("/")
    } catch (failure) {
      const message = getApiErrorMessage(
        failure,
        "Could not sign in. Try again."
      )
      if (/verif/i.test(message)) {
        router.push(withEmail("/verify-otp", email.trim()))
      } else {
        setError(message)
      }
    }
  }

  return (
    <FormShell
      title="Sign in"
      notice={notice}
      error={error}
      onSubmit={submit}
      footer={
        <div className="flex justify-between gap-4">
          <Link href="/register" className="underline">
            Create account
          </Link>
          <Link href="/forgot-password" className="underline">
            Forgot password
          </Link>
        </div>
      }
    >
      <Field label="Email">
        <Input
          type="email"
          autoComplete="email"
          required
          value={email}
          onChange={(event) => setEmail(event.target.value)}
        />
      </Field>
      <Field label="Password">
        <Input
          type="password"
          autoComplete="current-password"
          required
          value={password}
          onChange={(event) => setPassword(event.target.value)}
        />
      </Field>
      <Submit isLoading={isLoading}>Sign in</Submit>
    </FormShell>
  )
}

export function RegisterForm() {
  const router = useRouter()
  const [register, { isLoading }] = useRegisterMutation()
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
  })
  const [error, setError] = useState<string>()
  const set = (key: keyof typeof form) => (value: string) =>
    setForm((current) => ({ ...current, [key]: value }))

  const submit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setError(undefined)
    try {
      const email = form.email.trim()
      await register({ ...form, email }).unwrap()
      router.push(withEmail("/verify-otp", email))
    } catch (failure) {
      setError(getApiErrorMessage(failure, "Could not create your account."))
    }
  }

  return (
    <FormShell
      title="Create your account"
      description={`Shop from sellers across India on ${brand.name}.`}
      error={error}
      onSubmit={submit}
      footer={
        <Link href="/login" className="underline">
          Sign in instead
        </Link>
      }
    >
      <div className="grid grid-cols-2 gap-4">
        <Field label="First name">
          <Input
            autoComplete="given-name"
            required
            value={form.firstName}
            onChange={(event) => set("firstName")(event.target.value)}
          />
        </Field>
        <Field label="Last name">
          <Input
            autoComplete="family-name"
            required
            value={form.lastName}
            onChange={(event) => set("lastName")(event.target.value)}
          />
        </Field>
      </div>
      <Field label="Email">
        <Input
          type="email"
          autoComplete="email"
          required
          value={form.email}
          onChange={(event) => set("email")(event.target.value)}
        />
      </Field>
      <Field label="Password" hint="Use at least 8 characters.">
        <Input
          type="password"
          autoComplete="new-password"
          required
          minLength={MIN_PASSWORD_LENGTH}
          value={form.password}
          onChange={(event) => set("password")(event.target.value)}
        />
      </Field>
      <Submit isLoading={isLoading}>Create account</Submit>
    </FormShell>
  )
}

function CodeField({
  value,
  onChange,
}: {
  value: string
  onChange: (value: string) => void
}) {
  return (
    <Field label="6-digit code">
      <Input
        inputMode="numeric"
        autoComplete="one-time-code"
        required
        minLength={6}
        maxLength={6}
        pattern="[0-9]{6}"
        className="tabular-nums"
        value={value}
        onChange={(event) => onChange(event.target.value)}
      />
    </Field>
  )
}

export function VerifyEmailForm({ email }: { email: string }) {
  const router = useRouter()
  const [verify, { isLoading }] = useVerifyOtpMutation()
  const [resend, { isLoading: isResending }] = useResendOtpMutation()
  const [otp, setOtp] = useState("")
  const [error, setError] = useState<string>()
  const [notice, setNotice] = useState<string>()

  const submit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setError(undefined)
    try {
      await verify({ email, otp }).unwrap()
      router.push("/login?verified=true")
    } catch (failure) {
      setError(getApiErrorMessage(failure, "Could not verify that code."))
    }
  }

  const sendAgain = async () => {
    setError(undefined)
    try {
      await resend({ email }).unwrap()
      setNotice("We sent a new code.")
    } catch (failure) {
      setError(getApiErrorMessage(failure, "Could not send a new code."))
    }
  }

  return (
    <FormShell
      title="Verify your email"
      description={`Enter the code we sent to ${email}.`}
      notice={notice}
      error={error}
      onSubmit={submit}
      footer={
        <button
          type="button"
          onClick={sendAgain}
          disabled={isResending}
          className="underline"
        >
          Send a new code
        </button>
      }
    >
      <CodeField value={otp} onChange={setOtp} />
      <Submit isLoading={isLoading}>Verify email</Submit>
    </FormShell>
  )
}

export function ForgotPasswordForm() {
  const router = useRouter()
  const [forgot, { isLoading }] = useForgotPasswordMutation()
  const [email, setEmail] = useState("")
  const [error, setError] = useState<string>()

  const submit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setError(undefined)
    try {
      await forgot({ email: email.trim() }).unwrap()
      router.push(withEmail("/reset-password", email.trim()))
    } catch (failure) {
      setError(getApiErrorMessage(failure, "Could not send a reset code."))
    }
  }

  return (
    <FormShell
      title="Reset your password"
      description="We will email you a code."
      error={error}
      onSubmit={submit}
      footer={
        <Link href="/login" className="underline">
          Back to sign in
        </Link>
      }
    >
      <Field label="Email">
        <Input
          type="email"
          autoComplete="email"
          required
          value={email}
          onChange={(event) => setEmail(event.target.value)}
        />
      </Field>
      <Submit isLoading={isLoading}>Send code</Submit>
    </FormShell>
  )
}

export function ResetPasswordForm({ email }: { email: string }) {
  const router = useRouter()
  const [reset, { isLoading }] = useResetPasswordMutation()
  const [otp, setOtp] = useState("")
  const [newPassword, setNewPassword] = useState("")
  const [error, setError] = useState<string>()

  const submit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setError(undefined)
    try {
      await reset({ email, otp, newPassword }).unwrap()
      router.push("/login?reset=true")
    } catch (failure) {
      setError(getApiErrorMessage(failure, "Could not reset your password."))
    }
  }

  return (
    <FormShell
      title="Choose a new password"
      description={`Enter the code we sent to ${email}.`}
      error={error}
      onSubmit={submit}
    >
      <CodeField value={otp} onChange={setOtp} />
      <Field label="New password" hint="Use at least 8 characters.">
        <Input
          type="password"
          autoComplete="new-password"
          required
          minLength={MIN_PASSWORD_LENGTH}
          value={newPassword}
          onChange={(event) => setNewPassword(event.target.value)}
        />
      </Field>
      <Submit isLoading={isLoading}>Reset password</Submit>
    </FormShell>
  )
}
