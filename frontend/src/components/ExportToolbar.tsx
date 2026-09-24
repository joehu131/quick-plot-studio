"use client";

import { useState, useRef, useEffect } from "react";
import { Download, FileCode, Image as ImageIcon, ChevronDown } from "lucide-react";
import { ChartSpec, DatasetSummary } from "@/types/chart";
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
    <div className="bg-surface border border-surface-border rounded-xl p-3.5 shadow-2xs flex flex-wrap items-center justify-between gap-2.5 font-body">
      <div className="flex items-center space-x-2">
        <Download className="w-4 h-4 text-primary" />
        <span className="text-xs font-bold text-text-main font-heading">Export Options:</span>
      </div>

      <div className="flex items-center space-x-2">
        {/* Primary Download Dropdown (Opens Upward) */}
        <div className="relative" ref={dropdownRef}>
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="px-3.5 py-1.5 rounded-lg bg-primary hover:bg-primary-hover text-white text-xs font-bold flex items-center space-x-1.5 transition-colors shadow-2xs cursor-pointer"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Download</span>
            <ChevronDown className={`w-3.5 h-3.5 transition-transform ${isOpen ? "rotate-180" : ""}`} />
          </button>

          {isOpen && (
            <div className="absolute right-0 bottom-full mb-1 w-52 bg-white border border-surface-border rounded-lg shadow-xl z-50 py-1 text-xs text-text-main divide-y divide-surface-border">
              <div className="py-1">
                <button
                  onClick={() => handleDownload("png", 150)}
                  className="w-full text-left px-3 py-1.5 hover:bg-surface hover:text-primary flex items-center justify-between cursor-pointer transition-colors"
                >
                  <span className="flex items-center space-x-1.5">
                    <ImageIcon className="w-3.5 h-3.5 text-text-muted" />
                    <span>PNG Image</span>
                  </span>
                  <span className="text-[10px] text-text-muted bg-surface px-1.5 py-0.5 rounded font-bold font-body">150 DPI</span>
                </button>
                <button
                  onClick={() => handleDownload("png", 300)}
                  className="w-full text-left px-3 py-1.5 hover:bg-primary-light hover:text-primary flex items-center justify-between cursor-pointer transition-colors"
                >
                  <span className="flex items-center space-x-1.5">
                    <ImageIcon className="w-3.5 h-3.5 text-primary" />
                    <span className="font-semibold text-primary">PNG Image</span>
                  </span>
                  <span className="text-[10px] text-primary bg-primary-light px-1.5 py-0.5 rounded font-bold font-body">300 DPI</span>
                </button>
              </div>

              <div className="py-1">
                <button
                  onClick={() => handleDownload("jpg", 150)}
                  className="w-full text-left px-3 py-1.5 hover:bg-surface hover:text-primary flex items-center justify-between cursor-pointer transition-colors"
                >
                  <span className="flex items-center space-x-1.5">
                    <ImageIcon className="w-3.5 h-3.5 text-text-muted" />
                    <span>JPG Image</span>
                  </span>
                  <span className="text-[10px] text-text-muted bg-surface px-1.5 py-0.5 rounded font-bold font-body">150 DPI</span>
                </button>
                <button
                  onClick={() => handleDownload("jpg", 300)}
                  className="w-full text-left px-3 py-1.5 hover:bg-primary-light hover:text-primary flex items-center justify-between cursor-pointer transition-colors"
                >
                  <span className="flex items-center space-x-1.5">
                    <ImageIcon className="w-3.5 h-3.5 text-primary" />
                    <span className="font-semibold text-primary">JPG Image</span>
                  </span>
                  <span className="text-[10px] text-primary bg-primary-light px-1.5 py-0.5 rounded font-bold font-body">300 DPI</span>
                </button>
              </div>

              <div className="py-1">
                <button
                  onClick={() => handleDownload("svg")}
                  className="w-full text-left px-3 py-1.5 hover:bg-primary-light hover:text-primary flex items-center justify-between cursor-pointer transition-colors"
                >
                  <span className="flex items-center space-x-1.5">
                    <Download className="w-3.5 h-3.5 text-primary" />
                    <span className="font-semibold text-primary">SVG Vector</span>
                  </span>
                  <span className="text-[10px] text-primary bg-primary-light px-1.5 py-0.5 rounded font-bold font-body">Vector</span>
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Code & Spec Button -> Opens JsonSpecModal */}
        <button
          onClick={() => setIsJsonModalOpen(true)}
          className="px-3 py-1.5 rounded-lg bg-white hover:bg-surface text-text-main border border-surface-border text-xs font-semibold flex items-center space-x-1.5 transition-colors shadow-2xs cursor-pointer"
        >
          <FileCode className="w-3.5 h-3.5 text-primary" />
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
