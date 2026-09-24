"use client";

import { useState } from "react";
import { BookOpen, Settings } from "lucide-react";
import DocsModal from "@/components/DocsModal";
import SettingsModal from "@/components/SettingsModal";
import ModelSelector from "@/components/ModelSelector";

interface HeaderProps {
  selectedModel: string;
  onModelChange: (newModel: string) => void;
}

export default function Header({ selectedModel, onModelChange }: HeaderProps) {
  const [isDocsOpen, setIsDocsOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  return (
    <>
      <header className="border-b border-surface-border bg-white sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-14 flex items-center justify-between">
          {/* Brand & Dynamic Model Selector */}
          <div className="flex items-center space-x-3">
            <img src="/logo.svg" alt="QuickPlot Studio Logo" className="h-9 w-9 shrink-0" />
            <div className="flex items-center space-x-2.5">
              <span className="font-bold text-base tracking-tight text-text-main font-heading">
                QuickPlot Studio
              </span>

              {/* Custom Styled Model Selector Component */}
              <ModelSelector
                selectedModel={selectedModel}
                onModelChange={onModelChange}
              />
            </div>
          </div>

          {/* Right Controls: [Settings Gear] -> [Docs Button] -> [GitHub Button] */}
          <div className="flex items-center space-x-2">
            {/* 1. Settings Gear Button */}
            <button
              onClick={() => setIsSettingsOpen(true)}
              className="p-1.5 rounded-lg bg-surface hover:bg-zinc-100 text-text-muted hover:text-text-main border border-surface-border transition-colors cursor-pointer shadow-2xs"
              aria-label="Theme & Typography Settings"
              title="Theme & Typography Settings"
            >
              <Settings className="w-4 h-4 text-text-main" />
            </button>

            {/* 2. Docs Button */}
            <button
              onClick={() => setIsDocsOpen(true)}
              className="flex items-center space-x-1.5 px-2.5 py-1.5 rounded-lg bg-primary-light hover:bg-primary-light/80 text-primary border border-primary-border transition-colors text-xs font-semibold shadow-2xs cursor-pointer"
            >
              <BookOpen className="w-3.5 h-3.5" />
              <span>Docs</span>
            </button>

            {/* 3. GitHub Button */}
            <a
              href="https://github.com/joehu131/QuickPlotStudio"
              target="_blank"
              rel="noreferrer"
              className="flex items-center space-x-1.5 px-2.5 py-1.5 rounded-lg bg-zinc-900 hover:bg-zinc-800 text-white border border-zinc-800 transition-colors text-xs font-semibold"
            >
              <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
                <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
              </svg>
              <span className="hidden sm:inline">GitHub</span>
            </a>
          </div>
        </div>
      </header>

      {/* Docs Modal */}
      <DocsModal isOpen={isDocsOpen} onClose={() => setIsDocsOpen(false)} />

      {/* Settings Modal */}
      <SettingsModal isOpen={isSettingsOpen} onClose={() => setIsSettingsOpen(false)} />
    </>
  );
}
