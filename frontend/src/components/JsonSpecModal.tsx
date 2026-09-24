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
      className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs z-50 flex items-center justify-center p-4 overflow-y-auto font-body"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="bg-white border border-surface-border rounded-xl shadow-2xl max-w-3xl w-full max-h-[85vh] flex flex-col overflow-hidden text-text-main"
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-surface-border bg-surface">
          <div className="flex items-center space-x-3">
            <div className="p-2 rounded-lg bg-primary-light border border-primary-border">
              <Code2 className="w-5 h-5 text-primary" />
            </div>
            <div>
              <h2 className="text-base font-bold text-text-main font-heading tracking-tight">
                Code & Pipeline Inspector
              </h2>
              <p className="text-xs text-text-muted mt-0.5">
                Inspect AI input payload, Pydantic ChartSpec, or copy Seaborn Python code
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg hover:bg-zinc-100 text-text-muted hover:text-text-main transition-colors cursor-pointer"
            aria-label="Close inspector"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Navigation - High-Contrast Segmented Controls */}
        <div className="bg-surface px-6 py-2.5 border-b border-surface-border">
          <div className="inline-flex p-1 bg-surface-border/50 border border-surface-border rounded-lg text-xs space-x-1 flex-wrap gap-y-1">
            <button
              onClick={() => setActiveTab("input")}
              className={`px-3.5 py-1.5 rounded-md font-bold transition-all cursor-pointer ${
                activeTab === "input"
                  ? "bg-primary text-white shadow-xs"
                  : "text-text-muted hover:text-text-main hover:bg-white/60"
              }`}
            >
              Input Payload (JSON)
            </button>

            <button
              onClick={() => setActiveTab("output")}
              className={`px-3.5 py-1.5 rounded-md font-bold transition-all cursor-pointer ${
                activeTab === "output"
                  ? "bg-primary text-white shadow-xs"
                  : "text-text-muted hover:text-text-main hover:bg-white/60"
              }`}
            >
              Output Spec (JSON)
            </button>

            <button
              onClick={() => setActiveTab("code")}
              className={`px-3.5 py-1.5 rounded-md font-bold transition-all cursor-pointer ${
                activeTab === "code"
                  ? "bg-primary text-white shadow-xs"
                  : "text-text-muted hover:text-text-main hover:bg-white/60"
              }`}
            >
              Seaborn Code (Python)
            </button>
          </div>
        </div>

        {/* Content View */}
        <div className="p-6 overflow-auto flex-1 bg-[#18181B] text-[#F4F4F5]">
          <pre className="font-code text-xs leading-relaxed overflow-x-auto">
            <code>{activeContent}</code>
          </pre>
        </div>

        {/* Footer Actions */}
        <div className="px-6 py-3.5 border-t border-surface-border bg-surface flex items-center justify-between">
          <button
            onClick={handleCopy}
            className="px-3.5 py-1.5 rounded-lg bg-white border border-surface-border hover:bg-surface text-text-main text-xs font-bold flex items-center space-x-1.5 transition-colors shadow-2xs cursor-pointer"
          >
            {copied ? (
              <>
                <Check className="w-3.5 h-3.5 text-primary" />
                <span className="text-primary font-bold">Copied!</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5 text-text-muted" />
                <span>
                  Copy {activeTab === "input" ? "Input JSON" : activeTab === "output" ? "Output Spec" : "Python Code"}
                </span>
              </>
            )}
          </button>

          <div className="flex items-center space-x-2">
            <button
              onClick={handleDownload}
              className="px-4 py-1.5 bg-primary hover:bg-primary-hover text-white font-bold text-xs rounded-lg transition-colors flex items-center space-x-1.5 shadow-2xs cursor-pointer"
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
