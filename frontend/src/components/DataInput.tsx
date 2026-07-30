"use client";

import { useState } from "react";
import { Upload, Sparkles, Database, ArrowRight } from "lucide-react";
import { SAMPLE_DATASETS, SampleDataset } from "@/lib/sample-data";

interface DataInputProps {
  onUploadFile: (file: File) => void;
  onUploadText: (csvText: string) => void;
  isLoading: boolean;
}

export default function DataInput({ onUploadFile, onUploadText, isLoading }: DataInputProps) {
  const [activeTab, setActiveTab] = useState<"presets" | "upload" | "paste">("presets");
  const [pastedText, setPastedText] = useState("");
  const [isDragOver, setIsDragOver] = useState(false);

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      onUploadFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      onUploadFile(e.target.files[0]);
    }
  };

  const handlePresetSelect = (preset: SampleDataset) => {
    onUploadText(preset.csvText);
  };

  return (
    <div className="bg-[#F8F9FA] border border-zinc-200 rounded-lg p-3.5 shadow-sm">
      {/* Header Tabs */}
      <div className="flex items-center justify-between border-b border-zinc-200 pb-2.5 mb-3">
        <div className="flex items-center space-x-2">
          <Database className="w-4 h-4 text-[#E27C52]" />
          <h2 className="text-xs font-bold text-zinc-800 uppercase tracking-wider font-mono">
            1. Select or Upload Dataset
          </h2>
        </div>

        <div className="flex items-center bg-white p-0.5 rounded border border-zinc-200">
          <button
            onClick={() => setActiveTab("presets")}
            className={`px-2.5 py-1 text-[11px] font-mono rounded transition-colors ${
              activeTab === "presets"
                ? "bg-[#E27C52] text-white font-bold shadow-2xs"
                : "text-zinc-600 hover:text-zinc-900"
            }`}
          >
            Presets ({SAMPLE_DATASETS.length})
          </button>
          <button
            onClick={() => setActiveTab("upload")}
            className={`px-2.5 py-1 text-[11px] font-mono rounded transition-colors ${
              activeTab === "upload"
                ? "bg-[#E27C52] text-white font-bold shadow-2xs"
                : "text-zinc-600 hover:text-zinc-900"
            }`}
          >
            Upload File
          </button>
          <button
            onClick={() => setActiveTab("paste")}
            className={`px-2.5 py-1 text-[11px] font-mono rounded transition-colors ${
              activeTab === "paste"
                ? "bg-[#E27C52] text-white font-bold shadow-2xs"
                : "text-zinc-600 hover:text-zinc-900"
            }`}
          >
            Paste CSV
          </button>
        </div>
      </div>

      {/* Tab 1: Slimmer Presets Grid (4 Columns) */}
      {activeTab === "presets" && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2">
          {SAMPLE_DATASETS.map((dataset) => (
            <button
              key={dataset.id}
              onClick={() => handlePresetSelect(dataset)}
              disabled={isLoading}
              className="text-left group p-2.5 rounded-md border border-zinc-200 bg-white hover:border-[#E27C52] hover:bg-[#E27C52]/5 transition-all cursor-pointer relative shadow-2xs flex flex-col justify-between h-[68px]"
            >
              <div className="flex items-start justify-between">
                <span className="text-[9px] font-mono font-bold tracking-wider uppercase px-1.5 py-0.5 rounded bg-zinc-100 text-zinc-600 group-hover:bg-[#E27C52]/10 group-hover:text-[#E27C52] transition-colors">
                  {dataset.category}
                </span>
                <ArrowRight className="w-3 h-3 text-zinc-300 group-hover:text-[#E27C52] transform group-hover:translate-x-0.5 transition-all shrink-0 ml-1" />
              </div>
              <div>
                <h3 className="text-xs font-bold text-zinc-900 group-hover:text-[#E27C52] font-mono transition-colors truncate">
                  {dataset.name}
                </h3>
              </div>
            </button>
          ))}
        </div>
      )}

      {/* Tab 2: Upload File */}
      {activeTab === "upload" && (
        <div
          onDragOver={(e) => {
            e.preventDefault();
            setIsDragOver(true);
          }}
          onDragLeave={() => setIsDragOver(false)}
          onDrop={handleDrop}
          className={`border border-dashed rounded-lg p-4 text-center transition-colors ${
            isDragOver
              ? "border-[#E27C52] bg-[#E27C52]/5"
              : "border-zinc-300 bg-white hover:border-zinc-400"
          }`}
        >
          <Upload className="w-5 h-5 text-[#E27C52] mx-auto mb-1.5" />
          <p className="text-xs text-zinc-700 font-medium">
            Drag and drop your CSV file here, or{" "}
            <label className="text-[#E27C52] hover:underline cursor-pointer font-mono font-bold">
              browse
              <input
                type="file"
                accept=".csv,.txt,.tsv"
                onChange={handleFileChange}
                disabled={isLoading}
                className="hidden"
              />
            </label>
          </p>
          <p className="text-[10px] text-zinc-400 mt-0.5 font-mono">Supports .csv, .tsv, .txt up to 5MB</p>
        </div>
      )}

      {/* Tab 3: Paste CSV */}
      {activeTab === "paste" && (
        <div className="space-y-2">
          <textarea
            value={pastedText}
            onChange={(e) => setPastedText(e.target.value)}
            placeholder="Paste raw CSV text here... (Header1,Header2&#10;val1,val2)"
            rows={3}
            className="w-full bg-white border border-zinc-200 rounded-md p-2 text-xs text-zinc-900 placeholder-zinc-400 font-mono focus:outline-none focus:border-[#E27C52] transition-colors"
          />
          <button
            onClick={() => onUploadText(pastedText)}
            disabled={isLoading || !pastedText.trim()}
            className="w-full py-1.5 bg-[#E27C52] hover:bg-[#D46B41] disabled:opacity-50 text-white text-xs font-bold rounded-md flex items-center justify-center space-x-1.5 transition-colors font-mono shadow-2xs"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Process & Analyze CSV</span>
          </button>
        </div>
      )}
    </div>
  );
}
