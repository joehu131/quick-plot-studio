"use client";

import { X, BookOpen, ArrowRight, ArrowDown, Database, Zap, Sliders, Image as ImageIcon, Download, FileCode } from "lucide-react";

interface DocsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function DocsModal({ isOpen, onClose }: DocsModalProps) {
  if (!isOpen) return null;

  return (
    <div
      onClick={onClose}
      className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs z-50 flex items-center justify-center p-4 overflow-y-auto"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="bg-white border border-surface-border rounded-xl shadow-2xl max-w-4xl w-full max-h-[92vh] flex flex-col overflow-hidden font-body text-text-main"
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-surface-border bg-surface">
          <div className="flex items-center space-x-3">
            <div className="p-2 rounded-lg bg-primary-light border border-primary-border">
              <BookOpen className="w-5 h-5 text-primary" />
            </div>
            <div>
              <h2 className="text-base font-bold text-text-main font-heading tracking-tight">
                How QuickPlot Studio Works
              </h2>
              <p className="text-xs text-text-muted mt-0.5">
                Data Transformation & Architecture Flowchart
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg hover:bg-zinc-100 text-text-muted hover:text-text-main transition-colors cursor-pointer"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto flex-1 space-y-5">
          {/* Intro Text */}
          <div className="bg-white border border-surface-border rounded-xl p-4 shadow-2xs space-y-1.5">
            <p className="text-sm text-text-main leading-relaxed">
              <strong className="text-text-main font-bold">QuickPlot Studio</strong> is an intelligent dataset visualization engine. When a dataset is uploaded, Gemini AI scans the data profile and returns a <strong className="text-text-main font-bold">structured JSON specification</strong> (<code className="text-primary font-code text-xs font-semibold">ChartSpec</code> schema) defining the chart type, suggested title, axis mappings, theme, and grid/background.
            </p>
          </div>

          {/* Main Visual Flowchart Container */}
          <div className="bg-surface border border-surface-border rounded-xl p-5 space-y-4">
            {/* Top Row: Steps 1, 2, 3 */}
            <div className="grid grid-cols-1 md:grid-cols-12 gap-3 items-stretch">
              {/* Node 1: Client Upload */}
              <div className="md:col-span-3 bg-white border border-surface-border rounded-xl p-3.5 text-center flex flex-col justify-between shadow-2xs space-y-2">
                <div>
                  <div className="w-8 h-8 rounded-lg bg-primary-light text-primary border border-primary-border flex items-center justify-center mx-auto mb-1.5">
                    <Database className="w-4 h-4" />
                  </div>
                  <div className="text-xs font-bold text-text-main font-heading">1. Upload Dataset</div>
                  <p className="text-xs text-text-muted mt-0.5">CSV File or Raw Text</p>
                </div>
                <div className="bg-surface border border-surface-border text-text-main rounded-md p-2 text-left text-[11px] leading-tight font-code">
                  <span className="text-primary font-bold block"># Input CSV Snippet</span>
                  <span className="text-text-muted font-semibold">Date,Region,Revenue</span>
                  <span className="text-text-main block">2024-01,US,45000</span>
                  <span className="text-text-main block">2024-02,EU,38000</span>
                </div>
              </div>

              {/* Arrow 1 -> 2 */}
              <div className="md:col-span-1 flex items-center justify-center py-1">
                <div className="flex flex-col items-center space-y-1 text-primary">
                  <span className="text-[10px] font-bold bg-white px-2 py-0.5 rounded border border-surface-border shadow-2xs">Upload</span>
                  <ArrowRight className="w-4 h-4 hidden md:block" />
                  <ArrowDown className="w-4 h-4 md:hidden" />
                </div>
              </div>

              {/* Node 2: Server Storage */}
              <div className="md:col-span-4 bg-white border border-surface-border rounded-xl p-3.5 text-center flex flex-col justify-between shadow-2xs space-y-2">
                <div>
                  <div className="w-8 h-8 rounded-lg bg-surface text-text-main border border-surface-border flex items-center justify-center mx-auto mb-1.5">
                    <Zap className="w-4 h-4 text-primary" />
                  </div>
                  <div className="text-xs font-bold text-text-main font-heading">2. Server Cache</div>
                  <p className="text-xs text-text-muted mt-0.5">Parses & caches dataset in memory</p>
                </div>
                <div className="bg-surface border border-surface-border text-text-main rounded-md p-2 text-left text-[11px] leading-tight font-code">
                  <span className="text-primary font-bold block"># Cached Session</span>
                  <span className="text-text-muted">dataset_id: <span className="text-text-main font-bold">"ef89cb8f..."</span></span>
                  <span className="text-text-muted block">rows: 9 | cols: 3</span>
                </div>
              </div>

              {/* Arrow 2 -> 3 */}
              <div className="md:col-span-1 flex items-center justify-center py-1">
                <div className="flex flex-col items-center space-y-1 text-primary">
                  <span className="text-[10px] font-bold bg-white px-2 py-0.5 rounded border border-surface-border shadow-2xs">Analyze</span>
                  <ArrowRight className="w-4 h-4 hidden md:block" />
                  <ArrowDown className="w-4 h-4 md:hidden" />
                </div>
              </div>

              {/* Node 3: AI Structured Output */}
              <div className="md:col-span-3 bg-white border border-primary-border rounded-xl p-3.5 text-center flex flex-col justify-between shadow-2xs space-y-2">
                <div>
                  <div className="w-8 h-8 rounded-lg bg-primary-light text-primary border border-primary-border flex items-center justify-center mx-auto mb-1.5">
                    <FileCode className="w-4 h-4" />
                  </div>
                  <div className="text-xs font-bold text-text-main font-heading">3. Gemini JSON Spec</div>
                  <p className="text-xs text-text-muted mt-0.5">Outputs type-safe ChartSpec</p>
                </div>
                <div className="bg-surface border border-surface-border text-text-main rounded-md p-2 text-left text-[11px] leading-tight font-code">
                  <span className="text-primary font-bold block"># ChartSpec JSON</span>
                  <span className="text-text-muted">&#123; <span className="text-text-main font-bold">"type"</span>: <span className="text-primary font-semibold">"bar"</span>,</span>
                  <span className="text-text-muted block">  <span className="text-text-main font-bold">"title"</span>: <span className="text-primary font-semibold">"Sales Trend"</span> &#125;</span>
                </div>
              </div>
            </div>

            {/* Connecting Flow Divider between Step 3 and Step 4 */}
            <div className="relative py-2 flex items-center justify-between">
              <div className="w-full border-t border-dashed border-primary-border"></div>
              <span className="absolute left-1/2 -translate-x-1/2 bg-white text-primary px-3 py-1 rounded-full border border-primary-border text-[11px] font-bold shadow-2xs whitespace-nowrap">
                JSON Spec Populates Form Controls (Step 3 ➔ Step 4)
              </span>
            </div>

            {/* Bottom Row: Steps 4, 5, 6 */}
            <div className="grid grid-cols-1 md:grid-cols-12 gap-2.5 items-stretch">
              {/* Node 4: Form Controls */}
              <div className="md:col-span-3 bg-white border border-primary-border rounded-xl p-3.5 text-center flex flex-col justify-between shadow-2xs space-y-2">
                <div>
                  <div className="w-8 h-8 rounded-lg bg-primary-light text-primary border border-primary-border flex items-center justify-center mx-auto mb-1.5">
                    <Sliders className="w-4 h-4" />
                  </div>
                  <div className="text-xs font-bold text-text-main font-heading">4. Form Controls</div>
                  <p className="text-xs text-text-muted mt-0.5">Customize title, axes & theme</p>
                </div>
                <div className="bg-surface border border-surface-border text-text-main rounded-md p-2 text-left text-[11px] leading-tight font-code">
                  <span className="text-primary font-bold block"># Live React State</span>
                  <span className="text-text-muted">x = <span className="text-primary font-semibold">"Date"</span> | y = <span className="text-primary font-semibold">"Revenue"</span></span>
                  <span className="text-text-muted">theme = <span className="text-primary font-bold">"viridis"</span></span>
                </div>
              </div>

              {/* Arrow 4 -> 5 */}
              <div className="md:col-span-1 flex items-center justify-center py-1">
                <div className="flex flex-col items-center space-y-1 text-primary">
                  <span className="text-[10px] font-bold bg-white px-2 py-0.5 rounded border border-surface-border shadow-2xs">Render</span>
                  <ArrowRight className="w-4 h-4 hidden md:block" />
                  <ArrowDown className="w-4 h-4 md:hidden" />
                </div>
              </div>

              {/* Node 5: Chart Display */}
              <div className="md:col-span-4 bg-white border border-surface-border rounded-xl p-3.5 text-center flex flex-col justify-between shadow-2xs space-y-2">
                <div>
                  <div className="w-8 h-8 rounded-lg bg-surface text-text-main border border-surface-border flex items-center justify-center mx-auto mb-1.5">
                    <ImageIcon className="w-4 h-4 text-primary" />
                  </div>
                  <div className="text-xs font-bold text-text-main font-heading">5. Image Stream</div>
                  <p className="text-xs text-text-muted mt-0.5">Renders image stream instantly</p>
                </div>
                <div className="bg-surface border border-surface-border text-text-main rounded-md p-2 text-left text-[11px] leading-tight font-code">
                  <span className="text-primary font-bold block"># Matplotlib Stream</span>
                  <span className="text-text-muted">HTTP 200 image/png</span>
                  <span className="text-text-muted block">Resolution: 300 DPI (BytesIO)</span>
                </div>
              </div>

              {/* Arrow 5 -> 6 */}
              <div className="md:col-span-1 flex items-center justify-center py-1">
                <div className="flex flex-col items-center space-y-1 text-primary">
                  <span className="text-[10px] font-bold bg-white px-2 py-0.5 rounded border border-surface-border shadow-2xs">Export</span>
                  <ArrowRight className="w-4 h-4 hidden md:block" />
                  <ArrowDown className="w-4 h-4 md:hidden" />
                </div>
              </div>

              {/* Node 6: Download SVG / PNG */}
              <div className="md:col-span-3 bg-white border border-primary-border rounded-xl p-3.5 text-center flex flex-col justify-between shadow-2xs space-y-2">
                <div>
                  <div className="w-8 h-8 rounded-lg bg-primary-light text-primary border border-primary-border flex items-center justify-center mx-auto mb-1.5">
                    <Download className="w-4 h-4" />
                  </div>
                  <div className="text-xs font-bold text-text-main font-heading">6. Download Files</div>
                  <p className="text-xs text-text-muted mt-0.5">Export high-res PNG or vector SVG</p>
                </div>
                <div className="bg-surface border border-surface-border text-text-main rounded-md p-2 text-left text-[11px] leading-tight font-code">
                  <span className="text-primary font-bold block"># Export Toolbar</span>
                  <span className="text-text-muted">File: <span className="text-text-main font-bold">"chart.png"</span></span>
                  <span className="text-text-muted block">Vector SVG / 300 DPI PNG</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-3.5 border-t border-surface-border bg-surface flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-1.5 bg-primary hover:bg-primary-hover text-white font-bold text-xs rounded-lg transition-colors shadow-2xs cursor-pointer"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
