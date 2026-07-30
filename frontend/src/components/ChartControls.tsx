"use client";

import { SlidersHorizontal, Palette, Layout, Type, Layers } from "lucide-react";
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
    <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-5 shadow-xl backdrop-blur-sm space-y-5">
      {/* Header & AI Re-analyze button */}
      <div className="flex items-center justify-between border-b border-slate-800 pb-3">
        <div className="flex items-center space-x-2">
          <SlidersHorizontal className="w-5 h-5 text-indigo-400" />
          <h2 className="text-sm font-semibold text-slate-200">2. Real-Time Spec Controls</h2>
        </div>
        <button
          onClick={onReAnalyze}
          disabled={isAnalyzing}
          className="text-xs px-2.5 py-1 rounded-lg bg-indigo-500/10 hover:bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 transition-colors flex items-center space-x-1"
        >
          <span>Re-Analyze AI</span>
        </button>
      </div>

      {/* Chart Title */}
      <div>
        <label className="block text-xs font-medium text-slate-400 mb-1 flex items-center space-x-1">
          <Type className="w-3.5 h-3.5 text-indigo-400" />
          <span>Chart Title</span>
        </label>
        <input
          type="text"
          value={spec.title}
          onChange={(e) => handleChange("title", e.target.value)}
          className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-1.5 text-xs text-slate-200 focus:outline-none focus:border-indigo-500 font-medium"
        />
      </div>

      {/* Grid Row 1: Chart Type & Aggregation */}
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="block text-xs font-medium text-slate-400 mb-1 flex items-center space-x-1">
            <Layout className="w-3.5 h-3.5 text-indigo-400" />
            <span>Chart Type</span>
          </label>
          <select
            value={spec.chart_type}
            onChange={(e) => handleChange("chart_type", e.target.value as ChartType)}
            className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-1.5 text-xs text-slate-200 focus:outline-none focus:border-indigo-500"
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
          <label className="block text-xs font-medium text-slate-400 mb-1 flex items-center space-x-1">
            <Layers className="w-3.5 h-3.5 text-indigo-400" />
            <span>Aggregation</span>
          </label>
          <select
            value={spec.aggregation}
            onChange={(e) => handleChange("aggregation", e.target.value as AggregationType)}
            className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-1.5 text-xs text-slate-200 focus:outline-none focus:border-indigo-500"
          >
            <option value="none">None (Raw Rows)</option>
            <option value="sum">Sum</option>
            <option value="mean">Mean (Average)</option>
            <option value="count">Count</option>
            <option value="median">Median</option>
          </select>
        </div>
      </div>

      {/* Grid Row 2: X Column & Y Column */}
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="block text-xs font-medium text-slate-400 mb-1">X-Axis Column</label>
          <select
            value={spec.x_column}
            onChange={(e) => handleChange("x_column", e.target.value)}
            className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-1.5 text-xs text-slate-200 focus:outline-none focus:border-indigo-500 font-mono"
          >
            {columns.map((col) => (
              <option key={col} value={col}>
                {col}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-xs font-medium text-slate-400 mb-1">Y-Axis Column</label>
          <select
            value={spec.y_column || ""}
            onChange={(e) => handleChange("y_column", e.target.value || null)}
            className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-1.5 text-xs text-slate-200 focus:outline-none focus:border-indigo-500 font-mono"
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
        <label className="block text-xs font-medium text-slate-400 mb-1">Hue / Grouping Column</label>
        <select
          value={spec.hue_column || ""}
          onChange={(e) => handleChange("hue_column", e.target.value || null)}
          className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-1.5 text-xs text-slate-200 focus:outline-none focus:border-indigo-500 font-mono"
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
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="block text-xs font-medium text-slate-400 mb-1 flex items-center space-x-1">
            <Palette className="w-3.5 h-3.5 text-indigo-400" />
            <span>Color Palette</span>
          </label>
          <select
            value={spec.palette}
            onChange={(e) => handleChange("palette", e.target.value as ColorPalette)}
            className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-1.5 text-xs text-slate-200 focus:outline-none focus:border-indigo-500"
          >
            <option value="viridis">Viridis</option>
            <option value="magma">Magma</option>
            <option value="coolwarm">Coolwarm</option>
            <option value="deep">Deep</option>
            <option value="muted">Muted</option>
            <option value="pastel">Pastel</option>
            <option value="dark">Dark</option>
            <option value="rocket">Rocket</option>
          </select>
        </div>

        <div>
          <label className="block text-xs font-medium text-slate-400 mb-1">Seaborn Theme</label>
          <select
            value={spec.style_theme}
            onChange={(e) => handleChange("style_theme", e.target.value as StyleTheme)}
            className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-1.5 text-xs text-slate-200 focus:outline-none focus:border-indigo-500"
          >
            <option value="darkgrid">Dark Grid</option>
            <option value="whitegrid">White Grid</option>
            <option value="dark">Dark</option>
            <option value="white">White</option>
            <option value="ticks">Ticks</option>
          </select>
        </div>
      </div>

      {/* Sliders: Width & Height */}
      <div className="space-y-3 pt-2 border-t border-slate-800/80">
        <div className="flex items-center justify-between">
          <label className="text-xs font-medium text-slate-400">Figure Dimensions</label>
          <label className="flex items-center space-x-2 text-xs text-slate-300 cursor-pointer">
            <input
              type="checkbox"
              checked={spec.show_grid}
              onChange={(e) => handleChange("show_grid", e.target.checked)}
              className="rounded bg-slate-950 border-slate-800 text-indigo-600 focus:ring-0"
            />
            <span>Show Gridlines</span>
          </label>
        </div>

        <div className="grid grid-cols-2 gap-3 text-[11px] text-slate-400">
          <div>
            <span>Width: {spec.fig_width} in</span>
            <input
              type="range"
              min={6}
              max={16}
              step={0.5}
              value={spec.fig_width}
              onChange={(e) => handleChange("fig_width", parseFloat(e.target.value))}
              className="w-full accent-indigo-500 mt-1 cursor-pointer"
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
              className="w-full accent-indigo-500 mt-1 cursor-pointer"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
