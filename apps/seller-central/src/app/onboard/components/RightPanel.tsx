import React from "react";
import {
  QrCode,
  Smartphone,
  Phone,
  Mail,
  Clock,
  ArrowRight,
  LayoutDashboard,
  ExternalLink,
  MessageSquare,
  ShoppingBag,
} from "lucide-react";

interface RightPanelProps {
  onPreviewStore?: () => void;
  onGoToDashboard?: () => void;
  isDashboardEnabled?: boolean;
}

export const RightPanel: React.FC<RightPanelProps> = ({
  onPreviewStore,
  onGoToDashboard,
  isDashboardEnabled = false,
}) => {
  return (
    <div className="space-y-5 text-left">
      {/* 1. Top CTAs Panel */}
      <div className="flex items-center gap-3">
        {/* Preview Store */}
        <button
          type="button"
          onClick={onPreviewStore}
          className="flex-1 flex h-12 items-center justify-between px-4 border border-zinc-200 bg-white hover:bg-zinc-50 rounded-2xl text-xs font-bold text-zinc-700 transition-colors shadow-sm cursor-pointer select-none"
        >
          <div className="flex items-center gap-2">
            <ShoppingBag className="w-4 h-4 text-indigo-600" />
            <span>Preview Your Store</span>
          </div>
          <ArrowRight className="w-3.5 h-3.5 text-zinc-400" />
        </button>

        {/* Go to Dashboard */}
        <button
          type="button"
          onClick={onGoToDashboard}
          disabled={!isDashboardEnabled}
          className={`flex-1 flex h-12 items-center justify-between px-4 rounded-2xl text-xs font-bold text-white transition-all shadow-sm select-none ${
            isDashboardEnabled
              ? "bg-indigo-600 hover:bg-indigo-700 cursor-pointer"
              : "bg-indigo-600/50 cursor-not-allowed opacity-75"
          }`}
        >
          <div className="flex items-center gap-2">
            <LayoutDashboard className="w-4 h-4" />
            <div className="flex flex-col items-start leading-tight">
              <span>Go to Dashboard</span>
              <span className="text-[8px] font-medium text-indigo-100">
                (After completion)
              </span>
            </div>
          </div>
          <ExternalLink className="w-3.5 h-3.5 opacity-60" />
        </button>
      </div>

      {/* 2. Grow Your Business Purple Banner */}
      <div className="bg-gradient-to-br from-indigo-600 to-indigo-800 rounded-3xl p-6 text-white relative overflow-hidden shadow-md flex items-center min-h-[170px]">
        {/* Banner Details */}
        <div className="space-y-4 max-w-[55%] z-10">
          <h4 className="text-sm font-extrabold leading-snug tracking-tight">
            Grow your business with ShopEase
          </h4>
          <ul className="space-y-1.5 text-[10px] font-bold text-indigo-100 pl-1 list-disc list-inside">
            <li>Reach Crores of Customers</li>
            <li>Secure & Trusted Platform</li>
            <li>Easy Payments & Fast Payouts</li>
            <li>24/7 Seller Support</li>
          </ul>
        </div>

        {/* Vector SVG Mock illustration */}
        <div className="absolute right-0 bottom-0 top-0 w-[45%] flex items-center justify-center opacity-95">
          <svg
            viewBox="0 0 120 120"
            fill="none"
            className="w-full h-full max-h-[110px]"
            xmlns="http://www.w3.org/2000/svg"
          >
            {/* Phone Body */}
            <rect
              x="55"
              y="10"
              width="50"
              height="95"
              rx="8"
              fill="#e0e7ff"
              stroke="#818cf8"
              strokeWidth="2.5"
            />
            {/* Phone Screen display */}
            <rect x="59" y="16" width="42" height="73" rx="4" fill="#ffffff" />
            <rect x="63" y="21" width="34" height="25" rx="3" fill="#c7d2fe" />
            <line
              x1="63"
              y1="52"
              x2="85"
              y2="52"
              stroke="#818cf8"
              strokeWidth="2.5"
              strokeLinecap="round"
            />
            <line
              x1="63"
              y1="60"
              x2="92"
              y2="60"
              stroke="#cbd5e1"
              strokeWidth="2"
              strokeLinecap="round"
            />
            {/* Home button */}
            <circle cx="80" cy="97" r="3.5" fill="#818cf8" />

            {/* Shopping Box */}
            <path
              d="M20,62 L45,50 L70,62 L45,74 Z"
              fill="#fbbf24"
              stroke="#d97706"
              strokeWidth="1.5"
            />
            <path
              d="M20,62 L20,88 L45,100 L45,74 Z"
              fill="#f59e0b"
              stroke="#d97706"
              strokeWidth="1.5"
            />
            <path
              d="M45,74 L45,100 L70,88 L70,62 Z"
              fill="#d97706"
              stroke="#b45309"
              strokeWidth="1.5"
            />

            {/* Currency Coin */}
            <circle
              cx="45"
              cy="95"
              r="11"
              fill="#fbbf24"
              stroke="#d97706"
              strokeWidth="1.5"
            />
            <circle cx="45" cy="95" r="7.5" fill="#f59e0b" />
            <text
              x="42.5"
              y="98.5"
              fill="#ffffff"
              fontSize="10"
              fontWeight="900"
              fontFamily="sans-serif"
            >
              ₹
            </text>
          </svg>
        </div>
      </div>

      {/* 3. Need Help Support Info Card */}
      <div className="bg-white border border-zinc-200/60 rounded-3xl p-6 shadow-sm relative overflow-hidden flex flex-col gap-4">
        <div>
          <h4 className="text-sm font-extrabold text-zinc-900 leading-none">
            Need help?
          </h4>
          <span className="text-[10px] text-zinc-400 font-bold block mt-1.5 leading-none">
            Our seller support team is here for you.
          </span>
        </div>

        {/* Contact listings */}
        <div className="space-y-3.5">
          <div className="flex items-center gap-3 text-xs font-bold text-zinc-700">
            <Phone className="w-4.5 h-4.5 text-indigo-600 shrink-0" />
            <span className="font-mono">1800-123-4455</span>
          </div>
          <div className="flex items-center gap-3 text-xs font-bold text-zinc-700">
            <Mail className="w-4.5 h-4.5 text-indigo-600 shrink-0" />
            <span className="break-all">seller.support@shopease.com</span>
          </div>
          <div className="flex items-center gap-3 text-xs font-bold text-zinc-500">
            <Clock className="w-4.5 h-4.5 text-indigo-600 shrink-0" />
            <span>Mon - Sat | 9 AM - 7 PM</span>
          </div>
        </div>

        {/* Floating gift/shopping bag svg illustration on the right */}
        <div className="absolute right-2.5 bottom-1 opacity-80 pointer-events-none select-none">
          <svg
            viewBox="0 0 100 100"
            fill="none"
            className="w-16 h-16"
            xmlns="http://www.w3.org/2000/svg"
          >
            {/* Bag Body */}
            <path
              d="M25,35 L75,35 L82,88 L18,88 Z"
              fill="#818cf8"
              stroke="#4f46e5"
              strokeWidth="2"
            />
            {/* Bag Handle */}
            <path
              d="M38,35 C38,15 62,15 62,35"
              stroke="#4f46e5"
              strokeWidth="3.5"
              strokeLinecap="round"
            />
            {/* Tag logo star */}
            <circle cx="50" cy="62" r="11" fill="#fbbf24" />
            <polygon
              points="50,56 52,60 57,60 53,63 55,68 50,65 45,68 47,63 43,60 48,60"
              fill="#ffffff"
            />
          </svg>
        </div>
      </div>

      {/* 4. WhatsApp Banner with QR Code */}
      <div className="bg-emerald-50/50 border border-emerald-100 rounded-3xl p-6 shadow-sm flex items-center justify-between gap-4">
        <div className="space-y-4 max-w-[62%]">
          <div className="flex items-start gap-2.5">
            <div className="h-6 w-6 rounded-md bg-emerald-500 text-white flex items-center justify-center shadow-sm shrink-0">
              <MessageSquare className="w-3.5 h-3.5 fill-white stroke-none" />
            </div>
            <div className="flex flex-col text-left leading-tight">
              <h5 className="text-xs font-extrabold text-emerald-950">
                Join our WhatsApp Channel
              </h5>
              <span className="text-[9px] text-zinc-400 font-semibold mt-1">
                Get updates, tips & important announcements.
              </span>
            </div>
          </div>

          <button
            type="button"
            className="h-8.5 px-4 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-[10px] font-extrabold transition-colors cursor-pointer select-none"
          >
            Join Now
          </button>
        </div>

        {/* QR Code Container */}
        <div className="h-16 w-16 shrink-0 bg-white border border-zinc-150 p-1.5 rounded-xl flex items-center justify-center shadow-sm">
          <QrCode className="w-full h-full text-zinc-800 stroke-[1.5]" />
        </div>
      </div>
    </div>
  );
};
