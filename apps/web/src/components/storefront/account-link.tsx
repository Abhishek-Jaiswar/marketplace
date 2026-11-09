"use client"

import Link from "next/link"
import {
  useAppSelector,
  useGetMeQuery,
  useLogoutMutation,
} from "@workspace/store"

export function AccountLink() {
  const { data } = useGetMeQuery()
  const cachedUser = useAppSelector((state) => state.auth.user)
  const isAuthenticated = useAppSelector((state) => state.auth.isAuthenticated)
  const [logout] = useLogoutMutation()
  const user = isAuthenticated ? (data?.user ?? cachedUser) : null

  if (!user) {
    return (
      <Link
        href="/login"
        className="rounded-md bg-primary px-4 py-2 font-medium whitespace-nowrap text-primary-foreground"
      >
        Sign in
      </Link>
    )
  }

  return (
    <div className="flex items-center gap-3 whitespace-nowrap">
      <span className="font-medium">{user.firstName}</span>
      <button onClick={() => logout()} className="underline">
        Sign out
      </button>
    </div>
  )
}
