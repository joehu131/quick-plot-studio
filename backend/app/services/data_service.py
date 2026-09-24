import io
import json
import uuid
import time
import threading
from collections import OrderedDict
from typing import Tuple, Optional, List, Dict, Any
import numpy as np
import pandas as pd
from app.config import settings
from app.models.chart_spec import (
    DatasetSummary,
    ChartSpec,
    ColumnProfile,
    SortOrder,
    Orientation,
    ChartType,
)

class DataService:
    def __init__(self):
        # In-memory LRU session cache: dataset_id -> (df, creation_timestamp)
        self._cache: OrderedDict[str, Tuple[pd.DataFrame, float]] = OrderedDict()
        self._ttl_seconds: int = settings.DATASET_CACHE_TTL_SECONDS
        self._max_entries: int = 200
        self._lock = threading.Lock()

    def store_dataset(self, df: pd.DataFrame) -> str:
        """Stores a DataFrame in memory and returns a unique dataset_id."""
        dataset_id = str(uuid.uuid4())
        
        # Pre-process: strip column whitespace
        df.columns = [str(col).strip() for col in df.columns]
        
        # Attempt automatic datetime conversion for object/string columns
        df = self._auto_convert_datetimes(df)
        
        with self._lock:
            self._cleanup_expired_locked()
            # Enforce max capacity by evicting oldest item if needed
            if len(self._cache) >= self._max_entries:
                self._cache.popitem(last=False)
            self._cache[dataset_id] = (df, time.time())

        if settings.DEBUG:
            print(f"[AI Pipeline] DATA UPLOAD: Stored dataset '{dataset_id[:8]}...' ({len(df)} rows x {len(df.columns)} cols).", flush=True)
        return dataset_id

    def get_dataset(self, dataset_id: str) -> Optional[pd.DataFrame]:
        """Retrieves a cached DataFrame by dataset_id."""
        with self._lock:
            self._cleanup_expired_locked()
            if dataset_id in self._cache:
                df, _ = self._cache[dataset_id]
                # Refresh timestamp & LRU position on access
                self._cache[dataset_id] = (df, time.time())
                self._cache.move_to_end(dataset_id)
                return df.copy()
            return None

    def parse_csv_bytes(self, content: bytes) -> pd.DataFrame:
        """Parses CSV bytes into a Pandas DataFrame, evaluating candidate delimiters."""
        best_df = None
        max_cols = 0
        for sep in [',', ';', '\t']:
            try:
                buffer = io.BytesIO(content)
                df = pd.read_csv(buffer, sep=sep)
                if len(df.columns) > max_cols:
                    best_df = df
                    max_cols = len(df.columns)
                    # If multiple columns found, this is a strong delimiter match
                    if max_cols > 1:
                        return best_df
            except Exception:
                continue

        if best_df is not None:
            return best_df
        # Fallback to standard read_csv
        return pd.read_csv(io.BytesIO(content))

    def parse_csv_text(self, text: str) -> pd.DataFrame:
        """Parses raw CSV string text into a Pandas DataFrame."""
        return self.parse_csv_bytes(text.encode('utf-8'))

    def generate_summary(self, dataset_id: str, df: pd.DataFrame) -> DatasetSummary:
        """Generates summary statistics, per-column statistical profile, and stratified sample for Gemini analysis."""
        col_types = {}
        profiles: List[ColumnProfile] = []

        for col in df.columns:
            series = df[col]
            dtype_str = str(series.dtype)
            if 'datetime' in dtype_str:
                col_type = "datetime"
            elif 'int' in dtype_str or 'float' in dtype_str:
                col_type = "numeric"
            else:
                col_type = "categorical/text"
            col_types[col] = col_type

            null_count = int(series.isna().sum())
            unique_count = int(series.nunique())

            min_val = None
            max_val = None
            mean_val = None
            std_val = None
            top_values = None
            min_date = None
            max_date = None

            if col_type == "numeric":
                clean_num = pd.to_numeric(series.replace([np.inf, -np.inf], np.nan), errors='coerce').dropna()
                if not clean_num.empty:
                    min_raw = clean_num.min()
                    max_raw = clean_num.max()
                    mean_raw = clean_num.mean()
                    std_raw = clean_num.std() if len(clean_num) > 1 else 0.0

                    if np.isfinite(min_raw):
                        min_val = round(float(min_raw), 4)
                    if np.isfinite(max_raw):
                        max_val = round(float(max_raw), 4)
                    if np.isfinite(mean_raw):
                        mean_val = round(float(mean_raw), 4)
                    if np.isfinite(std_raw):
                        std_val = round(float(std_raw), 4)
            elif col_type == "categorical/text":
                top_values = [str(v) for v in series.dropna().value_counts().head(5).index.tolist()]
            elif col_type == "datetime":
                clean_dt = pd.to_datetime(series, errors='coerce').dropna()
                if not clean_dt.empty:
                    min_date = str(clean_dt.min())
                    max_date = str(clean_dt.max())

            profiles.append(
                ColumnProfile(
                    name=col,
                    dtype=col_type,
                    null_count=null_count,
                    unique_count=unique_count,
                    min_val=min_val,
                    max_val=max_val,
                    mean_val=mean_val,
                    std_val=std_val,
                    top_values=top_values,
                    min_date=min_date,
                    max_date=max_date,
                )
            )

        # Stratified sample: first 5, up to 5 from middle, last 5 (deduplicated)
        n = len(df)
        if n <= 15:
            sample_df = df.copy()
        else:
            head_idx = list(range(min(5, n)))
            tail_idx = list(range(max(n - 5, 5), n))
            middle_pool = list(range(5, max(n - 5, 5)))
            mid_count = min(5, len(middle_pool))
            rng = np.random.default_rng(seed=42)  # Deterministic seed for reproducible sampling
            mid_idx = sorted(rng.choice(middle_pool, size=mid_count, replace=False).tolist()) if middle_pool else []
            all_idx = sorted(set(head_idx + mid_idx + tail_idx))
            sample_df = df.iloc[all_idx]

        # Sanitize NaN/Inf and timestamps for robust JSON serialization
        sample_df = sample_df.replace([float('inf'), float('-inf')], None).fillna("")
        sample_rows = json.loads(sample_df.to_json(orient="records", date_format="iso"))

        return DatasetSummary(
            dataset_id=dataset_id,
            row_count=len(df),
            column_count=len(df.columns),
            columns=list(df.columns),
            column_types=col_types,
            sample_rows=sample_rows,
            column_profiles=profiles,
        )

    def reconcile_chart_spec(self, df: pd.DataFrame, spec: ChartSpec) -> ChartSpec:
        """Reconciles ChartSpec columns and parameters against the DataFrame to prevent hallucination errors."""
        columns = list(df.columns)
        if not columns:
            return spec

        spec = spec.model_copy()

        # Reconcile x_column
        if spec.x_column not in columns:
            # Case-insensitive match attempt
            matched = False
            for col in columns:
                if col.lower() == spec.x_column.lower():
                    spec.x_column = col
                    matched = True
                    break
            if not matched:
                spec.x_column = columns[0]

        # Reconcile y_column
        if spec.y_column and spec.y_column not in columns:
            matched = False
            for col in columns:
                if col.lower() == spec.y_column.lower():
                    spec.y_column = col
                    matched = True
                    break
            if not matched:
                # Pick second column if available
                spec.y_column = columns[1] if len(columns) > 1 else None

        # Reconcile hue_column
        if spec.hue_column and spec.hue_column not in columns:
            spec.hue_column = None

        # Reset orientation for chart types that do not support horizontal
        if spec.orientation == Orientation.HORIZONTAL and spec.chart_type not in [
            ChartType.BAR, ChartType.BOX
        ]:
            spec.orientation = Orientation.VERTICAL

        # Reset sort_order for chart types where sorting is not applicable
        if spec.sort_order != SortOrder.NONE and spec.chart_type in [
            ChartType.SCATTER, ChartType.HEATMAP, ChartType.HISTOGRAM
        ]:
            spec.sort_order = SortOrder.NONE

        return spec

    def _auto_convert_datetimes(self, df: pd.DataFrame) -> pd.DataFrame:
        """Helper to convert date-like string columns into datetime objects."""
        df = df.copy()
        for col in df.columns:
            if df[col].dtype == 'object':
                try:
                    # Sample non-null values to test date format
                    sample = df[col].dropna().head(10)
                    if not sample.empty and sample.astype(str).str.match(r'^\d{4}[-/]\d{2}[-/]\d{2}').all():
                        df[col] = pd.to_datetime(df[col], errors='coerce')
                except Exception:
                    pass
        return df

    def _cleanup_expired_locked(self):
        """Clean up entries older than TTL (caller must hold self._lock)."""
        now = time.time()
        expired = [k for k, (_, ts) in self._cache.items() if now - ts > self._ttl_seconds]
        for k in expired:
            del self._cache[k]

# Global singleton instance
data_service = DataService()
