"use client";

import { useState } from "react";
import { InputForm } from "@/components/InputForm";
import { ResultsDashboard } from "@/components/ResultsDashboard";
import type { AnalyzeResponse } from "@/lib/types";

export default function HomePage() {
  const [analysisResponse, setAnalysisResponse] =
    useState<AnalyzeResponse | null>(null);

  return (
    <main className="min-h-screen bg-slate-50 text-slate-950">
      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-5 py-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-3">
            <div
              className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-800 text-sm font-semibold text-white"
              aria-hidden="true"
            >
              CO
            </div>
            <div>
              <p className="text-base font-semibold text-slate-950">
                EcoTrack AI
              </p>
              <p className="text-xs text-slate-500">
                Impacto diario simplificado
              </p>
            </div>
          </div>
          <span className="hidden rounded-full border border-emerald-100 bg-emerald-50 px-3 py-1 text-xs font-medium text-emerald-800 sm:inline-flex">
            MVP académico
          </span>
        </div>
      </header>

      <div className="mx-auto grid max-w-6xl gap-8 px-5 py-8 sm:px-6 sm:py-12 lg:grid-cols-[0.9fr_1.1fr] lg:px-8">
        <section className="lg:pt-8">
          <span className="inline-flex rounded-full border border-emerald-100 bg-emerald-50 px-3 py-1 text-sm font-medium text-emerald-800">
            Análisis inteligente de CO₂e
          </span>
          <h1 className="mt-5 max-w-xl text-4xl font-semibold tracking-tight text-slate-950 sm:text-5xl">
            Entiende el impacto de tu negocio
          </h1>
          <p className="mt-5 max-w-xl text-lg leading-8 text-slate-600">
            Describe las actividades diarias de tu empresa y obtén una
            estimación sencilla de tu huella de carbono.
          </p>

          <div className="mt-8 grid gap-3 sm:grid-cols-2 lg:max-w-xl">
            <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
              <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                Enfoque
              </p>
              <p className="mt-2 text-sm font-medium text-slate-900">
                Operaciones diarias
              </p>
            </div>
            <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
              <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                Resultado
              </p>
              <p className="mt-2 text-sm font-medium text-slate-900">
                CO₂e estimado
              </p>
            </div>
          </div>
        </section>

        <div className="space-y-6">
          <InputForm
            onReset={() => setAnalysisResponse(null)}
            onResult={setAnalysisResponse}
          />

          {analysisResponse?.status === "success" ? (
            <ResultsDashboard result={analysisResponse.data} />
          ) : null}
        </div>
      </div>

      <section className="mx-auto max-w-6xl px-5 pb-10 sm:px-6 lg:px-8">
        <p className="rounded-2xl border border-slate-200 bg-white px-5 py-4 text-sm leading-6 text-slate-600 shadow-sm">
          EcoTrack AI proporciona estimaciones educativas basadas en factores de
          emisión simplificados. Los resultados no sustituyen una auditoría
          ambiental profesional.
        </p>
      </section>
    </main>
  );
}
