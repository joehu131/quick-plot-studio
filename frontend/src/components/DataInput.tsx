"use client";

import { useState } from "react";
import { Upload, FileText, Sparkles, Database, ArrowRight } from "lucide-react";
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
    <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-5 shadow-xl backdrop-blur-sm">
      {/* Header Tabs */}
      <div className="flex items-center justify-between border-b border-slate-800 pb-3 mb-4">
        <div className="flex items-center space-x-2">
          <Database className="w-5 h-5 text-indigo-400" />
          <h2 className="text-sm font-semibold text-slate-200">1. Select or Upload Dataset</h2>
        </div>

        <div className="flex items-center bg-slate-950 p-1 rounded-xl border border-slate-800">
          <button
            onClick={() => setActiveTab("presets")}
            className={`px-3 py-1 text-xs font-medium rounded-lg transition-all ${
              activeTab === "presets"
                ? "bg-indigo-600 text-white shadow-md shadow-indigo-600/30"
                : "text-slate-400 hover:text-slate-200"
            }`}
          >
            Presets
          </button>
          <button
            onClick={() => setActiveTab("upload")}
            className={`px-3 py-1 text-xs font-medium rounded-lg transition-all ${
              activeTab === "upload"
                ? "bg-indigo-600 text-white shadow-md shadow-indigo-600/30"
                : "text-slate-400 hover:text-slate-200"
            }`}
          >
            Upload File
          </button>
          <button
            onClick={() => setActiveTab("paste")}
            className={`px-3 py-1 text-xs font-medium rounded-lg transition-all ${
              activeTab === "paste"
                ? "bg-indigo-600 text-white shadow-md shadow-indigo-600/30"
                : "text-slate-400 hover:text-slate-200"
            }`}
          >
            Paste CSV
          </button>
        </div>
      </div>

      {/* Tab 1: Presets */}
      {activeTab === "presets" && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {SAMPLE_DATASETS.map((dataset) => (
            <button
              key={dataset.id}
              onClick={() => handlePresetSelect(dataset)}
              disabled={isLoading}
              className="text-left group p-3.5 rounded-xl border border-slate-800 bg-slate-950/50 hover:bg-indigo-950/20 hover:border-indigo-500/40 transition-all cursor-pointer relative overflow-hidden"
            >
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="text-xs font-bold text-slate-200 group-hover:text-indigo-300 transition-colors">
                    {dataset.name}
                  </h3>
                  <p className="text-[11px] text-slate-400 mt-1 line-clamp-2">
                    {dataset.description}
                  </p>
                </div>
                <ArrowRight className="w-4 h-4 text-slate-500 group-hover:text-indigo-400 transform group-hover:translate-x-0.5 transition-all shrink-0 ml-2" />
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
          className={`border-2 border-dashed rounded-xl p-6 text-center transition-colors ${
            isDragOver
              ? "border-indigo-500 bg-indigo-950/20"
              : "border-slate-800 bg-slate-950/30 hover:border-slate-700"
          }`}
        >
          <Upload className="w-8 h-8 text-indigo-400 mx-auto mb-2" />
          <p className="text-xs text-slate-300 font-medium">
            Drag and drop your CSV file here, or{" "}
            <label className="text-indigo-400 hover:text-indigo-300 cursor-pointer underline">
              browse files
              <input
                type="file"
                accept=".csv,.txt,.tsv"
                onChange={handleFileChange}
                disabled={isLoading}
                className="hidden"
              />
            </label>
          </p>
          <p className="text-[11px] text-slate-500 mt-1">Supports .csv, .tsv, .txt up to 5MB</p>
        </div>
      )}

      {/* Tab 3: Paste CSV */}
      {activeTab === "paste" && (
        <div className="space-y-3">
          <textarea
            value={pastedText}
            onChange={(e) => setPastedText(e.target.value)}
            placeholder="Paste your CSV raw text data here... (e.g., Header1,Header2&#10;val1,val2)"
            rows={4}
            className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-xs text-slate-200 placeholder-slate-500 font-mono focus:outline-none focus:border-indigo-500 transition-colors"
          />
          <button
            onClick={() => onUploadText(pastedText)}
            disabled={isLoading || !pastedText.trim()}
            className="w-full py-2 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white text-xs font-semibold rounded-xl flex items-center justify-center space-x-2 transition-all shadow-md shadow-indigo-600/20"
          >
            <Sparkles className="w-4 h-4" />
            <span>Process & Analyze CSV Text</span>
          </button>
        </div>
      )}
    </div>
  );
}
