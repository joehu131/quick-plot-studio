from typing import Optional
from fastapi import APIRouter, HTTPException
from pydantic import BaseModel, Field
from app.services.data_service import data_service
from app.services.ai_service import ai_service
from app.models.chart_spec import ChartSpec

router = APIRouter(tags=["AI Analysis"])

class AnalyzeRequest(BaseModel):
    dataset_id: str = Field(..., description="Unique dataset identifier returned by /api/upload")
    model: Optional[str] = Field(None, description="Optional target model name (or 'rule-based')")

@router.post("/analyze", response_model=ChartSpec)
def analyze_dataset(payload: AnalyzeRequest):
    """Analyzes a cached dataset with chosen AI model (or Rule-Based Engine) and returns recommended ChartSpec JSON."""
    df = data_service.get_dataset(payload.dataset_id)
    if df is None:
        raise HTTPException(
            status_code=440,
            detail="Dataset session expired or not found. Please upload the dataset again."
        )

    # 1. Generate structured dataset summary
    summary = data_service.generate_summary(payload.dataset_id, df)

    # 2. Invoke Gemini AI / requested model (or heuristic fallback if requested/failing)
    raw_spec = ai_service.analyze_dataset(summary, model=payload.model)

    # 3. Post-validate & reconcile spec columns against actual DataFrame
    reconciled_spec = data_service.reconcile_chart_spec(df, raw_spec)

    return reconciled_spec
