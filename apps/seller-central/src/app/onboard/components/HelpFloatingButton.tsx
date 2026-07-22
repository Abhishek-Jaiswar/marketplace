import React from "react";
import { HelpCircle } from "lucide-react";

export const HelpFloatingButton: React.FC = () => {
  return (
    <button
      type="button"
      className="fixed bottom-6 right-6 h-11 px-5 rounded-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-lg shadow-indigo-500/30 hover:shadow-indigo-500/40 transition-all flex items-center gap-1.5 cursor-pointer z-50 select-none"
    >
      <HelpCircle className="w-4 h-4" />
      <span>Help</span>
    </button>
  );
};
