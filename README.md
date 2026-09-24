# QuickPlot Studio (WIP)

A dataset visualizer that turns table data such as CSV files into good looking charts using AI-driven chart specification and server-side rendering with Seaborn/Matplotlib. The purpose of this project is to enable prettier charts faster

--> Upload a CSV (or pick a preset), let Gemini suggest a chart spec, tweak it in real time, and export the result as a high-res PNG, SVG, or raw JSON spec.

<table>
  <tr>
    <td width="50%" align="center">
      <img src="docs/revenue_trends_over_time_by_product_category.svg" alt="Revenue Trends over Time" width="100%">
    </td>
    <td width="50%" align="center">
      <img src="docs/total_epoch_by_architecture.svg" alt="Total Epoch by Architecture" width="100%">
    </td>
  </tr>
  <tr>
    <td width="50%" align="center">
      <img src="docs/relationship_between_sepal_length_and_sepal_width_by_species.svg" alt="Sepal Length vs Width" width="100%">
    </td>
    <td width="50%" align="center">
      <img src="docs/relationship_between_sepal_length_and_sepal_width_by_species (1).svg" alt="Sepal Metrics Distribution" width="100%">
    </td>
  </tr>
</table>

---

## Features

- **Multi-model support** — Switch between Gemini 3.5 Flash Lite, Gemini 3.6 Flash, Gemma-4-26b, or a rule-based fallback (no AI).
- **Automatic rate-limit fallback** — If Gemini returns a 429, the backend retries with Gemma-4 before falling back to deterministic rules.
- **Statistical data profiling** — Analyzes cardinality, null counts, distributions (min/max/mean/std), top categorical frequencies, and date boundaries via 15-row stratified sampling before querying the AI.
- **Structured AI output** — Gemini returns a typed `ChartSpec` JSON validated by Pydantic. No AI-generated code is executed.
- **Live spec editing** — Form controls populate with the AI recommendation. Adjust titles, themes, grid/background styles, aggregations, sort orders, top-N categories, orientations, and axes without re-calling the LLM (debounced re-renders, sub-50ms).
- **Studio themes & typography** — Switch between 6 curated palettes (Obsidian Slate, Viridis Teal, Magma Flame, Cividis Ocean, Warm Ochre, Nordic Mint) and 5 typography pairings.
- **300 DPI rendering** — Charts render server-side in a Matplotlib BytesIO buffer at 300 DPI with click-to-zoom fullscreen view.
- **Session-based uploads** — `POST /api/upload` returns a `dataset_id`. Subsequent render calls send only the ID + spec, avoiding redundant data transfer.
- **Export** — Download as 300 DPI PNG, vector SVG, or the raw JSON chart spec.
- **8 built-in dataset presets** — SaaS Churn & LTV, Tech Stock Volatility, Customer Segmentation, ML Model Benchmarks, Quarterly Tech Sales, Iris Flower Metrics, Global Temperatures, AI Salaries.
- **Architecture docs** — Built-in flowchart modal and pipeline walkthrough ([`docs/DATA_PIPELINE_WALKTHROUGH.md`](docs/DATA_PIPELINE_WALKTHROUGH.md)).
---

## Architecture

```mermaid
sequenceDiagram
    autonumber
    actor User
    participant NextJS as Next.js Frontend
    participant FastAPI as FastAPI Backend
    participant Gemini as Gemini AI (3.5 / 3.6 / Gemma-4)
    participant Seaborn as Seaborn / Matplotlib (300 DPI)

    User->>NextJS: 1. Drops CSV or selects preset
    NextJS->>FastAPI: 2. POST /api/upload (CSV)
    FastAPI-->>NextJS: 3. Returns dataset_id + DatasetSummary
    NextJS->>FastAPI: 4. POST /api/analyze (dataset_id + model)
    FastAPI->>Gemini: 5. Generate content (response_schema=ChartSpec)
    Gemini-->>FastAPI: 6. Returns structured ChartSpec JSON
    FastAPI-->>NextJS: 7. Validated & reconciled ChartSpec
    NextJS->>NextJS: 8. Populates live form controls
    NextJS->>FastAPI: 9. POST /api/render (dataset_id + spec)
    FastAPI->>Seaborn: 10. Generate 300 DPI figure in BytesIO buffer
    Seaborn-->>FastAPI: 11. Image stream buffer (PNG/SVG)
    FastAPI-->>NextJS: 12. Returns image stream
    NextJS-->>User: 13. Displays chart with click-to-zoom
```

### Pipeline Stages

![Pipeline stages](docs/pipeline_stages.png)

---

## Tech Stack

| Layer | Tools |
|-------|-------|
| Backend | `Python 3.12`, `FastAPI`, `Pandas`, `Matplotlib`, `Seaborn`, `Pydantic v2`, `google-genai SDK`, `Pytest` |
| Frontend | `Next.js 16 (React 19)`, `Tailwind CSS v4`, `TypeScript`, `Lucide Icons` |
| AI | `Gemini 3.5 Flash Lite`, `Gemini 3.6 Flash`, `Gemma-4-26b`, `Rule-based engine` |
| Infra | `Docker`, `Docker Compose`, `GitHub Actions CI/CD` |

---

## Configuration

Application settings in `backend/app/config.py`

- **`backend/.env`** — Secrets:
  ```env
  GEMINI_API_KEY=your_gemini_api_key
  ```
- **`backend/app/config.py`** — Defaults:
  ```python
  GEMINI_MODEL: str = "gemini-3.5-flash-lite"
  PROJECT_NAME: str = "QuickPlot Studio API"
  API_PREFIX: str = "/api"
  MAX_UPLOAD_SIZE_MB: int = 5
  ```

---

## Quickstart

### Prerequisites

- Python 3.12+
- Node.js 22+
- Gemini API key ([Google AI Studio](https://aistudio.google.com/))

### 1. Clone and configure

```bash
git clone git@github.com:joehu131/QuickPlotStudio.git
cd QuickPlotStudio

# Copy example environment templates
cp backend/.env.example backend/.env
# On Windows PowerShell:
# Copy-Item backend/.env.example backend/.env

# Add your Gemini API key to backend/.env
```

### 2. Backend (FastAPI)

```bash
cd backend
python -m venv .venv

# Windows PowerShell:
.venv\Scripts\Activate.ps1
# Linux / macOS:
source .venv/bin/activate

pip install -r requirements.txt
pytest tests -v
uvicorn app.main:app --reload --port 8000
```

API at `http://localhost:8000` — Swagger UI at `http://localhost:8000/docs`.

### 3. Frontend (Next.js)

```bash
cd frontend
npm install
npm run dev
```

Open `http://localhost:3000`.

---

## License

GNU General Public License v3.0 (GPL-3.0) - Joel Hultman 2026
