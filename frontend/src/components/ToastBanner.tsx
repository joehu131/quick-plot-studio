"use client";

import { useState, useEffect } from "react";
import { AlertTriangle, X, ShieldAlert } from "lucide-react";

interface ToastBannerProps {
  reasoning?: string | null;
}

export default function ToastBanner({ reasoning }: ToastBannerProps) {
  const [visible, setVisible] = useState(false);
  const [fallbackMessage, setFallbackMessage] = useState<string | null>(null);
  const [isStatistical, setIsStatistical] = useState(false);

  useEffect(() => {
    if (!reasoning) {
      setVisible(false);
      return;
    }

    if (reasoning.includes("[Fallback:")) {
      const match = reasoning.match(/\[Fallback:\s*([^\]]+)\]/);
      if (match) {
        setFallbackMessage(match[1]);
        setIsStatistical(reasoning.includes("statistical heuristic"));
        setVisible(true);
      }
    } else {
      setVisible(false);
    }
  }, [reasoning]);

  if (!visible || !fallbackMessage) return null;

  return (
    <div
      className={`rounded-xl p-3.5 border shadow-2xs font-body text-xs transition-all duration-200 flex items-start justify-between space-x-3 ${
        isStatistical
          ? "bg-rose-50/80 border-rose-200 text-rose-900"
          : "bg-amber-50/80 border-amber-200 text-amber-900"
      }`}
    >
      <div className="flex items-start space-x-2.5">
        {isStatistical ? (
          <ShieldAlert className="w-4 h-4 text-rose-600 mt-0.5 shrink-0" />
        ) : (
          <AlertTriangle className="w-4 h-4 text-amber-600 mt-0.5 shrink-0" />
        )}
        <div className="space-y-0.5">
          <div className="font-bold tracking-tight font-heading">
            {isStatistical ? "Statistical Engine Fallback" : "Model Auto-Fallback Notice"}
          </div>
          <p className="text-xs leading-relaxed opacity-90 font-body">
            {fallbackMessage}
          </p>
        </div>
      </div>

      <button
        onClick={() => setVisible(false)}
        className="p-1 rounded-md hover:bg-black/5 transition-colors text-zinc-500 hover:text-zinc-800 shrink-0 cursor-pointer"
        title="Dismiss notice"
      >
        <X className="w-3.5 h-3.5" />
      </button>
    </div>
  );
}
