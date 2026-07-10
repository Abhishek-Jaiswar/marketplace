import React from "react";
import Link from "next/link";
import { ShoppingBag } from "lucide-react";
import { ThemeToggle } from "../../components/layout/nav/ThemeToggle";

export default function AuthLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="min-h-screen w-full flex flex-col justify-between bg-background text-foreground transition-colors duration-200 relative overflow-hidden select-none">
      {/* Background gradients */}
      <div className="absolute top-0 right-1/4 w-[600px] h-[600px] bg-zinc-500/5 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-0 left-1/4 w-[500px] h-[500px] bg-zinc-500/5 rounded-full blur-[120px] pointer-events-none" />

      {/* Top Header/Action Row */}
      <header className="w-full max-w-7xl mx-auto px-6 py-4 flex items-center justify-between z-10">
        <Link href="/" className="flex items-center gap-2 group">
          <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-zinc-800 to-zinc-950 dark:from-zinc-100 dark:to-zinc-300 flex items-center justify-center shadow-lg">
            <ShoppingBag className="w-5 h-5 text-zinc-50 dark:text-zinc-950" />
          </div>
          <span className="text-md font-extrabold tracking-tight bg-gradient-to-r from-zinc-900 to-zinc-650 dark:from-white dark:to-zinc-400 bg-clip-text text-transparent">
            CBS Market
          </span>
        </Link>
        <ThemeToggle />
      </header>

      {/* Center card wrapper */}
      <main className="flex-1 flex items-center justify-center p-6 z-10 w-full max-w-md mx-auto">
        <div className="w-full bg-card border border-border rounded-3xl p-8 shadow-2xl backdrop-blur-xl transition-all duration-300">
          {children}
        </div>
      </main>

      {/* Footer */}
      <footer className="w-full max-w-7xl mx-auto px-6 py-6 text-center text-xs text-muted-foreground z-10 border-t border-border/50">
        <p>© {new Date().getFullYear()} CBS Marketplace. All rights reserved.</p>
      </footer>
    </div>
  );
}
