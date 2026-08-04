"use client";

import { X, BookOpen, ArrowRight, ArrowDown, Database, Zap, Sparkles, Sliders, Image as ImageIcon, Download, FileCode } from "lucide-react";

interface DocsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function DocsModal({ isOpen, onClose }: DocsModalProps) {
  if (!isOpen) return null;

  return (
    <div
      onClick={onClose}
      className="fixed inset-0 bg-zinc-900/60 backdrop-blur-xs z-50 flex items-center justify-center p-4 overflow-y-auto"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="bg-white border border-zinc-200 rounded-xl shadow-2xl max-w-4xl w-full max-h-[92vh] flex flex-col overflow-hidden font-sans text-zinc-900"
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-3.5 border-b border-zinc-200 bg-[#F8F9FA]">
          <div className="flex items-center space-x-3">
            <div className="p-2 rounded-lg bg-[#E27C52]/10 border border-[#E27C52]/20">
              <BookOpen className="w-5 h-5 text-[#E27C52]" />
            </div>
            <div>
              <h2 className="text-base font-bold text-zinc-900 font-mono tracking-tight">
                How QuickPlot Studio Works
              </h2>
              <p className="text-xs text-zinc-500 font-mono mt-0.5">
                Data Transformation & Architecture Flowchart
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg hover:bg-zinc-200 text-zinc-500 hover:text-zinc-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto flex-1 space-y-5">
          
          {/* Intro Text */}
          <div className="bg-white border border-zinc-200 rounded-lg p-4 shadow-2xs space-y-1.5">
            <p className="text-sm text-zinc-700 leading-relaxed">
              <strong className="text-zinc-900 font-semibold">QuickPlot Studio</strong> is an intelligent data visualization engine. When a dataset is uploaded, Gemini AI scans the data profile and returns a <strong className="text-zinc-900 font-semibold">structured JSON specification</strong> (<code className="text-[#E27C52] font-mono text-xs">ChartSpec</code> schema) defining the chart type, suggested title, axis mappings, theme, and grid/background rather than executing unverified AI code.
            </p>
            <p className="text-sm text-zinc-700 leading-relaxed">
              Those JSON values populate the UI controls, allowing real-time customization with sub-50ms Matplotlib re-renders and crisp PNG/SVG downloads.
            </p>
          </div>

          {/* Main Visual Flowchart Container */}
          <div className="bg-[#F8F9FA] border border-zinc-200 rounded-xl p-5 font-mono space-y-4">
            
            {/* Top Row: Steps 1, 2, 3 */}
            <div className="grid grid-cols-1 md:grid-cols-12 gap-3 items-stretch">
              
              {/* Node 1: Client Upload */}
              <div className="md:col-span-3 bg-white border border-zinc-300 rounded-lg p-3 text-center flex flex-col justify-between shadow-2xs space-y-2">
                <div>
                  <div className="w-8 h-8 rounded-lg bg-[#E27C52]/10 text-[#E27C52] border border-[#E27C52]/20 flex items-center justify-center mx-auto mb-1">
                    <Database className="w-4 h-4" />
                  </div>
                  <div className="text-xs font-bold text-zinc-900">1. Upload Dataset</div>
                  <p className="text-[11px] text-zinc-500 font-sans mt-0.5">CSV File or Raw Text</p>
                </div>
                {/* Light CSV Snippet */}
                <div className="bg-zinc-50 border border-zinc-200 text-zinc-800 rounded p-2 text-left text-[10px] leading-tight font-mono">
                  <span className="text-[#E27C52] font-bold block"># Input CSV Snippet</span>
                  <span className="text-zinc-500 font-semibold">Date,Region,Revenue</span>
                  <span className="text-zinc-700 block">2024-01,US,45000</span>
                  <span className="text-zinc-700 block">2024-02,EU,38000</span>
                </div>
              </div>

              {/* Arrow 1 -> 2 */}
              <div className="md:col-span-1 flex items-center justify-center py-1">
                <div className="flex flex-col items-center space-y-1 text-[#E27C52]">
                  <span className="text-[10px] font-bold bg-white px-1.5 py-0.5 rounded border border-zinc-200 shadow-2xs">Upload</span>
                  <ArrowRight className="w-4 h-4 hidden md:block" />
                  <ArrowDown className="w-4 h-4 md:hidden" />
                </div>
              </div>

              {/* Node 2: Server Storage */}
              <div className="md:col-span-4 bg-white border border-zinc-300 rounded-lg p-3 text-center flex flex-col justify-between shadow-2xs space-y-2">
                <div>
                  <div className="w-8 h-8 rounded-lg bg-zinc-100 text-zinc-800 border border-zinc-200 flex items-center justify-center mx-auto mb-1">
                    <Zap className="w-4 h-4 text-[#E27C52]" />
                  </div>
                  <div className="text-xs font-bold text-zinc-900">2. Server Cache</div>
                  <p className="text-[11px] text-zinc-500 font-sans mt-0.5">Parses & caches dataset in memory</p>
                </div>
                {/* Light Session Snippet */}
                <div className="bg-zinc-50 border border-zinc-200 text-zinc-800 rounded p-2 text-left text-[10px] leading-tight font-mono">
                  <span className="text-[#E27C52] font-bold block"># Cached Session</span>
                  <span className="text-zinc-700">dataset_id: <span className="text-zinc-900 font-bold">"ef89cb8f..."</span></span>
                  <span className="text-zinc-500 block">rows: 9 | cols: 3</span>
                </div>
              </div>

              {/* Arrow 2 -> 3 */}
              <div className="md:col-span-1 flex items-center justify-center py-1">
                <div className="flex flex-col items-center space-y-1 text-[#E27C52]">
                  <span className="text-[10px] font-bold bg-white px-1.5 py-0.5 rounded border border-zinc-200 shadow-2xs">Analyze</span>
                  <ArrowRight className="w-4 h-4 hidden md:block" />
                  <ArrowDown className="w-4 h-4 md:hidden" />
                </div>
              </div>

              {/* Node 3: AI Structured Output */}
              <div className="md:col-span-3 bg-white border border-[#E27C52]/40 rounded-lg p-3 text-center flex flex-col justify-between shadow-2xs space-y-2">
                <div>
                  <div className="w-8 h-8 rounded-lg bg-[#E27C52]/10 text-[#E27C52] border border-[#E27C52]/20 flex items-center justify-center mx-auto mb-1">
                    <FileCode className="w-4 h-4" />
                  </div>
                  <div className="text-xs font-bold text-zinc-900">3. Gemini JSON Spec</div>
                  <p className="text-[11px] text-zinc-500 font-sans mt-0.5">Outputs type-safe ChartSpec schema</p>
                </div>
                {/* Light JSON Snippet */}
                <div className="bg-zinc-50 border border-zinc-200 text-zinc-800 rounded p-2 text-left text-[10px] leading-tight font-mono">
                  <span className="text-[#E27C52] font-bold block"># ChartSpec JSON</span>
                  <span className="text-zinc-700">&#123; <span className="text-zinc-900 font-bold">"type"</span>: <span className="text-emerald-700 font-semibold">"bar"</span>,</span>
                  <span className="text-zinc-700 block">  <span className="text-zinc-900 font-bold">"title"</span>: <span className="text-emerald-700 font-semibold">"Sales Trend"</span> &#125;</span>
                </div>
              </div>

            </div>

            {/* Connecting Flow Divider between Step 3 and Step 4 */}
            <div className="relative py-2 flex items-center justify-between">
              <div className="w-full border-t border-dashed border-[#E27C52]/40"></div>
              <span className="absolute left-1/2 -translate-x-1/2 bg-white text-[#E27C52] px-3 py-1 rounded-full border border-[#E27C52]/30 text-[10px] font-bold shadow-2xs font-mono whitespace-nowrap">
                JSON Spec Populates Form Controls (Step 3 ➔ Step 4)
              </span>
            </div>

            {/* Bottom Row: Steps 4, 5, 6 */}
            <div className="grid grid-cols-1 md:grid-cols-12 gap-2.5 items-stretch">
              
              {/* Node 4: Form Controls */}
              <div className="md:col-span-3 bg-white border border-[#E27C52]/40 rounded-lg p-3 text-center flex flex-col justify-between shadow-2xs space-y-2">
                <div>
                  <div className="w-8 h-8 rounded-lg bg-[#E27C52]/10 text-[#E27C52] border border-[#E27C52]/20 flex items-center justify-center mx-auto mb-1">
                    <Sliders className="w-4 h-4" />
                  </div>
                  <div className="text-xs font-bold text-zinc-900">4. Form Controls</div>
                  <p className="text-[11px] text-zinc-500 font-sans mt-0.5">Customize title, axes & colors</p>
                </div>
                {/* Light Controls Snippet */}
                <div className="bg-zinc-50 border border-zinc-200 text-zinc-800 rounded p-2 text-left text-[10px] leading-tight font-mono">
                  <span className="text-[#E27C52] font-bold block"># Live React State</span>
                  <span className="text-zinc-700">x = <span className="text-emerald-700 font-semibold">"Date"</span> | y = <span className="text-emerald-700 font-semibold">"Revenue"</span></span>
                  <span className="text-zinc-[#E27C52]">theme = <span className="text-[#E27C52] font-bold">"burnt_orange"</span></span>
                </div>
              </div>

              {/* Arrow 4 -> 5 */}
              <div className="md:col-span-1 flex items-center justify-center py-1">
                <div className="flex flex-col items-center space-y-1 text-[#E27C52]">
                  <span className="text-[9px] font-bold bg-white px-1 py-0.5 rounded border border-zinc-200 shadow-2xs">Render</span>
                  <ArrowRight className="w-4 h-4 hidden md:block" />
                  <ArrowDown className="w-4 h-4 md:hidden" />
                </div>
              </div>

              {/* Node 5: Chart Display */}
              <div className="md:col-span-4 bg-white border border-zinc-300 rounded-lg p-3 text-center flex flex-col justify-between shadow-2xs space-y-2">
                <div>
                  <div className="w-8 h-8 rounded-lg bg-zinc-100 text-zinc-800 border border-zinc-200 flex items-center justify-center mx-auto mb-1">
                    <ImageIcon className="w-4 h-4 text-[#E27C52]" />
                  </div>
                  <div className="text-xs font-bold text-zinc-900">5. Image Stream</div>
                  <p className="text-[11px] text-zinc-500 font-sans mt-0.5">Renders image stream instantly</p>
                </div>
                {/* Light Render Output Snippet */}
                <div className="bg-zinc-50 border border-zinc-200 text-zinc-800 rounded p-2 text-left text-[10px] leading-tight font-mono">
                  <span className="text-[#E27C52] font-bold block"># Matplotlib Stream</span>
                  <span className="text-zinc-700">HTTP 200 image/png</span>
                  <span className="text-zinc-500 block">Resolution: 300 DPI (BytesIO)</span>
                </div>
              </div>

              {/* Arrow 5 -> 6 */}
              <div className="md:col-span-1 flex items-center justify-center py-1">
                <div className="flex flex-col items-center space-y-1 text-[#E27C52]">
                  <span className="text-[9px] font-bold bg-white px-1 py-0.5 rounded border border-zinc-200 shadow-2xs">Export</span>
                  <ArrowRight className="w-4 h-4 hidden md:block" />
                  <ArrowDown className="w-4 h-4 md:hidden" />
                </div>
              </div>

              {/* Node 6: Download SVG / PNG */}
              <div className="md:col-span-3 bg-white border border-[#E27C52]/40 rounded-lg p-3 text-center flex flex-col justify-between shadow-2xs space-y-2">
                <div>
                  <div className="w-8 h-8 rounded-lg bg-[#E27C52]/10 text-[#E27C52] border border-[#E27C52]/20 flex items-center justify-center mx-auto mb-1">
                    <Download className="w-4 h-4" />
                  </div>
                  <div className="text-xs font-bold text-zinc-900">6. Download SVG / PNG</div>
                  <p className="text-[11px] text-zinc-500 font-sans mt-0.5">Export high-res PNG or vector SVG</p>
                </div>
                {/* Light Download Snippet */}
                <div className="bg-zinc-50 border border-zinc-200 text-zinc-800 rounded p-2 text-left text-[10px] leading-tight font-mono">
                  <span className="text-emerald-700 font-bold block"># Export Toolbar</span>
                  <span className="text-zinc-700">Filename: <span className="text-zinc-900 font-bold">"chart.png"</span></span>
                  <span className="text-zinc-500 block">Vector SVG / 300 DPI PNG</span>
                </div>
              </div>

            </div>

          </div>

        </div>

        {/* Footer */}
        <div className="px-6 py-3 border-t border-zinc-200 bg-[#F8F9FA] flex justify-end font-mono">
          <button
            onClick={onClose}
            className="px-5 py-1.5 bg-[#E27C52] hover:bg-[#D46B41] text-white font-bold text-xs rounded-lg transition-colors shadow-2xs"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
