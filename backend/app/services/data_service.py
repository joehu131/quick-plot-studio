import io
import uuid
import time
from typing import Dict, Tuple, Optional
import pandas as pd
from app.models.chart_spec import DatasetSummary, ChartSpec

class DataService:
    def __init__(self):
        # In-memory LRU session cache: dataset_id -> (df, creation_timestamp)
        self._cache: Dict[str, Tuple[pd.DataFrame, float]] = {}
        self._ttl_seconds: int = 3600  # 1 hour expiration

    def store_dataset(self, df: pd.DataFrame) -> str:
        """Stores a DataFrame in memory and returns a unique dataset_id."""
        self._cleanup_expired()
        dataset_id = str(uuid.uuid4())
        
        # Pre-process: strip column whitespace
        df.columns = [str(col).strip() for col in df.columns]
        
        # Attempt automatic datetime conversion for object/string columns
        df = self._auto_convert_datetimes(df)
        
        self._cache[dataset_id] = (df, time.time())
        return dataset_id

    def get_dataset(self, dataset_id: str) -> Optional[pd.DataFrame]:
        """Retrieves a cached DataFrame by dataset_id."""
        self._cleanup_expired()
        if dataset_id in self._cache:
            df, _ = self._cache[dataset_id]
            # Refresh timestamp on access
            self._cache[dataset_id] = (df, time.time())
            return df.copy()
        return None

    def parse_csv_bytes(self, content: bytes) -> pd.DataFrame:
        """Parses CSV bytes into a Pandas DataFrame."""
        # Try standard comma CSV, then tab, then semicolon
        for sep in [',', ';', '\t']:
            try:
                buffer = io.BytesIO(content)
                df = pd.read_csv(buffer, sep=sep)
                if len(df.columns) > 1 or sep == ',':
                    return df
            except Exception:
                continue
        # Fallback to standard read_csv
        return pd.read_csv(io.BytesIO(content))

    def parse_csv_text(self, text: str) -> pd.DataFrame:
        """Parses raw CSV string text into a Pandas DataFrame."""
        return self.parse_csv_bytes(text.encode('utf-8'))

    def generate_summary(self, dataset_id: str, df: pd.DataFrame) -> DatasetSummary:
        """Generates summary statistics and data preview for Gemini analysis."""
        col_types = {}
        for col in df.columns:
            dtype_str = str(df[col].dtype)
            if 'datetime' in dtype_str:
                col_types[col] = "datetime"
            elif 'int' in dtype_str or 'float' in dtype_str:
                col_types[col] = "numeric"
            else:
                col_types[col] = "categorical/text"

        # Sanitize NaN/Inf for JSON serialization
        sample_df = df.head(5).fillna("")
        sample_rows = sample_df.to_dict(orient="records")

        return DatasetSummary(
            dataset_id=dataset_id,
            row_count=len(df),
            column_count=len(df.columns),
            columns=list(df.columns),
            column_types=col_types,
            sample_rows=sample_rows
        )

    def reconcile_chart_spec(self, df: pd.DataFrame, spec: ChartSpec) -> ChartSpec:
        """Reconciles ChartSpec columns against the DataFrame to prevent hallucination errors."""
        columns = list(df.columns)
        if not columns:
            return spec

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

    def _cleanup_expired(self):
        """Clean up entries older than TTL."""
        now = time.time()
        expired = [k for k, (_, ts) in self._cache.items() if now - ts > self._ttl_seconds]
        for k in expired:
            del self._cache[k]

# Global singleton instance
data_service = DataService()
