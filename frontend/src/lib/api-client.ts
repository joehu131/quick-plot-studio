import { ChartSpec, DatasetSummary } from "@/types/chart";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api";

export async function uploadCsvFile(file: File): Promise<DatasetSummary> {
  const formData = new FormData();
  formData.append("file", file);

  const res = await fetch(`${API_BASE_URL}/upload`, {
    method: "POST",
    body: formData,
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({ detail: "Upload failed" }));
    throw new Error(err.detail || "Failed to upload CSV file");
  }

  return res.json();
}

export async function uploadCsvText(csvText: string): Promise<DatasetSummary> {
  const res = await fetch(`${API_BASE_URL}/upload/text`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ csv_text: csvText }),
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({ detail: "Upload failed" }));
    throw new Error(err.detail || "Failed to process raw CSV text");
  }

  return res.json();
}

export async function analyzeDataset(datasetId: string, model?: string): Promise<ChartSpec> {
  const res = await fetch(`${API_BASE_URL}/analyze`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      dataset_id: datasetId,
      model: model,
    }),
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({ detail: "AI Analysis failed" }));
    throw new Error(err.detail || "Failed to generate AI chart recommendation");
  }

  return res.json();
}

export async function fetchRenderBlob(
  datasetId: string,
  spec: ChartSpec,
  format: "png" | "jpg" | "jpeg" | "svg" = "png",
  signal?: AbortSignal,
  dpi: number = 300
): Promise<Blob> {
  const res = await fetch(`${API_BASE_URL}/render`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      dataset_id: datasetId,
      spec: spec,
      format: format,
      dpi: dpi,
    }),
    signal,
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({ detail: "Rendering failed" }));
    throw new Error(err.detail || "Failed to render chart image");
  }

  return res.blob();
}

export interface HealthResponse {
  isOnline: boolean;
  model?: string;
}

export async function getHealthDetails(): Promise<HealthResponse> {
  try {
    const res = await fetch(`${API_BASE_URL}/health`, { cache: "no-store" });
    if (!res.ok) return { isOnline: false };
    const data = await res.json();
    return {
      isOnline: true,
      model: data.model || "gemini-3.5-flash-lite",
    };
  } catch {
    return { isOnline: false };
  }
}

export async function checkBackendHealth(): Promise<boolean> {
  const details = await getHealthDetails();
  return details.isOnline;
}
