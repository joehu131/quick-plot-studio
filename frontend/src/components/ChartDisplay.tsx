"use client";

import { useEffect, useState, useRef } from "react";
import { Sparkles, Maximize2, RefreshCw, AlertCircle, Image as ImageIcon } from "lucide-react";
import { ChartSpec } from "@/types/chart";

interface ChartDisplayProps {
  imageBlob: Blob | null;
  spec: ChartSpec | null;
  isLoading: boolean;
  error: string | null;
}

export default function ChartDisplay({
  imageBlob,
  spec,
  isLoading,
  error,
}: ChartDisplayProps) {
  const [currentUrl, setCurrentUrl] = useState<string | null>(null);
  const [isZoomed, setIsZoomed] = useState(false);
  const currentUrlRef = useRef<string | null>(null);

  useEffect(() => {
    if (!imageBlob) return;

    const newUrl = URL.createObjectURL(imageBlob);
    
    if (currentUrlRef.current) {
      URL.revokeObjectURL(currentUrlRef.current);
    }

    currentUrlRef.current = newUrl;
    setCurrentUrl(newUrl);
  }, [imageBlob]);

  return (
    <div className="bg-[#F8F9FA] border border-zinc-200 rounded-lg p-4 shadow-sm flex flex-col justify-between space-y-3.5">
      {/* Top Bar */}
      <div className="flex items-center justify-between border-b border-zinc-200 pb-3">
        <div className="flex items-center space-x-2">
          <ImageIcon className="w-4 h-4 text-[#E27C52]" />
          <h2 className="text-xs font-bold text-zinc-800 uppercase tracking-wider font-mono">
            3. Live Rendered Visualization
          </h2>
        </div>

        {currentUrl && (
          <button
            onClick={() => setIsZoomed(true)}
            className="text-[11px] font-mono text-zinc-600 hover:text-zinc-900 px-2 py-1 rounded bg-white border border-zinc-200 flex items-center space-x-1 transition-colors font-medium shadow-2xs cursor-pointer"
          >
            <Maximize2 className="w-3 h-3 text-[#E27C52]" />
            <span>Full View</span>
          </button>
        )}
      </div>

      {/* Main Image View Container */}
      <div className="relative min-h-[360px] bg-[#F8F9FA] border border-zinc-200 rounded-lg flex items-center justify-center p-3 overflow-hidden">
        {/* Loading Spinner Overlay */}
        {isLoading && (
          <div className="absolute inset-0 bg-white/80 backdrop-blur-[2px] z-20 flex flex-col items-center justify-center space-y-2">
            <RefreshCw className="w-6 h-6 text-[#E27C52] animate-spin" />
            <p className="text-xs font-mono text-zinc-700 font-semibold">Rendering Plot Stream...</p>
          </div>
        )}

        {/* Error State */}
        {error ? (
          <div className="text-center p-5 space-y-1.5 max-w-md">
            <AlertCircle className="w-7 h-7 text-rose-500 mx-auto" />
            <h3 className="text-xs font-bold text-rose-700 font-mono">Rendering Error</h3>
            <p className="text-[11px] text-zinc-600 font-mono">{error}</p>
          </div>
        ) : currentUrl ? (
          /* Rendered Image — Clickable to open full view modal */
          <div
            onClick={() => setIsZoomed(true)}
            title="Click to open full view"
            className="relative max-w-full max-h-full flex items-center justify-center cursor-pointer group"
          >
            <img
              src={currentUrl}
              alt={spec?.title || "Rendered Chart"}
              style={{ imageRendering: "-webkit-optimize-contrast" }}
              className="max-h-[460px] w-auto object-contain rounded border border-zinc-200/50 shadow-xs group-hover:opacity-95 transition-opacity duration-150"
            />
            <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity bg-zinc-900/70 text-white text-[10px] font-mono px-2 py-0.5 rounded backdrop-blur-xs flex items-center space-x-1">
              <Maximize2 className="w-3 h-3 text-[#E27C52]" />
              <span>Click for Full View</span>
            </div>
          </div>
        ) : (
          /* Empty Placeholder State */
          <div className="text-center space-y-2 text-zinc-400 py-12">
            <div className="w-10 h-10 rounded-lg bg-white border border-zinc-200 flex items-center justify-center mx-auto shadow-2xs">
              <Sparkles className="w-5 h-5 text-zinc-400" />
            </div>
            <p className="text-xs font-mono text-zinc-600">
              Select or upload a dataset to generate your AI visualization spec
            </p>
          </div>
        )}
      </div>

      {/* AI Reasoning Box */}
      {spec?.reasoning && (
        <div className="p-3 rounded-lg bg-white border border-zinc-200 text-xs text-zinc-800 space-y-1 shadow-2xs">
          <div className="flex items-center space-x-1.5 font-bold text-[#E27C52] font-mono text-[11px]">
            <Sparkles className="w-3 h-3 text-[#E27C52]" />
            <span>AI Design Rationale:</span>
          </div>
          <p className="text-[11px] text-zinc-600 leading-relaxed font-mono">
            {spec.reasoning}
          </p>
        </div>
      )}

      {/* Fullscreen Zoom Modal */}
      {isZoomed && currentUrl && (
        <div
          onClick={() => setIsZoomed(false)}
          className="fixed inset-0 bg-zinc-900/60 backdrop-blur-xs z-50 flex items-center justify-center p-6 cursor-pointer"
        >
          <div className="relative max-w-5xl max-h-[90vh]">
            <img
              src={currentUrl}
              alt={spec?.title || "Zoomed Chart"}
              style={{ imageRendering: "-webkit-optimize-contrast" }}
              className="max-h-[85vh] w-auto object-contain rounded-lg border border-zinc-200 bg-white shadow-2xl p-2"
            />
            <p className="text-center text-xs font-mono text-zinc-300 mt-3">Click anywhere to close full view</p>
          </div>
        </div>
      )}
    </div>
  );
}
