import pytest
import pandas as pd
from app.services.data_service import data_service
from app.models.chart_spec import (
    ChartSpec,
    ChartType,
    SortOrder,
    Orientation,
)

def test_parse_csv_text(sample_sales_csv_text):
    df = data_service.parse_csv_text(sample_sales_csv_text)
    assert isinstance(df, pd.DataFrame)
    assert len(df) == 6
    assert set(df.columns) == {"date", "category", "revenue", "units_sold"}

def test_store_and_get_dataset(sample_df):
    dataset_id = data_service.store_dataset(sample_df)
    assert isinstance(dataset_id, str)
    assert len(dataset_id) > 0

    retrieved_df = data_service.get_dataset(dataset_id)
    assert retrieved_df is not None
    assert len(retrieved_df) == len(sample_df)

def test_generate_summary(sample_df):
    dataset_id = data_service.store_dataset(sample_df)
    summary = data_service.generate_summary(dataset_id, sample_df)
    assert summary.dataset_id == dataset_id
    assert summary.row_count == 6
    assert summary.column_count == 4
    # All 6 rows are included when dataset length <= 15
    assert len(summary.sample_rows) == 6

    # Verify column_profiles
    assert len(summary.column_profiles) == 4
    prof_map = {p.name: p for p in summary.column_profiles}

    # Numeric profile checks
    sales_prof = prof_map["sales"]
    assert sales_prof.dtype == "numeric"
    assert sales_prof.min_val == 100.0
    assert sales_prof.max_val == 300.0
    assert sales_prof.mean_val is not None
    assert sales_prof.std_val is not None

    # Categorical profile checks
    cat_prof = prof_map["category"]
    assert cat_prof.dtype == "categorical/text"
    assert cat_prof.unique_count == 3
    assert set(cat_prof.top_values) == {"A", "B", "C"}

    # Datetime profile checks
    date_prof = prof_map["date"]
    assert date_prof.dtype == "datetime"
    assert date_prof.min_date is not None
    assert date_prof.max_date is not None

def test_stratified_sampling_large_dataset():
    # Create dataset with 60 rows
    df_large = pd.DataFrame({
        "id": list(range(60)),
        "value": [float(i * 2) for i in range(60)]
    })
    dataset_id = data_service.store_dataset(df_large)
    summary = data_service.generate_summary(dataset_id, df_large)
    # Stratified sampling caps at 15 distinct sample rows
    assert len(summary.sample_rows) <= 15
    sample_ids = [r["id"] for r in summary.sample_rows]
    # Includes first rows and last rows
    assert 0 in sample_ids
    assert 59 in sample_ids

def test_reconcile_chart_spec(sample_df):
    spec = ChartSpec(
        chart_type=ChartType.BAR,
        title="Test Bar Chart",
        x_column="non_existent_column",
        y_column="PROFIT",  # Case-insensitive mismatch
        x_label="X Label",
        y_label="Y Label",
        sort_order=SortOrder.DESCENDING,
        top_n=50,  # Exceeds unique count of 3
        orientation=Orientation.HORIZONTAL
    )

    reconciled = data_service.reconcile_chart_spec(sample_df, spec)
    assert reconciled.x_column in list(sample_df.columns)
    assert reconciled.y_column == "profit"
    # top_n is preserved safely without wiping user selection
    assert reconciled.top_n == 50
    # Orientation remains HORIZONTAL for BAR
    assert reconciled.orientation == Orientation.HORIZONTAL

def test_reconcile_chart_spec_resets_incompatible_fields(sample_df):
    # Scatter chart with horizontal orientation and sort order should be reset
    spec = ChartSpec(
        chart_type=ChartType.SCATTER,
        title="Test Scatter",
        x_column="sales",
        y_column="profit",
        x_label="Sales",
        y_label="Profit",
        sort_order=SortOrder.ASCENDING,
        orientation=Orientation.HORIZONTAL
    )

    reconciled = data_service.reconcile_chart_spec(sample_df, spec)
    # Scatter does not support horizontal orientation or sort order
    assert reconciled.orientation == Orientation.VERTICAL
    assert reconciled.sort_order == SortOrder.NONE

def test_parse_semicolon_and_tab_csv():
    semicolon_csv = "colA;colB;colC\n1;2;3\n4;5;6"
    df_semi = data_service.parse_csv_text(semicolon_csv)
    assert len(df_semi.columns) == 3
    assert list(df_semi.columns) == ["colA", "colB", "colC"]

    tsv = "colA\tcolB\tcolC\n1\t2\t3\n4\t5\t6"
    df_tsv = data_service.parse_csv_text(tsv)
    assert len(df_tsv.columns) == 3
    assert list(df_tsv.columns) == ["colA", "colB", "colC"]

def test_generate_summary_with_timestamps():
    df = pd.DataFrame({
        "date": pd.to_datetime(["2024-01-01", "2024-01-02"]),
        "val": [10.5, float('inf')]
    })
    dataset_id = data_service.store_dataset(df)
    summary = data_service.generate_summary(dataset_id, df)
    assert summary.row_count == 2
    # Ensure sample_rows are JSON serializable
    import json
    serialized = json.dumps(summary.sample_rows)
    assert "2024-01-01" in serialized
