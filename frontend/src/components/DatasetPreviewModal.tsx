"use client";

import { useState } from "react";
import { X, Table, Search, Database, Layers } from "lucide-react";
import { DatasetSummary } from "@/types/chart";

interface DatasetPreviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  summary: DatasetSummary | null;
}

export default function DatasetPreviewModal({
  isOpen,
  onClose,
  summary,
}: DatasetPreviewModalProps) {
  const [searchTerm, setSearchTerm] = useState("");

  if (!isOpen || !summary) return null;

  const filteredRows = summary.sample_rows.filter((row) =>
    Object.values(row).some((val) =>
      String(val).toLowerCase().includes(searchTerm.toLowerCase())
    )
  );

  return (
    <div
      onClick={onClose}
      className="fixed inset-0 bg-zinc-900/60 backdrop-blur-xs z-50 flex items-center justify-center p-4 overflow-y-auto"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="bg-white border border-zinc-200 rounded-xl shadow-2xl max-w-5xl w-full max-h-[88vh] flex flex-col overflow-hidden font-sans text-zinc-900"
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-zinc-200 bg-[#F8F9FA]">
          <div className="flex items-center space-x-3">
            <div className="p-2 rounded-lg bg-[#E27C52]/10 border border-[#E27C52]/20">
              <Table className="w-5 h-5 text-[#E27C52]" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h2 className="text-base font-bold text-zinc-900 font-mono tracking-tight">
                  Loaded Dataset Preview
                </h2>
                <span className="text-[11px] font-mono font-bold px-2 py-0.5 rounded bg-white text-[#E27C52] border border-[#E27C52]/30">
                  {summary.row_count} rows × {summary.column_count} cols
                </span>
              </div>
              <p className="text-xs text-zinc-500 font-mono mt-0.5">
                Session ID: <span className="text-zinc-700 font-medium">{summary.dataset_id}</span>
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

        {/* Filter Toolbar */}
        <div className="px-6 py-3 border-b border-zinc-200 bg-white flex flex-wrap items-center justify-between gap-3">
          <div className="relative flex-1 max-w-xs">
            <Search className="w-4 h-4 absolute left-2.5 top-1/2 -translate-y-1/2 text-zinc-400" />
            <input
              type="text"
              placeholder="Search table values..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-[#F8F9FA] border border-zinc-200 rounded-lg pl-8 pr-3 py-1.5 text-xs font-mono text-zinc-900 focus:outline-none focus:border-[#E27C52]"
            />
          </div>

          {/* Column Tags */}
          <div className="flex items-center space-x-1.5 flex-wrap">
            <span className="text-xs font-mono text-zinc-500 flex items-center space-x-1 mr-1">
              <Layers className="w-3 h-3 text-[#E27C52]" />
              <span>Inferred Types:</span>
            </span>
            {Object.entries(summary.column_types).map(([col, type]) => (
              <span
                key={col}
                className="bg-[#F8F9FA] px-2 py-0.5 rounded border border-zinc-200 text-[10px] font-mono text-zinc-700"
              >
                <strong className="text-zinc-900 font-bold">{col}</strong>:{" "}
                <span className="text-[#E27C52]">{type}</span>
              </span>
            ))}
          </div>
        </div>

        {/* Table Content */}
        <div className="p-6 overflow-auto flex-1">
          {filteredRows.length > 0 ? (
            <div className="border border-zinc-200 rounded-lg overflow-hidden shadow-2xs">
              <table className="w-full text-left text-xs font-mono border-collapse">
                <thead>
                  <tr className="bg-[#F8F9FA] border-b border-zinc-200 text-zinc-700">
                    <th className="px-3.5 py-2.5 font-bold w-12 text-center text-zinc-400 border-r border-zinc-200">
                      #
                    </th>
                    {summary.columns.map((col) => (
                      <th
                        key={col}
                        className="px-4 py-2.5 font-bold text-zinc-900 border-r border-zinc-200 last:border-r-0 whitespace-nowrap"
                      >
                        {col}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-200 bg-white">
                  {filteredRows.map((row, idx) => (
                    <tr
                      key={idx}
                      className="hover:bg-[#E27C52]/5 transition-colors text-zinc-800"
                    >
                      <td className="px-3.5 py-2 text-center text-zinc-400 bg-[#F8F9FA] font-semibold border-r border-zinc-200">
                        {idx + 1}
                      </td>
                      {summary.columns.map((col) => (
                        <td
                          key={col}
                          className="px-4 py-2 whitespace-nowrap border-r border-zinc-200 last:border-r-0"
                        >
                          {row[col] !== undefined && row[col] !== null
                            ? String(row[col])
                            : <span className="text-zinc-400 italic">null</span>}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="py-12 text-center text-xs font-mono text-zinc-500">
              No matching records found for "{searchTerm}"
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-3 border-t border-zinc-200 bg-[#F8F9FA] flex justify-between items-center font-mono">
          <span className="text-xs text-zinc-500">
            Showing {filteredRows.length} of {summary.sample_rows.length} sample rows
          </span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 bg-[#E27C52] hover:bg-[#D46B41] text-white font-bold text-xs rounded-lg transition-colors shadow-2xs"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
