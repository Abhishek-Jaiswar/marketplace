import React, { useState } from "react"
import {
  PenTool,
  Upload,
  RefreshCw,
  CheckCircle2,
  Loader2,
  Image as ImageIcon,
} from "lucide-react"

export interface OnboardSignaturePadProps {
  signatureUploaded?: string | null
  canvasSignature?: string | null
  onUploadFile: (file: File) => Promise<void>
  onSaveCanvasSignature: () => Promise<void>
  clearCanvas: () => void
  isUploading?: boolean
  canvasRef: React.RefObject<HTMLCanvasElement | null>
  startDrawing: (e: React.MouseEvent<HTMLCanvasElement>) => void
  draw: (e: React.MouseEvent<HTMLCanvasElement>) => void
  stopDrawing: () => void
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
  const [tab, setTab] = useState<"upload" | "draw">("upload")

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      onUploadFile(e.target.files[0])
    }
  }

  return (
    <div className="flex flex-col gap-4 rounded-3xl border border-zinc-200/80 bg-white p-6 text-left shadow-xs">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="flex h-7 w-7 items-center justify-center rounded-lg border border-indigo-100 bg-indigo-50 text-indigo-600">
            <PenTool className="h-4 w-4" />
          </div>
          <h3 className="text-sm leading-none font-extrabold text-zinc-900">
            Digital Signature Verification
          </h3>
        </div>

        {signatureUploaded && (
          <span className="flex items-center gap-1 rounded-full border border-emerald-200 bg-emerald-50 px-2.5 py-0.5 text-[10px] font-extrabold text-emerald-600">
            <CheckCircle2 className="h-3 w-3" /> Attached
          </span>
        )}
      </div>

      {/* Tab Selector */}
      <div className="flex rounded-xl bg-zinc-100 p-1 text-xs font-bold">
        <button
          type="button"
          onClick={() => setTab("upload")}
          className={`flex-1 cursor-pointer rounded-lg py-2 transition-all ${
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
          className={`flex-1 cursor-pointer rounded-lg py-2 transition-all ${
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
          <label className="flex cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed border-zinc-200 bg-zinc-50/50 p-6 text-center transition-colors hover:border-indigo-500">
            <input
              type="file"
              accept="image/png, image/jpeg, image/jpg"
              onChange={handleFileChange}
              className="hidden"
            />
            {isUploading ? (
              <Loader2 className="h-6 w-6 animate-spin text-indigo-600" />
            ) : (
              <>
                <Upload className="mb-2 h-6 w-6 text-indigo-600" />
                <span className="text-xs font-bold text-zinc-800">
                  Click to Upload Signature File
                </span>
                <span className="mt-0.5 text-[10px] font-semibold text-zinc-400">
                  PNG, JPG or JPEG (Max 5MB)
                </span>
              </>
            )}
          </label>

          {signatureUploaded && (
            <div className="flex items-center gap-2 rounded-xl border border-emerald-200 bg-emerald-50 p-3 text-xs font-bold text-emerald-700">
              <ImageIcon className="h-4 w-4 text-emerald-600" />
              <span className="truncate">
                Attached File: {signatureUploaded}
              </span>
            </div>
          )}
        </div>
      )}

      {/* TAB 2: CANVAS DRAWING */}
      {tab === "draw" && (
        <div className="space-y-3">
          <div className="relative overflow-hidden rounded-2xl border border-zinc-200 bg-zinc-50">
            <canvas
              ref={canvasRef}
              width={480}
              height={140}
              onMouseDown={startDrawing}
              onMouseMove={draw}
              onMouseUp={stopDrawing}
              onMouseLeave={stopDrawing}
              className="h-36 w-full cursor-crosshair touch-none"
            />
            <span className="pointer-events-none absolute bottom-2 left-3 text-[10px] font-semibold text-zinc-400">
              Sign inside the box using mouse or touch
            </span>
          </div>

          <div className="flex items-center justify-between">
            <button
              type="button"
              onClick={clearCanvas}
              className="flex cursor-pointer items-center gap-1 text-xs font-bold text-zinc-500 hover:text-zinc-800"
            >
              <RefreshCw className="h-3.5 w-3.5" /> Clear Signature
            </button>

            <button
              type="button"
              onClick={onSaveCanvasSignature}
              disabled={!canvasSignature || isUploading}
              className="flex h-9 cursor-pointer items-center gap-1.5 rounded-lg bg-indigo-600 px-4 text-xs font-bold text-white shadow-xs transition-colors hover:bg-indigo-700 disabled:opacity-50"
            >
              {isUploading ? (
                <Loader2 className="h-3.5 w-3.5 animate-spin" />
              ) : (
                "Save Drawn Signature"
              )}
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
