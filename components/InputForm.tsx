"use client";

import { useState } from "react";
import type { FormEvent } from "react";
import type { AnalyzeResponse } from "@/lib/types";

type InputFormProps = {
  onResult: (response: AnalyzeResponse) => void;
  onReset?: () => void;
};

const exampleText =
  "Hoy consumimos 200 kWh y usamos 5 camionetas que recorrieron 40 km cada una.";

export function InputForm({ onResult, onReset }: InputFormProps) {
  const [text, setText] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState<string | undefined>();

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (text.trim().length === 0) {
      const response: AnalyzeResponse = {
        status: "validation_error",
        message: "Escribe una actividad para poder analizar tu impacto.",
      };
      setMessage(response.message);
      onResult(response);
      return;
    }

    setIsLoading(true);
    setMessage(undefined);

    try {
      const response = await fetch("/api/analyze", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ text }),
      });
      const data = (await response.json()) as AnalyzeResponse;

      if (data.status !== "success") {
        setMessage(data.message);
      }

      onResult(data);
    } catch {
      const response: AnalyzeResponse = {
        status: "error",
        message: "Ocurrió un problema al analizar la actividad. Intenta nuevamente.",
      };
      setMessage(response.message);
      onResult(response);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <section className="rounded-2xl border border-emerald-100 bg-white p-5 shadow-sm sm:p-7">
      <div className="mb-5">
        <h2 className="text-xl font-semibold text-slate-950">
          Cuéntanos qué hizo tu negocio hoy
        </h2>
        <p className="mt-2 text-sm leading-6 text-slate-600">
          Escribe una descripción sencilla. EcoTrack AI buscará consumo eléctrico
          y recorridos de vehículos con datos suficientes para estimar emisiones.
        </p>
      </div>

      <form className="space-y-4" onSubmit={handleSubmit}>
        <div>
          <label
            className="mb-2 block text-sm font-medium text-slate-800"
            htmlFor="activity-text"
          >
            Actividades del negocio
          </label>
          <textarea
            id="activity-text"
            className="min-h-44 w-full resize-y rounded-xl border border-slate-200 bg-white px-4 py-3 text-base leading-7 text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-emerald-600 focus:ring-4 focus:ring-emerald-100"
            disabled={isLoading}
            onChange={(event) => {
              setText(event.target.value);
              setMessage(undefined);
              onReset?.();
            }}
            placeholder="Ejemplo: Hoy consumimos 200 kWh de electricidad y usamos 5 camionetas de reparto que recorrieron 40 km cada una."
            value={text}
          />
        </div>

        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="rounded-xl bg-emerald-50 px-4 py-3 text-sm text-emerald-950">
            <span className="font-medium">Ejemplo: </span>
            <span>{exampleText}</span>
            <button
              className="ml-0 mt-2 block rounded-lg border border-emerald-200 bg-white px-3 py-1.5 text-sm font-medium text-emerald-800 transition hover:border-emerald-300 hover:bg-emerald-100 focus:outline-none focus:ring-4 focus:ring-emerald-100 sm:ml-3 sm:mt-0 sm:inline-block"
              disabled={isLoading}
              onClick={() => {
                setText(exampleText);
                setMessage(undefined);
                onReset?.();
              }}
              type="button"
            >
              Usar ejemplo
            </button>
          </div>

          <button
            className="inline-flex min-h-12 items-center justify-center rounded-xl bg-emerald-800 px-5 py-3 text-sm font-semibold text-white transition hover:bg-emerald-900 focus:outline-none focus:ring-4 focus:ring-emerald-200 disabled:cursor-not-allowed disabled:bg-slate-300 disabled:text-slate-600"
            disabled={isLoading}
            type="submit"
          >
            {isLoading ? "Analizando actividad..." : "Analizar mi impacto"}
          </button>
        </div>
      </form>

      {message ? (
        <div
          className="mt-5 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm leading-6 text-amber-950"
          role="status"
        >
          {message}
        </div>
      ) : null}
    </section>
  );
}
