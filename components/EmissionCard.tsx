import type { EmissionBreakdownItem } from "@/lib/types";

type EmissionCardProps = {
  item: EmissionBreakdownItem;
};

export function EmissionCard({ item }: EmissionCardProps) {
  return (
    <article className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <p className="text-xs font-semibold uppercase tracking-wide text-emerald-700">
        {item.label}
      </p>
      <p className="mt-3 text-2xl font-semibold text-slate-950">
        {item.kgCO2e.toFixed(2)} kg CO₂e
      </p>
      <p className="mt-2 text-sm text-slate-600">
        {item.percentage}% del impacto
      </p>
    </article>
  );
}
