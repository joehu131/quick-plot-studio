"use client";

import { useState, useRef, useEffect } from "react";
import { Download, FileCode, Image as ImageIcon, ChevronDown } from "lucide-react";
import { ChartSpec } from "@/types/chart";
import { fetchRenderBlob } from "@/lib/api-client";
import JsonSpecModal from "@/components/JsonSpecModal";

interface ExportToolbarProps {
  datasetId: string | null;
  spec: ChartSpec | null;
  summary?: DatasetSummary | null;
}

export default function ExportToolbar({ datasetId, spec, summary }: ExportToolbarProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isJsonModalOpen, setIsJsonModalOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  if (!datasetId || !spec) return null;

  const handleDownload = async (format: "png" | "jpg" | "svg", dpi: number = 300) => {
    setIsOpen(false);
    try {
      const blob = await fetchRenderBlob(datasetId, spec, format, undefined, dpi);
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      const fileExt = format === "jpg" ? "jpg" : format;
      const suffix = format === "svg" ? "vector" : `${dpi}dpi`;
      a.download = `${spec.title.toLowerCase().replace(/[^a-z0-9]/g, "_")}_${suffix}.${fileExt}`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (err) {
      alert(`Export failed: ${err instanceof Error ? err.message : String(err)}`);
    }
  };

  return (
    <div className="bg-[#F8F9FA] border border-zinc-200 rounded-lg p-3 shadow-sm flex flex-wrap items-center justify-between gap-2.5 font-mono">
      <div className="flex items-center space-x-1.5">
        <Download className="w-3.5 h-3.5 text-[#E27C52]" />
        <span className="text-xs font-bold text-zinc-800">Export Options:</span>
      </div>

      <div className="flex items-center space-x-2">
        {/* Orange Download Dropdown (Opens Upward) */}
        <div className="relative" ref={dropdownRef}>
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="px-3.5 py-1.5 rounded-lg bg-[#E27C52] hover:bg-[#D46B41] text-white text-xs font-bold flex items-center space-x-1.5 transition-colors shadow-2xs cursor-pointer"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Download</span>
            <ChevronDown className={`w-3.5 h-3.5 transition-transform ${isOpen ? "rotate-180" : ""}`} />
          </button>

          {isOpen && (
            <div className="absolute right-0 bottom-full mb-1 w-52 bg-white border border-zinc-200 rounded-lg shadow-xl z-50 py-1 text-xs font-mono text-zinc-800 divide-y divide-zinc-100">
              <div className="py-1">
                <button
                  onClick={() => handleDownload("png", 150)}
                  className="w-full text-left px-3 py-1.5 hover:bg-[#E27C52]/5 hover:text-[#E27C52] flex items-center justify-between cursor-pointer transition-colors"
                >
                  <span className="flex items-center space-x-1.5">
                    <ImageIcon className="w-3.5 h-3.5 text-zinc-400" />
                    <span>PNG Image</span>
                  </span>
                  <span className="text-[10px] text-zinc-400 bg-zinc-100 px-1.5 py-0.5 rounded font-bold">150 DPI</span>
                </button>
                <button
                  onClick={() => handleDownload("png", 300)}
                  className="w-full text-left px-3 py-1.5 hover:bg-[#E27C52]/5 hover:text-[#E27C52] flex items-center justify-between cursor-pointer transition-colors"
                >
                  <span className="flex items-center space-x-1.5">
                    <ImageIcon className="w-3.5 h-3.5 text-[#E27C52]" />
                    <span className="font-semibold">PNG Image</span>
                  </span>
                  <span className="text-[10px] text-[#E27C52] bg-[#E27C52]/10 px-1.5 py-0.5 rounded font-bold">300 DPI</span>
                </button>
              </div>

              <div className="py-1">
                <button
                  onClick={() => handleDownload("jpg", 150)}
                  className="w-full text-left px-3 py-1.5 hover:bg-[#E27C52]/5 hover:text-[#E27C52] flex items-center justify-between cursor-pointer transition-colors"
                >
                  <span className="flex items-center space-x-1.5">
                    <ImageIcon className="w-3.5 h-3.5 text-zinc-400" />
                    <span>JPG Image</span>
                  </span>
                  <span className="text-[10px] text-zinc-400 bg-zinc-100 px-1.5 py-0.5 rounded font-bold">150 DPI</span>
                </button>
                <button
                  onClick={() => handleDownload("jpg", 300)}
                  className="w-full text-left px-3 py-1.5 hover:bg-[#E27C52]/5 hover:text-[#E27C52] flex items-center justify-between cursor-pointer transition-colors"
                >
                  <span className="flex items-center space-x-1.5">
                    <ImageIcon className="w-3.5 h-3.5 text-[#E27C52]" />
                    <span className="font-semibold">JPG Image</span>
                  </span>
                  <span className="text-[10px] text-[#E27C52] bg-[#E27C52]/10 px-1.5 py-0.5 rounded font-bold">300 DPI</span>
                </button>
              </div>

              <div className="py-1">
                <button
                  onClick={() => handleDownload("svg")}
                  className="w-full text-left px-3 py-1.5 hover:bg-[#E27C52]/5 hover:text-[#E27C52] flex items-center justify-between cursor-pointer transition-colors"
                >
                  <span className="flex items-center space-x-1.5">
                    <Download className="w-3.5 h-3.5 text-emerald-600" />
                    <span className="font-semibold text-emerald-700">SVG Vector</span>
                  </span>
                  <span className="text-[10px] text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded font-bold">Vector</span>
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Code & Spec Button -> Opens JsonSpecModal */}
        <button
          onClick={() => setIsJsonModalOpen(true)}
          className="px-3 py-1.5 rounded-lg bg-white hover:bg-zinc-100 text-zinc-700 border border-zinc-200 text-xs font-semibold flex items-center space-x-1.5 transition-colors shadow-2xs cursor-pointer"
        >
          <FileCode className="w-3.5 h-3.5 text-[#E27C52]" />
          <span>Code & Spec</span>
        </button>
      </div>

      {/* JSON Spec Modal */}
      <JsonSpecModal
        isOpen={isJsonModalOpen}
        onClose={() => setIsJsonModalOpen(false)}
        spec={spec}
        summary={summary || null}
      />
    </div>
  );
}
