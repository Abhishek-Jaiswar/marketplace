import React from "react"
import { Truck, Loader2, CheckCircle2 } from "lucide-react"

interface LogisticsPickupSectionProps {
  street1: string
  onStreetChange: (val: string) => void
  postalCode: string
  onPinChange: (val: string) => void
  isPinLoading: boolean
  pinSuccess: boolean
  city: string
  onCityChange: (val: string) => void
  state: string
  onStateChange: (val: string) => void
}

export const LogisticsPickupSection: React.FC<LogisticsPickupSectionProps> = ({
  street1,
  onStreetChange,
  postalCode,
  onPinChange,
  isPinLoading,
  pinSuccess,
  city,
  onCityChange,
  state,
  onStateChange,
}) => {
  return (
    <div className="space-y-6 rounded-3xl border border-zinc-200/80 bg-white p-6 shadow-xs sm:p-8">
      <div className="flex items-center gap-3 border-b border-zinc-100 pb-4">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-purple-100 bg-purple-50 font-bold text-purple-600">
          <Truck className="h-5 w-5" />
        </div>
        <div>
          <h2 className="text-base leading-none font-extrabold text-zinc-900">
            Courier Pickup & Logistics Location
          </h2>
          <p className="mt-1 text-xs font-semibold text-zinc-400">
            Where shipping couriers will pick up customer packages.
          </p>
        </div>
      </div>

      <div className="space-y-4">
        {/* Street Address */}
        <div className="space-y-1.5">
          <label className="block text-xs font-bold tracking-wider text-zinc-700 uppercase">
            Building / Street Premises <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            value={street1}
            onChange={(e) => onStreetChange(e.target.value)}
            placeholder="Building No, Warehouse Name, Flat/Unit No, Street"
            required
            className="h-11 w-full rounded-xl border border-zinc-200 bg-zinc-50 px-4 text-xs font-bold text-zinc-900 transition-all focus:border-indigo-600 focus:bg-white focus:outline-none"
          />
        </div>

        {/* PIN Code, City, State Grid */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          {/* PIN CODE with AUTO LOOKUP */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <label className="block text-xs font-bold tracking-wider text-zinc-700 uppercase">
                PIN Code <span className="text-red-500">*</span>
              </label>
              {isPinLoading && (
                <span className="flex items-center gap-1 text-[10px] font-semibold text-indigo-600">
                  <Loader2 className="h-3 w-3 animate-spin" /> Detecting...
                </span>
              )}
              {pinSuccess && (
                <span className="flex items-center gap-1 text-[10px] font-bold text-emerald-600">
                  <CheckCircle2 className="h-3 w-3" /> Auto-filled
                </span>
              )}
            </div>
            <input
              type="text"
              value={postalCode}
              onChange={(e) => onPinChange(e.target.value)}
              placeholder="e.g. 400001"
              maxLength={6}
              required
              className="h-11 w-full rounded-xl border border-zinc-200 bg-zinc-50 px-4 font-mono text-xs font-bold text-zinc-900 transition-all focus:border-indigo-600 focus:bg-white focus:outline-none"
            />
          </div>

          {/* CITY */}
          <div className="space-y-1.5">
            <label className="block text-xs font-bold tracking-wider text-zinc-700 uppercase">
              City <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={city}
              onChange={(e) => onCityChange(e.target.value)}
              placeholder="e.g. Mumbai"
              required
              className="h-11 w-full rounded-xl border border-zinc-200 bg-zinc-50 px-4 text-xs font-bold text-zinc-900 transition-all focus:border-indigo-600 focus:bg-white focus:outline-none"
            />
          </div>

          {/* STATE */}
          <div className="space-y-1.5">
            <label className="block text-xs font-bold tracking-wider text-zinc-700 uppercase">
              State <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={state}
              onChange={(e) => onStateChange(e.target.value)}
              placeholder="e.g. Maharashtra"
              required
              className="h-11 w-full rounded-xl border border-zinc-200 bg-zinc-50 px-4 text-xs font-bold text-zinc-900 transition-all focus:border-indigo-600 focus:bg-white focus:outline-none"
            />
          </div>
        </div>
      </div>
    </div>
  )
}
