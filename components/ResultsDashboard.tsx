import { EmissionCard } from "@/components/EmissionCard";
import { RecommendationCard } from "@/components/RecommendationCard";
import type { EmissionResult, VehicleActivity } from "@/lib/types";

type ResultsDashboardProps = {
  result: EmissionResult;
};

export function ResultsDashboard({ result }: ResultsDashboardProps) {
  return (
    <section className="space-y-6" aria-live="polite">
      <div className="rounded-2xl border border-emerald-100 bg-white p-6 shadow-sm sm:p-7">
        <p className="text-xs font-semibold uppercase tracking-wide text-emerald-700">
          Huella estimada
        </p>
        <p className="mt-3 text-4xl font-semibold tracking-tight text-slate-950 sm:text-5xl">
          {result.totalKgCO2e.toFixed(2)} kg CO₂e
        </p>
        <p className="mt-3 text-sm text-slate-600">
          Estimación basada en las actividades reportadas.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        {result.breakdown.map((item) => (
          <EmissionCard item={item} key={item.category} />
        ))}
      </div>

      <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
        <h3 className="text-lg font-semibold text-slate-950">Distribución</h3>
        <div className="mt-4 space-y-4">
          {result.breakdown.map((item) => (
            <div key={item.category}>
              <div className="mb-2 flex items-center justify-between gap-3 text-sm">
                <span className="font-medium text-slate-800">{item.label}</span>
                <span className="text-slate-600">{item.percentage}%</span>
              </div>
              <div className="h-3 overflow-hidden rounded-full bg-slate-100">
                <div
                  className="h-full rounded-full bg-emerald-700"
                  style={{ width: `${item.percentage}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
        <h3 className="text-lg font-semibold text-slate-950">
          Lo que entendimos
        </h3>
        <div className="mt-4 grid gap-4 md:grid-cols-2">
          {result.parsedActivity.electricityKwh !== undefined ? (
            <div className="rounded-xl bg-slate-50 p-4">
              <p className="text-sm font-semibold text-slate-900">
                Electricidad
              </p>
              <p className="mt-2 text-sm text-slate-600">
                {result.parsedActivity.electricityKwh.toFixed(2)} kWh
              </p>
            </div>
          ) : null}

          {result.parsedActivity.vehicles.map((vehicle, index) => (
            <VehicleSummary
              key={`${vehicle.type}-${vehicle.quantity}-${vehicle.totalDistanceKm}-${index}`}
              vehicle={vehicle}
            />
          ))}
        </div>
      </section>

      <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
        <h3 className="text-lg font-semibold text-slate-950">Análisis</h3>
        <p className="mt-3 leading-7 text-slate-700">{result.explanation}</p>
      </section>

      <RecommendationCard recommendations={result.recommendations} />
    </section>
  );
}

function VehicleSummary({ vehicle }: { vehicle: VehicleActivity }) {
  return (
    <div className="rounded-xl bg-slate-50 p-4">
      <p className="text-sm font-semibold text-slate-900">Transporte</p>
      <dl className="mt-2 space-y-1 text-sm text-slate-600">
        <div className="flex justify-between gap-4">
          <dt>Vehículos</dt>
          <dd className="font-medium text-slate-800">
            {vehicle.quantity} {formatVehicleLabel(vehicle)}
          </dd>
        </div>
        <div className="flex justify-between gap-4">
          <dt>Km por vehículo</dt>
          <dd className="font-medium text-slate-800">
            {vehicle.distanceKmPerVehicle.toFixed(2)} km
          </dd>
        </div>
        <div className="flex justify-between gap-4">
          <dt>Km totales</dt>
          <dd className="font-medium text-slate-800">
            {vehicle.totalDistanceKm.toFixed(2)} km
          </dd>
        </div>
      </dl>
    </div>
  );
}

function formatVehicleLabel(vehicle: VehicleActivity): string {
  if (vehicle.quantity === 1) {
    return vehicle.label;
  }

  const pluralLabels: Record<VehicleActivity["type"], string> = {
    car: "carros",
    van: "camionetas",
    motorcycle: "motos",
    bus: "buses",
  };

  return pluralLabels[vehicle.type];
}
