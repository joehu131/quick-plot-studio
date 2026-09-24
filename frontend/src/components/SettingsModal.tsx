"use client";

import { useEffect, useRef } from "react";
import { X, Check, RotateCcw, Palette, Type, Sparkles } from "lucide-react";
import { useTheme } from "@/context/ThemeContext";
import { COLOR_THEMES, FONT_PAIRINGS } from "@/lib/theme";

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function SettingsModal({ isOpen, onClose }: SettingsModalProps) {
  const { currentTheme, currentFont, themeId, fontId, setThemeId, setFontId, resetDefaults } = useTheme();
  const modalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };

    if (isOpen) {
      document.body.style.overflow = "hidden";
      window.addEventListener("keydown", handleKeyDown);
    }

    return () => {
      document.body.style.overflow = "unset";
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-150">
      <div
        ref={modalRef}
        className="bg-white border border-surface-border rounded-xl max-w-md w-full shadow-2xl flex flex-col overflow-hidden font-body"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Compact Modal Header */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-surface-border bg-surface">
          <div className="flex items-center space-x-2">
            <Palette className="w-4 h-4 text-primary" />
            <h2 className="text-xs font-bold text-text-main font-heading">
              Appearance & Typography
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-md text-text-muted hover:text-text-main hover:bg-zinc-100 transition-colors cursor-pointer"
            aria-label="Close settings"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Compact Modal Body */}
        <div className="p-4 overflow-y-auto space-y-4 max-h-[75vh]">
          {/* 1. Color Palette Selection */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-[11px] font-bold text-text-muted uppercase tracking-wider flex items-center space-x-1">
                <Sparkles className="w-3 h-3 text-primary" />
                <span>Color Theme</span>
              </label>
              <span className="text-[10px] text-text-muted">
                Active: <strong className="text-text-main">{currentTheme.name}</strong>
              </span>
            </div>

            <div className="grid grid-cols-2 gap-1.5">
              {Object.values(COLOR_THEMES).map((theme) => {
                const isSelected = theme.id === themeId;
                return (
                  <button
                    key={theme.id}
                    onClick={() => setThemeId(theme.id)}
                    className={`px-2.5 py-2 rounded-lg border text-left transition-all flex items-center justify-between gap-2 cursor-pointer ${
                      isSelected
                        ? "bg-primary-light/40 border-primary shadow-2xs ring-1 ring-primary"
                        : "bg-white hover:bg-surface border-surface-border hover:border-zinc-300"
                    }`}
                  >
                    <div className="flex items-center space-x-2 min-w-0">
                      <div
                        className="w-3.5 h-3.5 rounded-full shrink-0 border border-black/10 shadow-2xs flex items-center justify-center"
                        style={{ backgroundColor: theme.primary }}
                      />
                      <span className="text-xs font-semibold text-text-main truncate">
                        {theme.name}
                      </span>
                    </div>
                    {isSelected && (
                      <Check className="w-3.5 h-3.5 text-primary shrink-0 stroke-[2.5]" />
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* 2. Typography Pairing Selection */}
          <div className="space-y-2 pt-2 border-t border-surface-border">
            <div className="flex items-center justify-between">
              <label className="text-[11px] font-bold text-text-muted uppercase tracking-wider flex items-center space-x-1">
                <Type className="w-3 h-3 text-primary" />
                <span>Typography</span>
              </label>
              <span className="text-[10px] text-text-muted">
                Active: <strong className="text-text-main">{currentFont.name}</strong>
              </span>
            </div>

            <div className="grid grid-cols-1 gap-1.5">
              {Object.values(FONT_PAIRINGS).map((font) => {
                const isSelected = font.id === fontId;
                return (
                  <button
                    key={font.id}
                    onClick={() => setFontId(font.id)}
                    className={`px-3 py-2 rounded-lg border text-left transition-all flex items-center justify-between gap-2 cursor-pointer ${
                      isSelected
                        ? "bg-primary-light/40 border-primary shadow-2xs ring-1 ring-primary"
                        : "bg-white hover:bg-surface border-surface-border hover:border-zinc-300"
                    }`}
                  >
                    <div className="flex items-center space-x-2 min-w-0 flex-wrap gap-y-0.5">
                      <span
                        className="text-xs font-bold text-text-main"
                        style={{ fontFamily: font.headingFamily }}
                      >
                        {font.name}
                      </span>
                      <span className="text-[10px] text-text-muted bg-surface px-1.5 py-0.5 rounded border border-surface-border font-medium font-code">
                        {font.headingName} + {font.bodyName} + {font.codeName}
                      </span>
                    </div>
                    {isSelected && (
                      <Check className="w-3.5 h-3.5 text-primary shrink-0 stroke-[2.5]" />
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Compact Modal Footer */}
        <div className="px-4 py-2.5 border-t border-surface-border bg-surface flex items-center justify-between">
          <button
            onClick={resetDefaults}
            className="flex items-center space-x-1 text-xs text-text-muted hover:text-text-main transition-colors px-2 py-1 rounded hover:bg-zinc-200/60 cursor-pointer font-medium"
          >
            <RotateCcw className="w-3 h-3" />
            <span>Reset</span>
          </button>
          <button
            onClick={onClose}
            className="px-3.5 py-1.5 rounded-lg bg-primary hover:bg-primary-hover text-white text-xs font-bold shadow-2xs transition-colors cursor-pointer"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
}
