import json
import logging
from typing import Optional
from google import genai
from google.genai import types

from app.config import settings
from app.models.chart_spec import (
    ChartSpec,
    ChartType,
    AggregationType,
    ColorPalette,
    StyleTheme,
    DatasetSummary
)

logger = logging.getLogger(__name__)

class AIService:
    def __init__(self):
        self._client: Optional[genai.Client] = None

    def _get_client(self) -> genai.Client:
        """Lazy initialization of Google GenAI client."""
        api_key = settings.GEMINI_API_KEY
        if not api_key or api_key == "your_gemini_api_key_here":
            raise ValueError("GEMINI_API_KEY is not configured in backend/.env file.")
        
        if self._client is None:
            self._client = genai.Client(api_key=api_key)
        return self._client

    def analyze_dataset(self, summary: DatasetSummary, model: Optional[str] = None) -> ChartSpec:
        """Analyzes a dataset summary using requested AI model, Gemma fallback on 429, or Rule-Based Engine."""
        target_model = model or settings.GEMINI_MODEL

        # Check if user requested pure rule-based heuristic engine
        if target_model in ["rule-based", "rule_based", "Rule-Based Engine (No AI)"]:
            logger.info("User selected Rule-Based Engine. Returning heuristic fallback spec.")
            return self._heuristic_fallback(summary, "User selected Rule-Based Engine (No AI)")

        # 1. Primary Model Attempt
        try:
            return self._call_model(summary, target_model)
        except Exception as primary_error:
            err_str = str(primary_error)
            logger.warning(f"Primary model '{target_model}' failed: {err_str}")

            # 2. Automatic Fallback to Gemma-4 on 429 / Rate Limit
            is_rate_limit = any(keyword in err_str.lower() for keyword in ["429", "resource_exhausted", "quota", "rate limit"])
            if is_rate_limit and target_model != "gemma-4-26b-a4b-it":
                logger.info("Rate limit hit on primary model. Attempting secondary AI fallback to 'gemma-4-26b-a4b-it'...")
                try:
                    gemma_spec = self._call_model(summary, "gemma-4-26b-a4b-it")
                    gemma_spec.reasoning = f"(Auto-fallback from {target_model} rate limit to Gemma 4 26B): {gemma_spec.reasoning}"
                    return gemma_spec
                except Exception as gemma_error:
                    logger.warning(f"Gemma fallback model also failed: {gemma_error}")

            # 3. Deterministic Statistical Fallback
            return self._heuristic_fallback(summary, err_str)

    def _call_model(self, summary: DatasetSummary, model_name: str) -> ChartSpec:
        """Executes Google GenAI API call with structured JSON response schema."""
        client = self._get_client()
        prompt = self._build_prompt(summary)

        response = client.models.generate_content(
            model=model_name,
            contents=prompt,
            config=types.GenerateContentConfig(
                response_mime_type="application/json",
                response_schema=ChartSpec,
                temperature=0.2
            )
        )

        # Check if SDK provided parsed Pydantic object directly
        if hasattr(response, "parsed") and isinstance(response.parsed, ChartSpec):
            return response.parsed

        # Parse from JSON string response
        if response.text:
            return ChartSpec.model_validate_json(response.text)

        raise ValueError(f"Empty response received from model '{model_name}'.")

    def _build_prompt(self, summary: DatasetSummary) -> str:
        return f"""
You are an expert data visualization architect. Analyze the dataset summary below and recommend the optimal chart visualization using the required JSON schema.

### Dataset Profile:
- Total Rows: {summary.row_count}
- Total Columns: {summary.column_count}
- Available Columns & Inferred Types: {summary.column_types}

### Data Preview (Top Rows):
{json.dumps(summary.sample_rows, indent=2)}

### Instructions:
1. Choose the single best `chart_type` from: bar, line, scatter, histogram, box, pie, heatmap.
   - Use 'line' for time-series data or trends over time (when a date/datetime column is present).
   - Use 'bar' for comparing categorical values against numeric metrics.
   - Use 'scatter' for relationships between two numeric columns.
   - Use 'box' for distributions across categorical groups.
   - Use 'histogram' for a single numeric column distribution.
   - Use 'pie' for proportions of a categorical variable (when categories <= 8).
   - Use 'heatmap' for correlation matrix across numeric columns.
2. Select `x_column` and `y_column` strictly from available columns: {summary.columns}.
3. Pick an appropriate `aggregation` if grouping is needed (none, sum, mean, count, median).
4. Provide a professional `title`, `x_label`, `y_label`, and `palette` (burnt_orange, Oranges, viridis, magma, coolwarm, deep, muted, pastel, crest, flare).
5. Explain your architectural reasoning clearly in `reasoning`.
"""

    def _heuristic_fallback(self, summary: DatasetSummary, error_reason: str) -> ChartSpec:
        """Deterministic fallback recommendation if API is unreachable, rate limited, or rule-based engine requested."""
        cols = summary.columns
        col_types = summary.column_types

        # Format user-friendly fallback reason
        if "Rule-Based Engine" in error_reason:
            clean_reason = "Rule-Based Engine (No AI): Applied deterministic statistical rules."
        elif "429" in error_reason or "RESOURCE_EXHAUSTED" in error_reason or "quota" in error_reason.lower():
            clean_reason = "Gemini API rate limit reached. Automatically applied statistical heuristic recommendation."
        else:
            clean_reason = "AI API unavailable. Automatically applied statistical heuristic recommendation."

        # Identify column types
        datetime_cols = [c for c, t in col_types.items() if t == "datetime"]
        numeric_cols = [c for c, t in col_types.items() if t == "numeric"]
        cat_cols = [c for c, t in col_types.items() if t == "categorical/text"]

        if datetime_cols and numeric_cols:
            x_col = datetime_cols[0]
            y_col = numeric_cols[0]
            chart_type = ChartType.LINE
            agg = AggregationType.NONE
            title = f"{y_col.capitalize()} Trend over {x_col.capitalize()}"
        elif cat_cols and numeric_cols:
            x_col = cat_cols[0]
            y_col = numeric_cols[0]
            chart_type = ChartType.BAR
            agg = AggregationType.SUM
            title = f"Total {y_col.capitalize()} by {x_col.capitalize()}"
        elif len(numeric_cols) >= 2:
            x_col = numeric_cols[0]
            y_col = numeric_cols[1]
            chart_type = ChartType.SCATTER
            agg = AggregationType.NONE
            title = f"{y_col.capitalize()} vs {x_col.capitalize()}"
        elif numeric_cols:
            x_col = numeric_cols[0]
            y_col = None
            chart_type = ChartType.HISTOGRAM
            agg = AggregationType.NONE
            title = f"Distribution of {x_col.capitalize()}"
        else:
            x_col = cols[0] if cols else "X"
            y_col = cols[1] if len(cols) > 1 else None
            chart_type = ChartType.BAR
            agg = AggregationType.NONE
            title = "Dataset Preview Visualization"

        return ChartSpec(
            chart_type=chart_type,
            title=title,
            x_column=x_col,
            y_column=y_col,
            hue_column=None,
            aggregation=agg,
            x_label=x_col.replace("_", " ").title(),
            y_label=y_col.replace("_", " ").title() if y_col else "Count",
            palette=ColorPalette.BURNT_ORANGE,
            style_theme=StyleTheme.WHITEGRID,
            fig_width=10.0,
            fig_height=6.0,
            show_grid=True,
            reasoning=clean_reason
        )

# Global singleton instance
ai_service = AIService()
