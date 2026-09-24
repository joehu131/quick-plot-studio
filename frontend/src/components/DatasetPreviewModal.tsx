"use client";

import { useState } from "react";
import { X, Table, Search, Layers } from "lucide-react";
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
      className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs z-50 flex items-center justify-center p-4 overflow-y-auto"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="bg-white border border-surface-border rounded-xl shadow-2xl max-w-5xl w-full max-h-[88vh] flex flex-col overflow-hidden font-body text-text-main"
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-surface-border bg-surface">
          <div className="flex items-center space-x-3">
            <div className="p-2 rounded-lg bg-primary-light border border-primary-border">
              <Table className="w-5 h-5 text-primary" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h2 className="text-base font-bold text-text-main font-heading tracking-tight">
                  Loaded Dataset Preview
                </h2>
                <span className="text-xs font-bold px-2 py-0.5 rounded-md bg-white text-primary border border-primary-border font-code">
                  {summary.row_count} rows × {summary.column_count} cols
                </span>
              </div>
              <p className="text-xs text-text-muted mt-0.5">
                Session ID: <span className="text-text-main font-medium font-code">{summary.dataset_id}</span>
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg hover:bg-zinc-100 text-text-muted hover:text-text-main transition-colors cursor-pointer"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Filter Toolbar */}
        <div className="px-6 py-3 border-b border-surface-border bg-white flex flex-wrap items-center justify-between gap-3">
          <div className="relative flex-1 max-w-xs">
            <Search className="w-4 h-4 absolute left-2.5 top-1/2 -translate-y-1/2 text-text-muted" />
            <input
              type="text"
              placeholder="Search table values..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-surface border border-surface-border rounded-lg pl-8 pr-3 py-1.5 text-xs text-text-main focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary font-body"
            />
          </div>

          {/* Column Tags */}
          <div className="flex items-center space-x-1.5 flex-wrap">
            <span className="text-xs text-text-muted flex items-center space-x-1 mr-1 font-medium">
              <Layers className="w-3.5 h-3.5 text-primary" />
              <span>Inferred Types:</span>
            </span>
            {Object.entries(summary.column_types).map(([col, type]) => (
              <span
                key={col}
                className="bg-surface px-2 py-0.5 rounded border border-surface-border text-[11px] text-text-muted font-code"
              >
                <strong className="text-text-main font-semibold">{col}</strong>:{" "}
                <span className="text-primary font-bold">{type}</span>
              </span>
            ))}
          </div>
        </div>

        {/* Table Content */}
        <div className="p-6 overflow-auto flex-1">
          {filteredRows.length > 0 ? (
            <div className="border border-surface-border rounded-lg overflow-hidden shadow-2xs">
              <table className="w-full text-left text-xs font-code border-collapse">
                <thead>
                  <tr className="bg-surface border-b border-surface-border text-text-main font-semibold">
                    <th className="px-3.5 py-2.5 w-12 text-center text-text-muted border-r border-surface-border font-bold">
                      #
                    </th>
                    {summary.columns.map((col) => (
                      <th
                        key={col}
                        className="px-4 py-2.5 font-bold text-text-main border-r border-surface-border last:border-r-0 whitespace-nowrap"
                      >
                        {col}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-surface-border bg-white">
                  {filteredRows.map((row, idx) => (
                    <tr
                      key={idx}
                      className="hover:bg-primary-light/40 transition-colors text-text-main"
                    >
                      <td className="px-3.5 py-2 text-center text-text-muted bg-surface font-semibold border-r border-surface-border">
                        {idx + 1}
                      </td>
                      {summary.columns.map((col) => (
                        <td
                          key={col}
                          className="px-4 py-2 whitespace-nowrap border-r border-surface-border last:border-r-0"
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
            <div className="py-12 text-center text-xs text-text-muted font-body">
              No matching records found for "{searchTerm}"
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-3 border-t border-surface-border bg-surface flex justify-between items-center font-body">
          <span className="text-xs text-text-muted">
            Showing {filteredRows.length} of {summary.sample_rows.length} sample rows
          </span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 bg-primary hover:bg-primary-hover text-white font-bold text-xs rounded-lg transition-colors shadow-2xs cursor-pointer"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
