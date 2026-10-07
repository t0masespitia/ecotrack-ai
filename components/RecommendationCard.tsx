import type { Recommendation } from "@/lib/types";

type RecommendationCardProps = {
  recommendations: Recommendation[];
};

export function RecommendationCard({
  recommendations,
}: RecommendationCardProps) {
  if (recommendations.length === 0) {
    return null;
  }

  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <h3 className="text-lg font-semibold text-slate-950">
        Recomendaciones
      </h3>
      <ul className="mt-4 space-y-3">
        {recommendations.map((recommendation) => (
          <li
            className="rounded-xl border border-emerald-100 bg-emerald-50 px-4 py-3"
            key={recommendation.title}
          >
            <p className="font-medium text-emerald-950">
              {recommendation.title}
            </p>
            <p className="mt-1 text-sm leading-6 text-slate-700">
              {recommendation.description}
            </p>
          </li>
        ))}
      </ul>
    </section>
  );
}
