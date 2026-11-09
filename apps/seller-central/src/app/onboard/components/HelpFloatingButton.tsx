import React from "react"
import { HelpCircle } from "lucide-react"

export const HelpFloatingButton: React.FC = () => {
  return (
    <button
      type="button"
      className="fixed right-6 bottom-6 z-50 flex h-11 cursor-pointer items-center gap-1.5 rounded-full bg-indigo-600 px-5 text-xs font-bold text-white shadow-lg shadow-indigo-500/30 transition-all select-none hover:bg-indigo-700 hover:shadow-indigo-500/40"
    >
      <HelpCircle className="h-4 w-4" />
      <span>Help</span>
    </button>
  )
}
