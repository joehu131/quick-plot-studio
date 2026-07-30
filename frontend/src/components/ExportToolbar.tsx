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
    <div className="bg-[#F8F9FA] border border-zinc-200 rounded-lg p-3 shadow-sm flex flex-wrap items-center justify-between gap-2.5 font-mono">
      <div className="flex items-center space-x-1.5">
        <Download className="w-3.5 h-3.5 text-[#E27C52]" />
        <span className="text-xs font-bold text-zinc-800">Export:</span>
      </div>

      <div className="flex items-center space-x-2">
        <button
          onClick={() => handleDownload("png")}
          className="px-2.5 py-1 rounded bg-[#E27C52] hover:bg-[#D46B41] text-white text-xs font-bold flex items-center space-x-1 transition-colors shadow-2xs"
        >
          <ImageIcon className="w-3.5 h-3.5" />
          <span>PNG (150 DPI)</span>
        </button>

        <button
          onClick={() => handleDownload("svg")}
          className="px-2.5 py-1 rounded bg-white hover:bg-zinc-100 text-zinc-800 border border-zinc-200 text-xs font-bold flex items-center space-x-1 transition-colors shadow-2xs"
        >
          <Download className="w-3.5 h-3.5 text-zinc-600" />
          <span>SVG</span>
        </button>

        <button
          onClick={handleDownloadJsonSpec}
          className="px-2.5 py-1 rounded bg-white hover:bg-zinc-100 text-zinc-700 border border-zinc-200 text-xs font-semibold flex items-center space-x-1 transition-colors shadow-2xs"
        >
          <FileCode className="w-3.5 h-3.5 text-[#E27C52]" />
          <span>JSON Spec</span>
        </button>
      </div>
    </div>
  );
}
