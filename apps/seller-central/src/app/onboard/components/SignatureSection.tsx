import React, { useState } from "react";
import { PenTool, UploadCloud, CheckCircle2, RefreshCw, Save, Check } from "lucide-react";

interface SignatureSectionProps {
  canvasSignature: string | null;
  signatureUploaded: string | null;
  isUploading?: boolean;
  onUploadSignature: (file: File) => void;
  onClearCanvas: () => void;
  onSaveCanvas: () => void;
  canvasRef: React.RefObject<HTMLCanvasElement | null>;
  isDrawing: boolean;
  startDrawing: (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => void;
  draw: (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => void;
  stopDrawing: () => void;
}

export const SignatureSection: React.FC<SignatureSectionProps> = ({
  canvasSignature,
  signatureUploaded,
  isUploading = false,
  onUploadSignature,
  onClearCanvas,
  onSaveCanvas,
  canvasRef,
  isDrawing,
  startDrawing,
  draw,
  stopDrawing,
}) => {
  const [signatureMode, setSignatureMode] = useState<"draw" | "upload" | null>(null);

  return (
    <div className="bg-white border border-zinc-200/60 rounded-3xl p-6 shadow-sm flex flex-col gap-4 text-left">
      {/* Header */}
      <div>
        <h3 className="text-sm font-extrabold text-zinc-900 leading-none">
          Add Your e-Signature
        </h3>
        <p className="text-[11px] text-zinc-400 font-semibold mt-1.5 leading-none">
          This will be used to digitally sign your agreements.
        </p>
      </div>

      {/* Signature Toggles Grid */}
      <div className="flex flex-col sm:flex-row items-center gap-4 py-2">
        {/* Draw Signature Toggle Button */}
        <button
          type="button"
          onClick={() => setSignatureMode(signatureMode === "draw" ? null : "draw")}
          className={`flex-1 w-full p-4 border rounded-2xl flex items-center justify-center gap-3.5 transition-all cursor-pointer select-none ${
            signatureMode === "draw"
              ? "border-indigo-600 bg-indigo-50/20 shadow-sm"
              : "border-zinc-200 bg-white hover:bg-zinc-50"
          }`}
        >
          <div
            className={`h-9 w-9 rounded-xl flex items-center justify-center border transition-colors ${
              signatureMode === "draw"
                ? "bg-indigo-600 border-indigo-600 text-white"
                : "bg-zinc-50 border-zinc-200 text-zinc-400"
            }`}
          >
            <PenTool className="w-4 h-4" />
          </div>
          <span
            className={`text-xs font-extrabold transition-colors ${
              signatureMode === "draw" ? "text-indigo-600" : "text-zinc-700"
            }`}
          >
            Draw your signature
          </span>
        </button>

        {/* OR Divider */}
        <span className="text-[10px] font-extrabold text-zinc-400 select-none px-1">
          OR
        </span>

        {/* Upload Signature Toggle Button */}
        <button
          type="button"
          onClick={() => setSignatureMode(signatureMode === "upload" ? null : "upload")}
          className={`flex-1 w-full p-4 border rounded-2xl flex items-center justify-center gap-3.5 transition-all cursor-pointer select-none ${
            signatureMode === "upload"
              ? "border-indigo-600 bg-indigo-50/20 shadow-sm"
              : "border-zinc-200 bg-white hover:bg-zinc-50"
          }`}
        >
          <div
            className={`h-9 w-9 rounded-xl flex items-center justify-center border transition-colors ${
              signatureMode === "upload"
                ? "bg-indigo-600 border-indigo-600 text-white"
                : "bg-zinc-50 border-zinc-200 text-zinc-400"
            }`}
          >
            <UploadCloud className="w-4.5 h-4.5" />
          </div>
          <div className="flex flex-col items-start leading-none">
            <span
              className={`text-xs font-extrabold transition-colors ${
                signatureMode === "upload" ? "text-indigo-600" : "text-zinc-700"
              }`}
            >
              Upload signature
            </span>
            <span className="text-[9px] text-zinc-400 font-semibold mt-0.5">
              (JPG, PNG)
            </span>
          </div>
        </button>
      </div>

      {/* Expanded Draw Mode signature pad */}
      {signatureMode === "draw" && (
        <div className="border border-zinc-200 dark:border-zinc-800 rounded-2xl overflow-hidden bg-zinc-50/20 p-4 space-y-3.5 animate-fadeIn">
          <div className="relative border border-zinc-250 bg-white rounded-xl overflow-hidden">
            <canvas
              ref={canvasRef}
              width={500}
              height={140}
              onMouseDown={startDrawing}
              onMouseMove={draw}
              onMouseUp={stopDrawing}
              onMouseLeave={stopDrawing}
              onTouchStart={startDrawing}
              onTouchMove={draw}
              onTouchEnd={stopDrawing}
              className="w-full h-32 bg-white cursor-crosshair block"
            />
            {!canvasSignature && (
              <div className="absolute inset-0 flex items-center justify-center text-zinc-350 pointer-events-none text-[11px] font-semibold select-none">
                Draw your signature inside this box
              </div>
            )}
          </div>

          <div className="flex gap-2">
            <button
              type="button"
              onClick={onClearCanvas}
              className="px-4 py-2 border border-zinc-200 bg-white hover:bg-zinc-50 rounded-xl text-xs font-bold text-zinc-500 transition-colors flex items-center gap-1.5 cursor-pointer"
            >
              <RefreshCw className="w-3.5 h-3.5" /> Clear
            </button>
            <button
              type="button"
              onClick={onSaveCanvas}
              disabled={!canvasSignature || isUploading}
              className="px-5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold transition-all disabled:opacity-50 flex items-center gap-1.5 cursor-pointer"
            >
              {isUploading ? (
                <RefreshCw className="w-3.5 h-3.5 animate-spin" />
              ) : (
                <Save className="w-3.5 h-3.5" />
              )}
              <span>Attach Drawn Signature</span>
            </button>
          </div>
        </div>
      )}

      {/* Expanded Upload Mode file picker */}
      {signatureMode === "upload" && (
        <div className="animate-fadeIn">
          <label className="flex h-24 flex-col items-center justify-center gap-2 border border-dashed border-zinc-250 bg-zinc-550/10 rounded-2xl bg-white hover:bg-zinc-50 cursor-pointer text-xs text-zinc-400 font-bold transition-all select-none">
            <UploadCloud className="w-6 h-6 text-zinc-400" />
            <span>Click to upload signature photo</span>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => {
                const files = e.target.files;
                if (files && files[0]) {
                  onUploadSignature(files[0]);
                }
              }}
              className="hidden"
              disabled={isUploading}
            />
          </label>
        </div>
      )}

      {/* Signature upload state indicator */}
      {signatureUploaded && (
        <div className="flex items-center gap-2 text-xs text-emerald-600 font-bold bg-emerald-50 border border-emerald-100 p-3.5 rounded-xl">
          <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-500" />
          <span>Signature successfully saved & bound to seller profile!</span>
        </div>
      )}
    </div>
  );
};
