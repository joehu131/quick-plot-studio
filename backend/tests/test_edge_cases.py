import pytest
import numpy as np
import pandas as pd
from app.services.data_service import data_service
from app.services.plot_service import plot_service
from app.services.ai_service import ai_service
from app.models.chart_spec import (
    ChartSpec,
    ChartType,
    AggregationType,
    Theme,
    GridStyle,
    SortOrder,
    Orientation,
    LegendPosition,
)

def test_empty_dataframe_rendering():
    df_empty = pd.DataFrame(columns=["col_a", "col_b"])
    spec = ChartSpec(
        chart_type=ChartType.BAR,
        title="Empty Data Test",
        x_column="col_a",
        y_column="col_b",
        x_label="X",
        y_label="Y"
    )
    img_bytes = plot_service.render_chart(df_empty, spec, format="png")
    assert isinstance(img_bytes, bytes)
    assert len(img_bytes) > 0
    assert img_bytes[:4] == b'\x89PNG'

def test_single_row_dataframe_histogram():
    df_single = pd.DataFrame({"val": [42.0]})
    spec = ChartSpec(
        chart_type=ChartType.HISTOGRAM,
        title="Single Row Histogram",
        x_column="val",
        x_label="Val",
        y_label="Count"
    )
    img_bytes = plot_service.render_chart(df_single, spec, format="png")
    assert isinstance(img_bytes, bytes)
    assert img_bytes[:4] == b'\x89PNG'

def test_constant_zero_variance_histogram():
    df_const = pd.DataFrame({"val": [10.0, 10.0, 10.0, 10.0]})
    spec = ChartSpec(
        chart_type=ChartType.HISTOGRAM,
        title="Constant Histogram",
        x_column="val",
        x_label="Val",
        y_label="Count"
    )
    img_bytes = plot_service.render_chart(df_const, spec, format="png")
    assert isinstance(img_bytes, bytes)
    assert img_bytes[:4] == b'\x89PNG'

def test_all_nan_numeric_summary():
    df_nan = pd.DataFrame({"num_col": [np.nan, np.nan, np.nan]})
    dataset_id = data_service.store_dataset(df_nan)
    summary = data_service.generate_summary(dataset_id, df_nan)

    assert len(summary.column_profiles) == 1
    prof = summary.column_profiles[0]
    assert prof.name == "num_col"
    assert prof.null_count == 3
    assert prof.min_val is None
    assert prof.max_val is None
    assert prof.mean_val is None

def test_infinite_values_json_safe():
    df_inf = pd.DataFrame({
        "num": [1.0, float('inf'), float('-inf'), 5.0]
    })
    dataset_id = data_service.store_dataset(df_inf)
    summary = data_service.generate_summary(dataset_id, df_inf)

    prof = summary.column_profiles[0]
    # Infinities are replaced and do not produce raw Infinity or NaN in summary
    assert prof.min_val == 1.0
    assert prof.max_val == 5.0

    # Ensure JSON serializable without error
    import json
    serialized = summary.model_dump_json()
    assert "Infinity" not in serialized
    assert "NaN" not in serialized

def test_single_categorical_column_bar_chart():
    df_cat = pd.DataFrame({"fruit": ["Apple", "Banana", "Apple", "Orange", "Banana", "Apple"]})
    dataset_id = data_service.store_dataset(df_cat)
    summary = data_service.generate_summary(dataset_id, df_cat)

    # Heuristic fallback handles pure categorical datasets
    fallback = ai_service._heuristic_fallback(summary, "Test")
    assert fallback.chart_type == ChartType.BAR
    assert fallback.aggregation == AggregationType.COUNT

    # Plot service renders count aggregation properly
    img_bytes = plot_service.render_chart(df_cat, fallback, format="png")
    assert isinstance(img_bytes, bytes)
    assert img_bytes[:4] == b'\x89PNG'

def test_line_chart_not_sorted_by_values():
    # Sequence over time
    df_trend = pd.DataFrame({
        "step": [1, 2, 3, 4],
        "value": [100, 10, 80, 20]
    })
    spec = ChartSpec(
        chart_type=ChartType.LINE,
        title="Trend",
        x_column="step",
        y_column="value",
        x_label="Step",
        y_label="Value",
        sort_order=SortOrder.DESCENDING  # Should not scramble step order
    )
    prepared = plot_service._prepare_data(df_trend, spec)
    cropped = plot_service._apply_sort_and_crop(prepared, spec)
    # Line chart retains order of step
    assert list(cropped["step"]) == [1, 2, 3, 4]
