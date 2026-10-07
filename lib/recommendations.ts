import type {
  EmissionBreakdownItem,
  EmissionCalculation,
  Recommendation,
} from "./types";

export function generateExplanation(calculation: EmissionCalculation): string {
  const dominantCategory = getDominantCategory(calculation.breakdown);

  if (!dominantCategory) {
    return "No se encontraron emisiones suficientes para generar una explicación.";
  }

  if (dominantCategory.category === "electricity") {
    return "El consumo eléctrico representa la mayor parte de las emisiones estimadas de tu negocio en esta actividad.";
  }

  return "El transporte representa la mayor parte de las emisiones estimadas de tu negocio en esta actividad.";
}

export function generateRecommendations(
  calculation: EmissionCalculation,
): Recommendation[] {
  const dominantCategory = getDominantCategory(calculation.breakdown);

  if (!dominantCategory) {
    return [];
  }

  if (dominantCategory.category === "electricity") {
    return [
      {
        title: "Revisa equipos de alto consumo",
        description:
          "Identifica equipos que permanecen encendidos muchas horas y evalúa apagarlos fuera del horario de uso.",
      },
      {
        title: "Reduce consumos fuera de horario",
        description:
          "Apaga luces, computadores y equipos auxiliares cuando el negocio esté cerrado.",
      },
      {
        title: "Evalúa iluminación eficiente",
        description:
          "Cambiar a iluminación LED puede reducir el consumo eléctrico diario sin afectar la operación.",
      },
    ];
  }

  return [
    {
      title: "Optimiza las rutas",
      description:
        "Agrupa entregas cercanas para reducir kilómetros recorridos durante la jornada.",
    },
    {
      title: "Evita recorridos innecesarios",
      description:
        "Revisa si algunos desplazamientos pueden combinarse o programarse en una sola salida.",
    },
    {
      title: "Prioriza vehículos eficientes",
      description:
        "Cuando sea posible, usa motos o vehículos de menor consumo para entregas pequeñas.",
    },
  ];
}

function getDominantCategory(
  breakdown: EmissionBreakdownItem[],
): EmissionBreakdownItem | undefined {
  return breakdown.reduce<EmissionBreakdownItem | undefined>((dominant, item) => {
    if (!dominant || item.kgCO2e > dominant.kgCO2e) {
      return item;
    }

    return dominant;
  }, undefined);
}
