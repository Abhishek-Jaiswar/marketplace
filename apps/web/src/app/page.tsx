"use client";

import Image from "next/image";
import { useState } from "react";
import {
  useAppDispatch,
  useAppSelector,
  increment,
  decrement,
} from "@workspace/store";
import { useGetUsersQuery, useCreateUserMutation } from "../lib/features/usersApi";

export default function Home() {
  const dispatch = useAppDispatch();
  const counterValue = useAppSelector((state) => state.counter.value);

  // RTK Query hooks
  const { data: users = [], isLoading, error: fetchError } = useGetUsersQuery();
  const [createUser, { isLoading: isCreating, error: createError }] = useCreateUserMutation();

  // Form state
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [formFeedback, setFormFeedback] = useState<{ type: "success" | "error"; message: string } | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormFeedback(null);

    if (!email) {
      setFormFeedback({ type: "error", message: "Email is required." });
      return;
    }

    try {
      await createUser({ name, email }).unwrap();
      setFormFeedback({ type: "success", message: `User "${name || email}" created successfully!` });
      setName("");
      setEmail("");
    } catch (err: any) {
      console.error("Failed to create user:", err);
      setFormFeedback({
        type: "error",
        message: err.data?.error || err.message || "Failed to create user.",
      });
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-[#09090b] text-[#f4f4f5] font-sans antialiased selection:bg-teal-500 selection:text-black">
      {/* Glow effects */}
      <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-teal-500/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-10 right-1/4 w-[400px] h-[400px] bg-purple-500/10 rounded-full blur-[120px] pointer-events-none" />

      <main className="flex-1 flex flex-col items-center justify-center p-6 md:p-12 relative z-10 w-full max-w-6xl mx-auto">
        <div className="w-full grid md:grid-cols-12 gap-8 items-start">
          {/* Left panel: Info & Redux Counter Demo (4 cols) */}
          <div className="md:col-span-5 space-y-6">
            <div className="bg-white/[0.02] border border-white/[0.06] rounded-3xl p-6 shadow-2xl backdrop-blur-xl">
              <div className="flex items-center gap-3 mb-6">
                <div className="relative w-7 h-7">
                  <Image
                    src="/next.svg"
                    alt="Next.js"
                    fill
                    className="invert opacity-90"
                  />
                </div>
                <h1 className="text-lg font-bold tracking-tight bg-gradient-to-r from-teal-400 to-emerald-400 bg-clip-text text-transparent">
                  CBS Marketplace
                </h1>
              </div>

              <h2 className="text-2xl font-extrabold tracking-tight text-white mb-3">
                Redux & RTK Query
              </h2>
              <p className="text-xs md:text-sm text-zinc-400 leading-relaxed mb-4">
                Now using a shared Redux store from 
                <code className="text-teal-400 bg-zinc-900/60 px-1 py-0.5 rounded font-mono text-xs ml-1">@workspace/store</code>.
                State is managed globally and fetched client-side with RTK Query.
              </p>
            </div>

            {/* Counter Demo Card */}
            <div className="bg-white/[0.02] border border-white/[0.06] rounded-3xl p-6 shadow-2xl backdrop-blur-xl">
              <h3 className="text-xs font-semibold text-zinc-500 uppercase tracking-widest mb-4">
                Redux Counter Slice
              </h3>
              <div className="flex items-center justify-between bg-zinc-900/40 border border-white/[0.04] p-4 rounded-2xl">
                <div>
                  <p className="text-[10px] text-zinc-500 uppercase font-bold tracking-wider">Current Value</p>
                  <p className="text-2xl font-bold font-mono text-white mt-1">{counterValue}</p>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => dispatch(decrement())}
                    className="w-10 h-10 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] active:bg-white/[0.12] border border-white/[0.06] flex items-center justify-center text-zinc-300 font-bold transition-all"
                  >
                    -
                  </button>
                  <button
                    onClick={() => dispatch(increment())}
                    className="w-10 h-10 rounded-xl bg-teal-500/10 hover:bg-teal-500/20 active:bg-teal-500/30 border border-teal-500/20 flex items-center justify-center text-teal-400 font-bold transition-all"
                  >
                    +
                  </button>
                </div>
              </div>
            </div>

            {/* Create User Form */}
            <div className="bg-white/[0.02] border border-white/[0.06] rounded-3xl p-6 shadow-2xl backdrop-blur-xl">
              <h3 className="text-xs font-semibold text-zinc-500 uppercase tracking-widest mb-4">
                Add New User
              </h3>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-[10px] text-zinc-400 font-semibold uppercase tracking-wider mb-1">
                    Name
                  </label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Enter name"
                    className="w-full bg-zinc-900/60 border border-white/[0.06] rounded-xl px-4 py-2 text-sm text-white focus:outline-none focus:border-teal-500/50 transition-colors"
                  />
                </div>
                <div>
                  <label className="block text-[10px] text-zinc-400 font-semibold uppercase tracking-wider mb-1">
                    Email *
                  </label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="name@example.com"
                    required
                    className="w-full bg-zinc-900/60 border border-white/[0.06] rounded-xl px-4 py-2 text-sm text-white focus:outline-none focus:border-teal-500/50 transition-colors"
                  />
                </div>

                {formFeedback && (
                  <div
                    className={`p-3 rounded-xl text-xs border ${
                      formFeedback.type === "success"
                        ? "bg-teal-500/10 border-teal-500/20 text-teal-400"
                        : "bg-red-500/10 border-red-500/20 text-red-400"
                    }`}
                  >
                    {formFeedback.message}
                  </div>
                )}

                {createError && (
                  <div className="bg-red-500/10 border border-red-500/20 text-red-400 rounded-xl p-3 text-xs">
                    Failed to save:{" "}
                    {"status" in createError
                      ? JSON.stringify(createError.data)
                      : createError.message}
                  </div>
                )}

                <button
                  type="submit"
                  disabled={isCreating}
                  className="w-full bg-teal-500 text-black font-semibold text-sm py-2.5 rounded-xl hover:bg-teal-400 active:scale-[0.98] disabled:opacity-50 disabled:pointer-events-none transition-all cursor-pointer"
                >
                  {isCreating ? "Creating User..." : "Create User"}
                </button>
              </form>
            </div>
          </div>

          {/* Right panel: RTK Query Live Users list (7 cols) */}
          <div className="md:col-span-7 bg-white/[0.02] border border-white/[0.06] rounded-3xl p-6 md:p-8 shadow-2xl backdrop-blur-xl">
            <div className="flex items-center justify-between mb-6 pb-4 border-b border-white/[0.06]">
              <h3 className="text-sm font-semibold text-zinc-400 uppercase tracking-widest">
                RTK Query Cached Users ({users.length})
              </h3>
              <span className="text-[10px] bg-purple-500/10 text-purple-400 px-2.5 py-1 rounded-full font-mono font-medium border border-purple-500/20">
                Auto-Refetching Live
              </span>
            </div>

            {/* Error Message */}
            {fetchError && (
              <div className="bg-red-500/10 border border-red-500/20 text-red-400 rounded-xl p-4 mb-6 text-sm">
                <p className="font-semibold mb-1">Failed to Load Users</p>
                <p className="font-mono text-xs text-red-300/80">
                  {"status" in fetchError
                    ? `Status: ${fetchError.status} - ${JSON.stringify(fetchError.data)}`
                    : fetchError.message || "Unknown fetching error."}
                </p>
              </div>
            )}

            {/* Users List */}
            {isLoading ? (
              <div className="flex flex-col items-center justify-center py-20 gap-3">
                <div className="w-8 h-8 rounded-full border-2 border-teal-500/20 border-t-teal-500 animate-spin" />
                <p className="text-zinc-500 text-sm">Querying backend server...</p>
              </div>
            ) : users.length === 0 ? (
              <div className="text-center py-16 border border-dashed border-white/[0.08] rounded-2xl bg-white/[0.01]">
                <p className="text-zinc-500 text-sm mb-2">No users found in database.</p>
                <p className="text-xs text-zinc-600">Use the form on the left to add your first user.</p>
              </div>
            ) : (
              <div className="grid gap-3 max-h-[500px] overflow-y-auto pr-1">
                {users.map((user) => (
                  <div
                    key={user.id}
                    className="group relative flex items-center justify-between p-4 rounded-2xl bg-white/[0.01] hover:bg-white/[0.03] border border-white/[0.04] hover:border-white/[0.08] transition-all duration-300 hover:translate-x-1"
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-teal-500/20 to-emerald-500/10 flex items-center justify-center border border-teal-500/20 group-hover:scale-105 transition-transform duration-300">
                        <span className="text-teal-400 font-bold font-mono">
                          {user.name ? user.name.charAt(0).toUpperCase() : "U"}
                        </span>
                      </div>
                      <div>
                        <h4 className="font-semibold text-white group-hover:text-teal-400 transition-colors duration-200">
                          {user.name || "Unnamed User"}
                        </h4>
                        <p className="text-xs text-zinc-500 font-mono mt-0.5">{user.email}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <span className="text-[10px] text-zinc-500 font-mono">
                        {new Date(user.createdAt).toLocaleDateString(undefined, {
                          month: "short",
                          day: "numeric",
                        })}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Footer controls */}
        <div className="w-full mt-12 pt-6 border-t border-white/[0.06] flex flex-col sm:flex-row gap-4 justify-between items-center text-xs text-zinc-500">
          <span>Powered by Redux Toolkit v2, RTK Query, Turborepo & Prisma</span>
          <div className="flex gap-4">
            <a
              href="https://redux-toolkit.js.org/"
              target="_blank"
              rel="noreferrer"
              className="hover:text-white transition-colors duration-200"
            >
              RTK Docs
            </a>
            <a
              href="https://turbo.build"
              target="_blank"
              rel="noreferrer"
              className="hover:text-white transition-colors duration-200"
            >
              Turbo Docs
            </a>
          </div>
        </div>
      </main>
    </div>
  );
}
