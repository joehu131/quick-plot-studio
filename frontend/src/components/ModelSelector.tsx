"use client";

import { useState, useRef, useEffect } from "react";
import { Sparkles, ChevronDown, Check } from "lucide-react";

export interface ModelOption {
  value: string;
  label: string;
  badge?: string;
  description?: string;
}

export const MODEL_OPTIONS: ModelOption[] = [
  {
    value: "gemini-3.5-flash-lite",
    label: "Gemini 3.5 Flash Lite",
    badge: "Recommended",
    description: "Fast, lightweight standard model with 500 req/day quota",
  },
  {
    value: "gemini-3.6-flash",
    label: "Gemini 3.6 Flash",
    badge: "Heavy Duty",
    description: "High capability model for complex multi-series datasets",
  },
  {
    value: "gemma-4-26b-a4b-it",
    label: "gemma-4-26b-a4b-it",
    badge: "AI Fallback",
    description: "Open Gemma architecture secondary AI fallback model",
  },
  {
    value: "rule-based",
    label: "Rule-Based Engine (No AI)",
    badge: "Instant 0ms",
    description: "Deterministic statistical rules without LLM calls",
  },
];

interface ModelSelectorProps {
  selectedModel: string;
  onModelChange: (modelValue: string) => void;
}

export default function ModelSelector({ selectedModel, onModelChange }: ModelSelectorProps) {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const activeOption = MODEL_OPTIONS.find((opt) => opt.value === selectedModel) || MODEL_OPTIONS[0];

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSelect = (value: string) => {
    onModelChange(value);
    setIsOpen(false);
  };

  return (
    <div className="relative inline-block font-mono" ref={containerRef}>
      {/* Pill Trigger */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="inline-flex items-center space-x-1.5 px-2.5 py-1 rounded-md text-[11px] bg-[#E27C52]/10 text-[#E27C52] border border-[#E27C52]/30 font-bold hover:bg-[#E27C52]/20 transition-all shadow-2xs cursor-pointer select-none"
      >
        <Sparkles className="w-3 h-3 text-[#E27C52] shrink-0" />
        <span>{activeOption.label}</span>
        <ChevronDown className={`w-3 h-3 text-[#E27C52] transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`} />
      </button>

      {/* Floating Dropdown Menu Panel */}
      {isOpen && (
        <div className="absolute left-0 top-full mt-1.5 w-76 bg-white border border-zinc-200 rounded-lg shadow-xl z-50 overflow-hidden py-1 font-sans animate-in fade-in zoom-in-95 duration-100">
          <div className="px-3 py-1.5 border-b border-zinc-100 bg-[#F8F9FA] flex items-center justify-between text-[10px] font-mono text-zinc-500 font-semibold uppercase tracking-wider">
            <span>Select Engine Model</span>
            <span className="text-[#E27C52]">4 Options</span>
          </div>

          <div className="py-1">
            {MODEL_OPTIONS.map((option) => {
              const isSelected = option.value === selectedModel;
              return (
                <button
                  key={option.value}
                  onClick={() => handleSelect(option.value)}
                  className={`w-full text-left px-3 py-2 flex items-start justify-between hover:bg-[#E27C52]/5 transition-colors cursor-pointer group ${
                    isSelected ? "bg-[#E27C52]/10" : ""
                  }`}
                >
                  <div className="space-y-0.5">
                    <div className="flex items-center space-x-1.5">
                      <span className={`text-xs font-bold font-mono ${isSelected ? "text-[#E27C52]" : "text-zinc-900 group-hover:text-[#E27C52]"}`}>
                        {option.label}
                      </span>
                      {option.badge && (
                        <span className={`text-[9px] font-mono font-bold px-1.5 py-0.2 rounded border ${
                          option.badge === "Recommended"
                            ? "bg-[#E27C52]/10 text-[#E27C52] border-[#E27C52]/30"
                            : option.badge === "Heavy Duty"
                            ? "bg-purple-100 text-purple-700 border-purple-200"
                            : "bg-zinc-100 text-zinc-600 border-zinc-200"
                        }`}>
                          {option.badge}
                        </span>
                      )}
                    </div>
                    {option.description && (
                      <p className="text-[10px] text-zinc-500 line-clamp-1 font-sans">
                        {option.description}
                      </p>
                    )}
                  </div>

                  {isSelected && (
                    <Check className="w-3.5 h-3.5 text-[#E27C52] shrink-0 ml-2 mt-0.5" />
                  )}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
