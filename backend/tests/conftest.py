import pytest
import pandas as pd
from fastapi.testclient import TestClient
from app.main import app

@pytest.fixture
def client():
    return TestClient(app)

@pytest.fixture
def sample_sales_csv_text():
    return """date,category,revenue,units_sold
2024-01-01,Electronics,1200.50,10
2024-01-02,Electronics,1500.00,12
2024-01-01,Clothing,450.25,15
2024-01-02,Clothing,600.80,20
2024-01-03,Electronics,950.00,8
2024-01-03,Clothing,710.00,22
"""

@pytest.fixture
def sample_df():
    data = {
        "category": ["A", "B", "A", "B", "C", "C"],
        "sales": [100, 200, 150, 250, 300, 280],
        "profit": [20, 50, 35, 60, 80, 75],
        "date": ["2024-01-01", "2024-01-02", "2024-01-03", "2024-01-04", "2024-01-05", "2024-01-06"]
    }
    df = pd.DataFrame(data)
    df["date"] = pd.to_datetime(df["date"])
    return df
