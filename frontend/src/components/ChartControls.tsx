"use client";

import { SlidersHorizontal, Palette, Layout, Type, Layers, Info } from "lucide-react";
import { ChartSpec, ChartType, AggregationType, ColorPalette, StyleTheme } from "@/types/chart";

interface ChartControlsProps {
  spec: ChartSpec;
  columns: string[];
  onChange: (updatedSpec: ChartSpec) => void;
  onReAnalyze: () => void;
  isAnalyzing: boolean;
}

export default function ChartControls({
  spec,
  columns,
  onChange,
  onReAnalyze,
  isAnalyzing,
}: ChartControlsProps) {
  const handleChange = (field: keyof ChartSpec, value: unknown) => {
    onChange({
      ...spec,
      [field]: value,
    });
  };

  return (
    <div className="bg-[#F8F9FA] border border-zinc-200 rounded-lg p-4 shadow-sm space-y-4">
      {/* Header & AI Re-analyze button */}
      <div className="flex items-center justify-between border-b border-zinc-200 pb-3">
        <div className="flex items-center space-x-2">
          <SlidersHorizontal className="w-4 h-4 text-[#E27C52]" />
          <h2 className="text-xs font-bold text-zinc-800 uppercase tracking-wider font-mono">
            2. Real-Time Spec Controls
          </h2>
        </div>
        <button
          onClick={onReAnalyze}
          disabled={isAnalyzing}
          className="text-[11px] font-mono font-bold px-2.5 py-1 rounded bg-white hover:bg-[#E27C52]/5 text-[#E27C52] border border-[#E27C52]/30 transition-colors flex items-center space-x-1"
        >
          <span>Re-Analyze AI</span>
        </button>
      </div>

      {/* Chart Title */}
      <div>
        <label className="block text-xs font-mono font-medium text-zinc-600 mb-1 flex items-center space-x-1">
          <Type className="w-3 h-3 text-[#E27C52]" />
          <span>Chart Title</span>
        </label>
        <input
          type="text"
          value={spec.title}
          onChange={(e) => handleChange("title", e.target.value)}
          className="w-full bg-white border border-zinc-200 rounded-lg px-2.5 py-1.5 text-xs text-zinc-900 focus:outline-none focus:border-[#E27C52] font-semibold"
        />
      </div>

      {/* Grid Row 1: Chart Type & Aggregation */}
      <div className="grid grid-cols-2 gap-2.5">
        <div>
          <label className="block text-xs font-mono font-medium text-zinc-600 mb-1 flex items-center space-x-1">
            <Layout className="w-3 h-3 text-[#E27C52]" />
            <span>Chart Type</span>
          </label>
          <select
            value={spec.chart_type}
            onChange={(e) => handleChange("chart_type", e.target.value as ChartType)}
            className="w-full bg-white border border-zinc-200 rounded-lg px-2.5 py-1.5 text-xs text-zinc-900 focus:outline-none focus:border-[#E27C52] font-mono"
          >
            <option value="bar">Bar Chart</option>
            <option value="line">Line Plot</option>
            <option value="scatter">Scatter Plot</option>
            <option value="histogram">Histogram</option>
            <option value="box">Box Plot</option>
            <option value="pie">Pie Chart</option>
            <option value="heatmap">Heatmap</option>
          </select>
        </div>

        <div>
          <label className="block text-xs font-mono font-medium text-zinc-600 mb-1 flex items-center space-x-1">
            <Layers className="w-3 h-3 text-[#E27C52]" />
            <span>Aggregation</span>
          </label>
          <select
            value={spec.aggregation}
            onChange={(e) => handleChange("aggregation", e.target.value as AggregationType)}
            className="w-full bg-white border border-zinc-200 rounded-lg px-2.5 py-1.5 text-xs text-zinc-900 focus:outline-none focus:border-[#E27C52] font-mono"
          >
            <option value="none">None (Raw)</option>
            <option value="sum">Sum</option>
            <option value="mean">Mean</option>
            <option value="count">Count</option>
            <option value="median">Median</option>
          </select>
        </div>
      </div>

      {/* Grid Row 2: X Column & Y Column */}
      <div className="grid grid-cols-2 gap-2.5">
        <div>
          <label className="block text-xs font-mono font-medium text-zinc-600 mb-1">X-Axis Column</label>
          <select
            value={spec.x_column}
            onChange={(e) => handleChange("x_column", e.target.value)}
            className="w-full bg-white border border-zinc-200 rounded-lg px-2.5 py-1.5 text-xs text-zinc-900 focus:outline-none focus:border-[#E27C52] font-mono"
          >
            {columns.map((col) => (
              <option key={col} value={col}>
                {col}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-xs font-mono font-medium text-zinc-600 mb-1">Y-Axis Column</label>
          <select
            value={spec.y_column || ""}
            onChange={(e) => handleChange("y_column", e.target.value || null)}
            className="w-full bg-white border border-zinc-200 rounded-lg px-2.5 py-1.5 text-xs text-zinc-900 focus:outline-none focus:border-[#E27C52] font-mono"
          >
            <option value="">(None)</option>
            {columns.map((col) => (
              <option key={col} value={col}>
                {col}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Hue Column */}
      <div>
        <label className="block text-xs font-mono font-medium text-zinc-600 mb-1">Hue / Group Column</label>
        <select
          value={spec.hue_column || ""}
          onChange={(e) => handleChange("hue_column", e.target.value || null)}
          className="w-full bg-white border border-zinc-200 rounded-lg px-2.5 py-1.5 text-xs text-zinc-900 focus:outline-none focus:border-[#E27C52] font-mono"
        >
          <option value="">(None)</option>
          {columns.map((col) => (
            <option key={col} value={col}>
              {col}
            </option>
          ))}
        </select>
      </div>

      {/* Grid Row 3: Palette & Style Theme */}
      <div className="grid grid-cols-2 gap-2.5">
        <div>
          <label className="block text-xs font-mono font-medium text-zinc-600 mb-1 flex items-center space-x-1">
            <Palette className="w-3 h-3 text-[#E27C52]" />
            <span>Color Palette</span>
          </label>
          <select
            value={spec.palette}
            onChange={(e) => handleChange("palette", e.target.value as ColorPalette)}
            className="w-full bg-white border border-zinc-200 rounded-lg px-2.5 py-1.5 text-xs text-zinc-900 focus:outline-none focus:border-[#E27C52] font-mono"
          >
            <option value="burnt_orange">Burnt Orange</option>
            <option value="Oranges">Warm Oranges</option>
            <option value="viridis">Viridis</option>
            <option value="magma">Magma</option>
            <option value="coolwarm">Coolwarm</option>
            <option value="deep">Deep</option>
            <option value="muted">Muted</option>
            <option value="pastel">Pastel</option>
            <option value="crest">Crest</option>
            <option value="flare">Flare</option>
          </select>
        </div>

        <div>
          <div className="flex items-center space-x-1 mb-1">
            <label className="block text-xs font-mono font-medium text-zinc-600">Theme</label>

            {/* Small Info Icon (w-3 h-3) */}
            <div className="relative group inline-flex items-center cursor-pointer">
              <Info className="w-3 h-3 text-zinc-400 group-hover:text-[#E27C52] transition-colors" />

              {/* High-Key Light Mode White Hover Tooltip Box (Wider w-[350px] so all items fit on 1 line) */}
              <div className="absolute left-0 bottom-full mb-1.5 hidden group-hover:block w-[350px] p-3 bg-white text-zinc-800 rounded-lg text-[11px] font-mono leading-relaxed shadow-xl border border-zinc-200 z-30 pointer-events-none">
                <span className="text-[#E27C52] font-bold block border-b border-zinc-200 pb-1 mb-1.5">
                  Seaborn Style Themes:
                </span>
                <ul className="space-y-1 text-zinc-600">
                  <li className="whitespace-nowrap"><strong className="text-zinc-900 font-bold">Light Grid:</strong> Soft grey gridlines on light warm canvas</li>
                  <li className="whitespace-nowrap"><strong className="text-zinc-900 font-bold">Ticks:</strong> Clean white background with tick marks</li>
                  <li className="whitespace-nowrap"><strong className="text-zinc-900 font-bold">Pure White:</strong> Minimalist white background with no grid</li>
                  <li className="whitespace-nowrap"><strong className="text-zinc-900 font-bold">Dark Grid:</strong> Dark slate canvas with subtle gridlines</li>
                  <li className="whitespace-nowrap"><strong className="text-zinc-900 font-bold">Dark Canvas:</strong> Deep black background with white text</li>
                </ul>
              </div>
            </div>
          </div>

          <select
            value={spec.style_theme}
            onChange={(e) => handleChange("style_theme", e.target.value as StyleTheme)}
            className="w-full bg-white border border-zinc-200 rounded-lg px-2.5 py-1.5 text-xs text-zinc-900 focus:outline-none focus:border-[#E27C52] font-mono"
          >
            <option value="whitegrid">Light Grid</option>
            <option value="ticks">Ticks</option>
            <option value="white">Pure White</option>
            <option value="darkgrid">Dark Grid</option>
            <option value="dark">Dark Canvas</option>
          </select>
        </div>
      </div>

      {/* Sliders: Width & Height */}
      <div className="space-y-2.5 pt-2 border-t border-zinc-200">
        <div className="flex items-center justify-between">
          <label className="text-xs font-mono font-medium text-zinc-600">Dimensions</label>
          <label className="flex items-center space-x-1.5 text-[11px] font-mono text-zinc-700 cursor-pointer font-medium">
            <input
              type="checkbox"
              checked={spec.show_grid}
              onChange={(e) => handleChange("show_grid", e.target.checked)}
              className="rounded border-zinc-300 text-[#E27C52] focus:ring-0 cursor-pointer"
            />
            <span>Show Gridlines</span>
          </label>
        </div>

        <div className="grid grid-cols-2 gap-2.5 text-[11px] font-mono text-zinc-600">
          <div>
            <span>Width: {spec.fig_width} in</span>
            <input
              type="range"
              min={6}
              max={16}
              step={0.5}
              value={spec.fig_width}
              onChange={(e) => handleChange("fig_width", parseFloat(e.target.value))}
              className="w-full accent-[#E27C52] mt-1 cursor-pointer"
            />
          </div>
          <div>
            <span>Height: {spec.fig_height} in</span>
            <input
              type="range"
              min={4}
              max={12}
              step={0.5}
              value={spec.fig_height}
              onChange={(e) => handleChange("fig_height", parseFloat(e.target.value))}
              className="w-full accent-[#E27C52] mt-1 cursor-pointer"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
