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

def test_503_unavailability_triggers_gemma_fallback(sample_df, monkeypatch):
    dataset_id = data_service.store_dataset(sample_df)
    summary = data_service.generate_summary(dataset_id, sample_df)

    calls = []

    def mock_call_model(sum_obj, model_name):
        calls.append(model_name)
        if model_name == "gemini-3.5-flash-lite":
            raise Exception("503 UNAVAILABLE: Model experiencing high demand")
        return ChartSpec(
            chart_type="bar",
            title="Gemma Output",
            x_column="date",
            y_column="sales",
            x_label="Date",
            y_label="Sales",
            reasoning="Gemma 4 selected bar chart"
        )

    monkeypatch.setattr(ai_service, "_call_model", mock_call_model)

    spec = ai_service.analyze_dataset(summary, model="gemini-3.5-flash-lite")
    assert calls == ["gemini-3.5-flash-lite", "gemma-4-26b-a4b-it"]
    assert "[Fallback: Primary model 'gemini-3.5-flash-lite' failed (503 UNAVAILABLE: High Demand). Switched to Gemma 4 26B]" in spec.reasoning
    assert "Gemma 4 selected bar chart" in spec.reasoning

def test_format_error_summary():
    assert "503 UNAVAILABLE" in ai_service._format_error_summary("503 UNAVAILABLE high demand")
    assert "429 RATE LIMIT" in ai_service._format_error_summary("429 Resource Exhausted")
    assert "500 INTERNAL" in ai_service._format_error_summary("500 Internal server error")
    assert "504 GATEWAY TIMEOUT" in ai_service._format_error_summary("Gateway timeout occurred")

def test_timeout_triggers_gemma_fallback(sample_df, monkeypatch):
    dataset_id = data_service.store_dataset(sample_df)
    summary = data_service.generate_summary(dataset_id, sample_df)

    calls = []

    def mock_call_model(sum_obj, model_name):
        calls.append(model_name)
        if model_name == "gemini-3.5-flash-lite":
            raise TimeoutError("Model 'gemini-3.5-flash-lite' timed out after 3.0s")
        return ChartSpec(
            chart_type="bar",
            title="Gemma Output",
            x_column="date",
            y_column="sales",
            x_label="Date",
            y_label="Sales",
            reasoning="Gemma 4 selected bar chart"
        )

    monkeypatch.setattr(ai_service, "_call_model", mock_call_model)

    spec = ai_service.analyze_dataset(summary, model="gemini-3.5-flash-lite")
    assert calls == ["gemini-3.5-flash-lite", "gemma-4-26b-a4b-it"]
    assert "504 GATEWAY TIMEOUT" in spec.reasoning
    assert "Gemma 4 selected bar chart" in spec.reasoning

