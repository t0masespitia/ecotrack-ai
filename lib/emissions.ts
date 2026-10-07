import type {
  EmissionBreakdownItem,
  EmissionCalculation,
  ParsedActivity,
} from "./types";

export const emissionFactors = {
  // MVP educativo: estos factores son aproximados y deben actualizarse con
  // fuentes oficiales si el producto pasa a uso real.
  electricityKgCO2ePerKwh: 0.23,
  transportKgCO2ePerKm: {
    car: 0.18,
    van: 0.21,
    motorcycle: 0.09,
    bus: 0.08,
  },
} as const;

export function calculateEmissions(
  parsedActivity: ParsedActivity,
): EmissionCalculation {
  const electricityKgCO2e = calculateElectricityEmissions(
    parsedActivity.electricityKwh,
  );
  const transportKgCO2e = calculateTransportEmissions(parsedActivity);

  const totalKgCO2e = roundToOne(electricityKgCO2e + transportKgCO2e);
  const breakdownWithoutPercentages = buildBreakdown(
    electricityKgCO2e,
    transportKgCO2e,
  );

  return {
    totalKgCO2e,
    breakdown: addPercentages(breakdownWithoutPercentages, totalKgCO2e),
  };
}

export function calculateElectricityEmissions(
  electricityKwh: number | undefined,
): number {
  if (electricityKwh === undefined || electricityKwh <= 0) {
    return 0;
  }

  return roundToOne(electricityKwh * emissionFactors.electricityKgCO2ePerKwh);
}

export function calculateTransportEmissions(
  parsedActivity: ParsedActivity,
): number {
  const emissions = parsedActivity.vehicles.reduce((total, vehicle) => {
    const factor =
      emissionFactors.transportKgCO2ePerKm[
        vehicle.type as keyof typeof emissionFactors.transportKgCO2ePerKm
      ];

    return total + vehicle.totalDistanceKm * factor;
  }, 0);

  return roundToOne(emissions);
}

function buildBreakdown(
  electricityKgCO2e: number,
  transportKgCO2e: number,
): EmissionBreakdownItem[] {
  const items: EmissionBreakdownItem[] = [];

  if (electricityKgCO2e > 0) {
    items.push({
      category: "electricity",
      label: "Electricidad",
      kgCO2e: electricityKgCO2e,
      percentage: 0,
    });
  }

  if (transportKgCO2e > 0) {
    items.push({
      category: "transport",
      label: "Transporte",
      kgCO2e: transportKgCO2e,
      percentage: 0,
    });
  }

  return items;
}

function addPercentages(
  breakdown: EmissionBreakdownItem[],
  totalKgCO2e: number,
): EmissionBreakdownItem[] {
  if (totalKgCO2e <= 0) {
    return breakdown;
  }

  return breakdown.map((item) => ({
    ...item,
    percentage: Math.round((item.kgCO2e / totalKgCO2e) * 100),
  }));
}

function roundToOne(value: number): number {
  return Math.round(value * 10) / 10;
}
