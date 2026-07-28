import React from "react";
import { Truck, Loader2, CheckCircle2 } from "lucide-react";

interface LogisticsPickupSectionProps {
  street1: string;
  onStreetChange: (val: string) => void;
  postalCode: string;
  onPinChange: (val: string) => void;
  isPinLoading: boolean;
  pinSuccess: boolean;
  city: string;
  onCityChange: (val: string) => void;
  state: string;
  onStateChange: (val: string) => void;
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
    <div className="bg-white border border-zinc-200/80 rounded-3xl p-6 sm:p-8 shadow-xs space-y-6">
      <div className="flex items-center gap-3 pb-4 border-b border-zinc-100">
        <div className="h-10 w-10 rounded-xl bg-purple-50 border border-purple-100 text-purple-600 flex items-center justify-center font-bold">
          <Truck className="w-5 h-5" />
        </div>
        <div>
          <h2 className="text-base font-extrabold text-zinc-900 leading-none">
            Courier Pickup & Logistics Location
          </h2>
          <p className="text-xs text-zinc-400 font-semibold mt-1">
            Where shipping couriers will pick up customer packages.
          </p>
        </div>
      </div>

      <div className="space-y-4">
        {/* Street Address */}
        <div className="space-y-1.5">
          <label className="block text-xs font-bold text-zinc-700 uppercase tracking-wider">
            Building / Street Premises <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            value={street1}
            onChange={(e) => onStreetChange(e.target.value)}
            placeholder="Building No, Warehouse Name, Flat/Unit No, Street"
            required
            className="w-full h-11 bg-zinc-50 border border-zinc-200 rounded-xl px-4 text-xs font-bold text-zinc-900 focus:outline-none focus:border-indigo-600 focus:bg-white transition-all"
          />
        </div>

        {/* PIN Code, City, State Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {/* PIN CODE with AUTO LOOKUP */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <label className="block text-xs font-bold text-zinc-700 uppercase tracking-wider">
                PIN Code <span className="text-red-500">*</span>
              </label>
              {isPinLoading && (
                <span className="text-[10px] text-indigo-600 font-semibold flex items-center gap-1">
                  <Loader2 className="w-3 h-3 animate-spin" /> Detecting...
                </span>
              )}
              {pinSuccess && (
                <span className="text-[10px] text-emerald-600 font-bold flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3" /> Auto-filled
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
              className="w-full h-11 bg-zinc-50 border border-zinc-200 rounded-xl px-4 text-xs font-mono font-bold text-zinc-900 focus:outline-none focus:border-indigo-600 focus:bg-white transition-all"
            />
          </div>

          {/* CITY */}
          <div className="space-y-1.5">
            <label className="block text-xs font-bold text-zinc-700 uppercase tracking-wider">
              City <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={city}
              onChange={(e) => onCityChange(e.target.value)}
              placeholder="e.g. Mumbai"
              required
              className="w-full h-11 bg-zinc-50 border border-zinc-200 rounded-xl px-4 text-xs font-bold text-zinc-900 focus:outline-none focus:border-indigo-600 focus:bg-white transition-all"
            />
          </div>

          {/* STATE */}
          <div className="space-y-1.5">
            <label className="block text-xs font-bold text-zinc-700 uppercase tracking-wider">
              State <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={state}
              onChange={(e) => onStateChange(e.target.value)}
              placeholder="e.g. Maharashtra"
              required
              className="w-full h-11 bg-zinc-50 border border-zinc-200 rounded-xl px-4 text-xs font-bold text-zinc-900 focus:outline-none focus:border-indigo-600 focus:bg-white transition-all"
            />
          </div>
        </div>
      </div>
    </div>
  );
};
