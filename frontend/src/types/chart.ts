export type ChartType = 
  | 'bar' 
  | 'line' 
  | 'scatter' 
  | 'histogram' 
  | 'box' 
  | 'pie' 
  | 'heatmap';

export type AggregationType = 
  | 'none' 
  | 'sum' 
  | 'mean' 
  | 'count' 
  | 'median';

export type ColorPalette = 
  | 'burnt_orange'
  | 'Oranges'
  | 'viridis' 
  | 'magma' 
  | 'coolwarm' 
  | 'deep' 
  | 'muted' 
  | 'pastel' 
  | 'crest' 
  | 'flare';

export type StyleTheme = 
  | 'whitegrid' 
  | 'ticks' 
  | 'white' 
  | 'darkgrid' 
  | 'dark';

export interface ChartSpec {
  chart_type: ChartType;
  title: string;
  x_column: string;
  y_column?: string | null;
  hue_column?: string | null;
  aggregation: AggregationType;
  x_label: string;
  y_label: string;
  palette: ColorPalette;
  style_theme: StyleTheme;
  fig_width: number;
  fig_height: number;
  show_grid: boolean;
  reasoning: string;
}

export interface DatasetSummary {
  dataset_id: string;
  row_count: number;
  column_count: number;
  columns: string[];
  column_types: Record<string, string>;
  sample_rows: Record<string, unknown>[];
}
