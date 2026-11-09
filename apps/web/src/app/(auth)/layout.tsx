import React from "react"
import Image from "next/image"

export default function AuthLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <div className="relative flex w-full flex-1 flex-col justify-center overflow-hidden bg-background py-12 text-foreground transition-colors duration-200 select-none">
      {/* Background radial effects */}
      <div className="pointer-events-none absolute top-0 right-1/4 h-[600px] w-[600px] rounded-full bg-zinc-500/5 blur-[120px]" />
      <div className="pointer-events-none absolute bottom-0 left-1/4 h-[500px] w-[500px] rounded-full bg-zinc-500/5 blur-[120px]" />

      <main className="z-10 mx-auto flex w-full max-w-5xl flex-1 items-center justify-center p-4 sm:p-6">
        <div className="grid min-h-[600px] w-full grid-cols-1 overflow-hidden rounded-3xl border border-border bg-card shadow-2xl transition-all duration-300 md:grid-cols-12">
          {/* Left panel: Cover image (visible on desktop) */}
          <div className="relative hidden overflow-hidden border-r border-border bg-zinc-100 md:col-span-6 md:block dark:bg-zinc-900">
            <Image
              src="/login-image.png"
              alt="CBS Marketplace Authentication"
              fill
              priority
              className="pointer-events-none object-cover object-center transition-transform duration-700 select-none hover:scale-102"
            />
            {/* Text Overlay Protection */}
            <div className="absolute inset-0 flex flex-col justify-between bg-gradient-to-t from-black/75 via-black/25 to-black/10 p-10 text-white select-none">
              <div>
                <span className="inline-block rounded-full border border-white/5 bg-white/10 px-3 py-1 font-mono text-[9px] font-black tracking-widest text-zinc-200 uppercase backdrop-blur-md">
                  Secure Gateway
                </span>
              </div>
              <div className="space-y-2">
                <h3 className="text-xl leading-tight font-black tracking-tight">
                  Welcome to CBS Marketplace
                </h3>
                <p className="text-xs leading-relaxed font-medium text-zinc-300">
                  Connect with millions of buyers and sellers worldwide.
                  Discover curated premium products and manage your profile
                  securely.
                </p>
              </div>
            </div>
          </div>

          {/* Right panel: Active Auth Form */}
          <div className="col-span-1 flex flex-col justify-center bg-card p-8 sm:p-12 md:col-span-6">
            <div className="mx-auto w-full max-w-sm">{children}</div>
          </div>
        </div>
      </main>
    </div>
  )
}
