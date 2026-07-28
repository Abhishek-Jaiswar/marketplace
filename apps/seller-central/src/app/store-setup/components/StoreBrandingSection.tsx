import React from "react";
import { Store, Globe, Check, Copy } from "lucide-react";

export const CATEGORIES = [
  "Consumer Electronics & Accessories",
  "Apparel, Fashion & Footwear",
  "Home, Kitchen & Furniture",
  "Beauty, Personal Care & Wellness",
  "Books, Stationery & Office Supplies",
  "Toys, Baby Products & Gaming",
  "Sports, Fitness & Outdoor",
  "Groceries & Gourmet Food",
];

interface StoreBrandingSectionProps {
  displayName: string;
  onDisplayNameChange: (val: string) => void;
  category: string;
  onCategoryChange: (val: string) => void;
  slug: string;
  copiedSlug: boolean;
  onCopySlug: () => void;
  description: string;
  onDescriptionChange: (val: string) => void;
}

export const StoreBrandingSection: React.FC<StoreBrandingSectionProps> = ({
  displayName,
  onDisplayNameChange,
  category,
  onCategoryChange,
  slug,
  copiedSlug,
  onCopySlug,
  description,
  onDescriptionChange,
}) => {
  return (
    <div className="bg-white border border-zinc-200/80 rounded-3xl p-6 sm:p-8 shadow-xs space-y-6">
      <div className="flex items-center gap-3 pb-4 border-b border-zinc-100">
        <div className="h-10 w-10 rounded-xl bg-indigo-50 border border-indigo-100 text-indigo-600 flex items-center justify-center font-bold">
          <Store className="w-5 h-5" />
        </div>
        <div>
          <h2 className="text-base font-extrabold text-zinc-900 leading-none">
            Store Identity & Branding
          </h2>
          <p className="text-xs text-zinc-400 font-semibold mt-1">
            How customers recognize your business on CBS Marketplace.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {/* Store Display Name */}
        <div className="space-y-1.5">
          <label className="block text-xs font-bold text-zinc-700 uppercase tracking-wider">
            Store Display Name <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            value={displayName}
            onChange={(e) => onDisplayNameChange(e.target.value)}
            placeholder="e.g. Apex Tech Gear"
            required
            className="w-full h-11 bg-zinc-50 border border-zinc-200 rounded-xl px-4 text-xs font-bold text-zinc-900 focus:outline-none focus:border-indigo-600 focus:bg-white transition-all"
          />
          <p className="text-[11px] text-zinc-400 font-semibold">
            Auto-suggested from your verified GSTIN legal trade name.
          </p>
        </div>

        {/* Primary Category */}
        <div className="space-y-1.5">
          <label className="block text-xs font-bold text-zinc-700 uppercase tracking-wider">
            Primary Category <span className="text-red-500">*</span>
          </label>
          <select
            value={category}
            onChange={(e) => onCategoryChange(e.target.value)}
            className="w-full h-11 bg-zinc-50 border border-zinc-200 rounded-xl px-4 text-xs font-bold text-zinc-800 focus:outline-none focus:border-indigo-600 focus:bg-white transition-all cursor-pointer"
          >
            {CATEGORIES.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Store Slug / Custom URL Card */}
      <div className="bg-slate-50 border border-zinc-200/80 rounded-2xl p-4 space-y-2">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold text-zinc-700 flex items-center gap-1.5">
            <Globe className="w-3.5 h-3.5 text-indigo-600" /> Store URL Preview
          </span>
          <button
            type="button"
            onClick={onCopySlug}
            className="text-[11px] font-bold text-indigo-600 hover:text-indigo-700 flex items-center gap-1 cursor-pointer"
          >
            {copiedSlug ? (
              <>
                <Check className="w-3 h-3 text-emerald-600" /> Copied!
              </>
            ) : (
              <>
                <Copy className="w-3 h-3" /> Copy URL
              </>
            )}
          </button>
        </div>
        <div className="bg-white border border-zinc-200 rounded-xl px-3.5 py-2.5 text-xs font-mono font-semibold text-zinc-700 flex items-center overflow-x-auto">
          <span className="text-zinc-400">cbsmarketplace.com/store/</span>
          <span className="text-indigo-600 font-bold">{slug || "your-store-name"}</span>
        </div>
      </div>

      {/* Short Tagline / Description */}
      <div className="space-y-1.5">
        <label className="block text-xs font-bold text-zinc-700 uppercase tracking-wider">
          Store Tagline / Description
        </label>
        <textarea
          rows={2}
          value={description}
          onChange={(e) => onDescriptionChange(e.target.value)}
          placeholder="Brief summary of your products, brand values, or specialty offerings..."
          className="w-full bg-zinc-50 border border-zinc-200 rounded-xl p-3 text-xs font-semibold text-zinc-800 focus:outline-none focus:border-indigo-600 focus:bg-white transition-all resize-none"
        />
      </div>
    </div>
  );
};
