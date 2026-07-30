# AiCharter — Dataset Visualizer

> **AI-Driven Data Visualization Engine**: Transform raw tabular datasets (CSV / text previews) into publication-grade statistical charts using **Google Gemini 2.5/3.5 Flash** structured outputs, **FastAPI**, **Pandas**, **Seaborn**, **Next.js**, and **Tailwind CSS**.

---

## 📌 Features

- **Smart AI Recommendations**: Automatically analyzes data types, distributions, and cardinalities to determine the ideal chart representation.
- **Structured JSON Specs**: Gemini outputs a type-safe Pydantic `ChartSpec` schema (chart type, titles, axes, color palettes) instead of executing raw Python code.
- **Real-Time Interactive Tweaking**: Form controls populate instantly with AI recommendations. Modify titles, color themes, and labels in real time with sub-100ms debounced re-renders without re-calling the LLM API.
- **Flicker-Free Live Preview**: React double-buffering and stream caching deliver seamless visual updates.

---

## 🛠 Tech Stack

- **Backend**: Python 3.12, FastAPI, Pandas, Matplotlib, Seaborn, Pydantic, `google-genai` SDK
- **Frontend**: Next.js 15 (React 19), Tailwind CSS, `shadcn/ui`, TypeScript
- **AI Integration**: Gemini 2.5/3.5 Flash via Google AI Studio API (`response_schema`)

---

## 📋 Architecture & Implementation Plan

Full architectural specifications, data flows, and schema models are documented in [PLAN.md](PLAN.md).
