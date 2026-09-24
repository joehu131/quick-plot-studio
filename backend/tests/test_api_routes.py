import io
import pytest

def test_health_endpoint(client):
    response = client.get("/api/health")
    assert response.status_code == 200
    json_data = response.json()
    assert json_data["status"] == "ok"

def test_upload_text_endpoint(client, sample_sales_csv_text):
    response = client.post(
        "/api/upload/text",
        json={"csv_text": sample_sales_csv_text}
    )
    assert response.status_code == 200
    data = response.json()
    assert "dataset_id" in data
    assert data["row_count"] == 6
    assert data["column_count"] == 4

def test_upload_file_endpoint(client, sample_sales_csv_text):
    file_bytes = io.BytesIO(sample_sales_csv_text.encode('utf-8'))
    response = client.post(
        "/api/upload",
        files={"file": ("test_sales.csv", file_bytes, "text/csv")}
    )
    assert response.status_code == 200
    data = response.json()
    assert "dataset_id" in data
    assert data["row_count"] == 6

def test_analyze_endpoint(client, sample_sales_csv_text):
    # Step 1: Upload dataset
    upload_res = client.post(
        "/api/upload/text",
        json={"csv_text": sample_sales_csv_text}
    )
    assert upload_res.status_code == 200
    dataset_id = upload_res.json()["dataset_id"]

    # Step 2: Analyze dataset with AI endpoint
    analyze_res = client.post(
        "/api/analyze",
        json={"dataset_id": dataset_id}
    )
    assert analyze_res.status_code == 200
    spec = analyze_res.json()
    assert "chart_type" in spec
    assert "title" in spec
    assert "x_column" in spec

def test_render_endpoint(client, sample_sales_csv_text):
    # Step 1: Upload dataset
    upload_res = client.post(
        "/api/upload/text",
        json={"csv_text": sample_sales_csv_text}
    )
    assert upload_res.status_code == 200
    dataset_id = upload_res.json()["dataset_id"]

    # Step 2: Render chart using dataset_id
    render_payload = {
        "dataset_id": dataset_id,
        "spec": {
            "chart_type": "bar",
            "title": "Revenue by Category",
            "x_column": "category",
            "y_column": "revenue",
            "hue_column": None,
            "aggregation": "sum",
            "x_label": "Product Category",
            "y_label": "Total Revenue ($)",
            "theme": "viridis",
            "grid_style": "darkgrid",
            "fig_width": 10.0,
            "fig_height": 6.0,
            "show_grid": True,
            "reasoning": "Bar chart comparing revenue across product categories."
        },
        "format": "png"
    }

    render_res = client.post("/api/render", json=render_payload)
    assert render_res.status_code == 200
    assert render_res.headers["content-type"] == "image/png"
    assert render_res.content[:4] == b'\x89PNG'

def test_render_endpoint_dpi_validation(client, sample_sales_csv_text):
    upload_res = client.post("/api/upload/text", json={"csv_text": sample_sales_csv_text})
    dataset_id = upload_res.json()["dataset_id"]

    # Reject DPI > 600
    res_high = client.post("/api/render", json={
        "dataset_id": dataset_id,
        "spec": {
            "chart_type": "bar", "title": "T", "x_column": "category", "y_column": "revenue",
            "x_label": "X", "y_label": "Y"
        },
        "dpi": 50000
    })
    assert res_high.status_code == 422

    # Reject DPI < 72
    res_low = client.post("/api/render", json={
        "dataset_id": dataset_id,
        "spec": {
            "chart_type": "bar", "title": "T", "x_column": "category", "y_column": "revenue",
            "x_label": "X", "y_label": "Y"
        },
        "dpi": 10
    })
    assert res_low.status_code == 422

