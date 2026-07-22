import React from "react";
import { Bell, ChevronDown, ShoppingBag } from "lucide-react";

interface HeaderProps {
  userName?: string;
  sellerId?: string;
}

export const Header: React.FC<HeaderProps> = ({
  userName = "Abhishek Jaiswar",
  sellerId = "SE123456",
}) => {
  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase();
  };

  return (
    <header className="sticky top-0 z-50 w-full bg-white border-b border-zinc-150 py-3 px-8 flex items-center justify-between shadow-sm">
      {/* Logo */}
      <div className="flex items-center gap-2">
        <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-indigo-600 text-white">
          <ShoppingBag className="w-5 h-5" />
        </div>
        <div className="flex flex-col leading-none">
          <span className="text-md font-extrabold text-zinc-900 tracking-tight font-sans">
            ShopEase
          </span>
          <span className="text-[10px] text-zinc-400 font-semibold uppercase tracking-wider">
            Marketplace
          </span>
        </div>
      </div>

      {/* Stepper Progress */}
      <div className="hidden md:flex items-center gap-6">
        <div className="flex items-center gap-2 text-emerald-600 font-semibold text-sm">
          <div className="flex h-5 w-5 items-center justify-center rounded-full bg-emerald-50 text-emerald-600 border border-emerald-250">
            <span className="text-xs">✓</span>
          </div>
          <span>Email & Password</span>
        </div>
        <div className="h-[1px] w-8 bg-zinc-200"></div>
        <div className="flex items-center gap-2 text-zinc-900 font-bold text-sm">
          <div className="flex h-5.5 w-5.5 items-center justify-center rounded-full bg-indigo-600 text-white text-xs">
            2
          </div>
          <span className="border-b-2 border-indigo-600 pb-0.5">Business Details</span>
        </div>
      </div>

      {/* Right User Bar */}
      <div className="flex items-center gap-4">
        {/* Notification Bell */}
        <div className="relative cursor-pointer p-1 rounded-full hover:bg-zinc-50 transition-colors">
          <Bell className="w-5 h-5 text-zinc-400" />
          <span className="absolute top-0.5 right-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[9px] font-bold text-white leading-none border border-white">
            3
          </span>
        </div>

        {/* User profile dropdown */}
        <div className="flex items-center gap-2.5 cursor-pointer pl-2 border-l border-zinc-100 hover:opacity-90 transition-opacity">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-indigo-100 text-indigo-700 font-bold text-xs">
            {getInitials(userName)}
          </div>
          <div className="hidden sm:flex flex-col text-left leading-tight">
            <span className="text-xs font-bold text-zinc-800">{userName}</span>
            <span className="text-[10px] text-zinc-400 font-semibold">
              Seller ID: {sellerId}
            </span>
          </div>
          <ChevronDown className="w-3.5 h-3.5 text-zinc-400 hidden sm:block" />
        </div>
      </div>
    </header>
  );
};
