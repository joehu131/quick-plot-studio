"use client";

import { useState } from "react";
import { X, Code2, Copy, Check, Download } from "lucide-react";
import { ChartSpec, DatasetSummary } from "@/types/chart";
import { generateSeabornCode } from "@/lib/code-generator";

interface JsonSpecModalProps {
  isOpen: boolean;
  onClose: () => void;
  spec: ChartSpec | null;
  summary: DatasetSummary | null;
}

export default function JsonSpecModal({ isOpen, onClose, spec, summary }: JsonSpecModalProps) {
  const [activeTab, setActiveTab] = useState<"input" | "output" | "code">("input");
  const [copied, setCopied] = useState(false);

  if (!isOpen || !spec) return null;

  const inputJsonString = summary
    ? JSON.stringify(
        {
          dataset_id: summary.dataset_id,
          row_count: summary.row_count,
          column_count: summary.column_count,
          columns: summary.columns,
          column_types: summary.column_types,
          sample_rows: summary.sample_rows,
        },
        null,
        2
      )
    : "// Dataset summary profile unavailable";

  const outputJsonString = JSON.stringify(spec, null, 2);
  const pythonCodeString = generateSeabornCode(spec);

  let activeContent = "";
  if (activeTab === "input") activeContent = inputJsonString;
  else if (activeTab === "output") activeContent = outputJsonString;
  else activeContent = pythonCodeString;

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(activeContent);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Fallback
    }
  };

  const handleDownload = () => {
    let filename = "";
    let mimeType = "data:text/json;charset=utf-8,";

    const titleSlug = spec.title.toLowerCase().replace(/[^a-z0-9]/g, "_");

    if (activeTab === "input") {
      filename = `${titleSlug}_input_summary.json`;
    } else if (activeTab === "output") {
      filename = `${titleSlug}_chart_spec.json`;
    } else {
      filename = `${titleSlug}_seaborn_script.py`;
      mimeType = "data:text/x-python;charset=utf-8,";
    }

    const dataStr = mimeType + encodeURIComponent(activeContent);
    const a = document.createElement("a");
    a.href = dataStr;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  return (
    <div
      onClick={onClose}
      className="fixed inset-0 bg-zinc-900/60 backdrop-blur-xs z-50 flex items-center justify-center p-4 overflow-y-auto font-sans"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="bg-white border border-zinc-200 rounded-xl shadow-2xl max-w-3xl w-full max-h-[85vh] flex flex-col overflow-hidden text-zinc-900"
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-zinc-200 bg-[#F8F9FA]">
          <div className="flex items-center space-x-3">
            <div className="p-2 rounded-lg bg-[#E27C52]/10 border border-[#E27C52]/20">
              <Code2 className="w-5 h-5 text-[#E27C52]" />
            </div>
            <div>
              <h2 className="text-base font-bold text-zinc-900 font-mono tracking-tight">
                Code & Pipeline Inspector
              </h2>
              <p className="text-xs text-zinc-500 font-mono mt-0.5">
                Inspect AI input payload, Pydantic ChartSpec, or copy Seaborn Python code
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg hover:bg-zinc-200 text-zinc-500 hover:text-zinc-800 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Navigation - High-Contrast Segmented Controls */}
        <div className="bg-[#F8F9FA] px-6 py-2.5 border-b border-zinc-200">
          <div className="inline-flex p-1 bg-zinc-200/80 rounded-lg font-mono text-xs space-x-1 flex-wrap gap-y-1">
            <button
              onClick={() => setActiveTab("input")}
              className={`px-3.5 py-1.5 rounded-md font-bold transition-all cursor-pointer ${
                activeTab === "input"
                  ? "bg-[#E27C52] text-white shadow-2xs"
                  : "text-zinc-600 hover:text-zinc-900 hover:bg-zinc-100"
              }`}
            >
              Input Payload (JSON)
            </button>

            <button
              onClick={() => setActiveTab("output")}
              className={`px-3.5 py-1.5 rounded-md font-bold transition-all cursor-pointer ${
                activeTab === "output"
                  ? "bg-[#E27C52] text-white shadow-2xs"
                  : "text-zinc-600 hover:text-zinc-900 hover:bg-zinc-100"
              }`}
            >
              Output Spec (JSON)
            </button>

            <button
              onClick={() => setActiveTab("code")}
              className={`px-3.5 py-1.5 rounded-md font-bold transition-all cursor-pointer ${
                activeTab === "code"
                  ? "bg-[#E27C52] text-white shadow-2xs"
                  : "text-zinc-600 hover:text-zinc-900 hover:bg-zinc-100"
              }`}
            >
              Seaborn Code (Python)
            </button>
          </div>
        </div>

        {/* Content View */}
        <div className="p-6 overflow-auto flex-1 bg-[#18181B] text-[#F4F4F5]">
          <pre className="font-mono text-xs leading-relaxed overflow-x-auto selection:bg-[#E27C52] selection:text-white">
            <code>{activeContent}</code>
          </pre>
        </div>

        {/* Footer Actions */}
        <div className="px-6 py-3.5 border-t border-zinc-200 bg-[#F8F9FA] flex items-center justify-between font-mono">
          <button
            onClick={handleCopy}
            className="px-3.5 py-1.5 rounded-lg bg-white border border-zinc-200 hover:bg-zinc-100 text-zinc-800 text-xs font-bold flex items-center space-x-1.5 transition-colors shadow-2xs cursor-pointer"
          >
            {copied ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-600" />
                <span className="text-emerald-600">Copied!</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5 text-zinc-500" />
                <span>
                  Copy {activeTab === "input" ? "Input JSON" : activeTab === "output" ? "Output Spec" : "Python Code"}
                </span>
              </>
            )}
          </button>

          <div className="flex items-center space-x-2">
            <button
              onClick={handleDownload}
              className="px-4 py-1.5 bg-[#E27C52] hover:bg-[#D46B41] text-white font-bold text-xs rounded-lg transition-colors flex items-center space-x-1.5 shadow-2xs cursor-pointer"
            >
              <Download className="w-3.5 h-3.5" />
              <span>
                Download {activeTab === "input" ? "Input JSON" : activeTab === "output" ? "Chart Spec" : "Python Script"}
              </span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
