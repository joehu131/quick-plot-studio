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
import ToastBanner from "@/components/ToastBanner";

import { Table } from "lucide-react";
import DatasetPreviewModal from "@/components/DatasetPreviewModal";

export default function Home() {
  const [summary, setSummary] = useState<DatasetSummary | null>(null);
  const [spec, setSpec] = useState<ChartSpec | null>(null);
  const [imageBlob, setImageBlob] = useState<Blob | null>(null);

  const [selectedModel, setSelectedModel] = useState<string>("gemini-3.5-flash-lite");

  const [isLoadingData, setIsLoadingData] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [isRendering, setIsRendering] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);

  const renderAbortController = useRef<AbortController | null>(null);

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

  const handleDatasetLoaded = async (newSummary: DatasetSummary, modelToUse?: string) => {
    setSummary(newSummary);
    setIsAnalyzing(true);
    setError(null);

    const model = modelToUse || selectedModel;

    try {
      const recommendedSpec = await analyzeDataset(newSummary.dataset_id, model);
      setSpec(recommendedSpec);
      await triggerRender(newSummary.dataset_id, recommendedSpec);
    } catch (err) {
      setError((err as Error).message || "Failed to analyze dataset");
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

  const handleReAnalyze = async (overrideModel?: string) => {
    if (!summary?.dataset_id) return;
    setIsAnalyzing(true);
    const modelToUse = overrideModel || selectedModel;
    try {
      const freshSpec = await analyzeDataset(summary.dataset_id, modelToUse);
      setSpec(freshSpec);
      await triggerRender(summary.dataset_id, freshSpec);
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleModelChange = (newModel: string) => {
    setSelectedModel(newModel);
    if (summary?.dataset_id) {
      handleReAnalyze(newModel);
    }
  };

  useEffect(() => {
    handleUploadText(SAMPLE_DATASETS[0].csvText);
  }, []);

  return (
    <div className="min-h-screen bg-white text-zinc-900 flex flex-col font-sans selection:bg-[#E27C52] selection:text-white">
      <Header selectedModel={selectedModel} onModelChange={handleModelChange} />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-4 font-sans">
        {/* Top Data Upload Component */}
        <DataInput
          onUploadFile={handleUploadFile}
          onUploadText={handleUploadText}
          isLoading={isLoadingData || isAnalyzing}
        />

        {/* Toast Notification Banner for Fallbacks */}
        <ToastBanner reasoning={spec?.reasoning} />

        {/* Dataset Meta Banner */}
        {summary && (
          <div className="bg-[#F8F9FA] border border-zinc-200 rounded-lg px-3.5 py-2 flex flex-wrap items-center justify-between text-xs text-zinc-600 gap-2 font-mono shadow-2xs">
            <div className="flex items-center space-x-2.5">
              <span className="font-bold text-zinc-900">Active Profile:</span>
              <span className="bg-white px-2 py-0.5 rounded border border-zinc-200 font-bold text-[#E27C52]">
                {summary.row_count} rows × {summary.column_count} cols
              </span>
              <button
                onClick={() => setIsPreviewOpen(true)}
                className="flex items-center space-x-1 text-[11px] font-bold px-2 py-0.5 rounded bg-white hover:bg-[#E27C52]/10 text-[#E27C52] border border-[#E27C52]/30 transition-colors cursor-pointer"
              >
                <Table className="w-3 h-3" />
                <span>Preview Data</span>
              </button>
            </div>
            <div className="flex items-center space-x-1.5 flex-wrap">
              <span className="text-zinc-500 font-medium">Columns:</span>
              {summary.columns.map((col) => (
                <span
                  key={col}
                  className="bg-white px-1.5 py-0.5 rounded border border-zinc-200 text-[11px] text-zinc-700 font-semibold"
                >
                  {col}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Main 2-Column Grid: Form Controls (Left) & Chart Display (Right) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-start">
          <div className="lg:col-span-5">
            {spec && summary ? (
              <ChartControls
                spec={spec}
                columns={summary.columns}
                onChange={handleSpecChange}
                onReAnalyze={() => handleReAnalyze()}
                isAnalyzing={isAnalyzing}
              />
            ) : (
              <div className="bg-[#F8F9FA] border border-zinc-200 rounded-lg p-6 text-center text-xs font-mono text-zinc-500">
                Upload or select a dataset above to display spec controls
              </div>
            )}
          </div>

          <div className="lg:col-span-7 space-y-3">
            <ChartDisplay
              imageBlob={imageBlob}
              spec={spec}
              isLoading={isRendering || isAnalyzing}
              error={error}
            />

            <ExportToolbar datasetId={summary?.dataset_id || null} spec={spec} summary={summary} />
          </div>
        </div>

        {/* Dataset Preview Modal */}
        <DatasetPreviewModal
          isOpen={isPreviewOpen}
          onClose={() => setIsPreviewOpen(false)}
          summary={summary}
        />
      </main>

      <footer className="border-t border-zinc-200 py-3 text-center text-[11px] font-mono text-zinc-500 bg-[#F8F9FA] space-y-1">
        <div>QuickPlot Studio | Analytics Engine (FastAPI, Next.js, Seaborn & Multi-Model Engine)</div>
        <div className="text-zinc-600 font-semibold">Built by: Joel Hultman 2026</div>
      </footer>
    </div>
  );
}
