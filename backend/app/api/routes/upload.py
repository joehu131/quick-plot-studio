from typing import Optional
from fastapi import APIRouter, UploadFile, File, HTTPException, Body
from pydantic import BaseModel
from app.services.data_service import data_service
from app.models.chart_spec import DatasetSummary

router = APIRouter(tags=["Dataset Upload"])

class TextUploadRequest(BaseModel):
    csv_text: str

@router.post("/upload", response_model=DatasetSummary)
async def upload_csv_file(file: UploadFile = File(...)):
    """Uploads a CSV file, parses it into memory, and returns dataset summary & dataset_id."""
    if not file.filename.endswith(('.csv', '.txt', '.tsv')):
        raise HTTPException(status_code=400, detail="Only CSV, TSV, or TXT files are allowed.")

    try:
        content = await file.read()
        if len(content) > 5 * 1024 * 1024:  # 5MB limit
            raise HTTPException(status_code=400, detail="File size exceeds maximum limit of 5MB.")

        df = data_service.parse_csv_bytes(content)
        if df.empty:
            raise HTTPException(status_code=400, detail="Uploaded file contains no data.")

        dataset_id = data_service.store_dataset(df)
        return data_service.generate_summary(dataset_id, df)
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Failed to parse CSV file: {str(e)}")

@router.post("/upload/text", response_model=DatasetSummary)
def upload_csv_text(payload: TextUploadRequest):
    """Parses raw pasted CSV text, caches dataset into memory, and returns dataset summary."""
    if not payload.csv_text.strip():
        raise HTTPException(status_code=400, detail="CSV text cannot be empty.")

    try:
        df = data_service.parse_csv_text(payload.csv_text)
        if df.empty:
            raise HTTPException(status_code=400, detail="Parsed text contains no tabular data.")

        dataset_id = data_service.store_dataset(df)
        return data_service.generate_summary(dataset_id, df)
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Failed to parse CSV text: {str(e)}")
