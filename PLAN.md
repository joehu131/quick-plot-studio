# Dataset Visualizer — Architectural & Implementation Plan

A modern, full-stack GitHub portfolio project that takes raw dataset previews (CSV/Text), leverages **Google Gemini 2.5/3.5 Flash** (via `google-genai` SDK structured outputs) to recommend the optimal visualization configuration as a JSON spec, and renders high-quality charts in real time using **FastAPI**, **Pandas**, **Matplotlib**, and **Seaborn**. Frontend built with **Next.js**, **Tailwind CSS**, and **shadcn/ui**.

---

## 1. Architecture & Data Flow

### Flow Overview
```
┌─────────────────┐       1. Upload / Paste CSV Data       ┌──────────────────┐
│                 │ ──────────────────────────────────────> │                  │
│                 │                                         │                  │
│                 │       2. POST /api/analyze (preview)    │                  │
│                 │ ──────────────────────────────────────> │                  │
│                 │                                         │  FastAPI Backend │
│                 │       3. Returns Pydantic ChartSpec JSON│  & Gemini API    │
│                 │ <────────────────────────────────────── │                  │
│ Next.js Frontend│                                         │                  │
│                 │       4. Form populated with JSON spec  │                  │
│                 │          (User tweaks title, colors,    │                  │
│                 │           axes in real-time)            │                  │
│                 │                                         │                  │
│                 │       5. POST /api/render (spec + data) │                  │
│                 │ ──────────────────────────────────────> │                  │
│                 │                                         │                  │
│                 │       6. Returns PNG/SVG Image Stream   │                  │
│                 │ <────────────────────────────────────── │                  │
└─────────────────┘                                         └──────────────────┘
```

### Detailed Sequence
1. **Data Input & Summarization**:
   - User drops a CSV file or pastes tabular data in the Next.js frontend.
   - The frontend parses a small preview (header + top 10 rows + column data types) and sends it to `POST /api/analyze`.
2. **AI Chart Selection (Gemini API)**:
   - FastAPI receives the dataset summary and sends a prompt to Gemini 2.5/3.5 Flash using structured output schemas (`response_schema` backed by a Pydantic `ChartSpec` model).
   - Gemini evaluates column types, cardinality, distributions, and semantics to select the optimal chart type, suggested title, axis labels, color palette, and column mappings.
   - FastAPI validates the returned JSON against the `ChartSpec` model and sends it back to the frontend.
3. **Real-Time Tweaking**:
   - The frontend populates form controls (dropdowns, inputs, color pickers) with the `ChartSpec` fields.
   - When the user edits any field (e.g., changes chart title, swaps palette, changes chart type), a debounced request hits `POST /api/render` with the current raw data and `ChartSpec`.
   - **Crucial Optimization**: The Gemini API is **only** called during the initial analysis phase (`POST /api/analyze`). All subsequent tweaks render instantly (<100ms) without AI calls.
4. **Plot Rendering & Stream Response**:
   - `POST /api/render` accepts the dataset and updated `ChartSpec`.
   - Seaborn/Matplotlib generates the chart in-memory into a `BytesIO` buffer.
   - The response returns an image (`image/png` or `image/svg+xml`) directly to the frontend `<img>` tag via Blob URL.

---

## 2. Project Structure

```
AutoPlotProject/
├── PLAN.md
├── README.md
├── .gitignore
├── backend/
│   ├── app/
│   │   ├── __init__.py
│   │   ├── main.py                # FastAPI app initialization, CORS, middleware
│   │   ├── config.py              # App settings (Pydantic Settings: GEMINI_API_KEY, envs)
│   │   ├── models/
│   │   │   ├── __init__.py
│   │   │   └── chart_spec.py      # Pydantic models for ChartSpec, ChartType, ColorPalette
│   │   ├── services/
│   │   │   ├── __init__.py
│   │   │   ├── ai_service.py      # Gemini SDK integration with structured outputs
│   │   │   ├── data_service.py    # Pandas summary generator, CSV parser & validator
│   │   │   └── plot_service.py    # Matplotlib / Seaborn figure generator & renderer
│   │   └── api/
│   │       ├── __init__.py
│   │       ├── router.py          # Main API router aggregator
│   │       └── routes/
│   │           ├── analyze.py     # POST /api/analyze endpoint
│   │           ├── render.py      # POST /api/render endpoint
│   │           └── health.py      # GET /api/health endpoint
│   ├── tests/
│   │   ├── conftest.py            # Pytest fixtures and mock dataset generators
│   │   ├── test_data_service.py   # Unit tests for data parsing
│   │   ├── test_plot_service.py   # Unit tests for plot generation
│   │   └── test_api_routes.py     # Integration tests for FastAPI endpoints
│   ├── requirements.txt           # fastapi, uvicorn, pandas, matplotlib, seaborn, google-genai, pydantic-settings, pytest
│   └── Dockerfile
├── frontend/
│   ├── src/
│   │   ├── app/
│   │   │   ├── layout.tsx         # Root layout with fonts, providers, theme toggle
│   │   │   ├── page.tsx           # Main workspace UI
│   │   │   └── globals.css        # Tailwind styles & CSS variables
│   │   ├── components/
│   │   │   ├── Header.tsx         # Brand navbar with status & GitHub repo link
│   │   │   ├── DataInput.tsx      # File drag-and-drop, paste area, sample data presets
│   │   │   ├── ChartControls.tsx  # Dynamic form for tweaking ChartSpec fields
│   │   │   ├── ChartDisplay.tsx   # Live chart viewer, loading skeletons, error fallbacks
│   │   │   ├── ExportToolbar.tsx  # PNG, SVG, CSV export buttons & image resolution selectors
│   │   │   └── ui/                # shadcn/ui primitives (Button, Input, Select, Card, Tabs, Slider, Switch)
│   │   ├── lib/
│   │   │   ├── api-client.ts      # Axios / Fetch client wrapper for backend API
│   │   │   ├── sample-data.ts     # Pre-loaded sample datasets for 1-click demos
│   │   │   └── utils.ts           # Class merging (cn utility) and helper functions
│   │   └── types/
│   │       └── chart.ts           # TypeScript interfaces mirroring backend Pydantic models
│   ├── public/
│   │   └── demo-placeholder.png   # GIF / Preview asset for README
│   ├── package.json
│   ├── tailwind.config.js
│   ├── tsconfig.json
│   └── next.config.mjs
└── .github/
    └── workflows/
        ├── backend-ci.yml         # Linting (flake8/black/ruff) and pytest runner
        └── frontend-ci.yml        # ESLint, TypeScript check, build verification
```

---

## 3. Pydantic / JSON Schema Definition

```python
from enum import Enum
from typing import Optional, List
from pydantic import BaseModel, Field

class ChartType(str, Enum):
    BAR = "bar"
    LINE = "line"
    SCATTER = "scatter"
    HISTOGRAM = "histogram"
    BOX = "box"
    HEATMAP = "heatmap"
    PIE = "pie"
    VIOLIN = "violin"

class ColorPalette(str, Enum):
    VIRIDIS = "viridis"
    MAGMA = "magma"
    SPECTRAL = "Spectral"
    COOLWARM = "coolwarm"
    DEEP = "deep"
    MUTED = "muted"
    PASTEL = "pastel"
    DARK = "dark"

class StyleTheme(str, Enum):
    DARKGRID = "darkgrid"
    WHITEGRID = "whitegrid"
    DARK = "dark"
    WHITE = "white"
    TICKS = "ticks"

class ChartSpec(BaseModel):
    chart_type: ChartType = Field(
        ..., 
        description="The type of visualization best suited for the data relationship."
    )
    title: str = Field(
        ..., 
        description="A concise, professional title summarizing the main insights."
    )
    x_column: str = Field(
        ..., 
        description="Dataset column name mapped to the X axis."
    )
    y_column: Optional[str] = Field(
        None, 
        description="Dataset column name mapped to the Y axis (optional for histograms/pies)."
    )
    hue_column: Optional[str] = Field(
        None, 
        description="Optional dataset column name for grouping/color categorization."
    )
    x_label: str = Field(
        ..., 
        description="Formatted label for the X axis."
    )
    y_label: str = Field(
        ..., 
        description="Formatted label for the Y axis."
    )
    palette: ColorPalette = Field(
        default=ColorPalette.VIRIDIS, 
        description="Color palette theme for data series."
    )
    style_theme: StyleTheme = Field(
        default=StyleTheme.DARKGRID, 
        description="Seaborn aesthetic background style."
    )
    fig_width: float = Field(
        default=10.0, 
        ge=4.0, 
        le=20.0, 
        description="Figure width in inches."
    )
    fig_height: float = Field(
        default=6.0, 
        ge=3.0, 
        le=15.0, 
        description="Figure height in inches."
    )
    show_grid: bool = Field(
        default=True, 
        description="Whether to render gridlines on the plot."
    )
    reasoning: str = Field(
        ..., 
        description="Short explanation from the AI detailing why this chart representation was recommended."
    )
```

---

## 4. Step-by-Step Milestones

### Milestone 1: MVP Backend Core
- Setup FastAPI structure with `uvicorn`.
- Implement `data_service.py` to parse CSV input, clean column names, and generate structured data summaries (data types, missing values, sample rows).
- Implement `plot_service.py` with Matplotlib/Seaborn renderer accepting raw data + `ChartSpec` and returning PNG/SVG byte buffers.
- Endpoint `POST /api/render` fully functional with manual JSON spec inputs.

### Milestone 2: AI Integration (Gemini 2.5/3.5 Flash)
- Configure `google-genai` SDK in `ai_service.py`.
- Design robust prompt engineering sending column names, types, summary metrics, and 5 sample rows to Gemini.
- Enforce strict JSON output using `response_mime_type="application/json"` and `response_schema=ChartSpec`.
- Endpoint `POST /api/analyze` accepts CSV, invokes Gemini, validates and returns `ChartSpec`.

### Milestone 3: Frontend Foundations
- Create Next.js application with Tailwind CSS and shadcn/ui components.
- Implement `DataInput.tsx` with drag-and-drop CSV upload, text paste box, and sample dataset selectors (e.g., Iris, Sales Data, Tech Salaries).
- Build state management linking data parsing with backend `/api/analyze` trigger.

### Milestone 4: Real-Time Tweaking UI
- Implement `ChartControls.tsx` form powered by shadcn inputs, selects, switches, and sliders.
- Bind form controls to frontend `ChartSpec` state.
- Connect live debounced updates to `POST /api/render` so image refreshes smoothly without calling Gemini.
- Implement `ChartDisplay.tsx` with zoom, loading skeleton overlays, and error states.

### Milestone 5: Export & Portfolio Polish
- Implement SVG & high-DPI PNG image downloading in `ExportToolbar.tsx`.
- Dark mode toggle with modern UI accents.
- Add sample dataset presets for instant 1-click evaluation.
- Full error handling for invalid CSVs or mismatched column specs.

---

## 5. GitHub Polish Checklist

- [ ] **Automated Test Suite**:
  - Backend: Pytest covering CSV parsing, invalid data handling, rendering pipeline, and API endpoint mocks.
  - Frontend: ESLint clean build, TypeScript zero-errors check.
- [ ] **CI/CD Workflows (`.github/workflows/`)**:
  - `backend-ci.yml`: Runs `pytest`, `black --check`, and `ruff` on every pull request.
  - `frontend-ci.yml`: Runs `npm run lint` and `npm run build`.
- [ ] **Professional `README.md`**:
  - Eye-catching header banner and demo GIF/screenshot placeholder.
  - Interactive feature highlights badge list (FastAPI, Next.js, Gemini API, Pydantic, Tailwind).
  - Clear local setup instructions (Prerequisites, `.env` setup, Docker run command).
  - System Architecture diagram (Mermaid JS rendered).
  - API Reference documentation section.
- [ ] **Docker Support**:
  - `backend/Dockerfile` and `docker-compose.yml` for 1-command local startup.

---

## Architectural Rationale & Key Choices
- **Decoupled AI vs Renderer**: Separating `analyze` (LLM inference) from `render` (deterministic Matplotlib generation) cuts LLM API costs to zero during editing, guarantees instant sub-100ms user interaction, and eliminates security risks associated with executing LLM-generated Python code (`exec()`).
- **Structured Outputs over Code Generation**: Returning a validated Pydantic JSON schema guarantees type safety and predictable field definitions that map 1:1 to React UI controls.
- **Seaborn/Matplotlib on Backend vs Canvas/Recharts on Frontend**: Matplotlib/Seaborn provides publication-grade statistical visualizations (violin plots, heatmaps with annotations, multi-hue regressions) that standard JS charting libraries struggle to configure automatically without verbose code.
