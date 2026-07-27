import React from "react";
import { Check, UserCheck, ShieldCheck, PenTool, Store, Landmark, Rocket } from "lucide-react";

interface StepperNavProps {
  currentStep: number;
  completedSteps: Record<number, boolean>;
  onSelectStep: (step: number) => void;
}

const STEPS = [
  { id: 1, label: "Verification", icon: UserCheck },
  { id: 2, label: "GSTIN", icon: ShieldCheck },
  { id: 3, label: "Signature", icon: PenTool },
  { id: 4, label: "Store & Pickup", icon: Store },
  { id: 5, label: "Bank Account", icon: Landmark },
  { id: 6, label: "Review & Submit", icon: Rocket },
];

export const StepperNav: React.FC<StepperNavProps> = ({
  currentStep,
  completedSteps,
  onSelectStep,
}) => {
  return (
    <div className="w-full bg-white border-b border-zinc-200 shadow-sm py-4 px-6 sticky top-16 z-40">
      <div className="max-w-4xl mx-auto flex items-center justify-between overflow-x-auto gap-2 scrollbar-none py-1">
        {STEPS.map((step, idx) => {
          const Icon = step.icon;
          const isCompleted = completedSteps[step.id];
          const isActive = currentStep === step.id;

          return (
            <React.Fragment key={step.id}>
              {/* Step Pill */}
              <button
                type="button"
                onClick={() => onSelectStep(step.id)}
                className={`flex items-center gap-2 px-3.5 py-2 rounded-2xl text-xs font-bold transition-all shrink-0 cursor-pointer ${
                  isActive
                    ? "bg-indigo-600 text-white shadow-md shadow-indigo-600/20 scale-105"
                    : isCompleted
                    ? "bg-emerald-50 text-emerald-700 border border-emerald-200 hover:bg-emerald-100/60"
                    : "bg-zinc-50 text-zinc-400 border border-zinc-200 hover:bg-zinc-100 hover:text-zinc-600"
                }`}
              >
                <div
                  className={`flex h-5 w-5 items-center justify-center rounded-full text-[10px] ${
                    isActive
                      ? "bg-white/20 text-white font-extrabold"
                      : isCompleted
                      ? "bg-emerald-600 text-white"
                      : "bg-zinc-200 text-zinc-500"
                  }`}
                >
                  {isCompleted ? <Check className="w-3 h-3 stroke-[3]" /> : step.id}
                </div>
                <span>{step.label}</span>
              </button>

              {/* Connecting line */}
              {idx < STEPS.length - 1 && (
                <div
                  className={`h-0.5 w-6 shrink-0 transition-colors hidden sm:block ${
                    completedSteps[step.id] ? "bg-emerald-400" : "bg-zinc-200"
                  }`}
                />
              )}
            </React.Fragment>
          );
        })}
      </div>
    </div>
  );
};
