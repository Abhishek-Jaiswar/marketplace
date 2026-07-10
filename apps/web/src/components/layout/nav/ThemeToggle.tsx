"use client";

import React, { useEffect, useState } from "react";
import { useTheme } from "next-themes";
import { Sun, Moon } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export function ThemeToggle() {
  const { setTheme, resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  // Prevent hydration mismatch (only render UI on client)
  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className="w-9 h-9 rounded-xl border border-white/[0.06] bg-white/[0.01] opacity-50" />
    );
  }

  const isDark = resolvedTheme === "dark";

  return (
    <button
      onClick={() => setTheme(isDark ? "light" : "dark")}
      className="w-9 h-9 flex items-center justify-center rounded-xl text-zinc-400 hover:text-teal-400 hover:bg-zinc-100 dark:hover:bg-white/[0.03] border border-transparent hover:border-zinc-200 dark:hover:border-white/[0.06] transition-all cursor-pointer overflow-hidden relative"
      aria-label="Toggle theme"
    >
      <AnimatePresence mode="wait" initial={false}>
        {isDark ? (
          <motion.div
            key="moon"
            initial={{ y: 15, opacity: 0, rotate: 40 }}
            animate={{ y: 0, opacity: 1, rotate: 0 }}
            exit={{ y: -15, opacity: 0, rotate: -40 }}
            transition={{ duration: 0.15 }}
          >
            <Moon className="w-4.5 h-4.5" />
          </motion.div>
        ) : (
          <motion.div
            key="sun"
            initial={{ y: 15, opacity: 0, rotate: -40 }}
            animate={{ y: 0, opacity: 1, rotate: 0 }}
            exit={{ y: -15, opacity: 0, rotate: 40 }}
            transition={{ duration: 0.15 }}
          >
            <Sun className="w-4.5 h-4.5 text-amber-500" />
          </motion.div>
        )}
      </AnimatePresence>
    </button>
  );
}
export default ThemeToggle;
