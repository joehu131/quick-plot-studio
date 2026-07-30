"use client";

import { useState, useCallback, useEffect, useRef } from "react";
import Header from "@/components/Header";
import DataInput from "@/components/DataInput";
import ChartControls from "@/components/ChartControls";
import ChartDisplay from "@/components/ChartDisplay";
import ExportToolbar from "@/components/ExportToolbar";

import { ChartSpec, DatasetSummary } from "@/types/chart";
import {
  uploadCsvFile,
  uploadCsvText,
  analyzeDataset,
  fetchRenderBlob,
} from "@/lib/api-client";
import { SAMPLE_DATASETS } from "@/lib/sample-data";

export default function Home() {
  const [summary, setSummary] = useState<DatasetSummary | null>(null);
  const [spec, setSpec] = useState<ChartSpec | null>(null);
  const [imageBlob, setImageBlob] = useState<Blob | null>(null);

  const [isLoadingData, setIsLoadingData] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [isRendering, setIsRendering] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const renderAbortController = useRef<AbortController | null>(null);

  // Debounced Render function utilizing AbortController for race condition protection
  const triggerRender = useCallback(
    async (datasetId: string, currentSpec: ChartSpec) => {
      if (renderAbortController.current) {
        renderAbortController.current.abort();
      }
      const controller = new AbortController();
      renderAbortController.current = controller;

      setIsRendering(true);
      setError(null);

      try {
        const blob = await fetchRenderBlob(datasetId, currentSpec, "png", controller.signal);
        setImageBlob(blob);
      } catch (err) {
        if ((err as Error).name !== "AbortError") {
          setError((err as Error).message || "Chart rendering failed");
        }
      } finally {
        setIsRendering(false);
      }
    },
    []
  );

  // Auto-analyze flow after dataset upload
  const handleDatasetLoaded = async (newSummary: DatasetSummary) => {
    setSummary(newSummary);
    setIsAnalyzing(true);
    setError(null);

    try {
      const recommendedSpec = await analyzeDataset(newSummary.dataset_id);
      setSpec(recommendedSpec);
      await triggerRender(newSummary.dataset_id, recommendedSpec);
    } catch (err) {
      setError((err as Error).message || "Failed to analyze dataset with Gemini AI");
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleUploadFile = async (file: File) => {
    setIsLoadingData(true);
    setError(null);
    try {
      const summaryData = await uploadCsvFile(file);
      await handleDatasetLoaded(summaryData);
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setIsLoadingData(false);
    }
  };

  const handleUploadText = async (csvText: string) => {
    setIsLoadingData(true);
    setError(null);
    try {
      const summaryData = await uploadCsvText(csvText);
      await handleDatasetLoaded(summaryData);
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setIsLoadingData(false);
    }
  };

  const handleSpecChange = (newSpec: ChartSpec) => {
    setSpec(newSpec);
    if (summary?.dataset_id) {
      triggerRender(summary.dataset_id, newSpec);
    }
  };

  const handleReAnalyze = async () => {
    if (!summary?.dataset_id) return;
    setIsAnalyzing(true);
    try {
      const freshSpec = await analyzeDataset(summary.dataset_id);
      setSpec(freshSpec);
      await triggerRender(summary.dataset_id, freshSpec);
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setIsAnalyzing(false);
    }
  };

  // Load first sample dataset automatically on mount
  useEffect(() => {
    handleUploadText(SAMPLE_DATASETS[0].csvText);
  }, []);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-indigo-500 selection:text-white">
      <Header />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
        {/* Top Data Upload Component */}
        <DataInput
          onUploadFile={handleUploadFile}
          onUploadText={handleUploadText}
          isLoading={isLoadingData || isAnalyzing}
        />

        {/* Dataset Meta Banner */}
        {summary && (
          <div className="bg-slate-900/40 border border-slate-800 rounded-xl px-4 py-2.5 flex flex-wrap items-center justify-between text-xs text-slate-400 gap-2">
            <div className="flex items-center space-x-3">
              <span className="font-semibold text-slate-200">Active Dataset Summary:</span>
              <span className="bg-slate-950 px-2 py-0.5 rounded border border-slate-800 font-mono text-indigo-300">
                {summary.row_count} rows × {summary.column_count} columns
              </span>
            </div>
            <div className="flex items-center space-x-1.5 flex-wrap">
              <span className="text-slate-500">Columns:</span>
              {summary.columns.map((col) => (
                <span
                  key={col}
                  className="bg-slate-950 px-2 py-0.5 rounded border border-slate-800 font-mono text-[11px] text-slate-300"
                >
                  {col}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Main 2-Column Grid: Form Controls (Left) & Chart Display (Right) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          <div className="lg:col-span-5">
            {spec && summary ? (
              <ChartControls
                spec={spec}
                columns={summary.columns}
                onChange={handleSpecChange}
                onReAnalyze={handleReAnalyze}
                isAnalyzing={isAnalyzing}
              />
            ) : (
              <div className="bg-slate-900/30 border border-slate-800 rounded-2xl p-8 text-center text-xs text-slate-500">
                Upload or select a dataset above to display form controls
              </div>
            )}
          </div>

          <div className="lg:col-span-7 space-y-4">
            <ChartDisplay
              imageBlob={imageBlob}
              spec={spec}
              isLoading={isRendering || isAnalyzing}
              error={error}
            />

            <ExportToolbar datasetId={summary?.dataset_id || null} spec={spec} />
          </div>
        </div>
      </main>

      <footer className="border-t border-slate-900 py-4 text-center text-xs text-slate-500">
        AiCharter Portfolio Project — Built with FastAPI, Next.js, Pandas, Seaborn & Gemini 2.5 Flash
      </footer>
    </div>
  );
}
