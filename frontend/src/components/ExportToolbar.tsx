"use client";

import { Download, FileCode, Image as ImageIcon } from "lucide-react";
import { ChartSpec } from "@/types/chart";
import { fetchRenderBlob } from "@/lib/api-client";

interface ExportToolbarProps {
  datasetId: string | null;
  spec: ChartSpec | null;
}

export default function ExportToolbar({ datasetId, spec }: ExportToolbarProps) {
  if (!datasetId || !spec) return null;

  const handleDownload = async (format: "png" | "svg") => {
    try {
      const blob = await fetchRenderBlob(datasetId, spec, format);
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `${spec.title.toLowerCase().replace(/[^a-z0-9]/g, "_")}.${format}`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (err) {
      alert(`Export failed: ${err instanceof Error ? err.message : String(err)}`);
    }
  };

  const handleDownloadJsonSpec = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(spec, null, 2));
    const a = document.createElement("a");
    a.href = dataStr;
    a.download = `${spec.title.toLowerCase().replace(/[^a-z0-9]/g, "_")}_spec.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  return (
    <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-4 shadow-xl backdrop-blur-sm flex flex-wrap items-center justify-between gap-3">
      <div className="flex items-center space-x-2">
        <Download className="w-4 h-4 text-indigo-400" />
        <span className="text-xs font-semibold text-slate-300">Export Options:</span>
      </div>

      <div className="flex items-center space-x-2">
        <button
          onClick={() => handleDownload("png")}
          className="px-3 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold flex items-center space-x-1.5 transition-all shadow-md shadow-indigo-600/20"
        >
          <ImageIcon className="w-3.5 h-3.5" />
          <span>Download PNG</span>
        </button>

        <button
          onClick={() => handleDownload("svg")}
          className="px-3 py-1.5 rounded-xl bg-slate-950 hover:bg-slate-800 text-slate-200 border border-slate-800 text-xs font-semibold flex items-center space-x-1.5 transition-colors"
        >
          <Download className="w-3.5 h-3.5" />
          <span>Download SVG</span>
        </button>

        <button
          onClick={handleDownloadJsonSpec}
          className="px-3 py-1.5 rounded-xl bg-slate-950 hover:bg-slate-800 text-slate-300 border border-slate-800 text-xs font-medium flex items-center space-x-1.5 transition-colors"
        >
          <FileCode className="w-3.5 h-3.5 text-indigo-400" />
          <span>JSON Spec</span>
        </button>
      </div>
    </div>
  );
}
