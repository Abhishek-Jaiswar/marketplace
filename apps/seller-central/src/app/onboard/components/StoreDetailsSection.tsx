import React, { useState, useEffect } from "react";
import { Store, MapPin, Landmark, CheckCircle2, Loader2, ArrowRight, Edit3 } from "lucide-react";

interface StoreDetailsSectionProps {
  initialDisplayName?: string | null;
  initialDescription?: string | null;
  initialStreet?: string | null;
  initialCity?: string | null;
  initialState?: string | null;
  initialPostalCode?: string | null;
  initialBankName?: string | null;
  initialAccountNumber?: string | null;
  initialIfscCode?: string | null;
  initialHolderName?: string | null;
  storeCompleted?: boolean;
  bankCompleted?: boolean;
  onSaveStore: (data: {
    displayName: string;
    description?: string;
    street1: string;
    city: string;
    state: string;
    postalCode: string;
  }) => Promise<void>;
  onSaveBank: (data: {
    accountNumber: string;
    ifscCode: string;
    bankName: string;
    accountHolderName: string;
  }) => Promise<void>;
}

export const StoreDetailsSection: React.FC<StoreDetailsSectionProps> = ({
  initialDisplayName = "",
  initialDescription = "",
  initialStreet = "",
  initialCity = "",
  initialState = "",
  initialPostalCode = "",
  initialBankName = "",
  initialAccountNumber = "",
  initialIfscCode = "",
  initialHolderName = "",
  storeCompleted = false,
  bankCompleted = false,
  onSaveStore,
  onSaveBank,
}) => {
  const [displayName, setDisplayName] = useState<string>(initialDisplayName || "");
  const [description, setDescription] = useState<string>(initialDescription || "");
  const [street1, setStreet1] = useState<string>(initialStreet || "");
  const [city, setCity] = useState<string>(initialCity || "");
  const [state, setState] = useState<string>(initialState || "");
  const [postalCode, setPostalCode] = useState<string>(initialPostalCode || "");

  const [accountNumber, setAccountNumber] = useState<string>(initialAccountNumber || "");
  const [ifscCode, setIfscCode] = useState<string>(initialIfscCode || "");
  const [bankName, setBankName] = useState<string>(initialBankName || "");
  const [accountHolderName, setAccountHolderName] = useState<string>(initialHolderName || "");

  const [isSavingStore, setIsSavingStore] = useState(false);
  const [isSavingBank, setIsSavingBank] = useState(false);
  const [storeSaved, setStoreSaved] = useState(storeCompleted);
  const [bankSaved, setBankSaved] = useState(bankCompleted);
  const [errorMsg, setErrorMsg] = useState("");

  useEffect(() => {
    if (initialDisplayName) setDisplayName(initialDisplayName);
    if (initialDescription) setDescription(initialDescription);
    if (initialStreet) setStreet1(initialStreet);
    if (initialCity) setCity(initialCity);
    if (initialState) setState(initialState);
    if (initialPostalCode) setPostalCode(initialPostalCode);
    if (storeCompleted) setStoreSaved(true);
  }, [initialDisplayName, initialDescription, initialStreet, initialCity, initialState, initialPostalCode, storeCompleted]);

  useEffect(() => {
    if (initialBankName) setBankName(initialBankName);
    if (initialAccountNumber) setAccountNumber(initialAccountNumber);
    if (initialIfscCode) setIfscCode(initialIfscCode);
    if (initialHolderName) setAccountHolderName(initialHolderName);
    if (bankCompleted) setBankSaved(true);
  }, [initialBankName, initialAccountNumber, initialIfscCode, initialHolderName, bankCompleted]);

  const handleSaveStoreSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg("");
    if (!displayName.trim()) {
      setErrorMsg("Store Display Name is required.");
      return;
    }
    if (!street1.trim() || !city.trim() || !state.trim() || !postalCode.trim()) {
      setErrorMsg("Please fill out complete pickup address fields.");
      return;
    }

    try {
      setIsSavingStore(true);
      await onSaveStore({
        displayName: displayName.trim(),
        description: description.trim(),
        street1: street1.trim(),
        city: city.trim(),
        state: state.trim(),
        postalCode: postalCode.trim(),
      });
      setStoreSaved(true);
    } catch (err: any) {
      setErrorMsg(err?.data?.message || err?.message || "Failed to save store details.");
    } finally {
      setIsSavingStore(false);
    }
  };

  const handleSaveBankSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg("");
    if (!accountNumber.trim() || !ifscCode.trim() || !bankName.trim() || !accountHolderName.trim()) {
      setErrorMsg("All bank account fields are required.");
      return;
    }

    try {
      setIsSavingBank(true);
      await onSaveBank({
        accountNumber: accountNumber.trim(),
        ifscCode: ifscCode.trim().toUpperCase(),
        bankName: bankName.trim(),
        accountHolderName: accountHolderName.trim(),
      });
      setBankSaved(true);
    } catch (err: any) {
      setErrorMsg(err?.data?.message || err?.message || "Failed to save bank details.");
    } finally {
      setIsSavingBank(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Store & Pickup Address Setup Card */}
      <div className="bg-white border border-zinc-200/80 rounded-3xl p-6 shadow-sm flex flex-col gap-5 text-left">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600 font-bold">
              <Store className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-extrabold text-zinc-900 leading-none">
                Store Setup & Pickup Location
              </h3>
              <p className="text-[11px] text-zinc-400 font-semibold mt-1">
                Required for customer orders & courier logistics.
              </p>
            </div>
          </div>
          {storeSaved && (
            <span className="flex items-center gap-1 text-[11px] font-extrabold text-emerald-600 bg-emerald-50 border border-emerald-200 px-3 py-1 rounded-full">
              <CheckCircle2 className="w-3.5 h-3.5" /> Saved
            </span>
          )}
        </div>

        {errorMsg && (
          <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-xs font-bold text-red-600">
            {errorMsg}
          </div>
        )}

        <form onSubmit={handleSaveStoreSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-zinc-700">
                Store Display Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
                placeholder="e.g. Acme Electronics Store"
                className="w-full h-11 bg-zinc-50 border border-zinc-200 rounded-xl px-3.5 text-xs font-semibold text-zinc-800 focus:outline-none focus:border-indigo-600 focus:bg-white"
                required
              />
            </div>

            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-zinc-700">
                Short Store Description
              </label>
              <input
                type="text"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="e.g. Quality gadgets & accessories"
                className="w-full h-11 bg-zinc-50 border border-zinc-200 rounded-xl px-3.5 text-xs font-semibold text-zinc-800 focus:outline-none focus:border-indigo-600 focus:bg-white"
              />
            </div>
          </div>

          {/* Pickup Address Header */}
          <div className="pt-2 border-t border-zinc-100 space-y-3">
            <div className="flex items-center gap-2 text-xs font-extrabold text-zinc-800">
              <MapPin className="w-4 h-4 text-indigo-600" />
              <span>Courier Pickup Address</span>
            </div>

            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-zinc-700">
                Street Address / Premises <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={street1}
                onChange={(e) => setStreet1(e.target.value)}
                placeholder="Building Name, Flat/Unit No, Street Name"
                className="w-full h-11 bg-zinc-50 border border-zinc-200 rounded-xl px-3.5 text-xs font-semibold text-zinc-800 focus:outline-none focus:border-indigo-600 focus:bg-white"
                required
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-zinc-700">
                  City <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  placeholder="e.g. Mumbai"
                  className="w-full h-11 bg-zinc-50 border border-zinc-200 rounded-xl px-3 text-xs font-semibold text-zinc-800 focus:outline-none focus:border-indigo-600 focus:bg-white"
                  required
                />
              </div>

              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-zinc-700">
                  State <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={state}
                  onChange={(e) => setState(e.target.value)}
                  placeholder="e.g. Maharashtra"
                  className="w-full h-11 bg-zinc-50 border border-zinc-200 rounded-xl px-3 text-xs font-semibold text-zinc-800 focus:outline-none focus:border-indigo-600 focus:bg-white"
                  required
                />
              </div>

              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-zinc-700">
                  PIN Code <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={postalCode}
                  onChange={(e) => setPostalCode(e.target.value)}
                  placeholder="e.g. 400001"
                  className="w-full h-11 bg-zinc-50 border border-zinc-200 rounded-xl px-3 text-xs font-semibold text-zinc-800 focus:outline-none focus:border-indigo-600 focus:bg-white"
                  required
                />
              </div>
            </div>
          </div>

          <div className="flex justify-end pt-2">
            <button
              type="submit"
              disabled={isSavingStore}
              className={`w-full sm:w-auto flex h-11 items-center justify-center gap-2 px-6 rounded-xl font-extrabold text-xs transition-all cursor-pointer disabled:opacity-50 ${
                storeSaved
                  ? "bg-zinc-100 hover:bg-zinc-200 text-zinc-800 border border-zinc-300 shadow-sm"
                  : "bg-indigo-600 hover:bg-indigo-700 text-white shadow-md shadow-indigo-600/20"
              }`}
            >
              {isSavingStore ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : storeSaved ? (
                <>
                  <Edit3 className="w-3.5 h-3.5" />
                  <span>Update Store Details</span>
                </>
              ) : (
                <>
                  <span>Save Store & Address</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </div>
        </form>
      </div>

      {/* Bank Account Setup Card */}
      <div className="bg-white border border-zinc-200/80 rounded-3xl p-6 shadow-sm flex flex-col gap-5 text-left">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600 font-bold">
              <Landmark className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-extrabold text-zinc-900 leading-none">
                Bank Account Details
              </h3>
              <p className="text-[11px] text-zinc-400 font-semibold mt-1">
                Required for direct payout settlements.
              </p>
            </div>
          </div>
          {bankSaved && (
            <span className="flex items-center gap-1 text-[11px] font-extrabold text-emerald-600 bg-emerald-50 border border-emerald-200 px-3 py-1 rounded-full">
              <CheckCircle2 className="w-3.5 h-3.5" /> Saved
            </span>
          )}
        </div>

        <form onSubmit={handleSaveBankSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-zinc-700">
                Account Holder Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={accountHolderName}
                onChange={(e) => setAccountHolderName(e.target.value)}
                placeholder="Full Name as per Bank Account"
                className="w-full h-11 bg-zinc-50 border border-zinc-200 rounded-xl px-3.5 text-xs font-semibold text-zinc-800 focus:outline-none focus:border-indigo-600 focus:bg-white"
                required
              />
            </div>

            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-zinc-700">
                Bank Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={bankName}
                onChange={(e) => setBankName(e.target.value)}
                placeholder="e.g. HDFC Bank / ICICI Bank"
                className="w-full h-11 bg-zinc-50 border border-zinc-200 rounded-xl px-3.5 text-xs font-semibold text-zinc-800 focus:outline-none focus:border-indigo-600 focus:bg-white"
                required
              />
            </div>

            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-zinc-700">
                Account Number <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={accountNumber}
                onChange={(e) => setAccountNumber(e.target.value)}
                placeholder="Enter 9-18 digit account number"
                className="w-full h-11 bg-zinc-50 border border-zinc-200 rounded-xl px-3.5 text-xs font-semibold text-zinc-800 focus:outline-none focus:border-indigo-600 focus:bg-white"
                required
              />
            </div>

            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-zinc-700">
                IFSC Code <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={ifscCode}
                onChange={(e) => setIfscCode(e.target.value.toUpperCase())}
                placeholder="e.g. HDFC0001234"
                className="w-full h-11 bg-zinc-50 border border-zinc-200 rounded-xl px-3.5 text-xs font-semibold text-zinc-800 font-mono uppercase focus:outline-none focus:border-indigo-600 focus:bg-white"
                required
              />
            </div>
          </div>

          <div className="flex justify-end pt-2">
            <button
              type="submit"
              disabled={isSavingBank}
              className={`w-full sm:w-auto flex h-11 items-center justify-center gap-2 px-6 rounded-xl font-extrabold text-xs transition-all cursor-pointer disabled:opacity-50 ${
                bankSaved
                  ? "bg-zinc-100 hover:bg-zinc-200 text-zinc-800 border border-zinc-300 shadow-sm"
                  : "bg-indigo-600 hover:bg-indigo-700 text-white shadow-md shadow-indigo-600/20"
              }`}
            >
              {isSavingBank ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : bankSaved ? (
                <>
                  <Edit3 className="w-3.5 h-3.5" />
                  <span>Update Bank Account</span>
                </>
              ) : (
                <>
                  <span>Save Bank Account</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
