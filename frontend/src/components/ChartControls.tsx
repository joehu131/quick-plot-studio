"use client";

import { useState, useRef, useEffect } from "react";
import { SlidersHorizontal, Palette, Layout, Type, Layers, Info, ChevronDown, Check, Sparkles } from "lucide-react";
import { ChartSpec, ChartType, AggregationType, Theme, GridStyle, SortOrder, Orientation, LegendPosition } from "@/types/chart";

interface ChartControlsProps {
  spec: ChartSpec;
  columns: string[];
  onChange: (updatedSpec: ChartSpec) => void;
  onReAnalyze: () => void;
  isAnalyzing: boolean;
}

interface ThemeOption {
  id: Theme;
  label: string;
  colors: string[];
}

const THEME_OPTIONS: ThemeOption[] = [
  { id: "Oranges", label: "Warm Oranges", colors: ["#FED976", "#FEB24C", "#FD8D3C", "#F16913", "#D94801"] },
  { id: "viridis", label: "Viridis", colors: ["#440154", "#31688E", "#35B779", "#FDE725"] },
  { id: "magma", label: "Magma", colors: ["#000004", "#51127C", "#B73779", "#FC8961", "#FECF92"] },
  { id: "coolwarm", label: "Coolwarm", colors: ["#3B4CC0", "#8CBDFF", "#F2F2F2", "#F7A789", "#B40426"] },
  { id: "deep", label: "Deep", colors: ["#4C72B0", "#DD8452", "#55A868", "#C44E52", "#8172B3"] },
  { id: "muted", label: "Muted", colors: ["#4878D0", "#EE854A", "#6ACC64", "#D65F5F", "#956CB4"] },
  { id: "pastel", label: "Pastel", colors: ["#A1C9F4", "#FFB482", "#8DE5A1", "#FF9F9B", "#D0BBFF"] },
  { id: "crest", label: "Crest", colors: ["#7EA6AC", "#57868D", "#3B6368", "#244247"] },
  { id: "flare", label: "Flare", colors: ["#E59E80", "#E37466", "#D84A5B", "#B82766"] },
];

export default function ChartControls({
  spec,
  columns,
  onChange,
  onReAnalyze,
  isAnalyzing,
}: ChartControlsProps) {
  const [isThemeOpen, setIsThemeOpen] = useState(false);
  const themeDropdownRef = useRef<HTMLDivElement>(null);

  const handleChange = (field: keyof ChartSpec, value: unknown) => {
    onChange({
      ...spec,
      [field]: value,
    });
  };

  // Close dropdown on outside click
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (themeDropdownRef.current && !themeDropdownRef.current.contains(event.target as Node)) {
        setIsThemeOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const currentThemeObj = THEME_OPTIONS.find((t) => t.id === spec.theme) || THEME_OPTIONS[0];

  return (
    <div className="bg-surface border border-surface-border rounded-xl p-4 shadow-2xs space-y-4 font-body">
      {/* Header & AI Re-analyze button */}
      <div className="flex items-center justify-between border-b border-surface-border pb-3">
        <div className="flex items-center space-x-2">
          <SlidersHorizontal className="w-4 h-4 text-primary" />
          <h2 className="text-xs font-bold text-text-main uppercase tracking-wider font-heading">
            2. Real-Time Spec Controls
          </h2>
        </div>
        <button
          onClick={onReAnalyze}
          disabled={isAnalyzing}
          className="text-xs font-semibold px-2.5 py-1 rounded-lg bg-white hover:bg-primary-light text-primary border border-primary-border transition-colors flex items-center space-x-1 cursor-pointer shadow-2xs"
        >
          <Sparkles className="w-3 h-3" />
          <span>Re-Analyze AI</span>
        </button>
      </div>

      {/* Chart Title */}
      <div>
        <label className="block text-xs font-medium text-text-muted mb-1 flex items-center space-x-1">
          <Type className="w-3 h-3 text-primary" />
          <span>Chart Title</span>
        </label>
        <input
          type="text"
          value={spec.title}
          onChange={(e) => handleChange("title", e.target.value)}
          className="w-full bg-white border border-surface-border rounded-lg px-3 py-1.5 text-xs text-text-main focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary font-semibold transition-colors"
        />
      </div>

      {/* Grid Row 1: Chart Type & Aggregation */}
      <div className="grid grid-cols-2 gap-2.5">
        <div>
          <label className="block text-xs font-medium text-text-muted mb-1 flex items-center space-x-1">
            <Layout className="w-3 h-3 text-primary" />
            <span>Chart Type</span>
          </label>
          <select
            value={spec.chart_type}
            onChange={(e) => handleChange("chart_type", e.target.value as ChartType)}
            className="w-full bg-white border border-surface-border rounded-lg px-2.5 py-1.5 text-xs text-text-main focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-colors cursor-pointer"
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
          <label className="block text-xs font-medium text-text-muted mb-1 flex items-center space-x-1">
            <Layers className="w-3 h-3 text-primary" />
            <span>Aggregation</span>
          </label>
          <select
            value={spec.aggregation}
            onChange={(e) => handleChange("aggregation", e.target.value as AggregationType)}
            className="w-full bg-white border border-surface-border rounded-lg px-2.5 py-1.5 text-xs text-text-main focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-colors cursor-pointer"
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
          <label className="block text-xs font-medium text-text-muted mb-1">X-Axis Column</label>
          <select
            value={spec.x_column}
            onChange={(e) => handleChange("x_column", e.target.value)}
            className="w-full bg-white border border-surface-border rounded-lg px-2.5 py-1.5 text-xs text-text-main focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-colors cursor-pointer font-body font-medium"
          >
            {columns.map((col) => (
              <option key={col} value={col}>
                {col}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-xs font-medium text-text-muted mb-1">Y-Axis Column</label>
          <select
            value={spec.y_column || ""}
            onChange={(e) => handleChange("y_column", e.target.value || null)}
            className="w-full bg-white border border-surface-border rounded-lg px-2.5 py-1.5 text-xs text-text-main focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-colors cursor-pointer font-body font-medium"
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
        <label className="block text-xs font-medium text-text-muted mb-1">Hue / Group Column</label>
        <select
          value={spec.hue_column || ""}
          onChange={(e) => handleChange("hue_column", e.target.value || null)}
          className="w-full bg-white border border-surface-border rounded-lg px-2.5 py-1.5 text-xs text-text-main focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-colors cursor-pointer font-body font-medium"
        >
          <option value="">(None)</option>
          {columns.map((col) => (
            <option key={col} value={col}>
              {col}
            </option>
          ))}
        </select>
      </div>

      {/* Grid Row 3: Custom Theme Dropdown with Pill Swatches & Grid/Background */}
      <div className="grid grid-cols-2 gap-2.5">
        
        {/* Custom Theme Selector with Pill Color Swatches */}
        <div className="relative" ref={themeDropdownRef}>
          <label className="block text-xs font-medium text-text-muted mb-1 flex items-center space-x-1">
            <Palette className="w-3 h-3 text-primary" />
            <span>Plot Theme</span>
          </label>
          
          <button
            type="button"
            onClick={() => setIsThemeOpen(!isThemeOpen)}
            className="w-full bg-white border border-surface-border rounded-lg px-2.5 py-1.5 text-xs text-text-main focus:outline-none focus:border-primary flex items-center justify-between transition-colors cursor-pointer shadow-2xs"
          >
            <span className="truncate font-medium">{currentThemeObj.label}</span>

            <div className="flex items-center space-x-1.5 ml-2">
              <div className="flex items-center space-x-0.5 bg-surface border border-surface-border rounded-full px-1.5 py-0.5 shadow-2xs">
                {currentThemeObj.colors.map((c, i) => (
                  <span
                    key={i}
                    className="w-2 h-2 rounded-full border border-black/10 shrink-0"
                    style={{ backgroundColor: c }}
                  />
                ))}
              </div>
              <ChevronDown className={`w-3.5 h-3.5 text-text-muted transition-transform ${isThemeOpen ? "rotate-180" : ""}`} />
            </div>
          </button>

          {/* Theme Dropdown Popover */}
          {isThemeOpen && (
            <div className="absolute left-0 top-full mt-1 w-full bg-white border border-surface-border rounded-lg shadow-xl z-40 py-1 text-xs overflow-hidden max-h-60 overflow-y-auto divide-y divide-surface-border">
              {THEME_OPTIONS.map((themeObj) => {
                const isSelected = themeObj.id === spec.theme;
                return (
                  <div
                    key={themeObj.id}
                    onClick={() => {
                      handleChange("theme", themeObj.id);
                      setIsThemeOpen(false);
                    }}
                    className={`px-3 py-2 flex items-center justify-between cursor-pointer transition-colors ${
                      isSelected ? "bg-primary-light font-bold text-primary" : "hover:bg-surface text-text-main"
                    }`}
                  >
                    <div className="flex items-center space-x-2 truncate">
                      {isSelected && <Check className="w-3 h-3 text-primary shrink-0" />}
                      <span className="truncate">{themeObj.label}</span>
                    </div>

                    <div className="flex items-center space-x-0.5 bg-surface border border-surface-border rounded-full px-1.5 py-0.5 shrink-0 shadow-2xs ml-2">
                      {themeObj.colors.map((c, idx) => (
                        <span
                          key={idx}
                          className="w-2 h-2 rounded-full border border-black/10"
                          style={{ backgroundColor: c }}
                        />
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Grid & Background Select */}
        <div>
          <div className="flex items-center space-x-1 mb-1">
            <label className="block text-xs font-medium text-text-muted">Grid & Background</label>

            {/* Small Info Icon */}
            <div className="relative group inline-flex items-center cursor-pointer">
              <Info className="w-3 h-3 text-text-muted group-hover:text-primary transition-colors" />

              {/* Hover Tooltip */}
              <div className="absolute left-0 bottom-full mb-1.5 hidden group-hover:block w-[350px] p-3 bg-white text-text-main rounded-lg text-xs leading-relaxed shadow-xl border border-surface-border z-30 pointer-events-none">
                <span className="text-primary font-bold block border-b border-surface-border pb-1 mb-1.5">
                  Grid & Background Options:
                </span>
                <ul className="space-y-1 text-text-muted">
                  <li className="whitespace-nowrap"><strong className="text-text-main font-bold">Light Grid:</strong> Soft grey gridlines on light canvas</li>
                  <li className="whitespace-nowrap"><strong className="text-text-main font-bold">Ticks:</strong> Clean white background with tick marks</li>
                  <li className="whitespace-nowrap"><strong className="text-text-main font-bold">Pure White:</strong> Minimalist white background with no grid</li>
                  <li className="whitespace-nowrap"><strong className="text-text-main font-bold">Dark Grid:</strong> Dark slate canvas with subtle gridlines</li>
                  <li className="whitespace-nowrap"><strong className="text-text-main font-bold">Dark Canvas:</strong> Deep black background with white text</li>
                </ul>
              </div>
            </div>
          </div>

          <select
            value={spec.grid_style}
            onChange={(e) => handleChange("grid_style", e.target.value as GridStyle)}
            className="w-full bg-white border border-surface-border rounded-lg px-2.5 py-1.5 text-xs text-text-main focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-colors cursor-pointer"
          >
            <option value="whitegrid">Light Grid</option>
            <option value="ticks">Ticks</option>
            <option value="white">Pure White</option>
            <option value="darkgrid">Dark Grid</option>
            <option value="dark">Dark Canvas</option>
          </select>
        </div>
      </div>

      {/* Grid Row 4: Sort, Top N, Orientation, Legend */}
      <div className="grid grid-cols-2 gap-2.5">
        <div>
          <label className="block text-xs font-medium text-text-muted mb-1">Sort Order</label>
          <select
            value={spec.sort_order || "none"}
            onChange={(e) => handleChange("sort_order", e.target.value as SortOrder)}
            className="w-full bg-white border border-surface-border rounded-lg px-2.5 py-1.5 text-xs text-text-main focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-colors cursor-pointer"
          >
            <option value="none">None</option>
            <option value="ascending">Ascending</option>
            <option value="descending">Descending</option>
          </select>
        </div>

        <div>
          <label className="block text-xs font-medium text-text-muted mb-1">Orientation</label>
          <select
            value={spec.orientation || "vertical"}
            onChange={(e) => handleChange("orientation", e.target.value as Orientation)}
            className="w-full bg-white border border-surface-border rounded-lg px-2.5 py-1.5 text-xs text-text-main focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-colors cursor-pointer"
          >
            <option value="vertical">Vertical</option>
            <option value="horizontal">Horizontal</option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-2.5">
        <div>
          <label className="block text-xs font-medium text-text-muted mb-1">Top N Categories</label>
          <select
            value={spec.top_n ?? "all"}
            onChange={(e) => handleChange("top_n", e.target.value === "all" ? null : parseInt(e.target.value))}
            className="w-full bg-white border border-surface-border rounded-lg px-2.5 py-1.5 text-xs text-text-main focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-colors cursor-pointer"
          >
            <option value="all">Show All</option>
            {spec.top_n && ![5, 8, 10, 15, 20].includes(spec.top_n) && (
              <option value={spec.top_n}>Top {spec.top_n}</option>
            )}
            <option value="5">Top 5</option>
            <option value="8">Top 8</option>
            <option value="10">Top 10</option>
            <option value="15">Top 15</option>
            <option value="20">Top 20</option>
          </select>
        </div>

        <div>
          <label className="block text-xs font-medium text-text-muted mb-1">Legend Position</label>
          <select
            value={spec.legend_position || "auto"}
            onChange={(e) => handleChange("legend_position", e.target.value as LegendPosition)}
            className="w-full bg-white border border-surface-border rounded-lg px-2.5 py-1.5 text-xs text-text-main focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-colors cursor-pointer"
          >
            <option value="auto">Auto</option>
            <option value="right">Right</option>
            <option value="bottom">Bottom</option>
            <option value="none">Hidden</option>
          </select>
        </div>
      </div>

      {/* Sliders: Width & Height */}
      <div className="space-y-2.5 pt-2 border-t border-surface-border">
        <div className="flex items-center justify-between">
          <label className="text-xs font-medium text-text-muted">Dimensions</label>
          <label className="flex items-center space-x-1.5 text-xs text-text-main cursor-pointer font-medium">
            <input
              type="checkbox"
              checked={spec.show_grid}
              onChange={(e) => handleChange("show_grid", e.target.checked)}
              className="rounded border-surface-border accent-primary focus:ring-0 cursor-pointer"
            />
            <span>Show Gridlines</span>
          </label>
        </div>

        <div className="grid grid-cols-2 gap-2.5 text-xs text-text-muted font-body font-medium">
          <div>
            <span>Width: {spec.fig_width} in</span>
            <input
              type="range"
              min={6}
              max={16}
              step={0.5}
              value={spec.fig_width}
              onChange={(e) => handleChange("fig_width", parseFloat(e.target.value))}
              className="w-full accent-primary mt-1 cursor-pointer"
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
              className="w-full accent-primary mt-1 cursor-pointer"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
