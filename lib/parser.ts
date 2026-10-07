import type { ParsedActivity, VehicleActivity, VehicleType } from "./types";

const vehicleAliases: Record<string, { type: VehicleType; label: string }> = {
  carro: { type: "car", label: "carro" },
  carros: { type: "car", label: "carro" },
  camioneta: { type: "van", label: "camioneta" },
  camionetas: { type: "van", label: "camioneta" },
  moto: { type: "motorcycle", label: "moto" },
  motos: { type: "motorcycle", label: "moto" },
  bus: { type: "bus", label: "bus" },
  buses: { type: "bus", label: "bus" },
};

const electricityPattern = /(\d+(?:[.,]\d+)?)\s*kwh\b/g;
const transportPattern =
  /(\d+(?:[.,]\d+)?)\s*(carros?|camionetas?|motos?|buses|bus)\b.{0,90}?(\d+(?:[.,]\d+)?)\s*(?:km|kilometros?)\b/g;

export function parseBusinessActivity(text: string): ParsedActivity {
  const normalizedText = normalizeText(text);
  const electricityKwh = parseElectricityKwh(normalizedText);
  const vehicles = parseVehicles(normalizedText);

  const recognizedCategories: ParsedActivity["recognizedCategories"] = [];

  if (electricityKwh !== undefined) {
    recognizedCategories.push("electricity");
  }

  if (vehicles.length > 0) {
    recognizedCategories.push("transport");
  }

  return {
    ...(electricityKwh !== undefined ? { electricityKwh } : {}),
    vehicles,
    recognizedCategories,
  };
}

export function hasRecognizedActivity(parsedActivity: ParsedActivity): boolean {
  return (
    parsedActivity.electricityKwh !== undefined ||
    parsedActivity.vehicles.length > 0
  );
}

function parseElectricityKwh(text: string): number | undefined {
  const matches = [...text.matchAll(electricityPattern)];
  const totalKwh = matches.reduce((total, match) => {
    const value = parseLocalizedNumber(match[1]);
    return isValidPositiveNumber(value) ? total + value : total;
  }, 0);

  return totalKwh > 0 ? roundToTwo(totalKwh) : undefined;
}

function parseVehicles(text: string): VehicleActivity[] {
  return [...text.matchAll(transportPattern)]
    .map((match) => {
      const quantity = parseLocalizedNumber(match[1]);
      const vehicleKey = match[2];
      const distanceKmPerVehicle = parseLocalizedNumber(match[3]);
      const vehicle = vehicleAliases[vehicleKey];

      if (
        !vehicle ||
        !Number.isInteger(quantity) ||
        !isReasonableVehicleQuantity(quantity) ||
        !isReasonableDistance(distanceKmPerVehicle)
      ) {
        return undefined;
      }

      return {
        type: vehicle.type,
        label: vehicle.label,
        quantity,
        distanceKmPerVehicle: roundToTwo(distanceKmPerVehicle),
        totalDistanceKm: roundToTwo(quantity * distanceKmPerVehicle),
      };
    })
    .filter((vehicle): vehicle is VehicleActivity => vehicle !== undefined);
}

function normalizeText(text: string): string {
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/\s+/g, " ")
    .trim();
}

function parseLocalizedNumber(value: string): number {
  return Number(value.replace(",", "."));
}

function isValidPositiveNumber(value: number): boolean {
  return Number.isFinite(value) && value > 0;
}

function isReasonableVehicleQuantity(value: number): boolean {
  return isValidPositiveNumber(value) && value <= 1000;
}

function isReasonableDistance(value: number): boolean {
  return isValidPositiveNumber(value) && value <= 10000;
}

function roundToTwo(value: number): number {
  return Math.round(value * 100) / 100;
}
