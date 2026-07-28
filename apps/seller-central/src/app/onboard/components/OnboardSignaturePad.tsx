import React, { useState } from "react";
import { PenTool, Upload, RefreshCw, CheckCircle2, Loader2, Image as ImageIcon } from "lucide-react";

export interface OnboardSignaturePadProps {
  signatureUploaded?: string | null;
  canvasSignature?: string | null;
  onUploadFile: (file: File) => Promise<void>;
  onSaveCanvasSignature: () => Promise<void>;
  clearCanvas: () => void;
  isUploading?: boolean;
  canvasRef: React.RefObject<HTMLCanvasElement | null>;
  startDrawing: (e: React.MouseEvent<HTMLCanvasElement>) => void;
  draw: (e: React.MouseEvent<HTMLCanvasElement>) => void;
  stopDrawing: () => void;
}

export const OnboardSignaturePad: React.FC<OnboardSignaturePadProps> = ({
  signatureUploaded = null,
  canvasSignature = null,
  onUploadFile,
  onSaveCanvasSignature,
  clearCanvas,
  isUploading = false,
  canvasRef,
  startDrawing,
  draw,
  stopDrawing,
}) => {
  const [tab, setTab] = useState<"upload" | "draw">("upload");

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      onUploadFile(e.target.files[0]);
    }
  };

  return (
    <div className="bg-white border border-zinc-200/80 rounded-3xl p-6 shadow-xs flex flex-col gap-4 text-left">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="h-7 w-7 rounded-lg bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-600">
            <PenTool className="w-4 h-4" />
          </div>
          <h3 className="text-sm font-extrabold text-zinc-900 leading-none">
            Digital Signature Verification
          </h3>
        </div>

        {signatureUploaded && (
          <span className="flex items-center gap-1 text-[10px] font-extrabold text-emerald-600 bg-emerald-50 border border-emerald-200 px-2.5 py-0.5 rounded-full">
            <CheckCircle2 className="w-3 h-3" /> Attached
          </span>
        )}
      </div>

      {/* Tab Selector */}
      <div className="flex rounded-xl bg-zinc-100 p-1 text-xs font-bold">
        <button
          type="button"
          onClick={() => setTab("upload")}
          className={`flex-1 py-2 rounded-lg transition-all cursor-pointer ${
            tab === "upload"
              ? "bg-white text-indigo-600 shadow-xs"
              : "text-zinc-500 hover:text-zinc-800"
          }`}
        >
          Upload Signature Image
        </button>
        <button
          type="button"
          onClick={() => setTab("draw")}
          className={`flex-1 py-2 rounded-lg transition-all cursor-pointer ${
            tab === "draw"
              ? "bg-white text-indigo-600 shadow-xs"
              : "text-zinc-500 hover:text-zinc-800"
          }`}
        >
          Draw e-Signature
        </button>
      </div>

      {/* TAB 1: FILE UPLOAD */}
      {tab === "upload" && (
        <div className="space-y-3">
          <label className="border-2 border-dashed border-zinc-200 hover:border-indigo-500 rounded-2xl p-6 flex flex-col items-center justify-center text-center cursor-pointer transition-colors bg-zinc-50/50">
            <input
              type="file"
              accept="image/png, image/jpeg, image/jpg"
              onChange={handleFileChange}
              className="hidden"
            />
            {isUploading ? (
              <Loader2 className="w-6 h-6 animate-spin text-indigo-600" />
            ) : (
              <>
                <Upload className="w-6 h-6 text-indigo-600 mb-2" />
                <span className="text-xs font-bold text-zinc-800">
                  Click to Upload Signature File
                </span>
                <span className="text-[10px] text-zinc-400 font-semibold mt-0.5">
                  PNG, JPG or JPEG (Max 5MB)
                </span>
              </>
            )}
          </label>

          {signatureUploaded && (
            <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-xs font-bold text-emerald-700 flex items-center gap-2">
              <ImageIcon className="w-4 h-4 text-emerald-600" />
              <span className="truncate">Attached File: {signatureUploaded}</span>
            </div>
          )}
        </div>
      )}

      {/* TAB 2: CANVAS DRAWING */}
      {tab === "draw" && (
        <div className="space-y-3">
          <div className="border border-zinc-200 rounded-2xl overflow-hidden bg-zinc-50 relative">
            <canvas
              ref={canvasRef}
              width={480}
              height={140}
              onMouseDown={startDrawing}
              onMouseMove={draw}
              onMouseUp={stopDrawing}
              onMouseLeave={stopDrawing}
              className="w-full h-36 cursor-crosshair touch-none"
            />
            <span className="absolute bottom-2 left-3 text-[10px] text-zinc-400 font-semibold pointer-events-none">
              Sign inside the box using mouse or touch
            </span>
          </div>

          <div className="flex items-center justify-between">
            <button
              type="button"
              onClick={clearCanvas}
              className="text-xs font-bold text-zinc-500 hover:text-zinc-800 flex items-center gap-1 cursor-pointer"
            >
              <RefreshCw className="w-3.5 h-3.5" /> Clear Signature
            </button>

            <button
              type="button"
              onClick={onSaveCanvasSignature}
              disabled={!canvasSignature || isUploading}
              className="h-9 px-4 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold transition-colors cursor-pointer disabled:opacity-50 flex items-center gap-1.5 shadow-xs"
            >
              {isUploading ? (
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
              ) : (
                "Save Drawn Signature"
              )}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
