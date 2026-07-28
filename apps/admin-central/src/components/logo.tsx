import React from "react";
import Link from "next/link";
import { ShieldCheck } from "lucide-react";

interface LogoProps {
  light?: boolean;
  iconSize?: number;
  subtitle?: string;
}

export default function Logo({
  light = false,
  iconSize = 28,
  subtitle = "Admin Central",
}: LogoProps) {
  return (
    <Link href="/dashboard" className="flex items-center gap-2.5 group select-none">
      <div
        className="flex items-center justify-center rounded-xl bg-gradient-to-tr from-indigo-600 via-indigo-500 to-purple-600 text-white shadow-md shadow-indigo-500/20 transition-transform group-hover:scale-105"
        style={{ width: iconSize + 10, height: iconSize + 10 }}
      >
        <ShieldCheck style={{ width: iconSize, height: iconSize }} />
      </div>
      <div className="flex flex-col text-left leading-none">
        <span
          className={`text-lg font-black tracking-tight ${
            light ? "text-white" : "text-zinc-900 dark:text-white"
          }`}
        >
          CBS<span className="text-indigo-500">.</span>
        </span>
        <span
          className={`text-[10px] font-bold tracking-widest uppercase mt-0.5 ${
            light ? "text-indigo-200" : "text-zinc-500 dark:text-zinc-400"
          }`}
        >
          {subtitle}
        </span>
      </div>
    </Link>
  );
}
