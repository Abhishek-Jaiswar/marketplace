import React from "react";
import Image from "next/image";

export default function AuthLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="flex-1 w-full flex flex-col justify-center bg-background text-foreground transition-colors duration-200 relative overflow-hidden select-none py-12">
      {/* Background radial effects */}
      <div className="absolute top-0 right-1/4 w-[600px] h-[600px] bg-zinc-500/5 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-0 left-1/4 w-[500px] h-[500px] bg-zinc-500/5 rounded-full blur-[120px] pointer-events-none" />

      <main className="flex-1 flex items-center justify-center p-4 sm:p-6 z-10 w-full max-w-5xl mx-auto">
        <div className="w-full bg-card border border-border rounded-3xl shadow-2xl overflow-hidden grid grid-cols-1 md:grid-cols-12 min-h-[600px] transition-all duration-300">
          
          {/* Left panel: Cover image (visible on desktop) */}
          <div className="hidden md:block md:col-span-6 relative bg-zinc-100 dark:bg-zinc-900 overflow-hidden border-r border-border">
            <Image
              src="/login-image.png"
              alt="CBS Marketplace Authentication"
              fill
              priority
              className="object-cover object-center select-none pointer-events-none hover:scale-102 transition-transform duration-700"
            />
            {/* Text Overlay Protection */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/25 to-black/10 flex flex-col justify-between p-10 text-white select-none">
              <div>
                <span className="inline-block text-[9px] tracking-widest font-black uppercase font-mono text-zinc-200 bg-white/10 px-3 py-1 rounded-full backdrop-blur-md border border-white/5">
                  Secure Gateway
                </span>
              </div>
              <div className="space-y-2">
                <h3 className="text-xl font-black leading-tight tracking-tight">
                  Welcome to CBS Marketplace
                </h3>
                <p className="text-xs text-zinc-300 leading-relaxed font-medium">
                  Connect with millions of buyers and sellers worldwide. Discover curated premium products and manage your profile securely.
                </p>
              </div>
            </div>
          </div>

          {/* Right panel: Active Auth Form */}
          <div className="col-span-1 md:col-span-6 p-8 sm:p-12 flex flex-col justify-center bg-card">
            <div className="w-full max-w-sm mx-auto">
              {children}
            </div>
          </div>

        </div>
      </main>
    </div>
  );
}
