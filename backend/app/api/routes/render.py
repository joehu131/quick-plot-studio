from typing import Optional
from fastapi import APIRouter, HTTPException, Response
from pydantic import BaseModel, Field
from app.services.data_service import data_service
from app.services.plot_service import plot_service
from app.models.chart_spec import ChartSpec

router = APIRouter(tags=["Chart Rendering"])

class RenderRequest(BaseModel):
    dataset_id: str = Field(..., description="Unique dataset identifier obtained from /api/upload")
    spec: ChartSpec = Field(..., description="Chart specification defining plot parameters")
    format: Optional[str] = Field(default="png", description="Target image format (png or svg)")

@router.post("/render")
def render_chart(payload: RenderRequest):
    """Renders a chart image given a cached dataset_id and ChartSpec JSON."""
    df = data_service.get_dataset(payload.dataset_id)
    if df is None:
        raise HTTPException(
            status_code=440,
            detail="Dataset session expired or not found. Please upload the dataset again."
        )

    # Reconcile ChartSpec against actual DataFrame columns to prevent exceptions
    reconciled_spec = data_service.reconcile_chart_spec(df, payload.spec)

    try:
        format_lower = payload.format.lower() if payload.format else "png"
        image_bytes = plot_service.render_chart(df, reconciled_spec, format=format_lower)
        media_type = "image/svg+xml" if format_lower == "svg" else "image/png"

        return Response(
            content=image_bytes,
            media_type=media_type,
            headers={
                "Cache-Control": "no-cache, no-store, must-revalidate",
                "Pragma": "no-cache",
                "Expires": "0"
            }
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Chart rendering error: {str(e)}")
