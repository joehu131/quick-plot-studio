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
  const [pendingUrl, setPendingUrl] = useState<string | null>(null);
  const [isZoomed, setIsZoomed] = useState(false);

  // Revoke Blob URLs on unmount or update to prevent browser memory leaks
  const currentUrlRef = useRef<string | null>(null);

  useEffect(() => {
    if (!imageBlob) return;

    const newUrl = URL.createObjectURL(imageBlob);
    setPendingUrl(newUrl);

    return () => {
      // Cleanup pending URL if unmounted early
    };
  }, [imageBlob]);

  const handleImageLoaded = () => {
    if (pendingUrl) {
      if (currentUrlRef.current) {
        URL.revokeObjectURL(currentUrlRef.current);
      }
      currentUrlRef.current = pendingUrl;
      setCurrentUrl(pendingUrl);
      setPendingUrl(null);
    }
  };

  return (
    <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-5 shadow-xl backdrop-blur-sm flex flex-col justify-between space-y-4">
      {/* Top Bar */}
      <div className="flex items-center justify-between border-b border-slate-800 pb-3">
        <div className="flex items-center space-x-2">
          <ImageIcon className="w-5 h-5 text-indigo-400" />
          <h2 className="text-sm font-semibold text-slate-200">3. Live Rendered Visualization</h2>
        </div>

        {currentUrl && (
          <button
            onClick={() => setIsZoomed(true)}
            className="text-xs text-slate-400 hover:text-slate-200 px-2.5 py-1 rounded-lg bg-slate-950 border border-slate-800 flex items-center space-x-1 transition-colors"
          >
            <Maximize2 className="w-3.5 h-3.5" />
            <span>Full View</span>
          </button>
        )}
      </div>

      {/* Main Image View Container */}
      <div className="relative min-h-[360px] bg-slate-950/80 border border-slate-800/80 rounded-xl flex items-center justify-center p-4 overflow-hidden">
        {/* Loading Spinner Overlay */}
        {isLoading && (
          <div className="absolute inset-0 bg-slate-950/60 backdrop-blur-[2px] z-20 flex flex-col items-center justify-center space-y-2">
            <RefreshCw className="w-7 h-7 text-indigo-400 animate-spin" />
            <p className="text-xs font-medium text-slate-300">Rendering Plot Stream...</p>
          </div>
        )}

        {/* Error State */}
        {error ? (
          <div className="text-center p-6 space-y-2 max-w-md">
            <AlertCircle className="w-8 h-8 text-rose-400 mx-auto" />
            <h3 className="text-xs font-bold text-rose-300">Rendering Error</h3>
            <p className="text-[11px] text-slate-400">{error}</p>
          </div>
        ) : currentUrl ? (
          /* Rendered Image with Double Buffering */
          <div className="relative max-w-full max-h-full flex items-center justify-center">
            {/* Main visible image */}
            <img
              src={currentUrl}
              alt={spec?.title || "Rendered Chart"}
              className="max-h-[460px] w-auto object-contain rounded-lg shadow-2xl transition-opacity duration-200"
            />
            {/* Hidden pre-loader image for double buffering */}
            {pendingUrl && (
              <img
                src={pendingUrl}
                alt="Preloading Chart"
                onLoad={handleImageLoaded}
                className="hidden"
              />
            )}
          </div>
        ) : (
          /* Empty Placeholder State */
          <div className="text-center space-y-3 text-slate-500 py-12">
            <div className="w-12 h-12 rounded-2xl bg-slate-900 border border-slate-800 flex items-center justify-center mx-auto">
              <Sparkles className="w-6 h-6 text-slate-600" />
            </div>
            <p className="text-xs font-medium text-slate-400">
              Select or upload a dataset to generate your AI visualization spec
            </p>
          </div>
        )}
      </div>

      {/* AI Reasoning Box */}
      {spec?.reasoning && (
        <div className="p-3.5 rounded-xl bg-indigo-950/20 border border-indigo-500/20 text-xs text-indigo-200 space-y-1">
          <div className="flex items-center space-x-1.5 font-semibold text-indigo-300">
            <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
            <span>AI Design Rationale:</span>
          </div>
          <p className="text-[11px] text-indigo-300/80 leading-relaxed">
            {spec.reasoning}
          </p>
        </div>
      )}

      {/* Fullscreen Zoom Modal */}
      {isZoomed && currentUrl && (
        <div
          onClick={() => setIsZoomed(false)}
          className="fixed inset-0 bg-slate-950/90 backdrop-blur-md z-50 flex items-center justify-center p-6 cursor-pointer"
        >
          <div className="relative max-w-5xl max-h-[90vh]">
            <img
              src={currentUrl}
              alt={spec?.title || "Zoomed Chart"}
              className="max-h-[85vh] w-auto object-contain rounded-2xl shadow-2xl"
            />
            <p className="text-center text-xs text-slate-400 mt-3">Click anywhere to close full view</p>
          </div>
        </div>
      )}
    </div>
  );
}
