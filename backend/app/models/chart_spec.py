from enum import Enum
from typing import Optional, List, Dict, Any
from pydantic import BaseModel, Field

class ChartType(str, Enum):
    BAR = "bar"
    LINE = "line"
    SCATTER = "scatter"
    HISTOGRAM = "histogram"
    BOX = "box"
    PIE = "pie"
    HEATMAP = "heatmap"

class AggregationType(str, Enum):
    NONE = "none"
    SUM = "sum"
    MEAN = "mean"
    COUNT = "count"
    MEDIAN = "median"

class Theme(str, Enum):
    ORANGES = "Oranges"
    VIRIDIS = "viridis"
    MAGMA = "magma"
    COOLWARM = "coolwarm"
    DEEP = "deep"
    MUTED = "muted"
    PASTEL = "pastel"
    CREST = "crest"
    FLARE = "flare"

class GridStyle(str, Enum):
    WHITEGRID = "whitegrid"
    TICKS = "ticks"
    WHITE = "white"
    DARKGRID = "darkgrid"
    DARK = "dark"

class SortOrder(str, Enum):
    NONE = "none"
    ASCENDING = "ascending"
    DESCENDING = "descending"

class Orientation(str, Enum):
    VERTICAL = "vertical"
    HORIZONTAL = "horizontal"

class LegendPosition(str, Enum):
    AUTO = "auto"
    RIGHT = "right"
    BOTTOM = "bottom"
    NONE = "none"

class ChartSpec(BaseModel):
    chart_type: ChartType = Field(
        ...,
        description="The type of chart optimal for visualizing the dataset."
    )
    title: str = Field(
        ...,
        description="Clear, descriptive chart title."
    )
    x_column: str = Field(
        ...,
        description="Dataset column name for the primary X-axis."
    )
    y_column: Optional[str] = Field(
        None,
        description="Dataset column name for the Y-axis (optional for histograms/pies)."
    )
    hue_column: Optional[str] = Field(
        None,
        description="Optional dataset column name for color grouping or sub-categories."
    )
    aggregation: AggregationType = Field(
        default=AggregationType.NONE,
        description="Aggregation function to apply when grouping data before plotting."
    )
    x_label: str = Field(
        ...,
        description="Label text displayed on the X-axis."
    )
    y_label: str = Field(
        ...,
        description="Label text displayed on the Y-axis."
    )
    theme: Theme = Field(
        default=Theme.ORANGES,
        description="Color palette theme for chart elements."
    )
    grid_style: GridStyle = Field(
        default=GridStyle.WHITEGRID,
        description="Background style and gridlines layout."
    )
    sort_order: SortOrder = Field(
        default=SortOrder.NONE,
        description="Sort order for bar and pie charts by value. 'descending' is recommended for bar charts."
    )
    top_n: Optional[int] = Field(
        default=None,
        ge=1,
        le=50,
        description="Limit chart to the top N categories by value. None shows all categories."
    )
    orientation: Orientation = Field(
        default=Orientation.VERTICAL,
        description="Bar and box chart orientation. Use 'horizontal' for long category names."
    )
    legend_position: LegendPosition = Field(
        default=LegendPosition.AUTO,
        description="Legend placement on the chart."
    )
    fig_width: float = Field(
        default=10.0,
        ge=4.0,
        le=20.0,
        description="Figure width in inches."
    )
    fig_height: float = Field(
        default=6.0,
        ge=3.0,
        le=15.0,
        description="Figure height in inches."
    )
    show_grid: bool = Field(
        default=True,
        description="Whether gridlines should be visible on the chart."
    )
    reasoning: str = Field(
        default="Automatically generated visualization based on dataset structure.",
        description="AI explanation of why this chart representation was chosen."
    )


class ColumnProfile(BaseModel):
    """Per-column statistical profile sent to the AI for informed chart selection."""
    name: str
    dtype: str                                          # "numeric", "categorical/text", "datetime"
    null_count: int = 0
    unique_count: int = 0
    # Numeric columns
    min_val: Optional[float] = None
    max_val: Optional[float] = None
    mean_val: Optional[float] = None
    std_val: Optional[float] = None
    # Categorical columns
    top_values: Optional[List[str]] = None              # Top 5 most frequent values
    # Datetime columns
    min_date: Optional[str] = None
    max_date: Optional[str] = None


class DatasetSummary(BaseModel):
    dataset_id: str
    row_count: int
    column_count: int
    columns: List[str]
    column_types: Dict[str, str]
    sample_rows: List[Dict[str, Any]]
    column_profiles: List[ColumnProfile] = []
