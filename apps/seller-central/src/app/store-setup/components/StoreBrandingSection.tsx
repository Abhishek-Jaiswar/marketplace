import React from "react"
import { Store, Globe, Check, Copy } from "lucide-react"

export const CATEGORIES = [
  "Consumer Electronics & Accessories",
  "Apparel, Fashion & Footwear",
  "Home, Kitchen & Furniture",
  "Beauty, Personal Care & Wellness",
  "Books, Stationery & Office Supplies",
  "Toys, Baby Products & Gaming",
  "Sports, Fitness & Outdoor",
  "Groceries & Gourmet Food",
]

interface StoreBrandingSectionProps {
  displayName: string
  onDisplayNameChange: (val: string) => void
  category: string
  onCategoryChange: (val: string) => void
  slug: string
  copiedSlug: boolean
  onCopySlug: () => void
  description: string
  onDescriptionChange: (val: string) => void
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
    <div className="space-y-6 rounded-3xl border border-zinc-200/80 bg-white p-6 shadow-xs sm:p-8">
      <div className="flex items-center gap-3 border-b border-zinc-100 pb-4">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-indigo-100 bg-indigo-50 font-bold text-indigo-600">
          <Store className="h-5 w-5" />
        </div>
        <div>
          <h2 className="text-base leading-none font-extrabold text-zinc-900">
            Store Identity & Branding
          </h2>
          <p className="mt-1 text-xs font-semibold text-zinc-400">
            How customers recognize your business on CBS Marketplace.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
        {/* Store Display Name */}
        <div className="space-y-1.5">
          <label className="block text-xs font-bold tracking-wider text-zinc-700 uppercase">
            Store Display Name <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            value={displayName}
            onChange={(e) => onDisplayNameChange(e.target.value)}
            placeholder="e.g. Apex Tech Gear"
            required
            className="h-11 w-full rounded-xl border border-zinc-200 bg-zinc-50 px-4 text-xs font-bold text-zinc-900 transition-all focus:border-indigo-600 focus:bg-white focus:outline-none"
          />
          <p className="text-[11px] font-semibold text-zinc-400">
            Auto-suggested from your verified GSTIN legal trade name.
          </p>
        </div>

        {/* Primary Category */}
        <div className="space-y-1.5">
          <label className="block text-xs font-bold tracking-wider text-zinc-700 uppercase">
            Primary Category <span className="text-red-500">*</span>
          </label>
          <select
            value={category}
            onChange={(e) => onCategoryChange(e.target.value)}
            className="h-11 w-full cursor-pointer rounded-xl border border-zinc-200 bg-zinc-50 px-4 text-xs font-bold text-zinc-800 transition-all focus:border-indigo-600 focus:bg-white focus:outline-none"
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
      <div className="space-y-2 rounded-2xl border border-zinc-200/80 bg-slate-50 p-4">
        <div className="flex items-center justify-between">
          <span className="flex items-center gap-1.5 text-xs font-bold text-zinc-700">
            <Globe className="h-3.5 w-3.5 text-indigo-600" /> Store URL Preview
          </span>
          <button
            type="button"
            onClick={onCopySlug}
            className="flex cursor-pointer items-center gap-1 text-[11px] font-bold text-indigo-600 hover:text-indigo-700"
          >
            {copiedSlug ? (
              <>
                <Check className="h-3 w-3 text-emerald-600" /> Copied!
              </>
            ) : (
              <>
                <Copy className="h-3 w-3" /> Copy URL
              </>
            )}
          </button>
        </div>
        <div className="flex items-center overflow-x-auto rounded-xl border border-zinc-200 bg-white px-3.5 py-2.5 font-mono text-xs font-semibold text-zinc-700">
          <span className="text-zinc-400">cbsmarketplace.com/store/</span>
          <span className="font-bold text-indigo-600">
            {slug || "your-store-name"}
          </span>
        </div>
      </div>

      {/* Short Tagline / Description */}
      <div className="space-y-1.5">
        <label className="block text-xs font-bold tracking-wider text-zinc-700 uppercase">
          Store Tagline / Description
        </label>
        <textarea
          rows={2}
          value={description}
          onChange={(e) => onDescriptionChange(e.target.value)}
          placeholder="Brief summary of your products, brand values, or specialty offerings..."
          className="w-full resize-none rounded-xl border border-zinc-200 bg-zinc-50 p-3 text-xs font-semibold text-zinc-800 transition-all focus:border-indigo-600 focus:bg-white focus:outline-none"
        />
      </div>
    </div>
  )
}
