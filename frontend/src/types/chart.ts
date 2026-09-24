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

export type Theme = 
  | 'Oranges'
  | 'viridis' 
  | 'magma' 
  | 'coolwarm' 
  | 'deep' 
  | 'muted' 
  | 'pastel' 
  | 'crest' 
  | 'flare';

export type GridStyle = 
  | 'whitegrid' 
  | 'ticks' 
  | 'white' 
  | 'darkgrid' 
  | 'dark';

export type SortOrder = 'none' | 'ascending' | 'descending';
export type Orientation = 'vertical' | 'horizontal';
export type LegendPosition = 'auto' | 'right' | 'bottom' | 'none';

export interface ChartSpec {
  chart_type: ChartType;
  title: string;
  x_column: string;
  y_column?: string | null;
  hue_column?: string | null;
  aggregation: AggregationType;
  x_label: string;
  y_label: string;
  theme: Theme;
  grid_style: GridStyle;
  sort_order?: SortOrder;
  top_n?: number | null;
  orientation?: Orientation;
  legend_position?: LegendPosition;
  fig_width: number;
  fig_height: number;
  show_grid: boolean;
  reasoning: string;
}

export interface ColumnProfile {
  name: string;
  dtype: string;
  null_count: number;
  unique_count: number;
  min_val?: number | null;
  max_val?: number | null;
  mean_val?: number | null;
  std_val?: number | null;
  top_values?: string[] | null;
  min_date?: string | null;
  max_date?: string | null;
}

export interface DatasetSummary {
  dataset_id: string;
  row_count: number;
  column_count: number;
  columns: string[];
  column_types: Record<string, string>;
  sample_rows: Record<string, unknown>[];
  column_profiles?: ColumnProfile[];
}
