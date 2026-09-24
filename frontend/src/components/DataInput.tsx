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
    <div className="bg-surface border border-surface-border rounded-xl p-4 shadow-2xs font-body">
      {/* Header Tabs */}
      <div className="flex items-center justify-between border-b border-surface-border pb-3 mb-3">
        <div className="flex items-center space-x-2">
          <Database className="w-4 h-4 text-primary" />
          <h2 className="text-xs font-bold text-text-main uppercase tracking-wider font-heading">
            1. Select or Upload Dataset
          </h2>
        </div>

        <div className="flex items-center bg-white p-0.5 rounded-lg border border-surface-border shadow-2xs">
          <button
            onClick={() => setActiveTab("presets")}
            className={`px-3 py-1 text-xs rounded-md font-medium transition-all cursor-pointer ${
              activeTab === "presets"
                ? "bg-primary text-white font-bold shadow-xs"
                : "text-text-muted hover:text-text-main"
            }`}
          >
            Presets ({SAMPLE_DATASETS.length})
          </button>
          <button
            onClick={() => setActiveTab("upload")}
            className={`px-3 py-1 text-xs rounded-md font-medium transition-all cursor-pointer ${
              activeTab === "upload"
                ? "bg-primary text-white font-bold shadow-xs"
                : "text-text-muted hover:text-text-main"
            }`}
          >
            Upload File
          </button>
          <button
            onClick={() => setActiveTab("paste")}
            className={`px-3 py-1 text-xs rounded-md font-medium transition-all cursor-pointer ${
              activeTab === "paste"
                ? "bg-primary text-white font-bold shadow-xs"
                : "text-text-muted hover:text-text-main"
            }`}
          >
            Paste CSV
          </button>
        </div>
      </div>

      {/* Tab 1: Presets Grid */}
      {activeTab === "presets" && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5">
          {SAMPLE_DATASETS.map((dataset) => (
            <button
              key={dataset.id}
              onClick={() => handlePresetSelect(dataset)}
              disabled={isLoading}
              className="text-left group p-3 rounded-lg border border-surface-border bg-white hover:border-primary hover:bg-primary-light/50 transition-all cursor-pointer relative shadow-2xs flex flex-col justify-between h-[74px]"
            >
              <div className="flex items-start justify-between">
                <span className="text-[10px] font-semibold tracking-wider uppercase px-2 py-0.5 rounded-full bg-surface text-text-muted group-hover:bg-primary-light group-hover:text-primary transition-colors">
                  {dataset.category}
                </span>
                <ArrowRight className="w-3.5 h-3.5 text-text-muted group-hover:text-primary transform group-hover:translate-x-0.5 transition-all shrink-0 ml-1" />
              </div>
              <div>
                <h3 className="text-xs font-bold text-text-main group-hover:text-primary transition-colors truncate">
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
          className={`border border-dashed rounded-xl p-5 text-center transition-colors ${
            isDragOver
              ? "border-primary bg-primary-light/40"
              : "border-surface-border bg-white hover:border-primary-border"
          }`}
        >
          <Upload className="w-5 h-5 text-primary mx-auto mb-2" />
          <p className="text-xs text-text-main font-medium">
            Drag and drop your CSV file here, or{" "}
            <label className="text-primary hover:underline cursor-pointer font-bold">
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
          <p className="text-[11px] text-text-muted mt-1 font-body">Supports .csv, .tsv, .txt up to 5MB</p>
        </div>
      )}

      {/* Tab 3: Paste CSV */}
      {activeTab === "paste" && (
        <div className="space-y-2.5">
          <textarea
            value={pastedText}
            onChange={(e) => setPastedText(e.target.value)}
            placeholder="Paste raw CSV text here... (Header1,Header2&#10;val1,val2)"
            rows={3}
            className="w-full bg-white border border-surface-border rounded-lg p-2.5 text-xs text-text-main placeholder-text-muted font-body focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-colors"
          />
          <button
            onClick={() => {
              if (pastedText.trim()) {
                onUploadText(pastedText);
              }
            }}
            disabled={isLoading}
            className="w-full px-4 py-2 rounded-lg bg-primary hover:bg-primary-hover text-white text-xs font-bold flex items-center justify-center space-x-1.5 transition-colors shadow-2xs cursor-pointer"
          >
            <Sparkles className="w-3.5 h-3.5 text-white" />
            <span>Process & Analyze CSV</span>
          </button>
        </div>
      )}
    </div>
  );
}
