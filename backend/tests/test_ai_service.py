import pytest
from app.services.ai_service import ai_service
from app.services.data_service import data_service
from app.models.chart_spec import ChartSpec

def test_heuristic_fallback(sample_df):
    dataset_id = data_service.store_dataset(sample_df)
    summary = data_service.generate_summary(dataset_id, sample_df)
    
    # Test heuristic fallback directly
    fallback_spec = ai_service._heuristic_fallback(summary, "Test Fallback Reason")
    assert isinstance(fallback_spec, ChartSpec)
    assert fallback_spec.x_column in summary.columns
    assert fallback_spec.reasoning is not None

def test_analyze_dataset_returns_spec(sample_df):
    dataset_id = data_service.store_dataset(sample_df)
    summary = data_service.generate_summary(dataset_id, sample_df)
    
    spec = ai_service.analyze_dataset(summary)
    assert isinstance(spec, ChartSpec)
    assert spec.x_column in summary.columns
    assert spec.title is not None
