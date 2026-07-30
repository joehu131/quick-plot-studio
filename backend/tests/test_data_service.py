import pytest
import pandas as pd
from app.services.data_service import data_service
from app.models.chart_spec import ChartSpec, ChartType

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
    assert len(summary.sample_rows) == 5

def test_reconcile_chart_spec(sample_df):
    spec = ChartSpec(
        chart_type=ChartType.BAR,
        title="Test Bar Chart",
        x_column="non_existent_column",
        y_column="PROFIT",  # Case-insensitive mismatch
        x_label="X Label",
        y_label="Y Label"
    )

    reconciled = data_service.reconcile_chart_spec(sample_df, spec)
    assert reconciled.x_column in list(sample_df.columns)
    assert reconciled.y_column == "profit"
